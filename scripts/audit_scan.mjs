import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve(process.cwd(), '.impeccable/audit/screenshots');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

async function runAudit() {
  console.log('🚀 Starting Playwright Audit across Kaminey...');
  const browser = await chromium.launch({ headless: true });

  const BASE_URL = 'http://localhost:5173';

  const viewports = [
    { name: 'desktop', width: 1280, height: 800 },
    { name: 'mobile', width: 390, height: 844 } // iPhone 14
  ];

  const auditReport = {
    pages: [],
    a11yIssues: [],
    layoutIssues: [],
    perfMetrics: []
  };

  for (const vp of viewports) {
    console.log(`\n📱 Scanning viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2
    });
    const page = await context.newPage();

    // 1. Landing Page
    await page.goto(`${BASE_URL}/#/`, { waitUntil: 'networkidle' });
    const landingShot = path.join(SCREENSHOT_DIR, `landing_${vp.name}.png`);
    await page.screenshot({ path: landingShot, fullPage: true });
    console.log(`Saved screenshot: landing_${vp.name}.png`);

    // 1b. Rules Modal
    const rulesBtn = page.locator('button[aria-label="Open how to play guide"]');
    if (await rulesBtn.count() > 0) {
      await rulesBtn.click();
      await page.waitForTimeout(400);
      const rulesShot = path.join(SCREENSHOT_DIR, `rules_modal_${vp.name}.png`);
      await page.screenshot({ path: rulesShot });
      console.log(`Saved screenshot: rules_modal_${vp.name}.png`);
      const closeBtn = page.locator('button[aria-label="Close rules guide"]');
      if (await closeBtn.count() > 0) await closeBtn.click();
      await page.waitForTimeout(300);
    }

    // Audit landing page
    const landingMetrics = await page.evaluate(() => {
      const issues = [];
      // Small touch targets
      const interactives = document.querySelectorAll('button, a, input, [role="button"]');
      interactives.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44)) {
          issues.push({
            type: 'touch-target',
            tag: el.tagName,
            text: el.innerText?.slice(0, 30) || el.getAttribute('aria-label') || 'unlabeled',
            width: Math.round(rect.width),
            height: Math.round(rect.height)
          });
        }
      });

      // Horizontal overflow
      const docWidth = document.documentElement.clientWidth;
      const allElements = document.querySelectorAll('*');
      let maxOverflow = 0;
      allElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > docWidth + 2) {
          maxOverflow = Math.max(maxOverflow, rect.right - docWidth);
        }
      });

      return { issues, maxOverflow };
    });
    auditReport.pages.push({ page: 'Landing', viewport: vp.name, ...landingMetrics });

    // 2. Host Lobby Page
    await page.goto(`${BASE_URL}/#/host`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const hostShot = path.join(SCREENSHOT_DIR, `host_lobby_${vp.name}.png`);
    await page.screenshot({ path: hostShot, fullPage: true });
    console.log(`Saved screenshot: host_lobby_${vp.name}.png`);

    // 3. Player Join Page
    await page.goto(`${BASE_URL}/#/play`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const playerShot = path.join(SCREENSHOT_DIR, `player_join_${vp.name}.png`);
    await page.screenshot({ path: playerShot, fullPage: true });
    console.log(`Saved screenshot: player_join_${vp.name}.png`);

    // 4. Player with QR Room Code
    await page.goto(`${BASE_URL}/#/join/HAV412`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const playerRoomShot = path.join(SCREENSHOT_DIR, `player_room_${vp.name}.png`);
    await page.screenshot({ path: playerRoomShot, fullPage: true });
    console.log(`Saved screenshot: player_room_${vp.name}.png`);

    await context.close();
  }

  // Multi-Phase Flow Scan on Desktop
  console.log('\n🎭 Scanning In-Game Host Phases via Bot Auto-fill...');
  const gameContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2
  });
  const gamePage = await gameContext.newPage();
  await gamePage.goto(`${BASE_URL}/#/host`, { waitUntil: 'networkidle' });
  await gamePage.waitForTimeout(1000);

  // Click Auto-Fill Bots & Launch
  const launchBtn = gamePage.locator('button:has-text("Auto-Fill Bots & Launch")');
  if (await launchBtn.count() > 0) {
    console.log('Clicking Auto-Fill Bots & Launch...');
    await launchBtn.click();
    await gamePage.waitForTimeout(1200);

    // Screenshot Role Reveal
    const roleRevealShot = path.join(SCREENSHOT_DIR, `host_role_reveal.png`);
    await gamePage.screenshot({ path: roleRevealShot });
    console.log(`Saved screenshot: host_role_reveal.png`);

    // Proceed to Night
    const proceedNightBtn = gamePage.locator('button:has-text("Enter the Night")');
    if (await proceedNightBtn.count() > 0) {
      await proceedNightBtn.click();
      await gamePage.waitForTimeout(1200);
      const nightShot = path.join(SCREENSHOT_DIR, `host_night.png`);
      await gamePage.screenshot({ path: nightShot });
      console.log(`Saved screenshot: host_night.png`);

      // Proceed to Morning
      const proceedMorningBtn = gamePage.locator('button:has-text("Morning"), button:has-text("Dawn")');
      if (await proceedMorningBtn.count() > 0) {
        await proceedMorningBtn.click();
        await gamePage.waitForTimeout(1200);
        const morningShot = path.join(SCREENSHOT_DIR, `host_morning.png`);
        await gamePage.screenshot({ path: morningShot });
        console.log(`Saved screenshot: host_morning.png`);
      }
    }
  }

  await gameContext.close();
  await browser.close();

  const reportPath = path.join(SCREENSHOT_DIR, 'audit_data.json');
  fs.writeFileSync(reportPath, JSON.stringify(auditReport, null, 2));
  console.log(`\n✅ Audit scan complete! Data saved to ${reportPath}`);
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
