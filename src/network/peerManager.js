// Host-Authoritative Realtime Networking for Kaminey
// Powered by HybridNetworkBridge: Direct WebRTC DataChannels + Automatic WebSocket Server Relay Fallback.
// Guarantees seamless connections across cellular LTE/5G and symmetric NAT networks.

import { HybridNetworkBridge } from './hybridBridge.js';

// Generate unique 6-character room code (e.g. HAV412, SHI829)
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
    this.roomCode = (roomCode || '').toUpperCase().trim();

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

    this.connectedPlayers = new Map(); // playerId -> playerData
    this.isDestroyed = false;
    this._isReady = false;

    // Instantiate Hybrid Bridge as Host
    this.bridge = new HybridNetworkBridge({
      roomCode: this.roomCode,
      role: 'host',
      id: 'host',
      onPlayerJoin: (player) => {
        this.connectedPlayers.set(player.id, player);
        const handlers = this.getHandlers();

        // Synthetic connection object mimicking PeerJS connection for backwards compatibility
        const connProxy = {
          open: true,
          peer: player.id,
          send: (data) => {
            this.sendToPlayer(player.id, data.type, data.payload);
          }
        };

        handlers.onPlayerJoin?.(player, connProxy);

        // Immediate state sync reply to joining player
        if (handlers.getCustomStateForPlayer) {
          try {
            const state = handlers.getCustomStateForPlayer(player.id);
            if (state) {
              this.sendToPlayer(player.id, 'STATE_SYNC', state);
            }
          } catch (e) {
            console.warn('[HostNetwork] Direct initial state sync error:', e);
          }
        }
      },
      onPlayerLeave: (playerId) => {
        this.connectedPlayers.delete(playerId);
        this.getHandlers().onPlayerLeave?.(playerId);
      },
      onMessage: (envelope, senderId) => {
        const payload = envelope.payload !== undefined ? envelope.payload : envelope;
        const msgType = envelope.type || payload?.type;

        // Immediately resolve and dispatch state sync to requesting player
        if (msgType === 'REQUEST_STATE_SYNC') {
          const requestingPlayerId = senderId || payload?.playerId || envelope.senderId;
          if (requestingPlayerId && !this.connectedPlayers.has(requestingPlayerId)) {
            this.connectedPlayers.set(requestingPlayerId, { id: requestingPlayerId });
          }
          const handlers = this.getHandlers();
          if (handlers.getCustomStateForPlayer && requestingPlayerId) {
            try {
              const state = handlers.getCustomStateForPlayer(requestingPlayerId);
              if (state) {
                this.sendToPlayer(requestingPlayerId, 'STATE_SYNC', state);
              }
            } catch (e) {
              console.warn('[HostNetwork] REQUEST_STATE_SYNC reply error:', e);
            }
          }
          return;
        }

        const messageToPass = envelope.type ? envelope : payload;
        this.getHandlers().onPlayerMessage?.(messageToPass, senderId);
      },
      onStatusChange: (status) => {
        if (this.bridge?.ws?.readyState === 1) {
          this._isReady = true;
        }
        this.getHandlers().onStatusChange?.(status);
      },
      onRoomCreated: () => {
        this._isReady = true;
      },
      onModeChange: (mode) => {
        this.getHandlers().onModeChange?.(mode);
        const modeLabel = mode === 'P2P_DIRECT' ? 'Direct P2P' : 'Server Relay';
        this.getHandlers().onStatusChange?.(`Online (${modeLabel})`);
      }
    });
  }

  get isReady() {
    return !this.isDestroyed && Boolean(
      this._isReady || (this.bridge && this.bridge.ws && this.bridge.ws.readyState === 1)
    );
  }

  set isReady(val) {
    this._isReady = Boolean(val);
  }

  init() {
    if (this.isDestroyed) return;
    this.bridge.init();
  }

  // Broadcast tailored state to every registered player
  broadcastState(getCustomStateForPlayer, targetPlayerIds) {
    if (this.isDestroyed) return;
    const resolver = getCustomStateForPlayer || this.getHandlers().getCustomStateForPlayer;
    if (!resolver) return;

    // Collect recipient player IDs
    const recipientIds = new Set([
      ...Array.from(this.connectedPlayers.keys()),
      ...(targetPlayerIds || [])
    ]);

    recipientIds.forEach((playerId) => {
      try {
        const personalizedPayload = resolver(playerId);
        if (personalizedPayload) {
          this.bridge.sendToPlayer(playerId, 'STATE_SYNC', personalizedPayload);
        }
      } catch (e) {
        console.warn('[HostNetwork] Failed to send state to player', playerId, e);
      }
    });
  }

  sendToPlayer(playerId, type, data) {
    if (this.isDestroyed) return;
    this.bridge.sendToPlayer(playerId, type, data);
  }

  kickPlayer(playerId) {
    if (this.isDestroyed) return;
    this.bridge.sendToPlayer(playerId, 'PLAYER_KICKED', { reason: 'Host removed you from the game' });
    this.connectedPlayers.delete(playerId);
  }

  destroy() {
    this.isDestroyed = true;
    this.connectedPlayers.clear();
    if (this.bridge) {
      this.bridge.destroy();
    }
  }
}

export class PlayerNetwork {
  constructor(roomCode, playerData, onStateSync, onDisconnect, onStatusChange, onKicked, onModeChange) {
    this.roomCode = (roomCode || '').toUpperCase().trim();
    this.playerData = playerData; // { id, name, avatarId }
    this.onStateSync = onStateSync;
    this.onDisconnect = onDisconnect;
    this.onStatusChange = onStatusChange;
    this.onKicked = onKicked;
    this.onModeChange = onModeChange;
    this.isDestroyed = false;

    // Instantiate Hybrid Bridge as Player
    this.bridge = new HybridNetworkBridge({
      roomCode: this.roomCode,
      role: 'player',
      id: playerData.id,
      name: playerData.name,
      avatarId: playerData.avatarId,
      onMessage: (envelope) => {
        const type = envelope.type;
        const payload = envelope.payload !== undefined ? envelope.payload : envelope;

        if (type === 'STATE_SYNC') {
          this.onStateSync?.(payload);
        } else if (type === 'PLAYER_KICKED') {
          this.onKicked?.(payload?.reason || 'Host removed you from the game');
        }
      },
      onStatusChange: (status) => {
        this.onStatusChange?.(status);
      },
      onModeChange: (mode) => {
        this.onModeChange?.(mode);
        const modeLabel = mode === 'P2P_DIRECT' ? 'Direct P2P' : 'Server Relay';
        this.onStatusChange?.(`Connected (${modeLabel})`);
      },
      onKicked: (reason) => {
        this.onKicked?.(reason);
      }
    });
  }

  init() {
    if (this.isDestroyed) return;
    this.bridge.init();
  }

  send(type, payload) {
    if (this.isDestroyed) return;
    this.bridge.send(type, payload, 'host');
  }

  requestStateSync() {
    if (this.isDestroyed) return;
    this.send('REQUEST_STATE_SYNC', { playerId: this.playerData.id });
  }

  destroy() {
    this.isDestroyed = true;
    if (this.bridge) {
      this.bridge.destroy();
    }
  }
}
