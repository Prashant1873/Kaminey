# Stack Research

**Domain:** Real-Time Multiplayer Signaling & Relay Networking
**Researched:** 2026-10-08
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Node.js | v20+ LTS | Backend runtime | Universal support across hosting platforms (Render, Railway, Fly.io, VPS), built-in crypto, low resource usage. |
| `ws` | ^8.18.0 | Lightweight WebSocket server | Minimal memory footprint (<30MB RAM), zero unnecessary bloat, ultra-fast message throughput for JSON frames. |
| WebRTC DataChannel | Modern W3C Standard | Direct peer-to-peer data transport | Zero-latency UDP communication between host and mobile players when on compatible Wi-Fi networks. |
| Vite / React | 18.x | Frontend build and component orchestration | Existing workspace stack, fast HMR, small bundle size. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `dotenv` | ^16.4.5 | Environment variable configuration | Loading `PORT`, `ALLOWED_ORIGIN`, and optional TURN credentials on backend. |
| `nanoid` or Native Crypto | Native Node 20 | Room & session token generation | Collision-free room and client connection token generation without heavy dependencies. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `concurrently` | Concurrent dev execution | Runs both Vite frontend (`npm run dev`) and Node relay server (`node server.js`) with one command. |
| `vitest` | Unit and integration test runner | Fast execution for protocol and state serialization test cases. |

## Installation

```bash
# Backend dependencies (in server/ directory or root package)
npm install ws dotenv

# Dev dependencies
npm install -D concurrently
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Native `ws` | Socket.IO | Only if legacy browsers lack WebSocket support; otherwise Socket.IO introduces unwanted polling overhead and complex room engine abstraction. |
| Hybrid WebRTC + WS Relay | Pure PeerJS Cloud (`0.peerjs.com`) | Only for throwaway prototypes; unacceptable for production due to carrier rate limits, DNS blocks, and symmetric NAT failure. |
| Hybrid WebRTC + WS Relay | Pure WebSocket Centralized | Good alternative if host bandwidth is zero, but hybrid keeps host authoritative and saves cloud server bandwidth. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Public PeerJS broker (`0.peerjs.com`) | Unpredictable outages, rate limits, no SLA, blocks mobile joins. | Dedicated lightweight self-hosted Node/WS server. |
| STUN-only WebRTC without relay fallback | Fails completely on cellular (LTE/5G) or symmetric NAT firewalls. | Dual-mode transport: WebRTC with automatic WebSocket relay fallback. |
| Heavy Database (PostgreSQL/MongoDB) | Adds connection setup lag, migration overhead, and cold starts for ephemeral party games. | In-memory room map with automatic timeout cleanup. |

## Stack Patterns by Variant

**If Local Development:**
- Host and player connect to `ws://localhost:3001` or `ws://<local-ip>:3001`.
- Vite proxies `/ws` or connects directly via `VITE_WS_SERVER_URL`.

**If Production (GitHub Pages + Cloud Backend):**
- Frontend connects via `wss://kaminey-server.onrender.com` (or Railway/Fly URL).
- HTTPS/WSS ensures complete browser security context compliance on mobile Safari and Chrome.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `ws@^8.18.0` | Node.js v18 / v20 / v22 | Clean ESM and CommonJS support |
| React 18 | Vite 5 | Existing project setup |

## Sources

- MDN WebRTC API Specification & NAT Traversal Guide
- RFC 6455 (The WebSocket Protocol)
- PeerJS Architecture & Reliability Analysis

---
*Stack research for: Real-Time Multiplayer Signaling & Relay Networking*
*Researched: 2026-10-08*
