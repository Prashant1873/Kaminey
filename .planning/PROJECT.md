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
- [x] Lightweight Node.js/WebSocket signaling & relay server for dedicated room orchestration (Milestone v1.0)
- [x] Hybrid network bridge with automatic WebSocket relay fallback (Milestone v1.0)
- [x] Mobile background sleep/wake resilience and 15s host grace period (Milestone v1.0)
- [x] 1-click cloud server deployment profiles for Render/Railway (Milestone v1.0)

### Active

- [ ] Royal Haveli luxury color palette and semantic tokens (from `frontend-skill`)
- [ ] Tactile buttons, toggles, segmented controls with concentric radii & optical centering (from `frontend-skill`)
- [ ] Apple fluid spring physics and micro-animations with critically damped settling (from `frontend-skill`)
- [ ] Coordinated atomic skeleton loading system eliminating staggered DOM pop-in
- [ ] UI/UX cognitive flow overhaul enforcing Doherty 400ms threshold, Hick's & Fitts's laws
- [ ] Official GitHub release: comprehensive README, gameplay diagrams, release badges, launch packaging

### Out of Scope

- [ ] Complete native mobile apps (iOS/Android store binaries) — web app with mobile-first PWA responsiveness is sufficient
- [ ] User authentication / permanent account databases — ephemeral room sessions maintain party game spontaneity
- [ ] Video/Audio WebRTC streaming — only structured JSON state payloads are transmitted

## Current Milestone: v2.0 UI/UX Overhaul, Anti-Slop Design System and Production Release

**Goal:** Transform Kaminey into a luxury, anti-slop party game experience with fluid physics, atomic skeleton loading, and an official GitHub release.

**Target features:**
- Haveli color palette & semantic tokens (frontend-skill)
- Tactile buttons, toggles & concentric controls (frontend-skill)
- Apple fluid spring physics & layout transitions (frontend-skill)
- Coordinated atomic skeleton loading system
- UI/UX flow overhaul & cognitive UX laws
- Official GitHub release documentation, launch assets, and polish

## Context

- Real-world playtesting revealed mobile players on cellular (LTE/5G) or restrictive guest Wi-Fi networks could not connect to hosts due to symmetric NAT and public PeerJS cloud signaling (`0.peerjs.com`) downtime/rate limits.
- Milestone v1.0 successfully delivered a dedicated Node.js signaling/relay server, hybrid network bridge, mobile resilience, and cloud deployment.
- Milestone v2.0 elevates the visual craft, motion physics, perceived performance, and GitHub presence to production release grade.

## Constraints

- **Tech Stack**: Frontend: React 18, Vite, Vanilla CSS tokens. Backend: Node.js with `ws` or lightweight server.
- **Design System**: Strict anti-slop craft standards, Apple fluid spring physics, WCAG 2.2 AA accessibility, zero layout pop-in.
- **Deployment**: Frontend deployed to GitHub Pages; backend deployable to free/low-cost platforms (e.g. Render, Railway).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Hybrid WebRTC + WebSocket Relay | Pure STUN P2P fails on symmetric NAT/cellular; pure WebSocket increases server load. Hybrid gets best of both worlds. | ✓ Validated (v1.0) |
| Ephemeral Room Sessions | Avoids auth friction and database overhead for living room party games. | ✓ Good |
| Anti-Slop Design Tokens & Apple Springs | Replaces generic styling with an immersive royal Haveli palace aesthetic and fluid physics. | — Pending |
| Coordinated Atomic Skeletons | Prevents piecemeal DOM pops and jarring reflows during phase transitions and asset loading. | — Pending |

---
*Last updated: 2026-10-12 after Milestone v2.0 initialization*

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
