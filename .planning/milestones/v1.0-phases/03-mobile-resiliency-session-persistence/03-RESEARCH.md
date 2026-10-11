# Phase 3: Mobile Resiliency & Session Persistence - Research

**Researched:** 2026-10-08
**Domain:** Mobile Browser Lifecycle & Session Recovery
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

No user constraints - all decisions at the agent's discretion.
</user_constraints>

<architectural_responsibility_map>
## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Mobile Screen Sleep/Wake Detection | Client (`src/network/hybridBridge.js`) | — | Hooks `document.addEventListener('visibilitychange')` and `window.addEventListener('online')`. |
| State Resynchronization Protocol | Client Bridge & Host Base Station | — | Client requests `REQUEST_STATE_SYNC`, host dispatches personalized `STATE_SYNC`. |
| Host Disconnection Grace Period | Host Base Station (`src/components/host/HostBaseStation.jsx`) | — | Keeps disconnected player alive in state tree for 15s before purging. |
| Connection Mode UI Badge | Common UI Component (`src/components/common/NetworkBadge.jsx`) | Host & Player UI | Renders mode pill ("Direct P2P", "Server Relay", "Reconnecting"). |
</architectural_responsibility_map>

<research_summary>
## Summary

Mobile operating systems (iOS Safari and Android Chrome) aggressively freeze JavaScript execution, drop WebSockets, and throttle timers whenever the screen dims, locks, or the user switches tabs. Previously, this caused players to be permanently severed from the game.

Phase 3 implements a triple-layer recovery system:
1. **Sleep/Wake Hooks:** Listen to `document.visibilitychange` and `window.online`. When `document.visibilityState === 'visible'`, check if the socket or WebRTC data channel is dead. If dead, immediately reconnect and send `REQUEST_STATE_SYNC`.
2. **Host 15-Second Grace Period:** When a player drops, start a 15-second grace countdown timer instead of evicting them instantly. If the player reconnects with the same `playerId`, bind their new socket and resume without disrupting voting or roles.
3. **Visual Network Badge:** Render an unobtrusive status pill in both Host and Player headers, giving clear visibility into whether the session is on direct P2P, server relay, or reconnecting.

**Primary recommendation:** Integrate lifecycle events directly into `HybridNetworkBridge`, add `REQUEST_STATE_SYNC` handling to `HostNetwork`, add a 15s timer map to `HostBaseStation`, and create a shared `NetworkBadge` component.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| API / Library | Version | Purpose | Why Standard |
|---------------|---------|---------|--------------|
| Page Visibility API | W3C Standard | `document.visibilityState` | Detects foregrounding on iOS Safari and Android Chrome reliably. |
| Network Information API | W3C Standard | `window.addEventListener('online')` | Detects physical network interface recovery (e.g. Wi-Fi reconnection). |
| Lucide React | Existing | Status icons (Wifi, Radio, RefreshCw) | Consistent icon styling. |

## Validation Architecture

### Automated Test Strategy
- Test suite in `test/resilience.test.js` exercising:
  1. `REQUEST_STATE_SYNC` roundtrip between player bridge and host bridge.
  2. 15-second grace period timer mechanics.
  3. Network badge state rendering logic.
</standard_stack>
