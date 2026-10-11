import { createRequire } from "node:module";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  throw new Error(
    "Installer Playwright hors du dépôt, puis définir NODE_PATH vers son node_modules (voir README).",
  );
}
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
const errors = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
page.on("pageerror", (e) => errors.push(e.message));
const base = process.env.TEST_URL || "http://127.0.0.1:3000";
const artifacts = process.env.ARTIFACT_DIR || "/tmp/heros-bleu-tests";
await mkdir(artifacts, { recursive: true });
try {
  await page.goto(base + "/?test=1");
  await page.waitForSelector("#play");
  await page.screenshot({ path: artifacts + "/menu.png", fullPage: true });
  assert.equal(await page.locator("input[name=difficulty]").count(), 3);
  await page.locator("#play").click();
  await page.locator("#game").focus();
  await page.keyboard.down("ArrowRight");
  await page.waitForTimeout(500);
  await page.keyboard.up("ArrowRight");
  assert.ok((await page.evaluate(() => window.__test.game.hero.x)) > 180);
  await page.keyboard.press("Space");
  await page.waitForTimeout(80);
  assert.ok((await page.evaluate(() => window.__test.game.hero.y)) < 480);
  await page.keyboard.press("KeyI");
  await page.waitForTimeout(80);
  assert.ok((await page.evaluate(() => window.__test.game.hero.invisible)) > 9);
  await page.keyboard.press("KeyP");
  assert.equal(await page.evaluate(() => window.__test.game.state), "pause");
  const remaining = await page.evaluate(
    () => window.__test.game.hero.invisible,
  );
  await page.waitForTimeout(350);
  assert.equal(
    await page.evaluate(() => window.__test.game.hero.invisible),
    remaining,
  );
  await page.locator("#play").click();
  assert.equal(await page.evaluate(() => window.__test.game.state), "playing");
  await page.locator("#game").focus();
  await page.keyboard.down("KeyJ");
  await page.waitForTimeout(350);
  await page.keyboard.up("KeyJ");
  assert.ok(
    await page.evaluate(() =>
      window.__test.game.shots.some((s) => s.owner === "hero"),
    ),
  );
  await page.locator("#audio").click();
  assert.equal(
    await page.locator("#audio").getAttribute("aria-pressed"),
    "true",
  );
  await page.locator("#audio").click();
  assert.equal(
    await page.locator("#audio").getAttribute("aria-pressed"),
    "false",
  );
  await page.locator("#help-button").click();
  assert.equal(await page.locator("#help").isVisible(), true);
  await page.locator("#help-button").click();
  await page.screenshot({ path: artifacts + "/jeu.png", fullPage: true });
  // Scènes de test contrôlées pour vérifier les transitions de rendu.
  await page.evaluate(() => {
    const g = window.__test.game;
    g.enemies.forEach((e) => (e.hp = 0));
    g.hero.x = 2880;
    g.hero.invisible = 5;
    g.boss.fireCooldown = 0;
  });
  await page.waitForTimeout(100);
  assert.equal(await page.locator("#boss-hud").isVisible(), true);
  assert.ok(
    await page.evaluate(() =>
      window.__test.game.shots.some((s) => s.type === "fire"),
    ),
  );
  await page.screenshot({ path: artifacts + "/boss.png", fullPage: true });
  await page.evaluate(() => {
    const g = window.__test.game;
    g.boss.hp = 0;
    g.hero.x = 3300;
  });
  await page.waitForTimeout(100);
  assert.equal(await page.evaluate(() => window.__test.game.state), "victory");
  assert.match(await page.locator("#menu-title").innerText(), /sauvé/);
  assert.ok(
    (await page.evaluate(() =>
      Number(localStorage.getItem("heros-bleu-record")),
    )) > 0,
  );
  await page.locator("#play").click();
  await page.evaluate(() => {
    const g = window.__test.game;
    g.hero.hp = 1;
    g.shots.push({
      x: g.hero.x + 19,
      y: g.hero.y + 35,
      vx: 0,
      vy: 0,
      r: 8,
      type: "fire",
      damage: 20,
      owner: "enemy",
      ttl: 1,
    });
  });
  await page.waitForTimeout(100);
  assert.equal(await page.evaluate(() => window.__test.game.state), "defeat");
  await page.locator("#play").click();
  assert.equal(await page.evaluate(() => window.__test.game.hero.hp), 100);
  const mobile = await browser.newPage({
    viewport: { width: 740, height: 900 },
    isMobile: true,
    hasTouch: true,
  });
  mobile.on("pageerror", (e) => errors.push(e.message));
  await mobile.goto(base + "/?test=1");
  await mobile.locator("#play").click();
  assert.equal(await mobile.locator(".touch-controls").isVisible(), true);
  const right = await mobile.locator("[data-control=right]").boundingBox(),
    shoot = await mobile.locator("[data-control=shoot]").boundingBox();
  const cdp = await mobile.context().newCDPSession(mobile);
  const touches = [
    { x: right.x + right.width / 2, y: right.y + right.height / 2, id: 1 },
    { x: shoot.x + shoot.width / 2, y: shoot.y + shoot.height / 2, id: 2 },
  ];
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: touches,
  });
  await mobile.waitForTimeout(400);
  assert.ok((await mobile.evaluate(() => window.__test.game.hero.x)) > 160);
  assert.ok(
    await mobile.evaluate(() =>
      window.__test.game.shots.some((s) => s.owner === "hero"),
    ),
  );
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await mobile.waitForTimeout(80);
  assert.equal(await mobile.evaluate(() => window.__test.game.hero.vx), 0);
  assert.ok(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "pas de débordement horizontal",
  );
  await mobile.screenshot({ path: artifacts + "/tactile.png", fullPage: true });
  await mobile.close();
  assert.deepEqual(errors, []);
  console.log(
    "Chromium : menu, clavier, saut, tir, invisibilité, pause, audio, aide, boss, victoire, record, défaite, reprise et multitactile validés. Captures : " +
      artifacts,
  );
} finally {
  await browser.close();
}
