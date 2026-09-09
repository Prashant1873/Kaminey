# Impeccable Design Critique & Technical Audit: Kaminey (Kabo)

**Target:** `Kaminey — Murder in the Haveli` (Social Deduction Web Party Game)  
**Date:** September 2026  
**Auditor:** Antigravity (Impeccable Subsystem + Playwright Headless Chromium)  
**Artifacts Generated:** 10 Playwright screenshots across Desktop (1280x800) and Mobile (390x844) viewports.

---

## 1. Technical Audit (0–4 Scale per Dimension)

| Dimension | Score | Status | Findings Summary |
|:---|:---:|:---:|:---|
| **1. Accessibility** | 2/4 | Partial | Missing `aria-label`s on icon buttons (sound toggle, kick player); touch targets < 44px on header logo (`122x36px`) and category chips; low contrast on subtle metadata (`#80868b` / `#434654`). |
| **2. Performance** | 3/4 | Good | Lean Vite bundle (~400 kB JS, 8 kB CSS), no heavy asset waterfalls, fast WebRTC handshake, zero layout shift (CLS = 0). |
| **3. Theming & Tokens** | 2/4 | Partial | OLED pitch-black night mode implemented, but daytime/lobby relies on hardcoded HEX colors (`#003d9b`, `#f8f9fb`, `#ffffff`) rather than unified CSS variables; 14 detector token discrepancies found. |
| **4. Responsive Design** | 3/4 | Good | Zero horizontal overflow across mobile (maxOverflow = 0). Mobile player controller ergonomic for single-hand use. Host dashboard cramped on small phones (needs TV/Desktop orientation guidance). |
| **5. Implementation Integrity** | 3/4 | Good | Multi-peer WebRTC mesh with broadcast synchronization is rock solid. Needs cleanup of orphaned styles and missing prop types in UI layers. |
| **Total Audit Score** | **13/20** | **Pass with Technical Debt** | |

---

## 2. Nielsen's Usability Heuristics Critique (0–4 Scale)

| Heuristic | Score | Assessment |
|:---|:---:|:---|
| **H1: Visibility of System Status** | 3/4 | Clear lobby counts, connection badges, and phase indicators; countdown timer needs stronger auditory/visual urgency. |
| **H2: Match between System & Real World** | 2/4 | Thematic disconnect: Modern SaaS corporate blue/white UI feels like a spreadsheet app instead of an Indian heritage murder mystery. Vocabulary matches ("Haveli", "Chor", "Raja"), but visuals do not. |
| **H3: User Control & Freedom** | 3/4 | Logo navigates home cleanly; players can leave room; Host lacks mid-game pause, turn roll-back, or quick-kick during discussion. |
| **H4: Consistency & Standards** | 2/4 | Disjointed aesthetics between daytime lobby (clean corporate modern), night phase (pitch black OLED), and role cards. Inconsistent button radii and paddings. |
| **H5: Error Prevention** | 3/4 | Auto-uppercasing room codes, character length limits, and duplicate name warnings prevent bad joins. |
| **H6: Recognition over Recall** | 3/4 | Roles clearly spelled out during reveal; voting cards show player avatars; missing on-screen role reference cheat-sheet during discussion. |
| **H7: Flexibility & Efficiency** | 3/4 | Fast QR code join flow is smooth; lacks audio cues for phone players when TV screen changes phase. |
| **H8: Aesthetic & Minimalist Design** | 2/4 | Excessive dead whitespace on wide displays; lack of atmospheric depth, lighting, vignette, or Indian palace visual motifs. |
| **H9: Help Users Recognize & Recover from Errors** | 3/4 | Peer disconnection toast alerts work well; peer recovery reconnect could be smoother. |
| **H10: Help & Documentation** | 1/4 | Landing page lacks game rules overview, how-to-play guide, role explainers, or setup instructions. |

---

## 3. Design Specificity Verdict: "Thematic Dissonance"

- **Current Vibe:** Corporate enterprise portal / clean SaaS analytics dashboard (`#003d9b`, `#f8f9fb`, crisp sans-serif).
- **Intended Vibe:** Suspenseful, dramatic, high-energy Indian palace murder mystery (dark royal navy, deep crimson/maroon, burnished brass/gold accents, subtle jali lattice patterns, flickering candlelight ambience).
- **Core Diagnosis:** The game engine works, but the emotional dressing fails to transport the players into a palace thriller.

---

## 4. Persona Red Flags

1. **Alex (Casual First-Time Phone Player):**
   - Red Flag: Joins via QR, sees bright corporate blue room screen; doesn't feel excited or immersed; phone screen doesn't vibrate or sound when host starts the game.
2. **Jordan (Host Casting to Living Room TV):**
   - Red Flag: On a 55" TV, the lobby leaves massive blank space on left and right; room code and QR code are too small to read comfortably from a couch 10 feet away.
3. **Casey (Accessibility & Screen Reader User):**
   - Red Flag: Icon buttons have no aria text; color contrast on gray sub-text fails WCAG AA; role reveal relies purely on color and fast animation without spoken role announcement.
4. **Sam (Game Night Organizer):**
   - Red Flag: Wants to explain rules to 6 friends before starting, but landing page has zero rules or role breakdown, forcing host to verbally explain everything from scratch.

---

## 5. Prioritized Actionable Improvements

### Priority 0 (High Impact / Must Fix)
- **P0-1: TV-First Living Room Optimization for Host**
  - Scale up Room Code (`font-size: 5rem+`) and QR Code (`min 260px`) in host view.
  - Add "Cast to TV / Best on Big Screen" indicator.
- **P0-2: Palace Thematic Overhaul (Visual Immersion)**
  - Replace sterile `#003d9b` corporate blue with Royal Haveli palette: Midnight Obsidian (`#0B0C10`), Deep Royal Crimson (`#800020`), Burnished Gold (`#D4AF37`), Warm Amber (`#FFBF00`).
  - Add subtle architectural jali/arch SVG frame accents to role cards and phase banners.
- **P0-3: Accessibility Touch Targets & Aria Labels**
  - Increase header logo touch target to 48px height.
  - Add explicit `aria-label` to all icon buttons (Mute, Leave, Sound, Settings).

### Priority 1 (Beautifications & Polish)
- **P1-1: Atmospheric Micro-Animations & Sound Cues**
  - Smooth phase transition curtains (Day -> Dusk -> Night) with ambient audio (cicadas/wind at night, palace court instruments during day).
  - Haptic feedback (Vibration API) on player mobile when role is revealed or when night action is required.
- **P1-2: How to Play & Role Guide on Landing**
  - Add an expandable interactive "Rules of the Haveli" drawer or modal on landing page explaining Raja, Mantri, Chor, Sipahi mechanics.
- **P1-3: Role Card 3D Flip Interaction**
  - Give the mobile role reveal a physical "secret envelope" or wax-sealed parchment flip animation to create tactile suspense.

### Priority 2 (Feature Developments)
- **P2-1: In-Game Discussion Helper**
  - Quick accusation timer + podium highlight on host TV screen showing who is currently defending themselves.
- **P2-2: Custom Role Presets & Modifier Cards**
  - Support custom player counts (4 to 12 players) with auto-balanced roles (e.g. Daayan, Khufiya, Senapati).
- **P2-3: Post-Game Haveli Chronicle / Recap**
  - Animated newspaper or royal proclamation summarizing who killed whom, who lied, and MVP awards.
