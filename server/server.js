// Kaminey (Kabo) - Dedicated WebSocket Signaling & Fallback Relay Server
// Provides private room registries, WebRTC signaling, fallback message relay, and HTTP health probes.

import http from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';
import { fileURLToPath } from 'node:url';

export function createServer(options = {}) {
  const rooms = new Map(); // roomCode -> roomState

  const httpServer = http.createServer((req, res) => {
    // CORS headers for health check / HTTP requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    if (url.pathname === '/health' || url.pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'ok',
        uptime: Math.floor(process.uptime()),
        activeRooms: rooms.size,
        timestamp: Date.now()
      }));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  });

  const wss = new WebSocketServer({ server: httpServer });

  // 30s heartbeat & dead-room garbage collection
  const cleanupInterval = setInterval(() => {
    const now = Date.now();

    // Socket ping/pong liveness check
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        return ws.terminate();
      }
      ws.isAlive = false;
      try {
        ws.ping();
      } catch (e) {
        ws.terminate();
      }
    });

    // Inactive room garbage collection
    for (const [code, room] of rooms.entries()) {
      const isHostDead = !room.hostSocket || room.hostSocket.readyState !== WebSocket.OPEN;
      const hostDeadLongEnough = room.hostDisconnectedAt && (now - room.hostDisconnectedAt > 60000);
      const noActivePlayers = Array.from(room.players.values()).every(
        p => !p.socket || p.socket.readyState !== WebSocket.OPEN
      );

      if (isHostDead && hostDeadLongEnough && noActivePlayers) {
        rooms.delete(code);
      }
    }
  }, 30000);

  wss.on('close', () => {
    clearInterval(cleanupInterval);
  });

  wss.on('connection', (ws) => {
    ws.isAlive = true;

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('message', (raw) => {
      let data;
      try {
        data = JSON.parse(raw.toString());
      } catch (err) {
        ws.send(JSON.stringify({ type: 'ERROR', error: 'Malformed JSON payload' }));
        return;
      }

      const action = data.action;
      const roomCode = data.roomCode ? String(data.roomCode).toUpperCase().trim() : null;

      // Handle ping
      if (action === 'HEARTBEAT_PING') {
        ws.send(JSON.stringify({ type: 'HEARTBEAT_PONG', timestamp: data.timestamp || Date.now() }));
        return;
      }

      // Room Creation (Host)
      if (action === 'ROOM_CREATE') {
        if (!roomCode || roomCode.length < 3) {
          ws.send(JSON.stringify({ type: 'ERROR', error: 'Invalid room code format' }));
          return;
        }

        const existing = rooms.get(roomCode);
        if (existing && existing.hostSocket && existing.hostSocket.readyState === WebSocket.OPEN && existing.hostSocket !== ws) {
          ws.send(JSON.stringify({ type: 'ERROR', error: 'Room code already occupied by an active host' }));
          return;
        }

        const hostId = data.hostId || 'host';
        const room = existing || {
          roomCode,
          hostSocket: null,
          hostId,
          players: new Map(),
          createdAt: Date.now(),
          lastActive: Date.now(),
          hostDisconnectedAt: null
        };

        room.hostSocket = ws;
        room.hostId = hostId;
        room.hostDisconnectedAt = null;
        room.lastActive = Date.now();
        rooms.set(roomCode, room);

        ws.roomCode = roomCode;
        ws.role = 'host';
        ws.send(JSON.stringify({ type: 'ROOM_CREATED', roomCode }));
        return;
      }

      // Room Join (Player)
      if (action === 'ROOM_JOIN') {
        if (!roomCode || !rooms.has(roomCode)) {
          ws.send(JSON.stringify({ type: 'ERROR', error: 'Room not found' }));
          return;
        }

        const room = rooms.get(roomCode);
        const player = data.player || {};
        const playerId = player.id || `player-${Date.now()}`;
        const name = player.name || 'Guest';
        const avatarId = player.avatarId || 'lion';

        room.players.set(playerId, {
          socket: ws,
          id: playerId,
          name,
          avatarId,
          joinedAt: Date.now(),
          lastSeen: Date.now()
        });
        room.lastActive = Date.now();

        ws.roomCode = roomCode;
        ws.role = 'player';
        ws.playerId = playerId;

        // Confirm join to player
        const hostConnected = !!(room.hostSocket && room.hostSocket.readyState === WebSocket.OPEN);
        ws.send(JSON.stringify({
          type: 'ROOM_JOINED',
          roomCode,
          playerId,
          hostConnected
        }));

        // Notify host
        if (hostConnected) {
          room.hostSocket.send(JSON.stringify({
            type: 'PLAYER_JOINED',
            player: { id: playerId, name, avatarId }
          }));
        }
        return;
      }

      // Beyond create/join, require roomCode
      if (!roomCode || !rooms.has(roomCode)) {
        ws.send(JSON.stringify({ type: 'ERROR', error: 'Room not found or expired' }));
        return;
      }

      const room = rooms.get(roomCode);
      room.lastActive = Date.now();

      // WebRTC Signaling Router (SDP Offers/Answers and ICE Candidates)
      if (action === 'SIGNAL') {
        const { senderId, targetId, signalData } = data;
        if (!targetId || !signalData) {
          ws.send(JSON.stringify({ type: 'SIGNAL_ERROR', error: 'Missing targetId or signalData' }));
          return;
        }

        if (targetId === 'host') {
          if (room.hostSocket && room.hostSocket.readyState === WebSocket.OPEN) {
            room.hostSocket.send(JSON.stringify({
              type: 'SIGNAL',
              senderId,
              signalData
            }));
          } else {
            ws.send(JSON.stringify({ type: 'SIGNAL_ERROR', targetId, error: 'Host not connected' }));
          }
          return;
        }

        // Forwarding signal to a specific player
        const targetPlayer = room.players.get(targetId);
        if (targetPlayer && targetPlayer.socket && targetPlayer.socket.readyState === WebSocket.OPEN) {
          targetPlayer.socket.send(JSON.stringify({
            type: 'SIGNAL',
            senderId,
            signalData
          }));
        } else {
          ws.send(JSON.stringify({ type: 'SIGNAL_ERROR', targetId, error: 'Target player not connected' }));
        }
        return;
      }

      // Fallback Application Message Relay
      if (action === 'RELAY') {
        const { senderId, targetId, payload, timestamp } = data;
        const envelope = {
          type: 'RELAY_MESSAGE',
          senderId,
          payload,
          timestamp: timestamp || Date.now()
        };

        if (targetId === 'host') {
          if (room.hostSocket && room.hostSocket.readyState === WebSocket.OPEN) {
            room.hostSocket.send(JSON.stringify(envelope));
          }
          return;
        }

        if (targetId === 'all') {
          // Broadcast to host (if sender isn't host)
          if (ws !== room.hostSocket && room.hostSocket && room.hostSocket.readyState === WebSocket.OPEN) {
            room.hostSocket.send(JSON.stringify(envelope));
          }
          // Broadcast to all other players
          room.players.forEach((p) => {
            if (p.socket !== ws && p.socket && p.socket.readyState === WebSocket.OPEN) {
              p.socket.send(JSON.stringify(envelope));
            }
          });
          return;
        }

        // Direct player target
        const targetPlayer = room.players.get(targetId);
        if (targetPlayer && targetPlayer.socket && targetPlayer.socket.readyState === WebSocket.OPEN) {
          targetPlayer.socket.send(JSON.stringify(envelope));
        }
        return;
      }
    });

    ws.on('close', () => {
      const { roomCode, role, playerId } = ws;
      if (!roomCode || !rooms.has(roomCode)) return;

      const room = rooms.get(roomCode);
      if (role === 'host') {
        room.hostSocket = null;
        room.hostDisconnectedAt = Date.now();
        // Notify players that host connection dropped
        room.players.forEach((p) => {
          if (p.socket && p.socket.readyState === WebSocket.OPEN) {
            p.socket.send(JSON.stringify({ type: 'HOST_DISCONNECTED', roomCode }));
          }
        });
      } else if (role === 'player' && playerId) {
        room.players.delete(playerId);
        if (room.hostSocket && room.hostSocket.readyState === WebSocket.OPEN) {
          room.hostSocket.send(JSON.stringify({ type: 'PLAYER_DISCONNECTED', playerId }));
        }
      }
    });
  });

  return { httpServer, wss, rooms, cleanupInterval };
}

// Auto-start when run directly
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  const PORT = parseInt(process.env.PORT, 10) || 3001;
  const HOST = process.env.HOST || '0.0.0.0';
  const { httpServer } = createServer();
  httpServer.listen(PORT, HOST, () => {
    console.log(`[Kaminey Server] Online on http://${HOST}:${PORT} (ws://${HOST}:${PORT})`);
  });
}
