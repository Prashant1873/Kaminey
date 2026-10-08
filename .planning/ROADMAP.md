# Roadmap: Kaminey (Kabo)

## Overview

Milestone v1.0 establishes rock-solid backend robustness and mobile connectivity for Kaminey. We replace the fragile public PeerJS cloud broker with a dedicated lightweight Node.js/WebSocket server, implement a dual-transport hybrid bridge (P2P DataChannels with automatic WebSocket relay fallback), harden mobile sleep/wake resilience, and provide production cloud deployment configurations.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4): Planned milestone work
- Decimal phases (e.g. 2.1): Urgent insertions if needed

- [x] **Phase 1: Dedicated Node.js WebSocket Signaling & Relay Server** - Standalone room registry, WebRTC signaling router, and fallback message forwarder.
- [x] **Phase 2: Hybrid Client Network Bridge** - Dual-transport client bridge with 4-second P2P race and transparent WebSocket relay fallback.
- [ ] **Phase 3: Mobile Resiliency & Session Persistence** - Sleep/wake recovery (`visibilitychange`), 15s host grace period, state resync, and UI status badges.
- [ ] **Phase 4: Cloud Deployment & Production Integration** - Render/Railway deployment profiles, Vite environment wiring, and end-to-end cellular validation.

## Phase Details

### Phase 1: Dedicated Node.js WebSocket Signaling & Relay Server
**Goal**: Implement a lightweight, zero-database Node.js WebSocket server that manages room codes, routes WebRTC signaling envelopes, and relays game messages when direct P2P is inactive.
**Depends on**: Nothing
**Requirements**: SERVER-01, SERVER-02, SERVER-03, SERVER-04
**Success Criteria** (what must be TRUE):
  1. Server starts, logs port and health status, and answers HTTP `GET /health` with `status: "ok"` and uptime.
  2. Host can open a WebSocket connection, register a room code (`HAV412`), and receive join/leave socket events.
  3. Players can connect by room code, receive room state, and exchange WebRTC signaling messages or relayed game payloads.
  4. Inactive or abandoned rooms are safely garbage-collected via periodic ping/pong heartbeats.
**Plans**: 2 plans

Plans:
- [x] 01-01: Create `server/server.js` with room registry, HTTP `/health`, and WebSocket signaling/relay routing.
- [x] 01-02: Add automated integration test suite verifying room lifecycle, signaling exchange, and relay message forwarding.

---

### Phase 2: Hybrid Client Network Bridge
**Goal**: Build a unified client-side network abstraction layer that attempts direct WebRTC P2P DataChannels while automatically falling back to WebSocket server relay if ICE negotiation stalls or fails.
**Depends on**: Phase 1
**Requirements**: BRIDGE-01, BRIDGE-02, BRIDGE-03, BRIDGE-04
**Success Criteria** (what must be TRUE):
  1. `HybridNetworkBridge` provides a clean `send(type, payload)` API consumed by both `HostNetwork` and `PlayerNetwork`.
  2. When on compatible Wi-Fi networks, data channels connect directly via P2P for zero-latency gameplay.
  3. When on cellular networks or symmetric NAT, the bridge automatically switches active transport to `WS_RELAY` within 4 seconds without errors.
  4. Monotonic sequence numbering and deduplication window prevent duplicate votes or actions during transport handover.
**Plans**: 2 plans

Plans:
- [x] 02-01: Implement `src/network/hybridBridge.js` with dual-transport state machine, 4s fallback race timer, and deduplication.
- [x] 02-02: Refactor `HostNetwork` and `PlayerNetwork` in `src/network/peerManager.js` to delegate transport to `HybridNetworkBridge`.

---

### Phase 3: Mobile Resiliency & Session Persistence
**Goal**: Eliminate mobile disconnect bugs caused by phone screen locking, browser tab switching, and aggressive mobile OS background throttling.
**Depends on**: Phase 2
**Requirements**: RESILIENCE-01, RESILIENCE-02, RESILIENCE-03, RESILIENCE-04
**Success Criteria** (what must be TRUE):
  1. When a mobile player puts their phone to sleep or locks the screen, waking the device triggers `visibilitychange` and immediate socket verification.
  2. The mobile client requests state resynchronization (`REQUEST_STATE_SYNC`) and immediately restores the active game screen without requiring a page refresh.
  3. Host Base Station maintains a 15-second disconnection grace period before evicting a player, preventing accidental drops during brief network blips.
  4. Host and mobile player screens display a clear connection status badge ("Direct P2P", "Server Relay", "Reconnecting").
**Plans**: 2 plans

Plans:
- [ ] 03-01: Wire mobile lifecycle handlers (`visibilitychange`, `online`) and implement `REQUEST_STATE_SYNC` recovery protocol.
- [ ] 03-02: Add host 15s disconnection grace period and render connection status badges across host and mobile headers.

---

### Phase 4: Cloud Deployment & Production Integration
**Goal**: Package the server for 1-click cloud deployment (Render / Railway / Fly.io) and configure Vite build environments so GitHub Pages static frontend automatically connects to the production backend.
**Depends on**: Phase 3
**Requirements**: DEPLOY-01, DEPLOY-02, DEPLOY-03
**Success Criteria** (what must be TRUE):
  1. Backend folder `server/` includes deployment specifications (`package.json`, environment variable parsing, and Render/Railway manifests).
  2. Frontend build dynamically targets `VITE_WS_SERVER_URL` in production while falling back to local dev servers during development.
  3. Full game cycle (Lobby → Role Reveal → Night → Voting) runs successfully from a real smartphone on cellular data connecting to a desktop host.
**Plans**: 2 plans

Plans:
- [ ] 04-01: Add deployment configuration (`render.yaml`, `Dockerfile` / Procfile, `package.json` scripts) and client environment resolution.
- [ ] 04-02: End-to-end verification of mobile connection over cellular network, simulating transport fallback and screen sleep.

---

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Dedicated Node.js WebSocket Signaling & Relay Server | 2/2 | Complete | 2026-10-08 |
| 2. Hybrid Client Network Bridge | 2/2 | Complete | 2026-10-08 |
| 3. Mobile Resiliency & Session Persistence | 0/2 | Planned | - |
| 4. Cloud Deployment & Production Integration | 0/2 | Not started | - |

---
*Roadmap defined: 2026-10-08*
*Milestone: v1.0 Network & Backend Robustness*
