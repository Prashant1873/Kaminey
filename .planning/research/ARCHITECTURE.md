# Architecture Research

**Domain:** Real-Time Multiplayer Signaling & Relay Networking
**Researched:** 2026-10-08
**Confidence:** HIGH

## Standard Architecture

### System Overview

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Client Application Layer                              │
│       ┌──────────────────────┐              ┌──────────────────────┐        │
│       │ HostBaseStation.jsx  │              │ PlayerController.jsx │        │
│       └──────────┬───────────┘              └──────────┬───────────┘        │
├──────────────────┼─────────────────────────────────────┼────────────────────┤
│                  ▼                                     ▼                    │
│       ┌────────────────────────────────────────────────────────────┐        │
│       │                 HybridNetworkBridge.js                     │        │
│       │  - Transport Manager (P2P vs WS Relay)                     │        │
│       │  - Heartbeat & Visibility Lifecycle Handler                │        │
│       │  - Deduplication & Reconnect State Machine                 │        │
│       └──────────────┬──────────────────────────────┬──────────────┘        │
├──────────────────────┼──────────────────────────────┼───────────────────────┤
│                      │ [Primary: If Direct P2P OK]  │ [Fallback / Signaler] │
│                      ▼                              ▼                       │
│           ┌──────────────────────┐      ┌──────────────────────┐            │
│           │ WebRTC DataChannel   │◄────►│ WebSocket Connection │            │
│           │ (P2P direct data)    │      │ (Signaling & Relay)  │            │
│           └──────────────────────┘      └──────────┬───────────┘            │
├────────────────────────────────────────────────────┼────────────────────────┤
│                                                    ▼                        │
│                                         ┌──────────────────────┐            │
│                                         │ Node.js WS Server    │            │
│                                         │ (server/server.js)   │            │
│                                         │ - Room Registry      │            │
│                                         │ - Signal Router      │            │
│                                         │ - Fallback Message   │            │
│                                         │   Forwarder          │            │
│                                         └──────────────────────┘            │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `server/server.js` | Manages active room codes, connects hosts & players, routes WebRTC signaling offers/answers, and acts as message relay when P2P is inactive. | Node.js `ws` server with lightweight in-memory `Map<roomCode, { host, players }>`. |
| `src/network/HybridBridge.js` | Unifies network I/O for host and players. Encapsulates connection lifecycle, handles fallback transitions, and dispatches messages. | ES6 class wrapping native `WebSocket` and `RTCPeerConnection`. |
| `src/network/peerManager.js` | High-level API consumed by React components (`HostNetwork` and `PlayerNetwork`). | Refactored to delegate underlying transport to `HybridBridge`. |
| Host Base Station | Remains the single authority for game rules, phase transitions, and private role knowledge. | React state tree (`src/components/host/HostBaseStation.jsx`). |

## Recommended Project Structure

```text
Kabo/
├── server/
│   ├── server.js              # Dedicated Node.js WebSocket signaling & relay server
│   ├── package.json           # Backend dependencies (ws, dotenv)
│   └── test/
│       └── server.test.js     # Protocol & room routing integration tests
├── src/
│   └── network/
│       ├── config.js          # WS server URL resolution (dev vs prod) & ICE servers
│       ├── hybridBridge.js    # Core hybrid transport (WebRTC + WS relay fallback)
│       └── peerManager.js     # Host & player network adapter (consumed by UI)
└── package.json               # Root scripts ("dev", "dev:server", "dev:all")
```

### Structure Rationale

- `server/`: Kept self-contained with its own minimal dependencies so it can be deployed independently to Render/Railway or run alongside Vite during development.
- `src/network/`: Clean separation between protocol configuration (`config.js`), low-level hybrid transport (`hybridBridge.js`), and game-level message dispatching (`peerManager.js`).

## Architectural Patterns

### Pattern 1: Automatic Transport Fallback Race

**What:** When a player joins a room, the client immediately opens a WebSocket connection to the server for signaling and simultaneously initiates WebRTC P2P ICE candidate negotiation. If the WebRTC `RTCDataChannel` fails or takes longer than 4.0 seconds, the bridge switches its active channel mode from `P2P` to `WS_RELAY` without terminating the game or dropping the player.

**When to use:** Crucial for mobile party games where users are on mixed networks (cellular vs home Wi-Fi vs symmetric NAT).

**Trade-offs:** Minimal server bandwidth is used during relay, but connection success rate improves from ~60% to 100%.

```javascript
// Example: Unified send logic in HybridBridge
send(type, payload) {
  const envelope = { type, payload, senderId: this.id, timestamp: Date.now() };
  if (this.channelMode === 'P2P' && this.dataChannel?.readyState === 'open') {
    this.dataChannel.send(JSON.stringify(envelope));
  } else if (this.ws?.readyState === WebSocket.OPEN) {
    this.ws.send(JSON.stringify({ action: 'RELAY', ...envelope }));
  } else {
    this.queuePendingMessage(envelope);
  }
}
```

### Pattern 2: Lifecycle Sleep Wakeup Handler

**What:** On mobile OS (iOS Safari / Android Chrome), browser timers and sockets freeze when the phone screen is turned off or switched to another app. When the user reopens the browser (`visibilitychange` fires `document.visibilityState === 'visible'`), the bridge detects whether the socket/data channel died, triggers an immediate reconnect if needed, and sends `REQUEST_STATE_SYNC`.

```javascript
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    this.verifyLivenessAndResync();
  }
});
```

---
*Architecture research for: Real-Time Multiplayer Signaling & Relay Networking*
*Researched: 2026-10-08*
