# Feature Research

**Domain:** Real-Time Multiplayer Mobile Game Connectivity
**Researched:** 2026-10-08
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete or broken.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| 1-Click QR & Code Join | Mobile party players will not type URLs or complex tokens. | LOW | QR code encodes room code directly into hash route `#/join/:code`. |
| Automatic Relay Fallback | Players on cellular or hotel Wi-Fi cannot tell if NAT blocked P2P; game must work automatically. | MEDIUM | If WebRTC DataChannel doesn't open within 4s, seamless fallback to WebSocket relay. |
| Background Sleep Recovery | Phone screens dim or lock during conversations; app must not disconnect permanently. | MEDIUM | Listen to `visibilitychange` and `online` events, auto-ping and trigger state resync upon wake. |
| Host Session Persistence | Refreshing the TV browser should not terminate the room or kick all players. | MEDIUM | Store room credentials and reconnect to backend with session token. |
| Explicit Connection Status Feedback | Users need clear feedback if their phone is connecting, syncing, or offline. | LOW | Amber/green/red connection badges with contextual hints ("Relayed", "Direct P2P"). |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable for party games.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Dual-Transport Hybrid Engine | Delivers 0ms local latency when possible, yet 100% reliability on any network. | HIGH | Abstraction layer unifies P2P and WebSocket relay under a single `networkBridge.send()` API. |
| Monotonic Message Sequencing & Dedup | Eliminates double-voting or duplicated action dispatches during network blips or transport handover. | LOW | Sequence IDs (`seq: number`) and acknowledgment receipts. |
| In-App Network Diagnostic Modal | Host can view real-time latency (RTT) and transport mode (P2P vs Relay) for each player. | LOW | Helps host identify who is lagging or has poor cellular reception. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Heavy Persistent Accounts | Users want to save profiles across days. | Introduces passwords, email verifications, and high friction for casual party guests. | Ephemeral browser storage (`sessionStorage`) with avatar pickers. |
| Raw WebRTC without Server Relay | Pure serverless sounds appealing. | Fails completely across cellular networks, symmetric NAT, and strict firewalls. | Hybrid architecture with fallback server relay. |
| Long Polling HTTP Fallback | Fallback for non-WebSocket environments. | Extremely high server request overhead and high latency for real-time game timers. | Standard WebSocket fallback only (supported on 99.8% of modern mobile browsers). |

## Feature Dependencies

```text
[Node/WS Signaling Server]
    └──requires──> [Room Registry & Message Router]
                       └──enables──> [WebRTC Signaling Handshake]
                       └──enables──> [Fallback Message Relay]

[Mobile Client Bridge]
    └──requires──> [Heartbeat Keep-Alive]
    └──requires──> [Visibility Change Handler (Sleep Wakeup)]
    └──enhances──> [Seamless State Resynchronization]
```

### Dependency Notes

- **Fallback Message Relay requires Room Registry:** The server must map socket connections to room IDs to relay messages when P2P is unavailable.
- **Sleep Wakeup enhances State Resync:** When a mobile device resumes from screen lock, it immediately requests `REQUEST_STATE_SYNC` from the host.

## MVP Definition

### Launch With (v1.0 Milestone)

- [ ] Lightweight Node.js/WebSocket server with room management and message relay.
- [ ] Hybrid Client Network Bridge with automatic WebRTC-to-WebSocket fallback.
- [ ] Mobile sleep recovery (`visibilitychange`) and heartbeat ping/pong.
- [ ] Visual connection diagnostic badge (Direct vs Relayed vs Reconnecting).
- [ ] Environment-aware server configuration (local dev vs cloud deployment).

### Add After Validation (v1.x)

- [ ] Host network health dashboard showing per-player latency (RTT).
- [ ] Optional TURN server configuration for direct P2P even across strict symmetric NAT.

### Future Consideration (v2+)

- [ ] Multi-room clustering with Redis if player volume exceeds single-process capacity (>500 rooms).

---
*Feature research for: Real-Time Multiplayer Mobile Game Connectivity*
*Researched: 2026-10-08*
