// Hybrid Network Bridge for Kaminey
// Dual-Transport Architecture: Combines direct low-latency WebRTC DataChannels with
// an automatic 4-second fallback to WebSocket server relaying.
// Features monotonic message sequence IDs and deduplication cache.

import { getWebSocketServerUrl, ICE_SERVERS, FALLBACK_P2P_TIMEOUT_MS } from './config.js';

export class DeduplicationCache {
  constructor(ttlMs = 10000) {
    this.seen = new Map(); // id -> timestamp
    this.ttlMs = ttlMs;
  }

  isDuplicate(id) {
    if (!id) return false;
    const now = Date.now();
    this.prune(now);
    if (this.seen.has(id)) return true;
    this.seen.set(id, now);
    return false;
  }

  prune(now = Date.now()) {
    for (const [id, time] of this.seen.entries()) {
      if (now - time > this.ttlMs) {
        this.seen.delete(id);
      }
    }
  }

  clear() {
    this.seen.clear();
  }
}

export class HybridNetworkBridge {
  constructor(options = {}) {
    this.roomCode = (options.roomCode || '').toUpperCase().trim();
    this.role = options.role || 'player'; // 'host' | 'player'
    this.id = options.id || `${this.role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    this.name = options.name || 'Guest';
    this.avatarId = options.avatarId || 'lion';
    this.serverUrl = options.serverUrl || getWebSocketServerUrl();

    // Callbacks
    this.onMessage = options.onMessage || null;
    this.onPlayerJoin = options.onPlayerJoin || null;
    this.onPlayerLeave = options.onPlayerLeave || null;
    this.onStatusChange = options.onStatusChange || null;
    this.onModeChange = options.onModeChange || null;
    this.onKicked = options.onKicked || null;
    this.onRoomCreated = options.onRoomCreated || null;
    this.onRoomJoined = options.onRoomJoined || null;

    // Transport state
    this.transportMode = 'CONNECTING'; // 'CONNECTING' | 'P2P_DIRECT' | 'WS_RELAY' | 'DISCONNECTED'
    this.ws = null;
    this.peerConnections = new Map(); // peerId -> RTCPeerConnection
    this.dataChannels = new Map();    // peerId -> RTCDataChannel
    this.fallbackTimer = null;
    this.dedupCache = new DeduplicationCache(10000);
    this.seqNumber = 0;
    this.isDestroyed = false;
    this.p2pSupported = typeof RTCPeerConnection !== 'undefined';

    // Lifecycle handlers for mobile sleep/wake & network drops
    this.handleVisibilityChange = () => {
      if (typeof document === 'undefined' || this.isDestroyed) return;
      if (document.visibilityState === 'visible') {
        const isDead = !this.ws || this.ws.readyState === (typeof WebSocket !== 'undefined' ? WebSocket.CLOSED : 3) || this.ws.readyState === (typeof WebSocket !== 'undefined' ? WebSocket.CLOSING : 2);
        if (isDead) {
          this.onStatusChange?.('Reconnecting after sleep...');
          this.init();
        } else if (this.ws.readyState === (typeof WebSocket !== 'undefined' ? WebSocket.OPEN : 1) && this.role === 'player') {
          this.onStatusChange?.('Syncing palace chamber...');
          this.send('REQUEST_STATE_SYNC', { playerId: this.id }, 'host');
        }
      }
    };

    this.handleOnline = () => {
      if (this.isDestroyed) return;
      if (!this.ws || this.ws.readyState !== (typeof WebSocket !== 'undefined' ? WebSocket.OPEN : 1)) {
        this.onStatusChange?.('Network restored. Reconnecting...');
        this.init();
      }
    };

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
      window.addEventListener('online', this.handleOnline);
    }
  }

  setTransportMode(mode) {
    if (this.transportMode !== mode) {
      this.transportMode = mode;
      this.onModeChange?.(mode);
    }
  }

  init() {
    if (this.isDestroyed) return;
    if (this.ws && (this.ws.readyState === (typeof WebSocket !== 'undefined' ? WebSocket.OPEN : 1) || this.ws.readyState === (typeof WebSocket !== 'undefined' ? WebSocket.CONNECTING : 0))) {
      return;
    }
    this.onStatusChange?.('Connecting to signaling network...');

    try {
      this.ws = new WebSocket(this.serverUrl);
    } catch (err) {
      console.warn('[HybridBridge] WebSocket init error:', err);
      this.onStatusChange?.('Signaling server unreachable. Check connection.');
      return;
    }

    this.ws.onopen = () => {
      if (this.isDestroyed) return;
      this.onStatusChange?.('Connected to network. Negotiating room...');

      // Register or join room on signaling server
      if (this.role === 'host') {
        this.ws.send(JSON.stringify({
          action: 'ROOM_CREATE',
          roomCode: this.roomCode,
          hostId: this.id
        }));
      } else {
        this.ws.send(JSON.stringify({
          action: 'ROOM_JOIN',
          roomCode: this.roomCode,
          player: {
            id: this.id,
            name: this.name,
            avatarId: this.avatarId
          }
        }));
      }

      // Start the 4-second P2P fallback race timer
      this.startFallbackRace();
    };

    this.ws.onmessage = (event) => {
      if (this.isDestroyed) return;
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch (e) {
        return;
      }

      this.handleServerMessage(msg);
    };

    this.ws.onerror = (err) => {
      console.warn('[HybridBridge] WebSocket error:', err);
    };

    this.ws.onclose = () => {
      if (!this.isDestroyed) {
        this.setTransportMode('DISCONNECTED');
        this.onStatusChange?.('Disconnected from server. Reconnecting...');
      }
    };
  }

  startFallbackRace() {
    if (this.fallbackTimer) clearTimeout(this.fallbackTimer);

    // If browser doesn't support WebRTC, immediately switch to relay
    if (!this.p2pSupported) {
      this.setTransportMode('WS_RELAY');
      this.onStatusChange?.('Online (Server Relay mode)');
      return;
    }

    this.fallbackTimer = setTimeout(() => {
      if (this.transportMode === 'CONNECTING' && !this.isDestroyed) {
        console.warn('[HybridBridge] P2P ICE negotiation timed out (4s). Downgrading gracefully to WebSocket Relay mode.');
        this.setTransportMode('WS_RELAY');
        this.onStatusChange?.('Online (Server Relay mode)');
      }
    }, FALLBACK_P2P_TIMEOUT_MS);
  }

  async handleServerMessage(msg) {
    const { type } = msg;

    if (type === 'ROOM_CREATED') {
      this.onRoomCreated?.(msg.roomCode);
      this.onStatusChange?.('Online - Room created. Ready for guests');
      return;
    }

    if (type === 'ROOM_JOINED') {
      this.onRoomJoined?.(msg);
      this.onStatusChange?.('Joined room! Connecting to host...');
      if (this.role === 'player') {
        this.send('REQUEST_STATE_SYNC', { playerId: this.id }, 'host');
        if (this.p2pSupported) {
          this.initiatePlayerP2POffer('host');
        }
      }
      return;
    }

    if (type === 'PLAYER_JOINED') {
      this.onPlayerJoin?.(msg.player);
      return;
    }

    if (type === 'PLAYER_DISCONNECTED') {
      this.cleanupPeer(msg.playerId);
      this.onPlayerLeave?.(msg.playerId);
      return;
    }

    if (type === 'HOST_DISCONNECTED') {
      this.cleanupPeer('host');
      this.onStatusChange?.('Host disconnected from room.');
      return;
    }

    if (type === 'SIGNAL') {
      await this.handleIncomingSignal(msg.senderId, msg.signalData);
      return;
    }

    if (type === 'RELAY_MESSAGE') {
      this.handleIncomingPayload(msg.payload, msg.senderId);
      return;
    }

    if (type === 'ERROR') {
      console.warn('[HybridBridge] Server error:', msg.error);
      this.onStatusChange?.(`Error: ${msg.error}`);
    }
  }

  // --- WebRTC P2P Handshake Implementation ---

  async initiatePlayerP2POffer(targetId) {
    try {
      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      this.peerConnections.set(targetId, pc);

      const dc = pc.createDataChannel('kaminey-channel', { ordered: true });
      this.setupDataChannel(targetId, dc);

      pc.onicecandidate = (event) => {
        if (event.candidate && this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({
            action: 'SIGNAL',
            roomCode: this.roomCode,
            senderId: this.id,
            targetId,
            signalData: { type: 'ice-candidate', candidate: event.candidate }
          }));
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          action: 'SIGNAL',
          roomCode: this.roomCode,
          senderId: this.id,
          targetId,
          signalData: { type: 'offer', sdp: offer.sdp }
        }));
      }
    } catch (err) {
      console.warn('[HybridBridge] P2P Offer creation failed:', err);
      this.setTransportMode('WS_RELAY');
    }
  }

  async handleIncomingSignal(senderId, signalData) {
    if (!signalData || !this.p2pSupported) return;

    try {
      if (signalData.type === 'offer') {
        const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
        this.peerConnections.set(senderId, pc);

        pc.ondatachannel = (event) => {
          this.setupDataChannel(senderId, event.channel);
        };

        pc.onicecandidate = (event) => {
          if (event.candidate && this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
              action: 'SIGNAL',
              roomCode: this.roomCode,
              senderId: this.id,
              targetId: senderId,
              signalData: { type: 'ice-candidate', candidate: event.candidate }
            }));
          }
        };

        await pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: signalData.sdp }));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({
            action: 'SIGNAL',
            roomCode: this.roomCode,
            senderId: this.id,
            targetId: senderId,
            signalData: { type: 'answer', sdp: answer.sdp }
          }));
        }
      } else if (signalData.type === 'answer') {
        const pc = this.peerConnections.get(senderId);
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: signalData.sdp }));
        }
      } else if (signalData.type === 'ice-candidate') {
        const pc = this.peerConnections.get(senderId);
        if (pc && signalData.candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(signalData.candidate));
        }
      }
    } catch (err) {
      console.warn('[HybridBridge] Signal handling error:', err);
    }
  }

  setupDataChannel(peerId, dc) {
    this.dataChannels.set(peerId, dc);

    dc.onopen = () => {
      if (this.fallbackTimer) clearTimeout(this.fallbackTimer);
      this.setTransportMode('P2P_DIRECT');
      this.onStatusChange?.('Direct P2P channel connected');
    };

    dc.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch (e) {
        return;
      }
      this.handleIncomingPayload(data, peerId);
    };

    dc.onclose = () => {
      this.dataChannels.delete(peerId);
      if (this.dataChannels.size === 0 && this.transportMode === 'P2P_DIRECT') {
        this.setTransportMode('WS_RELAY');
        this.onStatusChange?.('P2P dropped; using Server Relay fallback');
      }
    };

    dc.onerror = (err) => {
      console.warn(`[HybridBridge] DataChannel error with ${peerId}:`, err);
    };
  }

  handleIncomingPayload(envelope, senderId) {
    if (!envelope) return;

    // Deduplication check
    if (envelope.msgId && this.dedupCache.isDuplicate(envelope.msgId)) {
      return; // Skip duplicate message
    }

    const payload = envelope.payload !== undefined ? envelope.payload : envelope;
    const effectiveSenderId = envelope.senderId || senderId;

    if (envelope.type === 'HEARTBEAT_PING') {
      this.send('HEARTBEAT_PONG', { timestamp: envelope.timestamp });
      return;
    }

    if (envelope.type === 'PLAYER_KICKED') {
      this.onKicked?.(payload?.reason || 'Host removed you from the game');
      return;
    }

    this.onMessage?.(envelope, effectiveSenderId);
  }

  // --- Unified Message Transmission API ---

  send(type, payload, targetId = 'host') {
    const envelope = {
      msgId: `${this.id}-${++this.seqNumber}-${Date.now()}`,
      type,
      payload,
      senderId: this.id,
      timestamp: Date.now()
    };

    // If in P2P mode and data channel is open, transmit directly
    const dc = this.dataChannels.get(targetId);
    if (this.transportMode === 'P2P_DIRECT' && dc && dc.readyState === 'open') {
      try {
        dc.send(JSON.stringify(envelope));
        return;
      } catch (err) {
        console.warn('[HybridBridge] Direct DataChannel send error, falling back to relay:', err);
      }
    }

    // Fallback: transmit via WebSocket Relay
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        action: 'RELAY',
        roomCode: this.roomCode,
        senderId: this.id,
        targetId,
        payload: envelope,
        timestamp: Date.now()
      }));
    }
  }

  sendToPlayer(playerId, type, payload) {
    this.send(type, payload, playerId);
  }

  broadcast(type, payload) {
    this.send(type, payload, 'all');
  }

  cleanupPeer(peerId) {
    const dc = this.dataChannels.get(peerId);
    if (dc) {
      try { dc.close(); } catch (e) {}
      this.dataChannels.delete(peerId);
    }
    const pc = this.peerConnections.get(peerId);
    if (pc) {
      try { pc.close(); } catch (e) {}
      this.peerConnections.delete(peerId);
    }
  }

  destroy() {
    this.isDestroyed = true;
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
      window.removeEventListener('online', this.handleOnline);
    }
    if (this.fallbackTimer) clearTimeout(this.fallbackTimer);
    this.dataChannels.forEach(dc => {
      try { dc.close(); } catch (e) {}
    });
    this.dataChannels.clear();
    this.peerConnections.forEach(pc => {
      try { pc.close(); } catch (e) {}
    });
    this.peerConnections.clear();
    if (this.ws) {
      try { this.ws.close(); } catch (e) {}
      this.ws = null;
    }
    this.dedupCache.clear();
    this.setTransportMode('DISCONNECTED');
  }
}
