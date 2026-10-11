# Requirements: Kaminey (Kabo)

**Defined:** 2026-10-12
**Core Value:** Frictionless, instant smartphone join and unbreakable session connection during social deduction gameplay across any network environment, elevated with anti-slop visual craft, fluid physics, and atomic skeleton loading.

## v2.0 Requirements

Requirements for Milestone v2.0: UI/UX Overhaul, Anti-Slop Design System and Production Release.

### Royal Haveli Color System & Visual Tokens (`COLOR`)

- [ ] **COLOR-01**: Define anti-slop color tokens (Indian Haveli palette: Deep Terracotta/Crimson, Royal Marigold/Gold, Haveli Sandstone, Peacock Emerald, Midnight Onyx background tinting) replacing generic pure black/grays and AI-purple gradients.
- [ ] **COLOR-02**: Enforce WCAG 2.2 AA compliant contrast tokens (minimum 4.5:1 text, 3:1 interactive/icons) across host base station and mobile controller themes.

### Tactile Controls, Toggles & Concentric Affordances (`CTRL`)

- [ ] **CTRL-01**: Implement tactile button hierarchy (Primary, Secondary, Destructive, Ghost) with sub-pixel optical centering (`translateY(-0.5px)` on SVG icons) and active states on pointer-down.
- [ ] **CTRL-02**: Enforce concentric corner radii formula ($r_{inner} = \max(0, r_{outer} - \text{padding})$) across cards, inputs, dialogs, and segmented containers.
- [ ] **CTRL-03**: Implement viscoelastic toggles and segmented tab controls using WAAPI stretch-and-squish kinetics and Poisson volume preservation.

### Apple Fluid Spring Motion & Micro-Interactions (`MOTION`)

- [ ] **MOTION-01**: Implement critically damped spring physics (`damping: 1.0`, `response: 0.3s - 0.5s`, zero overshoot) for modal settling, role card reveal, and phase transitions.
- [ ] **MOTION-02**: Implement underdamped momentum springs (`damping: 0.8`, velocity handoff) for tactile gesture releases (swiping dare cards, role peak flicks).
- [ ] **MOTION-03**: Guarantee 100% interruptible transitions across all game screens so user input never locks during animations.

### Coordinated Atomic Skeleton Loading System (`SKEL`)

- [ ] **SKEL-01**: Build coordinated skeleton loading primitives matching the exact dimensions and typography rhythm of target components.
- [ ] **SKEL-02**: Enforce atomic screen reveals where all component skeletons resolve in a single synchronized visual frame, completely preventing staggered DOM pop-in, layout shifts (CLS = 0), and half-loaded states during screen initialization and phase transitions.

### UI/UX Flow & Cognitive Ergonomics Overhaul (`UX`)

- [ ] **UX-01**: Enforce Fitts's Law on mobile controller with minimum 44x44px touch targets and thumb-zone reachability for voting, voting confirmation, and dare actions.
- [ ] **UX-02**: Enforce Hick's Law and progressive disclosure across game phases, simplifying complex host announcements and player choice screens.
- [ ] **UX-03**: Enforce Doherty Threshold (<400ms visual response / optimistic feedback) and Peak-End Rule celebration moments for victory, exile, and role reveal.

### Official GitHub Launch & Production Release (`REL`)

- [ ] **REL-01**: Comprehensive, production-grade GitHub `README.md` with system architecture diagrams, living room setup guide, mobile connectivity overview, and gameplay GIFs/badges.
- [ ] **REL-02**: Developer and operator documentation (deployment guide, self-hosting Node relay, environment configuration).
- [ ] **REL-03**: Final production build validation, linting/test verification, release tagging, and launch packaging.

## Validated Requirements (Milestone v1.0)

- [x] **SERVER-01**: Node.js WebSocket server manages room lifecycle (creation, player join, leave, destroy) with 6-character room codes.
- [x] **SERVER-02**: Server routes WebRTC SDP (offer/answer) and ICE candidate signaling payloads between host and mobile clients.
- [x] **SERVER-03**: Server acts as fallback message forwarder, relaying game state and player actions when direct WebRTC P2P is inactive.
- [x] **SERVER-04**: Server provides a lightweight HTTP health endpoint (`/health`) and socket ping/pong cleanup for inactive connections.
- [x] **BRIDGE-01**: Client initiates simultaneous WebSocket connection and WebRTC P2P DataChannel negotiation with a 4.0s timeout.
- [x] **BRIDGE-02**: Client automatically falls back to WebSocket relay mode without user intervention if WebRTC ICE negotiation fails or times out.
- [x] **BRIDGE-03**: `HybridNetworkBridge` provides a unified `send(type, payload)` API that abstracts transport mode away from host and player UI components.
- [x] **BRIDGE-04**: Monotonic message sequence numbering and deduplication window prevents duplicate votes or actions during transport handover.
- [x] **RESILIENCE-01**: Mobile client detects screen sleep and tab wake via `visibilitychange` and `online` events, instantly verifying socket liveness.
- [x] **RESILIENCE-02**: Host Base Station maintains a 15-second disconnection grace period before evicting a disconnected player from active game state.
- [x] **RESILIENCE-03**: Mobile client automatically issues `REQUEST_STATE_SYNC` upon reconnecting to restore the exact active phase screen without page refresh.
- [x] **RESILIENCE-04**: Host and mobile player UIs display real-time connection status badges ("Direct P2P", "Server Relay", "Reconnecting").
- [x] **DEPLOY-01**: Backend includes production configuration (`server/package.json`, environment variable handling, Render/Railway deployment profiles).
- [x] **DEPLOY-02**: Frontend build configures `VITE_WS_SERVER_URL` with automatic fallback to production cloud relay on GitHub Pages and localhost during dev.
- [x] **DEPLOY-03**: Verification suite tests end-to-end phone join, mobile sleep wake cycle, and cellular-to-Wi-Fi relay fallback.

## Out of Scope

Explicitly excluded to maintain focus on design craft and release polish.

| Feature | Reason |
|---------|--------|
| Persistent User Accounts & Auth DB | High friction for party games; ephemeral room tokens preserve casual living room pickup-and-play. |
| WebRTC Audio/Video Streaming | Game is designed for in-person living room play; phones are tactile secret controllers, not video chat. |
| Native App Store Binaries (iOS/Android) | Responsive web app with mobile PWA meta tags is sufficient and friction-free. |

## Traceability

Which phases cover which requirements.

| Requirement | Phase | Status |
|-------------|-------|--------|
| COLOR-01 | Phase 5 | Pending |
| COLOR-02 | Phase 5 | Pending |
| CTRL-01 | Phase 6 | Pending |
| CTRL-02 | Phase 6 | Pending |
| CTRL-03 | Phase 6 | Pending |
| MOTION-01 | Phase 7 | Pending |
| MOTION-02 | Phase 7 | Pending |
| MOTION-03 | Phase 7 | Pending |
| SKEL-01 | Phase 8 | Pending |
| SKEL-02 | Phase 8 | Pending |
| UX-01 | Phase 9 | Pending |
| UX-02 | Phase 9 | Pending |
| UX-03 | Phase 9 | Pending |
| REL-01 | Phase 10 | Pending |
| REL-02 | Phase 10 | Pending |
| REL-03 | Phase 10 | Pending |

**Coverage:**
- v2.0 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0 ✓

---
*Requirements defined: 2026-10-12*
*Milestone: v2.0 UI/UX Overhaul, Anti-Slop Design System and Production Release*
