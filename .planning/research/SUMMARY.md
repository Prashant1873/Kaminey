# Project Research Summary

**Project:** Kaminey (Kabo)
**Domain:** Real-Time Multiplayer Signaling & Relay Networking
**Researched:** 2026-10-08
**Confidence:** HIGH

## Executive Summary

Kaminey is an Indian royal Haveli-themed social deduction party game running on living room displays with secret smartphone controllers. Real-world testing revealed that mobile players on cellular (LTE/5G) or restrictive Wi-Fi networks were unable to connect to hosts or suffered frequent dropouts. Research pinpointed the exact root causes: reliance on the unstable public PeerJS cloud broker (`0.peerjs.com`) and lack of a fallback relay when Carrier-Grade / Symmetric NAT prevents direct WebRTC P2P hole-punching.

The recommended solution is a **Hybrid Dual-Transport Architecture**: a dedicated lightweight Node.js/WebSocket server providing rock-solid private room signaling, combined with a client-side network bridge that prioritizes direct low-latency P2P WebRTC data channels on compatible local Wi-Fi, while seamlessly and automatically falling back to WebSocket server relay whenever P2P fails or times out.

Crucially, the mobile client must also handle aggressive mobile OS power-saving routines (screen sleep and tab switches) via `visibilitychange` listeners, heartbeats, and grace periods, ensuring players never get permanently disconnected during party discussions.

## Key Findings

### Recommended Stack

- **Backend Runtime:** Node.js (v20+ LTS) running a minimal `ws` server (`server/server.js`), keeping memory footprint under 30MB with zero database dependencies.
- **Frontend Networking:** Native browser `WebSocket` and `RTCPeerConnection` orchestrated through a custom `HybridNetworkBridge`.
- **Deployment:** Frontend on GitHub Pages with HTTPS; backend ready for 1-click free/low-cost deployment on Render, Railway, or Fly.io with WSS.

### Expected Features

**Must have (table stakes):**
- Private, collision-free room code signaling via dedicated WebSocket backend.
- Automatic, transparent fallback to WebSocket relay within 4 seconds if WebRTC P2P fails.
- Mobile OS sleep recovery via `visibilitychange` listener and `REQUEST_STATE_SYNC` protocol.
- Connection state diagnostic feedback for both host and players ("Direct P2P", "Relayed", "Reconnecting").

**Should have (competitive differentiators):**
- Monotonic message sequence IDs and deduplication to prevent double-votes across transport switches.
- 15-second host drop grace period to prevent accidental player eviction during brief signal dips.

**Defer (v2+):**
- Multi-region server clustering with Redis pub/sub.

### Architecture Approach

A lightweight Node server in `server/server.js` maintains an in-memory registry of active rooms. Host and player clients connect to the server over WebSockets. The server routes WebRTC SDP offers/answers and ICE candidates. Concurrently, a 4-second race timer checks for an open WebRTC `RTCDataChannel`. If established, traffic flows direct P2P. If negotiation stalls or fails (e.g. mobile cellular symmetric NAT), the bridge seamlessly switches mode to `WS_RELAY`, routing all game messages through the server without interrupting the game.

### Critical Pitfalls

1. **Symmetric NAT / Cellular Blocking:** Direct P2P is impossible on mobile cellular data without a TURN relay or WebSocket fallback. *Mitigation:* Automatic 4-second fallback to server WebSocket relay.
2. **Mobile Background Sleep Freezes:** iOS Safari throttles timers and drops WebRTC channels when screen dims. *Mitigation:* Hook `visibilitychange`, trigger instant wake handshake, and allow a 15-second host grace period.
3. **Mixed Content / Insecure Contexts:** Mobile browsers reject WebRTC / Web Crypto if loaded on insecure HTTP IPs. *Mitigation:* Enforce `https://` (GitHub Pages) and `wss://` on production backend.

## Implications for Roadmap

Suggested phase structure for Milestone v1.0:

### Phase 1: Dedicated Node.js WebSocket Signaling & Relay Server
- Build lightweight `server/server.js` with room registry, signaling routing, and fallback message relaying.
- Add backend test suite verifying room lifecycle, player joins, and relay message forwarding.

### Phase 2: Hybrid Client Network Bridge (P2P + Auto-Relay Fallback)
- Create `src/network/hybridBridge.js` to manage dual-transport state and message dispatching.
- Update `HostNetwork` and `PlayerNetwork` in `src/network/peerManager.js` to use the hybrid bridge.
- Implement monotonic message sequencing and duplicate suppression.

### Phase 3: Mobile Resiliency & Session Persistence
- Implement `visibilitychange` and `online` event hooks for instant mobile screen sleep recovery.
- Add 15-second host disconnection grace period and mobile reconnection retry loop with `REQUEST_STATE_SYNC`.
- Add visual connection status badge on host and player UI ("P2P Direct", "Server Relay", "Reconnecting").

### Phase 4: Cloud Deployment & Production Integration
- Add deployment configurations for Render / Railway / Fly.io (Dockerfile / render.yaml / procfile).
- Wire environment variable configuration (`VITE_WS_SERVER_URL`) in frontend build.
- Validate end-to-end join flow across real mobile devices on cellular data and desktop host.

---
*Research synthesized: 2026-10-08*
