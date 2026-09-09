// Host-Authoritative Realtime Peer-to-Peer Networking for Kaminey
// Powered by PeerJS (Free, Zero-Config WebRTC)
// Strict Anti-Cheat: Host holds the master state; players only receive their private secrets.

import Peer from 'peerjs';

const PEER_PREFIX = 'kaminey-v1-';

// Generate 6-character room code (e.g. "HAVELI", "SHIKAR", "JUNGLE")
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
    this.onStatusChange?.('Connecting host to network...');
    
    // Create peer with deterministic room ID
    this.peer = new Peer(this.peerId, {
      debug: 1
    });

    this.peer.on('open', (id) => {
      this.isReady = true;
      this.onStatusChange?.('Host online. Waiting for players...');
    });

    this.peer.on('connection', (conn) => {
      conn.on('open', () => {
        // Player connected
        const playerId = conn.metadata?.playerId || conn.peer;
        this.connections.set(playerId, conn);
        this.onPlayerJoin?.({
          id: playerId,
          name: conn.metadata?.name || 'Guest',
          avatarId: conn.metadata?.avatarId || 'lion'
        }, conn);
      });

      conn.on('data', (data) => {
        this.onPlayerMessage?.(data, conn.metadata?.playerId || conn.peer);
      });

      conn.on('close', () => {
        const playerId = conn.metadata?.playerId || conn.peer;
        this.connections.delete(playerId);
        this.onPlayerLeave?.(playerId);
      });

      conn.on('error', (err) => {
        console.warn('Connection error with peer:', err);
      });
    });

    this.peer.on('error', (err) => {
      console.error('Host Peer error:', err);
      if (err.type === 'unavailable-id') {
        // Room code already taken, regenerate
        this.onStatusChange?.('Room code in use. Generating new code...');
      } else {
        this.onStatusChange?.(`Network status: ${err.type}`);
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

  // Direct message to a specific player
  sendToPlayer(playerId, type, data) {
    const conn = this.connections.get(playerId);
    if (conn && conn.open) {
      conn.send({ type, payload: data });
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
  constructor(roomCode, playerData, onStateSync, onDisconnect, onStatusChange) {
    this.roomCode = roomCode.toUpperCase().trim();
    this.hostPeerId = `${PEER_PREFIX}${this.roomCode}`;
    this.playerData = playerData; // { id, name, avatarId }
    this.onStateSync = onStateSync;
    this.onDisconnect = onDisconnect;
    this.onStatusChange = onStatusChange;
    this.peer = null;
    this.conn = null;
    this.reconnectAttempts = 0;
  }

  init() {
    this.onStatusChange?.('Connecting to living room base...');
    this.peer = new Peer(undefined, {
      debug: 1
    });

    this.peer.on('open', (myPeerId) => {
      this.connectToHost();
    });

    this.peer.on('error', (err) => {
      console.error('Player Peer error:', err);
      this.onStatusChange?.(`Connection error: ${err.message || err.type}`);
    });
  }

  connectToHost() {
    this.onStatusChange?.(`Joining room ${this.roomCode}...`);
    this.conn = this.peer.connect(this.hostPeerId, {
      metadata: this.playerData,
      reliable: true
    });

    this.conn.on('open', () => {
      this.onStatusChange?.('Connected! Entering lobby...');
      this.send('PLAYER_HELLO', this.playerData);
    });

    this.conn.on('data', (msg) => {
      if (msg.type === 'STATE_SYNC') {
        this.onStateSync?.(msg.payload);
      }
    });

    this.conn.on('close', () => {
      this.onStatusChange?.('Disconnected from host.');
      this.onDisconnect?.();
    });

    this.conn.on('error', (err) => {
      console.error('Host connection error:', err);
      this.onStatusChange?.('Could not reach room. Check code.');
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
