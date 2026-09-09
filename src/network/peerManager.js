// Host-Authoritative Realtime Peer-to-Peer Networking for Kaminey
// Powered by PeerJS (Free, Zero-Config WebRTC)
// Strict Anti-Cheat: Host holds the master state; players only receive their private secrets.

import Peer from 'peerjs';

const PEER_PREFIX = 'kaminey-v2-';

// Generate 6-character room code
export function generateRoomCode() {
  const words = ['HAVELI', 'SHIKAR', 'JUNGLE', 'CHETAK', 'TOOFAN', 'RAAJAH', 'DIWAAN', 'BAAZIG', 'SULTAN', 'MALANG', 'JADUVI', 'BEGUM'];
  const base = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(10 + Math.random() * 89);
  return `${base.slice(0, 4)}${num}`;
}

export class HostNetwork {
  constructor(roomCode, onPlayerJoin, onPlayerMessage, onPlayerLeave, onStatusChange) {
    this.roomCode = roomCode.toUpperCase().trim();
    this.peerId = `${PEER_PREFIX}${this.roomCode}`;
    this.onPlayerJoin = onPlayerJoin;
    this.onPlayerMessage = onPlayerMessage;
    this.onPlayerLeave = onPlayerLeave;
    this.onStatusChange = onStatusChange;
    this.connections = new Map(); // playerId -> dataConnection
    this.peer = null;
    this.isReady = false;
  }

  init() {
    this.onStatusChange?.('Connecting host base to network...');

    this.peer = new Peer(this.peerId, {
      debug: 1
    });

    this.peer.on('open', () => {
      this.isReady = true;
      this.onStatusChange?.('Online — Ready for guests');
    });

    this.peer.on('connection', (conn) => {
      conn.on('open', () => {
        // Player channel opened. Wait for explicit JOIN payload with persistent playerId
      });

      conn.on('data', (data) => {
        if (data && data.type === 'PLAYER_JOIN') {
          const { id, name, avatarId } = data.payload;
          const playerId = id || conn.peer;
          conn.playerId = playerId;
          this.connections.set(playerId, conn);
          this.onPlayerJoin?.({ id: playerId, name, avatarId }, conn);
        } else {
          const playerId = conn.playerId || conn.peer;
          this.onPlayerMessage?.(data, playerId);
        }
      });

      conn.on('close', () => {
        const playerId = conn.playerId || conn.peer;
        this.connections.delete(playerId);
        this.onPlayerLeave?.(playerId);
      });

      conn.on('error', (err) => {
        console.warn('Host connection peer error:', err);
      });
    });

    this.peer.on('error', (err) => {
      console.error('Host Peer error:', err);
      if (err.type === 'unavailable-id') {
        this.onStatusChange?.('Room code active. Reconnecting...');
      } else {
        this.onStatusChange?.(`Status: ${err.type}`);
      }
    });
  }

  // Send tailored state to every connected player
  // Ensures Bhole NEVER receive Kaminey identities
  broadcastState(getCustomStateForPlayer) {
    this.connections.forEach((conn, playerId) => {
      if (conn && conn.open) {
        try {
          const personalizedPayload = getCustomStateForPlayer(playerId);
          conn.send({
            type: 'STATE_SYNC',
            payload: personalizedPayload
          });
        } catch (e) {
          console.warn('Failed to send state to player', playerId, e);
        }
      }
    });
  }

  sendToPlayer(playerId, type, data) {
    const conn = this.connections.get(playerId);
    if (conn && conn.open) {
      conn.send({ type, payload: data });
    }
  }

  kickPlayer(playerId) {
    const conn = this.connections.get(playerId);
    if (conn) {
      try {
        if (conn.open) {
          conn.send({ type: 'PLAYER_KICKED', payload: { reason: 'Host removed you from the game' } });
        }
        setTimeout(() => {
          try { conn.close(); } catch (e) {}
        }, 80);
      } catch (e) {}
      this.connections.delete(playerId);
    }
  }

  destroy() {
    this.connections.forEach(c => c.close());
    this.connections.clear();
    if (this.peer) {
      this.peer.destroy();
    }
  }
}

export class PlayerNetwork {
  constructor(roomCode, playerData, onStateSync, onDisconnect, onStatusChange, onKicked) {
    this.roomCode = roomCode.toUpperCase().trim();
    this.hostPeerId = `${PEER_PREFIX}${this.roomCode}`;
    this.playerData = playerData; // { id, name, avatarId }
    this.onStateSync = onStateSync;
    this.onDisconnect = onDisconnect;
    this.onStatusChange = onStatusChange;
    this.onKicked = onKicked;
    this.peer = null;
    this.conn = null;
  }

  init() {
    this.onStatusChange?.('Connecting...');
    this.peer = new Peer(undefined, {
      debug: 1
    });

    this.peer.on('open', () => {
      this.connectToHost();
    });

    this.peer.on('error', (err) => {
      console.error('Player Peer error:', err);
      this.onStatusChange?.('Room offline or invalid code');
    });
  }

  connectToHost() {
    this.onStatusChange?.(`Joining ${this.roomCode}...`);
    this.conn = this.peer.connect(this.hostPeerId, {
      reliable: true
    });

    this.conn.on('open', () => {
      this.onStatusChange?.('Connected!');
      // Send unambiguous JOIN message with our unique player ID, name, avatar
      this.send('PLAYER_JOIN', this.playerData);
    });

    this.conn.on('data', (msg) => {
      if (msg && msg.type === 'STATE_SYNC') {
        this.onStateSync?.(msg.payload);
      } else if (msg && msg.type === 'PLAYER_KICKED') {
        this.onKicked?.(msg.payload?.reason || 'Host removed you from the game');
      }
    });

    this.conn.on('close', () => {
      this.onStatusChange?.('Disconnected from host');
      this.onDisconnect?.();
    });

    this.conn.on('error', (err) => {
      console.error('Host connection error:', err);
      this.onStatusChange?.('Connection lost');
    });
  }

  send(type, payload) {
    if (this.conn && this.conn.open) {
      this.conn.send({ type, payload, senderId: this.playerData.id });
    }
  }

  destroy() {
    if (this.conn) this.conn.close();
    if (this.peer) this.peer.destroy();
  }
}
