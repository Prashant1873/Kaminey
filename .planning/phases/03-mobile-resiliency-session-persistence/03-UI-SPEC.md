---
phase: 3
slug: mobile-resiliency-session-persistence
status: draft
shadcn_initialized: false
preset: none
created: 2026-10-08
---

# Phase 3 — UI Design Contract

> Visual and interaction contract for network status badges, grace period visualizer, and reconnection prompts.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none |
| Preset | not applicable |
| Component library | none (Vanilla CSS design tokens) |
| Icon library | lucide-react |
| Font | Hanken Grotesk / SF Pro Display |

---

## Spacing Scale

Declared values (multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Inline icon gaps, badge padding |
| sm | 8px | Connection status badge margins |
| md | 16px | Header bar padding |
| lg | 24px | Modal margins |
| xl | 32px | Major component separation |

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 0.9375rem | 400 | 1.5 |
| Label | 0.75rem | 700 | 1.2 |
| Heading | 1.25rem | 700 | 1.2 |
| Display | 2.25rem | 800 | 1.1 |

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | `#090A0F` | Surfaces, background, dark canvas |
| Secondary (30%) | `#1C202E` | Card containers, status chip pill |
| Accent P2P Direct | `#10B981` | Direct P2P badge (Green) |
| Accent WS Relay | `#F59E0B` | Relay fallback badge (Amber) |
| Destructive Reconnecting | `#EF4444` | Disconnected / Reconnecting badge (Red) |

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Direct P2P Badge | "P2P Direct" |
| Relay Fallback Badge | "Server Relay" |
| Reconnecting Badge | "Reconnecting..." |
| Host Disconnection Notice | "Player offline — 15s grace period active" |
| Mobile Screen Wake Resync | "Syncing palace chamber..." |

---

## UI Considerations

| Category | Element(s) | Status | Resolution / Reason |
|----------|------------|--------|---------------------|
| {populated} | NetworkStatusBadge | ✅ covered | Badge shows green dot + "P2P Direct" when connected via WebRTC |
| {partial} | NetworkStatusBadge | ✅ covered | Badge shows amber dot + "Server Relay" when relayed via WebSocket |
| {error} | NetworkStatusBadge | ✅ covered | Badge pulses red dot + "Reconnecting..." when socket/data channel drops |
| {loading} | Mobile Wake Screen | ✅ covered | Transparent toast "Syncing palace chamber..." briefly shown during REQUEST_STATE_SYNC |
