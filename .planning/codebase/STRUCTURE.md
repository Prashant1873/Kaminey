# Codebase Structure

**Analysis Date:** 2026-10-08

## Directory Layout

```text
kaminey/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages CI/CD automation workflow
├── .impeccable/
│   ├── audit/
│   │   └── screenshots/        # Playwright visual regression screenshots
│   └── critiques/
│       └── index-html.md       # Design audit report and Nielsen heuristics scorecard
├── .planning/
│   └── codebase/               # GSD codebase map documents
├── dist/                       # Production bundle output from Vite build (gitignored)
├── node_modules/               # Installed npm dependencies (gitignored)
├── scripts/
│   └── audit_scan.mjs          # Playwright automated audit script
├── src/
│   ├── audio/
│   │   └── soundEffects.js     # Web Audio API procedural sound synthesizer
│   ├── components/
│   │   ├── common/             # Shared reusable presentation components
│   │   │   ├── AvatarBadge.jsx
│   │   │   ├── Countdown.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── HowToPlayModal.jsx
│   │   │   ├── QRCodeView.jsx
│   │   │   └── TrippyVisualizer.jsx
│   │   ├── host/               # Base station screens (TV/living room views)
│   │   │   ├── HostBaseStation.jsx
│   │   │   ├── HostDares.jsx
│   │   │   ├── HostDiscussion.jsx
│   │   │   ├── HostDrinksBreather.jsx
│   │   │   ├── HostExile.jsx
│   │   │   ├── HostGameOver.jsx
│   │   │   ├── HostLobby.jsx
│   │   │   ├── HostMorning.jsx
│   │   │   ├── HostNight.jsx
│   │   │   ├── HostRoleReveal.jsx
│   │   │   └── HostVoting.jsx
│   │   └── player/             # Mobile controller screens (phone views)
│   │       ├── PlayerController.jsx
│   │       ├── PlayerDares.jsx
│   │       ├── PlayerDiscussion.jsx
│   │       ├── PlayerDrinksBreather.jsx
│   │       ├── PlayerGhost.jsx
│   │       ├── PlayerJoin.jsx
│   │       ├── PlayerNight.jsx
│   │       ├── PlayerRoleReveal.jsx
│   │       └── PlayerVoting.jsx
│   ├── context/
│   │   └── ThemeContext.jsx    # Light / dark theme React context provider
│   ├── data/
│   │   ├── animalAvatars.js    # Wildlife persona avatars list & color assignments
│   │   └── partyDares.js       # Group dares, secret missions & drinking prompts
│   ├── network/
│   │   └── peerManager.js      # HostNetwork and PlayerNetwork WebRTC peer logic
│   ├── App.jsx                 # Top-level application shell and route switcher
│   ├── index.css               # Complete design token stylesheet & glassmorphism system
│   └── main.jsx                # React DOM entry point
├── .gitignore                  # Git ignore rules for node_modules, dist, logs
├── DESIGN.md                   # Apple Minimal Haveli design specifications
├── index.html                  # HTML entry point with meta viewport & Google Fonts
├── package.json                # Project dependencies and npm scripts
├── package-lock.json           # Pinned dependency lockfile
├── README.md                   # Project overview, gameplay guide, setup instructions
└── vite.config.js              # Vite bundler and dev server configuration
```

## Directory Purposes

**`src/components/host/`:**
- Purpose: Base station UI components rendered on the host's screen (TV, laptop, tablet).
- Contains: Fullscreen widescreen layouts, QR displays, player lobbies, discussion spotlights, vote tallies, and verdict announcements.
- Key files: `src/components/host/HostBaseStation.jsx`, `src/components/host/HostLobby.jsx`, `src/components/host/HostVoting.jsx`.

**`src/components/player/`:**
- Purpose: Responsive smartphone controller views rendered on players' mobile devices.
- Contains: Single-hand ergonomic layouts, touch-first cards, wax-seal hold-to-reveal gestures, private traitor conclaves, and secret voting drawers.
- Key files: `src/components/player/PlayerController.jsx`, `src/components/player/PlayerRoleReveal.jsx`, `src/components/player/PlayerVoting.jsx`.

**`src/components/common/`:**
- Purpose: Shared presentation components used across both host and player views.
- Contains: Avatar badges, countdown timers, QR code generators, header navigation bars, modal rules dialogs, and audio-reactive visualizers.
- Key files: `src/components/common/Header.jsx`, `src/components/common/AvatarBadge.jsx`, `src/components/common/Countdown.jsx`, `src/components/common/TrippyVisualizer.jsx`.

**`src/network/`:**
- Purpose: Real-time peer-to-peer networking transport using WebRTC data channels.
- Contains: Host and client connection managers, keep-alive heartbeats, reconnection logic, and room code generators.
- Key files: `src/network/peerManager.js`.

**`src/audio/`:**
- Purpose: Client-side procedural sound generation without external audio file assets.
- Contains: Web Audio API sound synthesizer with custom frequency ramps and envelope curves.
- Key files: `src/audio/soundEffects.js`.

**`src/data/`:**
- Purpose: Static game content, rule sets, missions, and persona dictionaries.
- Contains: Wildlife animal avatar metadata, team challenges, secret cover dares, drinking game cards.
- Key files: `src/data/animalAvatars.js`, `src/data/partyDares.js`.

**`src/context/`:**
- Purpose: Global React state providers.
- Contains: Theme toggling (`dark` / `light`) and document attribute binding.
- Key files: `src/context/ThemeContext.jsx`.

**`scripts/`:**
- Purpose: Developer automation and testing scripts.
- Contains: Playwright headless browser audit runner for accessibility and UI testing.
- Key files: `scripts/audit_scan.mjs`.

## Key File Locations

**Entry Points:**
- `index.html`: Web document root with viewport metadata and font preconnects.
- `src/main.jsx`: React DOM initialization, context wrapping, stylesheet import.
- `src/App.jsx`: Hash router (`#/host`, `#/join/:code`, `#/play`, `#/`) and landing page view.

**Configuration:**
- `package.json`: Project scripts (`dev`, `build`, `preview`) and dependencies.
- `vite.config.js`: Vite server and plugin options.
- `DESIGN.md`: Color tokens, typography specifications, and component radius guidelines.

**Core Logic:**
- `src/components/host/HostBaseStation.jsx`: Game state machine, bot generation, and role distribution.
- `src/network/peerManager.js`: WebRTC peer connectivity and heartbeat loop.

**Testing:**
- `scripts/audit_scan.mjs`: Playwright headless browser test suite.

## Naming Conventions

**Files:**
- React components: PascalCase with `.jsx` extension (e.g. `HostVoting.jsx`, `PlayerController.jsx`, `Countdown.jsx`).
- Logic & helper modules: camelCase with `.js` extension (e.g. `peerManager.js`, `soundEffects.js`, `animalAvatars.js`).
- Scripts: snake_case with `.mjs` extension (e.g. `audit_scan.mjs`).

**Directories:**
- Feature / layer directories: lowercase single words or kebab-case (e.g. `components`, `host`, `player`, `common`, `audio`, `network`, `context`, `data`, `scripts`).

**Functions & Variables:**
- Component functions: PascalCase (e.g. `HostBaseStation`, `PlayerJoin`).
- Helper functions: camelCase (e.g. `generateRoomCode()`, `getPlayerPersonalizedState()`, `triggerHaptic()`).
- Constants: UPPER_SNAKE_CASE (e.g. `PEER_PREFIX`, `ANIMAL_AVATARS`, `TEAM_MISSIONS`, `BOT_NAMES`).

## Where to Add New Code

**New Game Phase:**
1. Add host view component to `src/components/host/` (e.g. `HostMinigame.jsx`).
2. Add player controller view to `src/components/player/` (e.g. `PlayerMinigame.jsx`).
3. Update state machine in `src/components/host/HostBaseStation.jsx` to transition into the new phase and handle incoming messages.
4. Update `src/components/player/PlayerController.jsx` to render the player view during the phase.
5. Update `getPhaseLabel` in `src/components/common/Header.jsx` with the readable phase title.

**New Party Dare or Mission:**
- Add entry to `TEAM_MISSIONS` array in `src/data/partyDares.js`. Specify `id`, `category`, `badge`, `title`, `mission`, `prompt`, and `categoryColor`.

**New Sound Effect:**
- Add method to `SoundController` class in `src/audio/soundEffects.js` using Web Audio API oscillators and gain nodes.

**New Animal Avatar:**
- Add entry to `ANIMAL_AVATARS` array in `src/data/animalAvatars.js` with `id`, `name`, `emoji`, `title`, and `color`.

## Special Directories

**`.impeccable/`:**
- Purpose: Stores automated design audit reports, Nielsen usability evaluations, and Playwright screenshot captures.
- Generated: Partially generated during audit runs.
- Committed: Yes (audit findings tracked in repo).

**`dist/`:**
- Purpose: Production build output containing bundled HTML, JS, and CSS for deployment.
- Generated: Yes (via `npm run build`).
- Committed: No (ignored via `.gitignore`).

---

*Structure analysis: 2026-10-08*
