# Requirements: Kaminey (Kabo)

**Defined:** 2026-10-08
**Core Value:** Frictionless, instant smartphone join and unbreakable session connection during social deduction gameplay across any network environment (cellular LTE/5G or mixed Wi-Fi).

## v1.0 Requirements

Requirements for Milestone v1.0: Network & Backend Robustness (Hybrid Relay & Signaling).

### Dedicated WebSocket Server (`SERVER`)

- [ ] **SERVER-01**: Node.js WebSocket server manages room lifecycle (creation, player join, leave, destroy) with 6-character room codes.
- [ ] **SERVER-02**: Server routes WebRTC SDP (offer/answer) and ICE candidate signaling payloads between host and mobile clients.
- [ ] **SERVER-03**: Server acts as fallback message forwarder, relaying game state and player actions when direct WebRTC P2P is inactive.
- [ ] **SERVER-04**: Server provides a lightweight HTTP health endpoint (`/health`) and socket ping/pong cleanup for inactive connections.

### Hybrid Client Network Bridge (`BRIDGE`)

- [ ] **BRIDGE-01**: Client initiates simultaneous WebSocket connection and WebRTC P2P DataChannel negotiation with a 4.0s timeout.
- [ ] **BRIDGE-02**: Client automatically falls back to WebSocket relay mode without user intervention if WebRTC ICE negotiation fails or times out.
- [ ] **BRIDGE-03**: `HybridNetworkBridge` provides a unified `send(type, payload)` API that abstracts transport mode away from host and player UI components.
- [ ] **BRIDGE-04**: Monotonic message sequence numbering and deduplication window prevents duplicate votes or actions during transport handover.

### Mobile Resiliency & Session Persistence (`RESILIENCE`)

- [ ] **RESILIENCE-01**: Mobile client detects screen sleep and tab wake via `visibilitychange` and `online` events, instantly verifying socket liveness.
- [ ] **RESILIENCE-02**: Host Base Station maintains a 15-second disconnection grace period before evicting a disconnected player from active game state.
- [ ] **RESILIENCE-03**: Mobile client automatically issues `REQUEST_STATE_SYNC` upon reconnecting to restore the exact active phase screen without page refresh.
- [ ] **RESILIENCE-04**: Host and mobile player UIs display real-time connection status badges ("Direct P2P", "Server Relay", "Reconnecting").

### Cloud Deployment & Environment Config (`DEPLOY`)

- [ ] **DEPLOY-01**: Backend includes production configuration (`server/package.json`, environment variable handling, Render/Railway deployment profiles).
- [ ] **DEPLOY-02**: Frontend build configures `VITE_WS_SERVER_URL` with automatic fallback to production cloud relay on GitHub Pages and localhost during dev.
- [ ] **DEPLOY-03**: Verification suite tests end-to-end phone join, mobile sleep wake cycle, and cellular-to-Wi-Fi relay fallback.

## v2 Requirements

Deferred to future release. Tracked but not in current milestone.

### Advanced Infrastructure & Game Enhancements

- **INFRA-01**: Multi-room clustering with Redis pub/sub if active room count exceeds single-process limit (>500 rooms).
- **INFRA-02**: Dedicated TURN relay server integration for direct WebRTC traversal across strict symmetric firewalls.
- **GAME-01**: In-game role cheat sheet on mobile during debate phases.
- **GAME-02**: Host pause and round rollback controls.

## Out of Scope

Explicitly excluded to maintain laser focus on connection robustness.

| Feature | Reason |
|---------|--------|
| Persistent User Accounts & Auth DB | High friction for party games; ephemeral room tokens preserve casual living room pickup-and-play. |
| WebRTC Audio/Video Streaming | Game is designed for in-person living room play; phones are tactile secret controllers, not video chat. |
| Long Polling HTTP Fallback | High server request latency and CPU overhead; modern mobile browsers support WebSockets natively. |

## Traceability

Which phases cover which requirements.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SERVER-01 | Phase 1 | Pending |
| SERVER-02 | Phase 1 | Pending |
| SERVER-03 | Phase 1 | Pending |
| SERVER-04 | Phase 1 | Pending |
| BRIDGE-01 | Phase 2 | Pending |
| BRIDGE-02 | Phase 2 | Pending |
| BRIDGE-03 | Phase 2 | Pending |
| BRIDGE-04 | Phase 2 | Pending |
| RESILIENCE-01 | Phase 3 | Pending |
| RESILIENCE-02 | Phase 3 | Pending |
| RESILIENCE-03 | Phase 3 | Pending |
| RESILIENCE-04 | Phase 3 | Pending |
| DEPLOY-01 | Phase 4 | Pending |
| DEPLOY-02 | Phase 4 | Pending |
| DEPLOY-03 | Phase 4 | Pending |

**Coverage:**
- v1.0 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0 ✓

---
*Requirements defined: 2026-10-08*
*Last updated: 2026-10-08 after Milestone v1.0 initialization*
