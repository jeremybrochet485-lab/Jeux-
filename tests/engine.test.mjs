import test from "node:test";
import assert from "node:assert/strict";
import {
  createGame,
  step,
  activateInvisible,
  collect,
  gainSpecial,
  hurtEnemy,
  useSpecial,
  MODES,
  SPECIALS,
  WORLD,
} from "../dist/engine.mjs";
const tick = (g, seconds, input = {}) => {
  for (let i = 0; i < Math.round(seconds * 100); i++) step(g, 0.01, input);
};
const quiet = () => {
  const g = createGame("medium", () => 0);
  g.enemies.forEach((e) => {
    e.fireCooldown = 999;
    e.smokeCooldown = 999;
  });
  return g;
};
test("Les trois difficultés existent et le boss reste aussi puissant", () => {
  assert.deepEqual(Object.keys(MODES), ["easy", "medium", "hard"]);
  for (const m of Object.keys(MODES)) {
    const g = createGame(m);
    assert.equal(g.boss.hp, 95);
    assert.ok(g.boss.hp > g.enemies[0].hp);
  }
});
test("Déplacement et arrêt", () => {
  const g = quiet();
  tick(g, 0.5, { right: true });
  assert.ok(g.hero.x > 200);
  const x = g.hero.x;
  tick(g, 0.2);
  assert.equal(g.hero.x, x);
});
test("Deux sauts seulement et atterrissage", () => {
  const g = quiet();
  step(g, 0.01, { jump: true });
  assert.equal(g.hero.jumps, 1);
  step(g, 0.01, {});
  step(g, 0.01, { jump: true });
  assert.equal(g.hero.jumps, 2);
  step(g, 0.01, {});
  step(g, 0.01, { jump: true });
  assert.equal(g.hero.jumps, 2);
  tick(g, 2);
  assert.equal(g.hero.onGround, true);
  assert.equal(g.hero.jumps, 0);
});
test("Invisibilité : exactement 10 secondes actives et pause sans consommation", () => {
  const g = quiet();
  assert.equal(activateInvisible(g), true);
  tick(g, 3);
  const remaining = g.hero.invisible;
  g.state = "pause";
  tick(g, 4);
  assert.equal(g.hero.invisible, remaining);
  g.state = "playing";
  tick(g, 6.99);
  assert.ok(g.hero.invisible > 0.009);
  step(g, 0.01);
  assert.ok(g.hero.invisible < 1e-9);
  assert.equal(activateInvisible(g), false);
  tick(g, 15.01);
  assert.equal(activateInvisible(g), true);
});
test("Les gardes ne visent pas un héros invisible", () => {
  const g = quiet();
  g.hero.x = 470;
  g.enemies[0].fireCooldown = 0;
  activateInvisible(g);
  tick(g, 0.2);
  assert.equal(g.shots.length, 0);
  g.hero.invisible = 0;
  step(g, 0.01);
  assert.ok(g.shots.some((s) => s.type === "ice"));
});
test("Le boss vise même un héros invisible", () => {
  const g = quiet();
  g.enemies.forEach((e) => (e.hp = 0));
  g.hero.x = 2900;
  g.bossActive = true;
  g.boss.fireCooldown = 0;
  activateInvisible(g);
  step(g, 0.01);
  assert.equal(g.shots.filter((s) => s.type === "fire").length, 2);
});
test("Invisibilité ne rend pas invulnérable", () => {
  const g = quiet();
  activateInvisible(g);
  g.shots.push({
    x: g.hero.x + 19,
    y: g.hero.y + 35,
    vx: 0,
    vy: 0,
    r: 8,
    type: "ice",
    damage: 12,
    owner: "enemy",
    ttl: 1,
  });
  step(g, 0.01);
  assert.equal(g.hero.hp, 88);
  assert.equal(g.hero.slow, 2);
});
test("Une pièce se collecte une fois, tous les dix gains améliorent les pouvoirs", () => {
  const g = quiet();
  for (let i = 0; i < 20; i++) collect(g, g.pickups[i]);
  assert.equal(g.coins, 20);
  assert.equal(g.level, 2);
  collect(g, g.pickups[0]);
  assert.equal(g.coins, 20);
  assert.equal(g.hero.invisible, 0);
});
test("Le tir amélioré inflige plus de dégâts", () => {
  const g = quiet();
  g.level = 2;
  step(g, 0.01, { shoot: true });
  assert.equal(g.shots[0].damage, 1.7);
});
test("Barre spéciale distincte : impacts, pas dégâts subis", () => {
  const g = quiet();
  hurtEnemy(g, g.enemies[0], 1);
  assert.equal(g.specialCharge, 12);
  const c = g.specialCharge;
  g.shots.push({
    x: g.hero.x + 19,
    y: g.hero.y + 35,
    vx: 0,
    vy: 0,
    r: 8,
    type: "fire",
    damage: 12,
    owner: "enemy",
    ttl: 1,
  });
  step(g, 0.01);
  assert.equal(g.specialCharge, c);
});
test("Les trois spéciaux sont tirables et consommables", () => {
  for (let i = 0; i < 3; i++) {
    const g = createGame("medium", () => i / 3 + 0.001);
    gainSpecial(g, 100);
    assert.equal(g.special, SPECIALS[i]);
    g.hero.hp = 30;
    g.hero.energy = 20;
    assert.equal(useSpecial(g), true);
    assert.equal(g.special, null);
    assert.equal(g.specialCharge, 0);
    if (i === 0) assert.equal(g.hero.hp, 75);
    if (i === 1) assert.equal(g.hero.energy, 100);
  }
});
test("Tentacules : portée frontale, coût et recharge", () => {
  const g = quiet();
  g.hero.x = 400;
  g.hero.facing = 1;
  g.enemies[0].hp = 10;
  step(g, 0.01, { tentacle: true });
  assert.equal(g.enemies[0].hp, 7);
  assert.ok(g.hero.energy < 51);
  step(g, 0.01, {});
  step(g, 0.01, { tentacle: true });
  assert.equal(g.enemies[0].hp, 7);
});
test("Nova exige une énergie pleine et frappe dans son rayon", () => {
  const g = quiet();
  step(g, 0.01, { nova: true });
  assert.equal(g.enemies[0].hp, 4);
  step(g, 0.01, {});
  g.hero.energy = 100;
  step(g, 0.01, { nova: true });
  assert.equal(g.enemies[0].hp, 0);
  assert.equal(g.enemies.at(-1).hp, 4);
  assert.equal(
    g.hero.energy,
    8,
    "énergie consommée, puis +8 pour le garde vaincu",
  );
});
test("Bouclier renvoie devant, sans protéger derrière", () => {
  for (const side of [1, -1]) {
    const g = quiet();
    g.hero.facing = 1;
    g.shots.push({
      x: g.hero.x + 19 + side * 15,
      y: g.hero.y + 35,
      vx: -side * 100,
      vy: 0,
      r: 8,
      type: "ice",
      damage: 12,
      owner: "enemy",
      ttl: 1,
    });
    step(g, 0.01, { shield: true });
    assert.equal(g.hero.hp, side === 1 ? 100 : 88);
    if (side === 1) {
      assert.equal(g.shots[0].owner, "hero");
      assert.ok(g.shots[0].vx > 0);
    }
  }
});
test("Fumée toxique : génération, dégâts et expiration", () => {
  const g = quiet();
  g.hero.x = 510;
  g.enemies[0].smokeCooldown = 0;
  step(g, 0.01);
  assert.ok(g.clouds.length);
  assert.ok(g.hero.hp < 100);
  g.hero.x = 100;
  tick(g, 5.1);
  assert.equal(g.clouds.length, 0);
});
test("Le boss a une seconde phase et des tirs triples", () => {
  const g = quiet();
  g.enemies.forEach((e) => (e.hp = 0));
  g.bossActive = true;
  g.hero.x = 2900;
  g.boss.hp = 40;
  g.boss.fireCooldown = 0;
  step(g, 0.01);
  assert.equal(g.boss.phase, 1);
  assert.equal(g.shots.filter((s) => s.type === "fire").length, 3);
});
test("Portail verrouillé, activation du boss puis victoire", () => {
  const g = quiet();
  g.hero.x = 2800;
  step(g, 0.01);
  assert.equal(g.hero.x, 2750);
  assert.equal(g.bossActive, false);
  g.enemies.forEach((e) => hurtEnemy(g, e, 100));
  step(g, 0.01);
  assert.equal(g.bossActive, true);
  assert.equal(g.portal, false);
  hurtEnemy(g, g.boss, 100);
  step(g, 0.01);
  assert.equal(g.portal, true);
  g.hero.x = 3300;
  step(g, 0.01);
  assert.equal(g.state, "victory");
});
test("Défaite arrête le moteur ; nouvelle partie réinitialise la progression", () => {
  const g = quiet();
  g.hero.hp = 1;
  g.shots.push({
    x: 119,
    y: 523,
    vx: 0,
    vy: 0,
    r: 8,
    type: "fire",
    damage: 12,
    owner: "enemy",
    ttl: 1,
  });
  step(g, 0.01);
  assert.equal(g.state, "defeat");
  const t = g.time;
  tick(g, 1);
  assert.equal(g.time, t);
  const next = createGame();
  assert.equal(next.hero.hp, 100);
  assert.equal(next.coins, 0);
});
test("Une partie simulée complète élimine les gardes et le boss avec de vrais tirs", () => {
  const g = quiet();
  for (const e of g.enemies) {
    g.hero.x = e.x - 170;
    g.hero.facing = 1;
    g.hero.invulnerable = 10;
    tick(g, 2, { shoot: true });
    assert.ok(e.hp <= 0, "garde éliminé");
  }
  assert.equal(g.bossActive, true);
  g.hero.x = 2820;
  g.hero.invulnerable = 100;
  tick(g, 35, { shoot: true });
  assert.ok(g.boss.hp <= 0, "boss éliminé");
  tick(g, 2, { right: true });
  assert.equal(g.state, "victory");
});
