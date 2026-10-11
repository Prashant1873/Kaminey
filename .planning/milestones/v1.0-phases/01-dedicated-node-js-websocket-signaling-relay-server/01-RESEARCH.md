# Phase 1: Dedicated Node.js WebSocket Signaling & Relay Server - Research

**Researched:** 2026-10-08
**Domain:** Node.js WebSocket Signaling & Relay Server
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

No user constraints - all decisions at the agent's discretion.
</user_constraints>

<architectural_responsibility_map>
## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Room Registry & Lifecycle | Backend Server (`server/server.js`) | — | Central source of active room codes and connected socket sockets. |
| WebRTC Signaling (SDP/ICE) | Backend Server (`server/server.js`) | Browser/Client | Relays offer, answer, and ICE candidate JSON envelopes between peers. |
| Fallback Game Message Relay | Backend Server (`server/server.js`) | Browser/Client | Routes application messages when P2P direct channels are blocked by symmetric NAT. |
| HTTP Health Monitoring | Backend Server (`server/server.js`) | — | Answers `GET /health` for cloud liveness probes (Render, Railway, Fly). |
| Game Rules & State Authority | Host Base Station (Browser) | — | Host remains single authority for game state machine and secret identities. |
</architectural_responsibility_map>

<research_summary>
## Summary

Phase 1 establishes the dedicated backend runtime for Kaminey. Rather than depending on public unmonitored infrastructure (`0.peerjs.com`), a dedicated Node.js `ws` server provides private room allocation, WebRTC signaling, and fallback message relaying.

The server operates with zero database dependencies, keeping memory consumption tiny (<30MB) and startup instantaneous. It maintains an in-memory map of active rooms (`Map<roomCode, { hostSocket, players: Map<playerId, socket> }>`). It also exposes a lightweight HTTP listener for `/health` checks to satisfy free/cloud hosting platform health checks.

**Primary recommendation:** Use Node.js standard `http` server coupled with the high-performance `ws` library in `server/server.js`, and test all protocol flows using Node's built-in test runner or Vitest.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Node.js | v20+ LTS | Runtime environment | Standard enterprise runtime, built-in test runner, zero extra binaries. |
| `ws` | ^8.18.0 | WebSocket Server & Client | Industry standard for Node.js, ultra-lightweight, zero protocol fluff, handles thousands of concurrent frames. |
| Node `http` | Built-in | HTTP Listener for `/health` | Handles cloud platform health checks without needing Express or Fastify. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `dotenv` | ^16.4.5 | Environment variable loader | Loading `PORT` (defaults to 3001) and CORS origins. |
| Node `crypto` | Built-in | Room ID generation & hash verification | Crypto-safe random code generation. |

## Implementation Patterns

### Message Envelope Protocol
All messages between client and server are encoded as JSON:
```json
{
  "action": "ROOM_CREATE" | "ROOM_JOIN" | "SIGNAL" | "RELAY" | "HEARTBEAT_PING" | "HEARTBEAT_PONG",
  "roomCode": "HAV412",
  "senderId": "player-1234",
  "targetId": "host" | "player-1234" | "all",
  "payload": {}
}
```

### Inactive Room Garbage Collection
A 30-second interval scans rooms. If the host socket has been closed for >60 seconds and no active players remain, the room record is evicted from memory.

## Validation Architecture

### Automated Test Strategy
- Integration tests in `server/test/server.test.js` using Node.js test runner (`node --test`) or `vitest`.
- Test suite connects real WebSocket client instances to verify:
  1. Room creation by host.
  2. Player join and room presence broadcast.
  3. Signal message forwarding between host and player.
  4. Fallback message relay forwarding between host and player.
  5. HTTP `GET /health` endpoint response.
  6. Room cleanup on disconnect.
</standard_stack>
