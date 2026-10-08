# Pitfalls Research

**Domain:** Real-Time Multiplayer Signaling & Relay Networking
**Researched:** 2026-10-08
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Relying Exclusively on STUN for Mobile WebRTC

**What goes wrong:**
Mobile players on cellular networks (Jio, Airtel, Verizon, T-Mobile) or public/hotel Wi-Fi networks fail to connect to the host living room TV screen, remaining stuck forever on "Joining room...".

**Why it happens:**
Mobile cellular operators and corporate firewalls enforce **Symmetric NAT** and Carrier-Grade NAT (CGNAT). STUN can only discover public mappings for cone NAT. Symmetric NAT generates different port mappings for different destinations, making direct P2P hole-punching mathematically impossible without a TURN relay or WebSocket relay.

**How to avoid:**
Implement dual-transport fallback. Start signaling over WebSocket. If WebRTC ICE negotiation does not complete within 4 seconds, automatically downgrade the session to WebSocket relay without erroring out.

**Warning signs:**
Host logs show `iceConnectionState: 'checking'` transitioning directly to `'failed'` or `'disconnected'`.

**Phase to address:**
Phase 1 & Phase 2 (Server Relay and Client Bridge).

---

### Pitfall 2: Mobile Background Sleep Socket Freezing

**What goes wrong:**
When a mobile player puts their phone down or switches to WhatsApp during council discussion, the game disconnects or fails to register their vote when they pick up the phone again.

**Why it happens:**
iOS Safari and Android Chrome severely throttle or terminate JavaScript execution, timer intervals (`setInterval`), and background network sockets when the app loses focus or the screen locks. The host's keep-alive timeout fires and evicts the player.

**How to avoid:**
1. Use a generous host drop grace period (e.g., 15–20s instead of 5s) before permanently purging player state.
2. Hook `document.addEventListener('visibilitychange')` and `window.addEventListener('online')` on the player device. Upon waking, immediately test socket state, reconnect if disconnected, and issue a lightweight `REQUEST_STATE_SYNC`.

**Warning signs:**
Players complain of "White screen", "Kicked from game", or out-of-sync phase screens after unlocking their device.

**Phase to address:**
Phase 3 (Mobile Resiliency).

---

### Pitfall 3: Mixed Content and Insecure Contexts on Mobile

**What goes wrong:**
The web app works on desktop `http://localhost:5173`, but when opened on a phone via local IP (`http://192.168.1.x:5173`), WebRTC APIs (`RTCPeerConnection`), secure storage, or Web Crypto APIs fail or produce security exceptions.

**Why it happens:**
Modern mobile browsers (especially Safari on iOS) restrict sensitive Web APIs to **Secure Contexts** (`https://` or `http://localhost`). Loading via `http://<LAN-IP>` is treated as an insecure context.

**How to avoid:**
1. Ensure the production build uses `https://` (GitHub Pages) and connects to `wss://` (production WebSocket backend).
2. For local mobile testing, recommend either a secure tunnel (`ngrok`, `localtunnel`, `vite --https`) or deploy to a staging cloud instance on Render/Railway.

**Warning signs:**
`TypeError: Cannot read properties of undefined (reading 'subtle')` or `navigator.mediaDevices / RTCPeerConnection is undefined`.

**Phase to address:**
Phase 1 & Phase 4 (Deployment and Environment Config).

---

### Pitfall 4: Duplicate Message Processing During Transport Handover

**What goes wrong:**
A player's vote or action is processed twice, or state sync packets arrive out of order when switching between P2P and relay.

**Why it happens:**
If a message is queued or transmitted over both the failing P2P connection and the fallback WebSocket relay simultaneously during a reconnect handover.

**How to avoid:**
Attach monotonic sequence numbers (`seq: number`) and unique message IDs (`id: string`) to all client-originated commands. The host deduplicates any action received with a previously processed ID within a 10-second sliding window.

**Warning signs:**
Double vote tallies or rapid state flickering in host console.

**Phase to address:**
Phase 2 (Hybrid Client Network Bridge).

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Using free public broker (`0.peerjs.com`) | Zero server code to write. | Silent downtime, zero control over rate limits, broken mobile play. | Only for preliminary 10-minute prototypes. Unacceptable for real gameplay. |
| Dropping player immediately on socket close | Simpler state management on host. | Ruined party game experience whenever someone locks their phone screen. | Never. Always allow at least 15s reconnection grace period with session recovery. |
| Hardcoding server URL in client code | Quick to test locally. | Breaks CI/CD and deployment across different hosting environments. | Never. Always use environment configuration (`import.meta.env.VITE_WS_URL`). |

---
*Pitfalls research for: Real-Time Multiplayer Signaling & Relay Networking*
*Researched: 2026-10-08*
