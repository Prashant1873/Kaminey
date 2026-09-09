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
      { urls: 'stun:stun4.l.google.com:19302' }
    ]
  }
};

// Generate highly unique 6-character room code (e.g. HAV412, SHI829)
export function generateRoomCode() {
  const words = [
    'HAVELI', 'SHIKAR', 'JUNGLE', 'CHETAK', 'TOOFAN', 'RAAJAH',
    'DIWAAN', 'BAAZIG', 'SULTAN', 'MALANG', 'JADUVI', 'BEGUM',
    'DARBAR', 'MAHAL', 'THAKUR', 'KOTWAL', 'NAWAAB', 'ZAMEEN'
  ];
  const base = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(100 + Math.random() * 900);
  return `${base.slice(0, 3)}${num}`;
}

export class HostNetwork {
  constructor(roomCode, ...args) {
    this.roomCode = roomCode.toUpperCase().trim();
    this.peerId = `${PEER_PREFIX}${this.roomCode}`;

    if (args.length === 1 && typeof args[0] === 'function') {
      this.getHandlers = args[0];
    } else if (args.length === 1 && typeof args[0] === 'object') {
      this.getHandlers = () => args[0];
    } else {
      const [onPlayerJoin, onPlayerMessage, onPlayerLeave, onStatusChange, onCodeUnavailable, getCustomStateForPlayer] = args;
      this.getHandlers = () => ({
        onPlayerJoin,
        onPlayerMessage,
        onPlayerLeave,
        onStatusChange,
        onCodeUnavailable,
        getCustomStateForPlayer
      });
    }

    this.connections = new Map(); // playerId -> dataConnection
    this.peer = null;
    this.isReady = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 3;
    this.isDestroyed = false;
    this.heartbeatTimer = null;

    // Clean up peer immediately on tab close or refresh to release ID on broker
    this.handleUnload = () => {
      this.destroy();
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.handleUnload);
      window.addEventListener('pagehide', this.handleUnload);
    }
  }

  startHeartbeat() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => {
      if (this.isDestroyed) return;
      this.connections.forEach((conn, playerId) => {
        if (conn && conn.open) {
          try {
            conn.send({ type: 'HEARTBEAT_PING', timestamp: Date.now() });
          } catch (e) {
            console.warn('Heartbeat send error to', playerId, e);
          }
        }
      });
    }, 2500);
  }

  init() {
    if (this.isDestroyed) return;
    const handlers = this.getHandlers();
    handlers.onStatusChange?.('Connecting host base to network...');

    this.peer = new Peer(this.peerId, PEER_CONFIG);

    this.peer.on('open', () => {
      this.isReady = true;
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.getHandlers().onStatusChange?.('Online - Ready for guests');
    });

    this.peer.on('connection', (conn) => {
      const registerAndSync = (data) => {
        const playerId = data?.id || conn.metadata?.id || conn.peer;
        const name = data?.name || conn.metadata?.name || 'Guest';
        const avatarId = data?.avatarId || conn.metadata?.avatarId || 'lion';
        conn.playerId = playerId;
        this.connections.set(playerId, conn);

        const currentHandlers = this.getHandlers();
        // Notify host base station to register player in game state
        currentHandlers.onPlayerJoin?.({ id: playerId, name, avatarId }, conn);

        // Instantly reply with personalized state sync so mobile device enters lobby immediately
        if (conn.open && currentHandlers.getCustomStateForPlayer) {
          try {
            const state = currentHandlers.getCustomStateForPlayer(playerId);
            conn.send({ type: 'STATE_SYNC', payload: state });
          } catch (e) {
            console.warn('Direct state sync send error:', e);
          }
        }
      };

      conn.on('open', () => {
        const data = conn.metadata || { id: conn.peer };
        registerAndSync(data);
      });

      conn.on('data', (data) => {
        if (!data) return;
        if (data.type === 'HEARTBEAT_PONG') {
          // Keep-alive received, connection healthy
          return;
        }
        if (data.type === 'PLAYER_JOIN') {
          registerAndSync(data.payload);
        } else {
          const playerId = conn.playerId || conn.metadata?.id || conn.peer;
          this.getHandlers().onPlayerMessage?.(data, playerId);
        }
      });

      conn.on('close', () => {
        const playerId = conn.playerId || conn.metadata?.id || conn.peer;
        this.connections.delete(playerId);
        this.getHandlers().onPlayerLeave?.(playerId);
      });

      conn.on('error', (err) => {
        console.warn('Host connection peer error:', err);
      });
    });

    this.peer.on('error', (err) => {
      console.error('Host Peer error:', err);
      const handlers = this.getHandlers();
      if (err.type === 'unavailable-id') {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          handlers.onStatusChange?.(`Reconnecting room code (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          setTimeout(() => {
            if (!this.isDestroyed && !this.isReady) {
              if (this.peer) {
                try { this.peer.destroy(); } catch (e) {}
              }
              this.init();
            }
          }, 1200);
        } else {
          handlers.onStatusChange?.('Room code busy on network, generating new code...');
          handlers.onCodeUnavailable?.();
        }
      } else {
        handlers.onStatusChange?.(`Status: ${err.type}`);
      }
    });
  }

  // Send tailored state to every connected player
  broadcastState(getCustomStateForPlayer) {
    const resolver = getCustomStateForPlayer || this.getHandlers().getCustomStateForPlayer;
    if (!resolver) return;

    this.connections.forEach((conn, playerId) => {
      if (conn && conn.open) {
        try {
          const personalizedPayload = resolver(playerId);
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
    this.isDestroyed = true;
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', this.handleUnload);
      window.removeEventListener('pagehide', this.handleUnload);
    }
    this.connections.forEach(c => {
      try { c.close(); } catch (e) {}
    });
    this.connections.clear();
    if (this.peer) {
      try { this.peer.destroy(); } catch (e) {}
      this.peer = null;
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
    this.reconnectTimer = null;
    this.isDestroyed = false;
  }

  init() {
    if (this.isDestroyed) return;
    this.onStatusChange?.('Connecting to network...');
    this.peer = new Peer(undefined, PEER_CONFIG);

    this.peer.on('open', () => {
      this.connectToHost();
    });

    this.peer.on('error', (err) => {
      console.error('Player Peer error:', err);
      if (err.type === 'peer-unavailable') {
        this.onStatusChange?.('Room offline or invalid code. Check host screen.');
      } else {
        this.onStatusChange?.(`Connection error: ${err.type}`);
      }
    });
  }

  connectToHost() {
    if (this.isDestroyed) return;
    this.onStatusChange?.(`Joining room ${this.roomCode}...`);
    this.conn = this.peer.connect(this.hostPeerId, {
      metadata: this.playerData,
      reliable: true
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
      }, 800);
    });

    this.conn.on('data', (msg) => {
      if (!msg) return;
      if (msg.type === 'HEARTBEAT_PING') {
        // Auto-reply to host heartbeat to prevent mobile data channel throttling
        if (this.conn && this.conn.open) {
          try {
            this.conn.send({ type: 'HEARTBEAT_PONG', timestamp: msg.timestamp });
          } catch (e) {}
        }
        return;
      }
      if (msg.type === 'STATE_SYNC') {
        this.receivedFirstSync = true;
        if (this.syncRetryTimer) clearInterval(this.syncRetryTimer);
        this.onStateSync?.(msg.payload);
      } else if (msg.type === 'PLAYER_KICKED') {
        this.onKicked?.(msg.payload?.reason || 'Host removed you from the game');
      }
    });

    this.conn.on('close', () => {
      if (this.syncRetryTimer) clearInterval(this.syncRetryTimer);
      if (!this.isDestroyed) {
        this.onStatusChange?.('Reconnecting to host...');
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        this.reconnectTimer = setTimeout(() => {
          if (!this.isDestroyed && this.peer && !this.peer.destroyed) {
            this.connectToHost();
          }
        }, 1500);
      } else {
        this.onStatusChange?.('Disconnected from host');
        this.onDisconnect?.();
      }
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
    this.isDestroyed = true;
    if (this.syncRetryTimer) clearInterval(this.syncRetryTimer);
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.conn) {
      try { this.conn.close(); } catch (e) {}
      this.conn = null;
    }
    if (this.peer) {
      try { this.peer.destroy(); } catch (e) {}
      this.peer = null;
    }
  }
}
