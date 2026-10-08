# Kaminey (Kabo)

## What This Is

A mobile-connected social deduction party game set in an Indian royal Haveli palace. A host screen (living room display/TV) coordinates rounds, timers, and public announcements while players secretly join and play from their smartphones via WebRTC and a hybrid WebSocket fallback relay.

## Core Value

Frictionless, instant smartphone join and unbreakable session connection during social deduction gameplay across any network environment (cellular LTE/5G or mixed Wi-Fi).

## Requirements

### Validated

- [x] Host Base Station orchestrator for living room TV / large display (`src/components/host/HostBaseStation.jsx`)
- [x] Mobile player controller and secret identity reveal (`src/components/player/PlayerController.jsx`)
- [x] Complete game state machine: Lobby, Role Reveal, Night, Dares, Morning, Discussion, Voting, and Exile
- [x] Procedural audio synthesis via Web Audio API (`src/audio/soundEffects.js`)
- [x] Curated Indian royal avatar taxonomy and 6-character room codes (`HAV412`, `SHI829`)
- [x] GitHub Pages static frontend deployment workflow

### Active

- [ ] Lightweight Node.js/WebSocket signaling & relay server for dedicated room orchestration
- [ ] Hybrid network bridge: attempt direct WebRTC P2P for low latency, automatically falling back to WebSocket relay if ICE / symmetric NAT fails
- [ ] Resilient heartbeat, keep-alive, and auto-reconnect logic for mobile devices surviving background sleep and tab switches
- [ ] 1-click cloud server deployment profile (Render, Railway, Fly.io, or self-hosted) with configurable frontend backend URL fallback

### Out of Scope

- [ ] Complete native mobile apps (iOS/Android store binaries) — web app with mobile-first PWA responsiveness is sufficient
- [ ] User authentication / permanent account databases — ephemeral room sessions maintain party game spontaneity
- [ ] Video/Audio WebRTC streaming — only structured JSON state payloads are transmitted

## Context

- Real-world playtesting revealed mobile players on cellular (LTE/5G) or restrictive guest Wi-Fi networks could not connect to hosts due to symmetric NAT and public PeerJS cloud signaling (`0.peerjs.com`) downtime/rate limits.
- The hybrid approach preserves zero-latency direct P2P when available while providing an unbreakable fallback relay via a lightweight Node/WebSocket server.

## Constraints

- **Tech Stack**: Frontend: React 18, Vite, Vanilla CSS tokens. Backend: Node.js with `ws` or lightweight server.
- **Network Compatibility**: Must work seamlessly across asymmetric Wi-Fi and mobile carrier networks (cellular 4G/5G).
- **Deployment**: Frontend deployed to GitHub Pages; backend deployable to free/low-cost platforms (e.g. Render, Railway) with zero mandatory credit card barrier.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Hybrid WebRTC + WebSocket Relay | Pure STUN P2P fails on symmetric NAT/cellular; pure WebSocket increases server load. Hybrid gets best of both worlds. | — Pending |
| Ephemeral Room Sessions | Avoids auth friction and database overhead for living room party games. | ✓ Good |

---
*Last updated: 2026-10-08 after Milestone v1.0 initialization*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state
