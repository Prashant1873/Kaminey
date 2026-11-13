import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium, devices } from 'playwright';

test('Mobile Dossier Secret Reveal Suite', async (t) => {
  // Check if local dev server is running
  let isServerRunning = false;
  try {
    const res = await fetch('http://localhost:5173/');
    if (res.ok) isServerRunning = true;
  } catch (e) {
    isServerRunning = false;
  }

  if (!isServerRunning) {
    t.skip('Vite dev server not running on http://localhost:5173 - skipping mobile UI test');
    return;
  }

  const browser = await chromium.launch({ headless: true });

  t.after(async () => {
    await browser.close();
  });

  // 1. Host base station
  const hostContext = await browser.newContext();
  const hostPage = await hostContext.newPage();
  await hostPage.goto('http://localhost:5173/#/host');
  await hostPage.waitForSelector('text=GATHERING IN THE HAVELI');
  const roomCode = await hostPage.evaluate(() => sessionStorage.getItem('kaminey_host_room'));
  assert.ok(roomCode, 'Room code must exist');
  await hostPage.waitForSelector('text=Ready for guests', { timeout: 10000 });

  // 2. Mobile Player on iPhone 14 viewport
  const mobileDevice = devices['iPhone 14'];
  const playerContext = await browser.newContext({
    ...mobileDevice,
    hasTouch: true,
    isMobile: true
  });
  const playerPage = await playerContext.newPage();
  await playerPage.goto(`http://localhost:5173/#/join/${roomCode}`);

  await playerPage.waitForSelector('form input');
  const inputs = await playerPage.$$('form input');
  if (inputs.length > 1) {
    await inputs[1].fill('KabirSpy');
  }
  await playerPage.click('button[type="submit"]');
  await playerPage.waitForSelector('text=Waiting for host to start the game', { timeout: 10000 });

  // 3. Launch game on Host with bots
  await hostPage.bringToFront();
  await hostPage.waitForSelector('button:has-text("Auto-Fill Bots & Start")');
  await hostPage.click('button:has-text("Auto-Fill Bots & Start")');
  await hostPage.waitForSelector('text=SECRET DOSSIERS DISPATCHED', { timeout: 10000 });

  // 4. Verify Secret Dossier screen on Mobile Player
  await playerPage.bringToFront();
  await playerPage.waitForSelector('text=SECRET DOSSIER', { timeout: 10000 });

  await t.test('1. Initial state displays wax seal without revealing secret identity', async () => {
    const initialCheck = await playerPage.evaluate(() => {
      const box = document.querySelector('.secret-reveal-box');
      return {
        inlineTransform: box.style.transform,
        boxText: box.innerText
      };
    });
    assert.equal(initialCheck.inlineTransform, 'rotateY(0deg)');
    assert.match(initialCheck.boxText, /HOLD OR TAP TO REVEAL/);
  });

  await t.test('2. Tap to Reveal button flips 3D dossier and unmasks identity', async () => {
    await playerPage.click('button:has-text("Tap to Reveal & Keep Open")');
    await playerPage.waitForTimeout(500);

    const check = await playerPage.evaluate(() => {
      const box = document.querySelector('.secret-reveal-box');
      return {
        inlineTransform: box.style.transform,
        computedTransform: window.getComputedStyle(box).transform,
        boxText: box.innerText
      };
    });
    assert.equal(check.inlineTransform, 'rotateY(180deg)');
    assert.match(check.computedTransform, /matrix3d/);
    assert.match(check.boxText, /YOU ARE A (BHOLA|KAMINA)/);
  });

  await t.test('3. Conceal Immediately button on card back safely conceals identity', async () => {
    const concealBtn = await playerPage.$('button:has-text("Conceal Immediately")');
    assert.ok(concealBtn, 'Conceal Immediately button must exist on card back');
    await concealBtn.click();
    await playerPage.waitForTimeout(500);

    const check = await playerPage.evaluate(() => {
      const box = document.querySelector('.secret-reveal-box');
      return box.style.transform;
    });
    assert.equal(check, 'rotateY(0deg)');
  });

  await t.test('4. Direct tap on wax card reveals secret dossier', async () => {
    const card = await playerPage.$('.secret-reveal-box');
    const boxRect = await card.boundingBox();
    await playerPage.touchscreen.tap(boxRect.x + boxRect.width / 2, boxRect.y + boxRect.height / 2);
    await playerPage.waitForTimeout(500);

    const check = await playerPage.evaluate(() => {
      const box = document.querySelector('.secret-reveal-box');
      return {
        inlineTransform: box.style.transform,
        computedTransform: window.getComputedStyle(box).transform,
        boxText: box.innerText
      };
    });
    assert.equal(check.inlineTransform, 'rotateY(180deg)');
    assert.match(check.computedTransform, /matrix3d/);
    assert.match(check.boxText, /YOU ARE A (BHOLA|KAMINA)/);
  });

  await t.test('5. Conceal Dossier toggle button hides secret dossier', async () => {
    await playerPage.click('button:has-text("Conceal Dossier (Hide)")');
    await playerPage.waitForTimeout(500);

    const check = await playerPage.evaluate(() => {
      const box = document.querySelector('.secret-reveal-box');
      return box.style.transform;
    });
    assert.equal(check, 'rotateY(0deg)');
  });
});
