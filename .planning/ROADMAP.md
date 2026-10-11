# Roadmap: Kaminey (Kabo)

## Overview

Milestone v2.0 elevates Kaminey to a production-grade party game experience. Following the network stability achieved in v1.0, this milestone delivers an anti-slop royal Haveli design system, tactile controls with concentric radii, Apple fluid spring physics, a coordinated atomic skeleton loading system that eliminates layout pop-in, cognitive UX flow optimization, and an official GitHub public release.

## Phases

**Phase Numbering:**
- Phases continue from Milestone v1.0 (Phases 1–4 complete).
- Integer phases (5, 6, 7, 8, 9, 10): Planned milestone work
- Decimal phases (e.g. 5.1): Urgent insertions if needed

- [x] **Phase 5: Royal Haveli Color System & Anti-Slop Visual Tokens** - Implement rich Indian Haveli palette, semantic design tokens, and WCAG 2.2 AA contrast.
- [ ] **Phase 6: Tactile Controls, Toggles & Concentric Affordances** - Build button hierarchy with optical centering, concentric radii, and viscoelastic WAAPI toggles.
- [ ] **Phase 7: Apple Fluid Spring Motion & Micro-Interactions** - Critically damped settling physics, underdamped momentum gestures, and 100% interruptible transitions.
- [ ] **Phase 8: Coordinated Atomic Skeleton Loading System** - Synchronized component skeleton loading with zero CLS layout shifts and atomic reveals.
- [ ] **Phase 9: UI/UX Flow & Cognitive Ergonomics Overhaul** - Enforce Fitts's Law 44px thumb reach, Hick's Law progressive disclosure, Doherty <400ms feedback, and Peak-End rule.
- [ ] **Phase 10: Official GitHub Launch & Production Release** - Comprehensive README, system diagrams, gameplay guides, release badges, and production release tagging.

## Phase Details

### Phase 5: Royal Haveli Color System & Anti-Slop Visual Tokens
**Goal**: Replace generic colors with a luxury Indian Haveli palace palette and semantic tokens compliant with WCAG 2.2 AA.
**Depends on**: Milestone v1.0 (Phase 4)
**Requirements**: COLOR-01, COLOR-02
**Success Criteria** (what must be TRUE):
  1. CSS tokens define Haveli palette (Terracotta Crimson, Marigold Gold, Haveli Sandstone, Peacock Emerald, Midnight Onyx background tinting).
  2. Zero AI-purple gradient meshes or uncurated pure grays on pure black exist across the app.
  3. All text achieves minimum 4.5:1 contrast and active icons/controls meet 3:1 against background.
**Plans**: 2 plans

Plans:
- [x] 05-01: Token definitions & color scale architecture in `src/styles/tokens.css`.
- [x] 05-02: Apply palette tokens across Host Base Station and Player Controller views.

---

### Phase 6: Tactile Controls, Toggles & Concentric Affordances
**Goal**: Overhaul all interactive controls (buttons, toggles, segmented tabs) using anti-slop craft standards from `frontend-skill`.
**Depends on**: Phase 5
**Requirements**: CTRL-01, CTRL-02, CTRL-03
**Success Criteria** (what must be TRUE):
  1. Primary, secondary, destructive, and ghost buttons implement sub-pixel optical centering (`translateY(-0.5px)` on icons) and active states on pointer-down.
  2. Concentric corner radii formula ($r_{inner} = \max(0, r_{outer} - \text{padding})$) eliminates corner pinching across all nested containers and cards.
  3. Segmented control tabs and toggles feature viscoelastic stretch-and-squish kinetics via WAAPI with Poisson volume preservation.
**Plans**: 2 plans

Plans:
- [ ] 06-01: Build tactile button, toggle, and segmented control component primitives.
- [ ] 06-02: Integrate controls into Host controls, lobby settings, and player action buttons.

---

### Phase 7: Apple Fluid Spring Motion & Micro-Interactions
**Goal**: Implement physics-based interruptible spring motion across all transitions, modals, and card interactions.
**Depends on**: Phase 6
**Requirements**: MOTION-01, MOTION-02, MOTION-03
**Success Criteria** (what must be TRUE):
  1. Modals, dialogs, and game stage announcements settle with critically damped spring physics (`damping: 1.0`, zero overshoot).
  2. Mobile player secret card reveal and swipe interactions utilize underdamped momentum springs (`damping: 0.8`, velocity handoff).
  3. All animations are 100% interruptible mid-flight without ever freezing user input or locking the touch interface.
**Plans**: 2 plans

Plans:
- [ ] 07-01: Spring physics animation utility & transition engine (`src/styles/springs.js`).
- [ ] 07-02: Wire fluid springs into Role Reveal, voting cards, and host announcements.

---

### Phase 8: Coordinated Atomic Skeleton Loading System
**Goal**: Ensure all screens and game components reveal atomically with matching skeleton primitives, preventing staggered DOM pop-in.
**Depends on**: Phase 7
**Requirements**: SKEL-01, SKEL-02
**Success Criteria** (what must be TRUE):
  1. Dedicated skeleton loading primitives mirror the exact layout, aspect ratio, and typography metrics of host and mobile components.
  2. Layout shift score is strictly 0 (CLS = 0) during room connection, initial load, and phase transitions.
  3. Screen content reveals in a single synchronized visual frame; elements never pop in one by one or in half-rendered states.
**Plans**: 2 plans

Plans:
- [ ] 08-01: Build coordinated skeleton primitives and atomic synchronization wrapper.
- [ ] 08-02: Integrate atomic loader across Host Base Station and Player Controller views.

---

### Phase 9: UI/UX Flow & Cognitive Ergonomics Overhaul
**Goal**: Redesign game interactions adhering to cognitive UX laws (Hick's, Fitts's, Jakob's, Doherty 400ms threshold, Peak-End rule).
**Depends on**: Phase 8
**Requirements**: UX-01, UX-02, UX-03
**Success Criteria** (what must be TRUE):
  1. Mobile controller enforces minimum 44x44px touch targets and bottom-screen thumb reachability for voting and action triggers.
  2. Information architecture splits complex host instructions and voting stages into progressive steps minimizing choice fatigue.
  3. Every user action triggers optimistic visual feedback within 400ms (Doherty threshold) and climax phases (Victory, Exile) feature high-impact celebration moments (Peak-End rule).
**Plans**: 2 plans

Plans:
- [ ] 09-01: Mobile thumb ergonomics & progressive disclosure audit across game stages.
- [ ] 09-02: Tactile feedback loops, <400ms optimistic reactions, and climax celebrations.

---

### Phase 10: Official GitHub Launch & Production Release
**Goal**: Prepare Kaminey for public launch with comprehensive documentation, living room architecture diagrams, release assets, and tag packaging.
**Depends on**: Phase 9
**Requirements**: REL-01, REL-02, REL-03
**Success Criteria** (what must be TRUE):
  1. Root `README.md` features complete party game guide, architecture diagram, deployment links, visual badges, and play instructions.
  2. Developer and self-hosting documentation clearly documents local run, environment variables, and WebSocket relay deployment.
  3. Production build passes all syntax, lint, and end-to-end tests cleanly, with git release tag `v2.0.0` ready for deployment.
**Plans**: 2 plans

Plans:
- [ ] 10-01: Complete README, architecture diagrams, and operator guides.
- [ ] 10-02: Production build validation, final clean-up, and release tagging.

---

## Progress

**Execution Order:**
Phases execute in numeric order: 5 → 6 → 7 → 8 → 9 → 10

| Phase | Plans Complete | Status | Completed |
|---|---|---|---|
| 5. Royal Haveli Color System & Anti-Slop Visual Tokens | 2/2 | Complete | 2026-10-12 |
| 6. Tactile Controls, Toggles & Concentric Affordances | 0/2 | Pending | — |
| 7. Apple Fluid Spring Motion & Micro-Interactions | 0/2 | Pending | — |
| 8. Coordinated Atomic Skeleton Loading System | 0/2 | Pending | — |
| 9. UI/UX Flow & Cognitive Ergonomics Overhaul | 0/2 | Pending | — |
| 10. Official GitHub Launch & Production Release | 0/2 | Pending | — |

---
*Roadmap defined: 2026-10-12*
*Milestone: v2.0 UI/UX Overhaul, Anti-Slop Design System and Production Release*
