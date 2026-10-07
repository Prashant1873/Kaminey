<!-- refreshed: 2026-10-08 -->
# Architecture

**Analysis Date:** 2026-10-08

## System Overview

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                      Living Room Base Station (TV / Laptop)             │
│                      `src/components/host/HostBaseStation.jsx`          │
├────────────────────────────┬─────────────────────────────┬──────────────┤
│  HostLobby / HostVoting    │  State Authority / Engine   │ Audio Engine │
│  `src/components/host/*`   │  (Roles, Timers, Verdicts)  │ `soundEffects│
└──────────────┬─────────────┴──────────────┬──────────────┴──────┬───────┘
               │                            │                     │
               │ (WebRTC DataChannel Mesh)  │                     │
               ▼                            ▼                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       HostNetwork Transport                             │
│                       `src/network/peerManager.js`                      │
└───────────────────────────────────────────┬─────────────────────────────┘
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      PlayerNetwork Client Transport                     │
│                      `src/network/peerManager.js`                       │
└───────────────────────────────────────────┬─────────────────────────────┘
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Mobile Player Controllers (Smartphones)              │
│                    `src/components/player/PlayerController.jsx`         │
├────────────────────────────┬─────────────────────────────┬──────────────┤
│  PlayerJoin / RoleReveal   │  PlayerNight / PlayerDares  │ PlayerVoting │
│  `src/components/player/*` │  `src/components/player/*`  │ PlayerGhost  │
└────────────────────────────┴─────────────────────────────┴──────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| `App` | Top-level hash router (`LANDING`, `HOST`, `PLAYER`), landing page, rules modal trigger | `src/App.jsx` |
| `HostBaseStation` | Master game orchestrator: manages player registry, role assignment, phase machine, countdowns, and personalized broadcasts | `src/components/host/HostBaseStation.jsx` |
| `PlayerController` | Mobile client orchestrator: maintains connection to room, dispatches user actions (votes, tasks, ready pings), renders phase views | `src/components/player/PlayerController.jsx` |
| `HostNetwork` | Host-side WebRTC manager: manages peer connections map, 2.5s heartbeat ping loop, and personalized state serialization | `src/network/peerManager.js` |
| `PlayerNetwork` | Player-side WebRTC manager: connects to host peer ID, auto-responds to heartbeats, retries connection on drop | `src/network/peerManager.js` |
| `SoundController` | Procedural Web Audio API sound generator (gongs, heartbeats, gavels, victory fanfare) | `src/audio/soundEffects.js` |
| `TrippyVisualizer` | Interactive procedural HTML5 canvas particle/fluid visualizer for drinks breather lounge | `src/components/common/TrippyVisualizer.jsx` |
| `QRCodeView` | Canvas QR code generator for room URL with one-click copy and auto-sizing | `src/components/common/QRCodeView.jsx` |
| `Countdown` | Shared timer display with progress bar, urgent color change, and tick audio effects | `src/components/common/Countdown.jsx` |

## Pattern Overview

**Overall:** Host-Authoritative Star Topology (P2P WebRTC Mesh) with Role-Isolated State Projections.

**Key Characteristics:**
- **Host Authoritative:** The host computer acts as the single source of truth for all game rules, role allocations, phase progression, and tallying. Players run thin dumb-terminal controllers.
- **Strict Anti-Cheat State Projection:** The host never broadcasts a raw global state. Instead, `getPlayerPersonalizedState(targetPlayerId)` in `src/components/host/HostBaseStation.jsx:65` crafts a personalized payload containing only what that specific player is permitted to see (`mySecret: { role, kamineyPartners, nightVotes }`).
- **Zero-Backend P2P Transit:** Signaling handled over PeerJS public brokers; once WebRTC data channels are established, all traffic travels directly device-to-device over encrypted UDP.

## Layers

**UI / Presentation Layer:**
- Purpose: Render views responsive to host TV screens (1080p/4K) and mobile smartphone controllers (390px-430px width).
- Location: `src/components/host/`, `src/components/player/`, `src/components/common/`
- Contains: React components, SVG icons (`lucide-react`), CSS utility classes.
- Depends on: Design tokens in `src/index.css`, audio in `src/audio/soundEffects.js`.
- Used by: `src/App.jsx`.

**State & Game Loop Layer:**
- Purpose: Manage state machine transitions (`LOBBY` → `ROLE_REVEAL` → `NIGHT` → `DARES` → `DRINKS_BREATHER` → `MORNING` → `DISCUSSION` → `VOTING` → `EXILE` → `GAME_OVER`).
- Location: `src/components/host/HostBaseStation.jsx`
- Contains: Phase transition handlers, bot injector logic, vote tallies, victory condition checks.
- Depends on: `src/network/peerManager.js`, `src/data/partyDares.js`, `src/data/animalAvatars.js`.

**Transport & Networking Layer:**
- Purpose: Abstract WebRTC peer setup, error recovery, reconnection loops, and keep-alive heartbeats.
- Location: `src/network/peerManager.js`
- Contains: `HostNetwork`, `PlayerNetwork`, `generateRoomCode`.
- Depends on: `peerjs` library.
- Used by: `src/components/host/HostBaseStation.jsx` and `src/components/player/PlayerController.jsx`.

**Procedural Asset Layer:**
- Purpose: Generate dynamic sounds and visual effects without external file downloads.
- Location: `src/audio/soundEffects.js`, `src/components/common/TrippyVisualizer.jsx`
- Contains: Web Audio API oscillators/gain envelopes and Canvas 2D math algorithms.

## Data Flow

### Primary Request Path (Mobile Action → Host Resolution)

1. Player taps an action (e.g. cast exile vote on player B) in `src/components/player/PlayerVoting.jsx:36`.
2. `PlayerController` invokes `networkRef.current.send('CAST_VOTE', { targetId })` (`src/components/player/PlayerController.jsx:104`).
3. Payload travels through WebRTC RTCDataChannel to the host device.
4. `HostNetwork` receives message in `conn.on('data')` and invokes `handlePlayerMessage` (`src/network/peerManager.js:141`).
5. Host updates its internal state: `setVotes(prev => ({ ...prev, [senderId]: targetId }))` (`src/components/host/HostBaseStation.jsx:133`).
6. State update triggers `useEffect` in `src/components/host/HostBaseStation.jsx:111`, invoking `broadcastState(getPlayerPersonalizedState)`.
7. `HostNetwork.broadcastState()` iterates through all active connections, generating a personalized sanitized payload for each player (`src/network/peerManager.js:182`).
8. Players receive `STATE_SYNC` message, triggering `setGameState(incomingState)` to refresh controller UI (`src/components/player/PlayerController.jsx:55`).

### Secondary Flow: Reconnection & Heartbeat Keep-Alive

1. `HostNetwork.startHeartbeat()` sends `HEARTBEAT_PING` every 2500ms to each connected player (`src/network/peerManager.js:75`).
2. Player device receives `HEARTBEAT_PING` and automatically returns `HEARTBEAT_PONG` (`src/network/peerManager.js:312`).
3. If phone browser sleeps and connection drops, `PlayerNetwork.conn.on('close')` fires, setting a 1500ms reconnect timer that re-establishes the connection and re-sends `PLAYER_JOIN` (`src/network/peerManager.js:331`).

**State Management:**
- Host holds master state in React hooks (`useState`, `useRef`).
- Client holds mirror state in `gameState` hook, updated strictly by inbound `STATE_SYNC` events.

## Key Abstractions

**`HostNetwork` & `PlayerNetwork`:**
- Purpose: Encapsulate PeerJS lifecycle, connection maps, STUN ICE handling, and auto-reconnect logic.
- Location: `src/network/peerManager.js`
- Pattern: EventEmitter / Callback injection pattern.

**Personalized State Projection (`getPlayerPersonalizedState`):**
- Purpose: Prevent data sniffing by stripping secret identities of other players before serialization.
- Location: `src/components/host/HostBaseStation.jsx:65`
- Pattern: View Model Projection / Adapter.

**Procedural Sound Synthesizer (`SoundController`):**
- Purpose: Produce low-latency audio effects through synthesized audio nodes rather than audio file downloads.
- Location: `src/audio/soundEffects.js`
- Pattern: Singleton service.

## Entry Points

**Web Entry:**
- Location: `index.html` → `src/main.jsx`
- Triggers: Browser loading page URL.
- Responsibilities: Wraps application in `ThemeProvider` and mounts `<App />` into `#root`.

**Application Router:**
- Location: `src/App.jsx`
- Triggers: URL hash change (`#/host`, `#/join/:code`, `#/play`, `#/`).
- Responsibilities: Routes user to either `HostBaseStation`, `PlayerController`, or `Landing` view.

## Architectural Constraints

- **Single Host per Room Code:** Room codes are deterministic peer IDs (`kaminey-v2-{ROOM_CODE}`). If two hosts pick the same code, PeerJS emits `unavailable-id` error, triggering automatic room code regeneration.
- **WebRTC Network Compatibility:** Requires symmetric/asymmetric NAT traversal via STUN. Networks behind corporate symmetric NATs or restrictive firewalls may fail without a TURN relay.
- **Client Lifecycles & Mobile Sleep:** Mobile Safari/Chrome suspends JavaScript and WebRTC sockets when screens lock. Heartbeat watchdog and auto-reconnect timers preserve and recover sessions.

## Anti-Patterns

### Storing Global Game State on Players
**What happens:** Sending the full `roles` object to all connected devices.
**Why it's wrong:** Any player opening Chrome DevTools or inspecting network packets can view who the traitors are.
**Do this instead:** Use `getPlayerPersonalizedState` in `src/components/host/HostBaseStation.jsx:65` to send only `mySecret.role` and teammates for Kaminey.

### Direct DOM Manipulation for Styles
**What happens:** Applying ad-hoc inline styles with raw hex codes without tokens.
**Why it's wrong:** Breaks the unified Apple Minimal Haveli design token system and theme toggling.
**Do this instead:** Use CSS variables defined in `src/index.css` (e.g. `var(--surface)`, `var(--primary)`).

## Error Handling

**Strategy:** Graceful degradation with automatic retries and visual status indicators.

**Patterns:**
- Peer ID collision handling with backoff retry (`reconnectAttempts < maxReconnectAttempts`) followed by automatic code regeneration (`src/network/peerManager.js:159`).
- Player disconnect debounce: When a player drops, host waits before removing them or preserves bot states.
- Web Audio API suspended state unlock: Auto-resumes `AudioContext` on first user interaction gesture (`src/audio/soundEffects.js:18`).

## Cross-Cutting Concerns

**Logging:** Standard browser console output (`console.warn`, `console.error`) with prefix identifiers.
**Theming:** CSS data-attribute switching (`[data-theme="light"]`, `[data-theme="dark"]`) controlled via React context (`src/context/ThemeContext.jsx`).
**Haptics:** Conditional invocation of `navigator.vibrate()` with graceful fallback on iOS/Safari where vibration is restricted (`src/components/player/PlayerRoleReveal.jsx:10`).

---

*Architecture analysis: 2026-10-08*
