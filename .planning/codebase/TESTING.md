# Testing Patterns

**Analysis Date:** 2026-10-08

## Test Framework

**Runner:**
- Playwright `1.63.0` (`playwright` in `devDependencies`) - Used for headless browser audit scans, visual regression, touch-target verification, and layout checks.
- Configuration / Script: `scripts/audit_scan.mjs`

**Assertion Library:**
- Custom node assertion and DOM evaluation within Playwright page contexts (`scripts/audit_scan.mjs:54`).

**Run Commands:**
```bash
node scripts/audit_scan.mjs        # Run Playwright visual & a11y audit across viewports
npm run build                      # Type and bundle verification test
```

## Test File Organization

**Location:**
- Automated test scripts located in `scripts/` directory (`scripts/audit_scan.mjs`).
- Visual regression snapshots stored in `.impeccable/audit/screenshots/`.
- Written audit reports and usability scorecards stored in `.impeccable/critiques/index-html.md`.

**Naming:**
- Audit scripts: `*_scan.mjs` or `*.test.js`.
- Screenshot artifacts: `{page}_{viewport}.png` (e.g. `landing_desktop.png`, `landing_mobile.png`, `host_lobby_desktop.png`, `rules_modal_mobile.png`).

**Structure:**
```text
scripts/
└── audit_scan.mjs                  # Multi-viewport audit test script
.impeccable/
├── audit/
│   └── screenshots/                # Captured evidence
└── critiques/
    └── index-html.md               # Audit findings & scorecards
```

## Test Structure

**Suite Organization:**
```javascript
// scripts/audit_scan.mjs
import { chromium } from 'playwright';
import path from 'path';

async function runAudit() {
  const browser = await chromium.launch({ headless: true });
  const BASE_URL = 'http://localhost:5173';
  const viewports = [
    { name: 'desktop', width: 1280, height: 800 },
    { name: 'mobile', width: 390, height: 844 } // iPhone 14
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2
    });
    const page = await context.newPage();

    // 1. Navigate to route
    await page.goto(`${BASE_URL}/#/`, { waitUntil: 'networkidle' });

    // 2. Capture screenshot artifact
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, `landing_${vp.name}.png`) });

    // 3. Evaluate DOM assertions (touch targets, overflow)
    const metrics = await page.evaluate(() => {
      // Check interactive elements >= 44x44px
      const issues = [];
      const interactives = document.querySelectorAll('button, a, input, [role="button"]');
      interactives.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44)) {
          issues.push({ type: 'touch-target', tag: el.tagName, width: rect.width, height: rect.height });
        }
      });
      return { issues };
    });
  }
  await browser.close();
}
```

## Mocking

**Framework:**
- Native in-memory test bots injected via React state in `src/components/host/HostBaseStation.jsx`.

**Patterns:**
- Local Auto-Fill Test Bots: Rather than launching 4 physical mobile phones during development, the Host Base Station includes a one-click local bot injector (`BOT_NAMES` in `src/components/host/HostBaseStation.jsx:19`).
- Bots simulate real player connections, cast automated randomized night assassination votes, participate in council voting trials, and verify game loops instantly.

```javascript
// Bot generation pattern in HostBaseStation.jsx
const addTestBot = () => {
  const availableNames = BOT_NAMES.filter(n => !players.some(p => p.name === n));
  const botName = availableNames[0] || `Bot ${players.length + 1}`;
  const randomAvatar = ANIMAL_AVATARS[Math.floor(Math.random() * ANIMAL_AVATARS.length)];
  const botPlayer = {
    id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    name: botName,
    avatarId: randomAvatar.id,
    isBot: true,
    isAlive: true,
    isExiled: false
  };
  setPlayers(prev => [...prev, botPlayer]);
};
```

## Fixtures and Factories

**Test Data:**
- Wildlife Animal Personas: `ANIMAL_AVATARS` in `src/data/animalAvatars.js`.
- Team missions & party dares: `TEAM_MISSIONS` in `src/data/partyDares.js`.
- Bot names list: `BOT_NAMES` in `src/components/host/HostBaseStation.jsx`.

**Location:**
- `src/data/` directory.

## Coverage

**Requirements:**
- Automated visual & accessibility scan via Playwright (`scripts/audit_scan.mjs`).
- Zero build-time syntax or compilation errors (`npm run build`).
- No unit test coverage framework (Jest/Vitest) is currently installed in `package.json`.

**View Coverage:**
- Inspect `.impeccable/critiques/index-html.md` for Nielsen heuristic scores, WCAG touch target pass/fail rates, and layout audits.

## Test Types

**Unit Tests:**
- Not currently configured. Business logic (such as `generateRoomCode()`, role balancing, and vote tallies) is validated via integration testing and build verification.

**Integration & E2E Tests:**
- End-to-end multi-device interaction tested live using host local network IP or instant bot simulation.
- Playwright script (`scripts/audit_scan.mjs`) validates multi-viewport rendering, modal interactions, and touch ergonomics.

**Accessibility (WCAG) Audits:**
- Automated DOM query verification verifying that touch targets exceed 44x44px and horizontal scroll overflow equals 0px (`scripts/audit_scan.mjs:57-82`).

## Common Patterns

**Viewport Testing Pattern:**
```javascript
const viewports = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 390, height: 844 } // iPhone 14
];
```

**Touch Target Verification Pattern:**
```javascript
const interactives = document.querySelectorAll('button, a, input, [role="button"]');
interactives.forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44)) {
    issues.push({ type: 'touch-target', tag: el.tagName, width: rect.width, height: rect.height });
  }
});
```

---

*Testing analysis: 2026-10-08*
