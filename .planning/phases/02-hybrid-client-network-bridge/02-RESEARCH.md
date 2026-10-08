# Phase 2: Hybrid Client Network Bridge - Research

**Researched:** 2026-10-08
**Domain:** WebRTC DataChannel & WebSocket Dual-Transport Client Networking
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

No user constraints - all decisions at the agent's discretion.
</user_constraints>

<architectural_responsibility_map>
## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Transport Selection & Fallback | Client (`src/network/hybridBridge.js`) | — | Client attempts WebRTC P2P; triggers fallback timer to WebSocket relay if ICE negotiation stalls. |
| Message Deduplication | Client (`src/network/hybridBridge.js`) | — | Tracks sliding window of message IDs to prevent double action dispatch during transport handover. |
| Game Protocol Orchestration | HostNetwork & PlayerNetwork (`src/network/peerManager.js`) | Client UI | Exposes existing API surface (`onPlayerJoin`, `onStateSync`, `send`) so UI components need zero breaking rewrites. |
| Network Endpoint Config | Client Config (`src/network/config.js`) | — | Resolves server WebSocket URL dynamically across dev (`localhost:3001`) and production cloud URL. |
</architectural_responsibility_map>

<research_summary>
## Summary

Phase 2 builds the client-side bridge that eliminates phone connection dropouts. In Phase 1, we built the dedicated Node.js signaling and fallback relay server. Phase 2 replaces direct PeerJS cloud dependency with a unified dual-transport abstraction: `HybridNetworkBridge`.

Upon joining, the client connects to the WebSocket server and simultaneously initiates WebRTC `RTCPeerConnection` negotiation with Google STUN. A 4.0-second race timer starts:
1. If the WebRTC `RTCDataChannel` opens within 4s, channel mode resolves to `P2P_DIRECT`.
2. If WebRTC ICE negotiation fails, is blocked by symmetric NAT, or takes longer than 4.0s, channel mode switches to `WS_RELAY`.
3. In both cases, UI components call `send(type, payload)`, which delegates to the active transport transparently.
4. Monotonic sequence numbers and a 10-second sliding ID cache prevent duplicate messages during fallback transitions.

**Primary recommendation:** Encapsulate native `RTCPeerConnection` and standard browser `WebSocket` in `src/network/hybridBridge.js`, refactoring `src/network/peerManager.js` to preserve the exact callback contract used by `HostBaseStation.jsx` and `PlayerController.jsx`.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library / API | Version | Purpose | Why Standard |
|---------------|---------|---------|--------------|
| Native `WebSocket` | W3C Standard | Signaling & Fallback Relay | Universally supported in mobile Safari & Chrome; zero extra bundle size. |
| Native `RTCPeerConnection` | W3C Standard | Direct P2P Data Channels | Built into modern browsers; enables zero-server-bandwidth gameplay when peers share local networks. |
| STUN Servers | Google Public STUN | ICE Candidate Gathering | `stun:stun.l.google.com:19302` for public IP discovery. |

## Implementation Patterns

### 4-Second Fallback Race
```javascript
// Start fallback timer
this.fallbackTimer = setTimeout(() => {
  if (this.channelMode === 'CONNECTING') {
    console.warn('[HybridBridge] P2P negotiation timed out (4s); activating WebSocket relay mode.');
    this.activateRelayMode();
  }
}, 4000);

dataChannel.onopen = () => {
  clearTimeout(this.fallbackTimer);
  this.channelMode = 'P2P_DIRECT';
  this.onModeChange?.('P2P_DIRECT');
};
```

### Deduplication Cache
```javascript
class DeduplicationCache {
  constructor(maxSize = 100, ttlMs = 10000) {
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
  prune(now) {
    for (const [id, time] of this.seen.entries()) {
      if (now - time > this.ttlMs) this.seen.delete(id);
    }
  }
}
```

## Validation Architecture

### Automated Test Strategy
- Unit and integration tests in `test/hybridBridge.test.js` or `server/test/hybrid.test.js`.
- Test cases:
  1. Bridge initializes WebSocket connection and registers room code.
  2. Fallback race timer triggers `WS_RELAY` mode when P2P is unavailable.
  3. Messages sent via `send()` are delivered via active transport.
  4. Deduplication suppresses duplicate message IDs.
</standard_stack>
