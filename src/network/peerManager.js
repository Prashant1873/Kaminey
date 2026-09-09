// Host-Authoritative Realtime Peer-to-Peer Networking for Kaminey
// Powered by PeerJS with Multi-STUN fallback for cross-network mobile connectivity
// Strict Anti-Cheat: Host holds the master state; players only receive their private secrets.

import Peer from 'peerjs';

const PEER_PREFIX = 'kaminey-v2-';

const PEER_CONFIG = {
  debug: 1,
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
      { urls: 'stun:global.stun.twilio.com:3478' }
    ]
  }
};

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

    this.peer = new Peer(this.peerId, PEER_CONFIG);

    this.peer.on('open', () => {
      this.isReady = true;
      this.onStatusChange?.('Online — Ready for guests');
    });

    this.peer.on('connection', (conn) => {
      const registerPlayer = (data) => {
        const playerId = data?.id || conn.metadata?.id || conn.peer;
        const name = data?.name || conn.metadata?.name || 'Guest';
        const avatarId = data?.avatarId || conn.metadata?.avatarId || 'lion';
        conn.playerId = playerId;
        this.connections.set(playerId, conn);
        this.onPlayerJoin?.({ id: playerId, name, avatarId }, conn);
      };

      // If connection arrives with metadata, pre-register immediately
      if (conn.metadata?.id) {
        registerPlayer(conn.metadata);
      }

      conn.on('open', () => {
        if (conn.metadata?.id) {
          registerPlayer(conn.metadata);
        }
      });

      conn.on('data', (data) => {
        if (data && data.type === 'PLAYER_JOIN') {
          registerPlayer(data.payload);
        } else {
          const playerId = conn.playerId || conn.metadata?.id || conn.peer;
          this.onPlayerMessage?.(data, playerId);
        }
      });

      conn.on('close', () => {
        const playerId = conn.playerId || conn.metadata?.id || conn.peer;
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
    this.receivedFirstSync = false;
    this.syncRetryTimer = null;
  }

  init() {
    this.onStatusChange?.('Connecting to network...');
    this.peer = new Peer(undefined, PEER_CONFIG);

    this.peer.on('open', () => {
      this.connectToHost();
    });

    this.peer.on('error', (err) => {
      console.error('Player Peer error:', err);
      this.onStatusChange?.('Room offline or invalid code');
    });
  }

  connectToHost() {
    this.onStatusChange?.(`Joining room ${this.roomCode}...`);
    this.conn = this.peer.connect(this.hostPeerId, {
      metadata: this.playerData
    });

    this.conn.on('open', () => {
      this.onStatusChange?.('Connected! Entering lobby...');
      // Send unambiguous JOIN message with our unique player ID, name, avatar
      this.send('PLAYER_JOIN', this.playerData);

      // Periodically ping JOIN until first state sync is received
      if (this.syncRetryTimer) clearInterval(this.syncRetryTimer);
      this.syncRetryTimer = setInterval(() => {
        if (this.receivedFirstSync) {
          clearInterval(this.syncRetryTimer);
          return;
        }
        if (this.conn && this.conn.open) {
          this.send('PLAYER_JOIN', this.playerData);
        }
      }, 1200);
    });

    this.conn.on('data', (msg) => {
      if (msg && msg.type === 'STATE_SYNC') {
        this.receivedFirstSync = true;
        if (this.syncRetryTimer) clearInterval(this.syncRetryTimer);
        this.onStateSync?.(msg.payload);
      } else if (msg && msg.type === 'PLAYER_KICKED') {
        this.onKicked?.(msg.payload?.reason || 'Host removed you from the game');
      }
    });

    this.conn.on('close', () => {
      if (this.syncRetryTimer) clearInterval(this.syncRetryTimer);
      this.onStatusChange?.('Disconnected from host');
      this.onDisconnect?.();
    });

    this.conn.on('error', (err) => {
      console.error('Host connection error:', err);
      this.onStatusChange?.('Could not reach room. Check code or refresh.');
    });
  }

  send(type, payload) {
    if (this.conn && this.conn.open) {
      this.conn.send({ type, payload, senderId: this.playerData.id });
    }
  }

  destroy() {
    if (this.syncRetryTimer) clearInterval(this.syncRetryTimer);
    if (this.conn) this.conn.close();
    if (this.peer) this.peer.destroy();
  }
}
