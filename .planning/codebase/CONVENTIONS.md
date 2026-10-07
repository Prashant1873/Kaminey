# Coding Conventions

**Analysis Date:** 2026-10-08

## Naming Patterns

**Files:**
- Component files: PascalCase matching the default export name (`src/components/host/HostBaseStation.jsx`, `src/components/player/PlayerRoleReveal.jsx`).
- Utility and data files: camelCase (`src/network/peerManager.js`, `src/audio/soundEffects.js`, `src/data/animalAvatars.js`).
- Scripts: snake_case with `.mjs` extension (`scripts/audit_scan.mjs`).

**Functions:**
- React functional components: PascalCase (e.g. `export default function HostLobby({ ... })`).
- Event handlers: `handle` prefix (e.g. `handleJoin`, `handleCastVote`, `handleSelect`, `handleReveal`).
- Callback props: `on` prefix (e.g. `onStartGame`, `onProceed`, `onCastVote`, `onLeave`).
- Utility helpers: camelCase descriptive verbs (e.g. `generateRoomCode()`, `triggerHaptic()`, `getAvatarById()`).

**Variables & Constants:**
- Local state and variables: camelCase (e.g. `selectedTargetId`, `isRevealed`, `alivePlayers`).
- Boolean flags: prefix with `is`, `has`, `can`, or `show` (e.g. `isKamina`, `hasVoted`, `canStart`, `showRules`).
- Static configuration constants: UPPER_SNAKE_CASE (e.g. `PEER_PREFIX`, `PEER_CONFIG`, `ANIMAL_AVATARS`, `BOT_NAMES`).

**Types / Data Models:**
- Ephemeral in JavaScript; referenced with clear object shapes in JSDoc comments or prop destructing (e.g. `{ id, name, avatarId, roomCode }`).

## Code Style

**Formatting:**
- Indentation: 2 spaces.
- Semicolons: Always used at statement terminators.
- Quotes: Single quotes for JavaScript imports/strings (`import React from 'react'`); double quotes for HTML/JSX attributes (`<div className="badge-gain">`).
- Trailing commas: Used in multiline arrays and objects.

**Styling & Design System Tokens:**
- CSS Variables over arbitrary hardcoded hex values:
  - Surface: `var(--surface)`, `var(--surface-container-low)`, `var(--surface-container-high)`.
  - Text: `var(--on-surface)`, `var(--on-surface-variant)`.
  - Borders: `var(--outline-variant)`.
  - Accents: `var(--primary)`, `var(--gain)`, `var(--loss)`, `var(--warning)`.
  - Border Radii: `var(--rounded-sm)` (4px), `var(--rounded-md)` (8px), `var(--rounded-xl)` (16px), `var(--rounded-2xl)` (20px), `var(--rounded-full)` (9999px).
- Tactical tactile scaling on buttons: `className="spring-btn"` with `:active { transform: scale(0.97); }`.
- Touch target minimum: At least 44px height and width (`minHeight: '44px'`, `minWidth: '44px'`) for mobile accessibility.

## Import Organization

**Order:**
1. React core and hooks (`import React, { useState, useEffect, useRef, useCallback } from 'react'` in `src/components/host/HostBaseStation.jsx:1`).
2. Third-party libraries (`import confetti from 'canvas-confetti'`, `import QRCode from 'qrcode'`).
3. Internal components (`import Header from '../common/Header'`, `import AvatarBadge from '../common/AvatarBadge'`).
4. Network transport & audio services (`import { HostNetwork } from '../../network/peerManager'`).
5. Static data and icons (`import { ANIMAL_AVATARS } from '../../data/animalAvatars'`, `import { Crown, Tv, Smartphone } from 'lucide-react'`).
6. Context hooks (`import { useTheme } from '../../context/ThemeContext'`).

**Path Aliases:**
- Relative imports with `./` and `../` used consistently throughout `src/`. No path aliases configured in `vite.config.js`.

## Error Handling

**Patterns:**
- WebRTC Peer Errors: Inspected by error type (`err.type === 'unavailable-id'`) with retry counter and graceful code re-generation fallback (`src/network/peerManager.js:159`).
- Safe failovers for browser APIs: Browser-specific features like `navigator.vibrate` and `navigator.clipboard.writeText` are always wrapped in `typeof window !== 'undefined'` and `try/catch` blocks (`src/components/player/PlayerRoleReveal.jsx:11`).
- Deserialization safety: `sessionStorage.getItem()` calls are wrapped in `try { JSON.parse(...) } catch (e) { ... }` with null fallback (`src/components/player/PlayerController.jsx:19`).

## Logging

**Framework:** Native `console` methods.

**Patterns:**
- Warnings: `console.warn(...)` for recoverable errors like network send failures or clipboard permissions (`src/network/peerManager.js:82`).
- Errors: `console.error(...)` for critical issues like STUN peer connection drops or QR code generation failures (`src/network/peerManager.js:157`).
- Production cleanliness: No spammy `console.log` statements in rendering loops.

## Comments

**When to Comment:**
- Header comments explain architectural responsibilities (e.g. `// Host-Authoritative Realtime Peer-to-Peer Networking for Kaminey` in `src/network/peerManager.js:1`).
- Inline comments explain non-obvious engineering decisions, such as mobile browser keep-alive timers, haptic fallbacks, and anti-cheat role isolation.

**JSDoc/TSDoc:**
- Used selectively on exported utility functions:
  ```javascript
  // Generate highly unique 6-character room code (e.g. HAV412, SHI829)
  export function generateRoomCode() { ... }
  ```

## Function Design

**Size:**
- Modular components separated by concern (`HostLobby`, `HostVoting`, `HostExile`, `PlayerRoleReveal`).
- Parent controllers (`HostBaseStation`, `PlayerController`) coordinate state and delegate rendering to dedicated subcomponents.

**Parameters:**
- Destructured props with explicit default values:
  ```javascript
  export default function Countdown({ duration, onExpire, active = true, label = 'Time Remaining' })
  ```

**Return Values:**
- React components return clean JSX hierarchy; callbacks return void or primitive status.

## Module Design

**Exports:**
- Default exports for React components (`export default function HostVoting(...)`).
- Named exports for utility functions, classes, and constants (`export class HostNetwork`, `export function generateRoomCode`, `export const ANIMAL_AVATARS`).

**Barrel Files:**
- Not used. Modules import directly from specific component paths (e.g. `import HostLobby from './HostLobby'`).

---

*Convention analysis: 2026-10-08*
