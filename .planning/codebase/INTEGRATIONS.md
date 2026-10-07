# External Integrations

**Analysis Date:** 2026-10-08

## APIs & External Services

**Peer-to-Peer Realtime Signaling:**
- PeerJS Public Cloud Broker - Initial WebRTC session discovery and handshake signaling.
  - SDK/Client: `peerjs` (`src/network/peerManager.js`)
  - Endpoint: Default PeerJS cloud infrastructure (`0.peerjs.com:443`)
  - Protocol: WSS (WebSocket Secure) for signaling; direct UDP/WebRTC data channels for payload transit.
  - Auth: None (free, serverless; relies on prefixed room code namespaces `kaminey-v2-{ROOM_CODE}`).

**STUN Relays (NAT Traversal):**
- Google Public STUN Servers - Discovers public IP/port bindings for devices across local Wi-Fi and mobile LTE/5G subnets.
  - URLs: `stun:stun.l.google.com:19302`, `stun:stun1.l.google.com:19302`, `stun:stun2.l.google.com:19302`, `stun:stun3.l.google.com:19302`, `stun:stun4.l.google.com:19302` (`src/network/peerManager.js`)
  - Auth: Publicly accessible STUN without authentication credentials.

**Web Fonts & CDN:**
- Google Fonts (`Hanken Grotesk`) - Typography referenced in `index.html` and `src/index.css`.
  - Origin: `https://fonts.googleapis.com` / `https://fonts.gstatic.com`
  - Purpose: Primary display, headline, and body typeface.

## Data Storage

**Databases:**
- None. The architecture is 100% ephemeral and serverless.
- State is held in-memory within the Host Base Station React state tree (`src/components/host/HostBaseStation.jsx`).

**Client Storage:**
- `sessionStorage`:
  - `kaminey_host_room`: Stores active host room code across page refreshes (`src/components/host/HostBaseStation.jsx:23`).
  - `kaminey_host_active`: Host session flag for route persistence (`src/App.jsx:25`).
  - `kaminey_player_session`: Persists `{ id, name, avatarId, roomCode }` for mobile players during browser tab reconnects (`src/components/player/PlayerController.jsx:20`).
- `localStorage`:
  - `kaminey_theme_v2`: Persists user's UI theme selection (`dark` vs `light`) (`src/context/ThemeContext.jsx:7`).

**File Storage:**
- Local filesystem / bundle only. No external asset hosting; sound effects synthesized via Web Audio API (`src/audio/soundEffects.js`) and avatars defined in JS (`src/data/animalAvatars.js`).

**Caching:**
- Browser HTTP caching for Vite production bundle (`dist/`).

## Authentication & Identity

**Auth Provider:**
- Ephemeral Anonymous Identity:
  - Host creates a room code (`generateRoomCode()`, e.g. `HAV412`, `SHI829`) based on Indian heritage word lists (`src/network/peerManager.js:23`).
  - Players assign an animal avatar (from `src/data/animalAvatars.js`) and persona name on join (`src/components/player/PlayerJoin.jsx:75`).
  - Player IDs are generated client-side: `player-${Date.now()}-${randomString}` (`src/components/player/PlayerController.jsx:75`).
  - No usernames, passwords, or OAuth tokens.

## Monitoring & Observability

**Error Tracking:**
- None (Console error logging in `src/network/peerManager.js`).

**Logs:**
- Browser DevTools console logging (`console.warn`, `console.error`) for peer connection lifecycles, ICE failures, and heartbeat timeouts.

**Audit Telemetry:**
- Local Playwright automation script (`scripts/audit_scan.mjs`) generating accessibility, touch-target size, and viewport screenshots to `.impeccable/audit/screenshots`.

## CI/CD & Deployment

**Hosting:**
- GitHub Pages (`https://<username>.github.io/<repo>/`).
- Static SPA routing supported via hash routing (`#/host`, `#/join/:code`, `#/play`, `#/`).

**CI Pipeline:**
- GitHub Actions workflow (`.github/workflows/deploy.yml`):
  - Triggers on push to `main` or `master`.
  - Runs `npm ci` and `npm run build`.
  - Deploys static build artifact `dist/` directly via `actions/deploy-pages@v4`.

## Environment Configuration

**Required env vars:**
- None. Zero build-time environment variables required for standard dev or production build.

**Secrets location:**
- No secrets stored in repository or deployment.

## Webhooks & Callbacks

**Incoming:**
- None. All real-time messages arrive via WebRTC `dataConnection.on('data')` directly between peers.

**Outgoing:**
- None.

---

*Integration audit: 2026-10-08*
