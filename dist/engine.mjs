export const WORLD = { width: 3400, height: 660, ground: 558 };
export const MODES = {
  easy: { damage: 0.65, cadence: 2.4, enemyHp: 3 },
  medium: { damage: 1, cadence: 1.8, enemyHp: 4 },
  hard: { damage: 1.4, cadence: 1.3, enemyHp: 5 },
};
export const SPECIALS = [
  "Soin solaire",
  "Énergie stellaire",
  "Tempête de glace",
];
export const PLATFORMS = [
  { x: 350, y: 446, w: 200, h: 16 },
  { x: 760, y: 394, w: 170, h: 16 },
  { x: 1180, y: 445, w: 190, h: 16 },
  { x: 1680, y: 390, w: 180, h: 16 },
  { x: 2100, y: 449, w: 150, h: 16 },
];
export function createGame(mode = "medium", random = Math.random) {
  const hp = MODES[mode]?.enemyHp || 4;
  return {
    mode: MODES[mode] ? mode : "medium",
    random,
    state: "playing",
    time: 0,
    camera: 0,
    score: 0,
    coins: 0,
    level: 0,
    specialCharge: 0,
    special: null,
    bossActive: false,
    portal: false,
    events: [],
    particles: [],
    shots: [],
    clouds: [],
    effects: [],
    previous: {},
    hero: {
      x: 100,
      y: WORLD.ground - 70,
      w: 38,
      h: 70,
      vx: 0,
      vy: 0,
      facing: 1,
      hp: 100,
      energy: 75,
      jumps: 0,
      onGround: true,
      invulnerable: 0,
      invisible: 0,
      invisCooldown: 0,
      slow: 0,
      shootCooldown: 0,
      tentacleCooldown: 0,
      novaCooldown: 0,
      tentacle: 0,
      shield: false,
      anim: 0,
    },
    enemies: [530, 850, 1150, 1470, 1740, 2020, 2280, 2500].map((x, i) => ({
      x,
      y: WORLD.ground - 64,
      w: 38,
      h: 64,
      hp,
      maxHp: hp,
      home: x,
      facing: -1,
      fireCooldown: 1.2 + i * 0.23,
      smokeCooldown: 5 + i * 0.8,
      frozen: 0,
      flash: 0,
    })),
    boss: {
      x: 3040,
      y: WORLD.ground - 105,
      w: 64,
      h: 105,
      hp: 95,
      maxHp: 95,
      fireCooldown: 1.4,
      phase: 0,
      facing: -1,
      flash: 0,
      frozen: 0,
    },
    pickups: [
      ...Array.from({ length: 30 }, (_, i) => ({
        type: "coin",
        x: 180 + i * 86,
        y: WORLD.ground - 25,
        r: 13,
        taken: false,
      })),
      ...PLATFORMS.flatMap((p) =>
        [0, 1, 2].map((i) => ({
          type: "coin",
          x: p.x + 30 + i * 50,
          y: p.y - 24,
          r: 13,
          taken: false,
        })),
      ),
      { type: "health", x: 1500, y: WORLD.ground - 26, r: 15, taken: false },
      { type: "energy", x: 2200, y: WORLD.ground - 26, r: 15, taken: false },
      { type: "star", x: 1760, y: 350, r: 15, taken: false },
    ],
  };
}
const center = (e) => ({ x: e.x + e.w / 2, y: e.y + e.h / 2 });
const overlap = (a, b) =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export function emit(g, text, kind = "info") {
  g.events.push({ text, kind });
}
export function gainSpecial(g, n) {
  if (g.special) return;
  g.specialCharge = Math.min(100, g.specialCharge + n);
  if (g.specialCharge >= 100) {
    g.special = SPECIALS[Math.floor(g.random() * SPECIALS.length)];
    emit(g, "Spécial prêt : " + g.special + " · R");
  }
}
export function hurtEnemy(g, e, n) {
  if (e.hp <= 0) return;
  const damage = Math.min(e.hp, n);
  e.hp -= damage;
  e.flash = 0.16;
  gainSpecial(g, 12);
  g.score += damage * 10;
  g.effects.push({ type: "hit", ...center(e), t: 0, max: 0.25 });
  if (e.hp <= 0) {
    g.score += e === g.boss ? 1000 : 150;
    g.hero.energy = Math.min(100, g.hero.energy + 8);
    emit(
      g,
      e === g.boss
        ? "Le Bouffon est vaincu ! Rejoins le portail."
        : "Garde neutralisé",
      e === g.boss ? "boss" : "hit",
    );
  }
}
export function hurtHero(g, n) {
  const h = g.hero;
  if (h.invulnerable > 0 || h.hp <= 0) return;
  h.hp = Math.max(0, h.hp - n);
  h.invulnerable = 0.65;
  g.effects.push({ type: "hurt", ...center(h), t: 0, max: 0.3 });
  if (h.hp === 0) {
    g.state = "defeat";
    emit(g, "Le quartier a encore besoin de toi.");
  }
}
export function activateInvisible(g) {
  const h = g.hero;
  if (h.invisCooldown > 0 || h.invisible > 0) return false;
  h.invisible = 10;
  h.invisCooldown = 25;
  emit(g, "Invisible pendant 10 secondes — le boss te voit toujours.");
  return true;
}
export function collect(g, p) {
  if (p.taken) return;
  p.taken = true;
  const h = g.hero;
  if (p.type === "coin") {
    g.coins++;
    g.score += 25;
    if (g.coins % 10 === 0) {
      g.level++;
      emit(g, "Pouvoirs améliorés · rang " + (g.level + 1), "upgrade");
    }
  }
  if (p.type === "health") h.hp = Math.min(100, h.hp + 25);
  if (p.type === "energy") h.energy = Math.min(100, h.energy + 22);
  if (p.type === "star") g.score += 75;
  g.effects.push({ type: "pickup", x: p.x, y: p.y, t: 0, max: 0.5 });
}
export function useSpecial(g) {
  if (!g.special) return false;
  const s = g.special;
  if (s === SPECIALS[0]) g.hero.hp = Math.min(100, g.hero.hp + 45);
  if (s === SPECIALS[1]) g.hero.energy = 100;
  if (s === SPECIALS[2]) {
    for (const e of [...g.enemies, ...(g.bossActive ? [g.boss] : [])])
      if (e.hp > 0 && Math.abs(e.x - g.hero.x) < 700) {
        e.frozen = 4;
        hurtEnemy(g, e, 4 + g.level);
      }
    g.effects.push({ type: "frost", ...center(g.hero), t: 0, max: 0.9 });
  }
  g.special = null;
  g.specialCharge = 0;
  emit(g, s + " activé !");
  return true;
}
function fire(g, e, vx, vy, type, damage, owner) {
  const c = center(e);
  g.shots.push({
    x: c.x + Math.sign(vx) * (e.w / 2 + 8),
    y: c.y,
    vx,
    vy,
    r: type === "fire" ? 13 : 7,
    type,
    damage,
    owner,
    ttl: 5,
  });
}
function front(g, e) {
  const h = g.hero;
  return Math.sign(center(e).x - center(h).x) === h.facing;
}
export function step(g, dt, input = {}) {
  if (g.state !== "playing") return;
  dt = clamp(dt, 0, 0.04);
  g.time += dt;
  const h = g.hero;
  const m = MODES[g.mode];
  const press = (k) => input[k] && !g.previous[k];
  for (const key of [
    "invulnerable",
    "invisible",
    "invisCooldown",
    "slow",
    "shootCooldown",
    "tentacleCooldown",
    "novaCooldown",
    "tentacle",
  ])
    h[key] = Math.max(0, h[key] - dt);
  h.shield = !!input.shield && h.energy > 0;
  h.energy = clamp(h.energy + (h.shield ? -24 : 10) * dt, 0, 100);
  h.vx =
    ((input.right ? 1 : 0) - (input.left ? 1 : 0)) * (h.slow > 0 ? 155 : 285);
  if (h.vx) h.facing = Math.sign(h.vx);
  h.anim += dt * (h.vx ? 12 : 3);
  if (press("jump") && h.jumps < 2) {
    h.vy = -510;
    h.jumps++;
    h.onGround = false;
    g.effects.push({
      type: "jump",
      x: h.x + h.w / 2,
      y: h.y + h.h,
      t: 0,
      max: 0.3,
    });
  }
  if (press("invisible")) activateInvisible(g);
  if (press("special")) useSpecial(g);
  if (input.shoot && h.shootCooldown === 0) {
    fire(g, h, h.facing * 750, 0, "blue", 1 + g.level * 0.35, "hero");
    h.shootCooldown = 0.26;
    g.events.push({ kind: "shoot" });
  }
  if (press("tentacle") && h.tentacleCooldown === 0 && h.energy >= 25) {
    h.energy -= 25;
    h.tentacle = 0.3;
    h.tentacleCooldown = 0.8;
    for (const e of [...g.enemies, ...(g.bossActive ? [g.boss] : [])])
      if (
        e.hp > 0 &&
        front(g, e) &&
        Math.abs(center(e).x - center(h).x) < 280 &&
        Math.abs(center(e).y - center(h).y) < 130
      )
        hurtEnemy(g, e, 3 + g.level);
    g.events.push({ kind: "tentacle" });
  }
  if (press("nova") && h.energy >= 99.999 && h.novaCooldown === 0) {
    h.energy = 0;
    h.novaCooldown = 3;
    for (const e of [...g.enemies, ...(g.bossActive ? [g.boss] : [])])
      if (
        e.hp > 0 &&
        Math.hypot(center(e).x - center(h).x, center(e).y - center(h).y) < 660
      )
        hurtEnemy(g, e, 7 + g.level * 2);
    g.effects.push({ type: "nova", ...center(h), t: 0, max: 0.8 });
    emit(g, "NOVA !", "nova");
  }
  const oldBottom = h.y + h.h;
  h.x = clamp(h.x + h.vx * dt, 0, WORLD.width - h.w);
  h.vy += 1300 * dt;
  h.y += h.vy * dt;
  h.onGround = false;
  const floors = [{ x: 0, y: WORLD.ground, w: WORLD.width }, ...PLATFORMS];
  for (const p of floors) {
    if (
      h.vy >= 0 &&
      oldBottom <= p.y + 0.5 &&
      h.y + h.h >= p.y &&
      h.x + h.w > p.x &&
      h.x < p.x + p.w
    ) {
      h.y = p.y - h.h;
      h.vy = 0;
      h.onGround = true;
      h.jumps = 0;
    }
  }
  if (h.y > WORLD.height) hurtHero(g, 100);
  if (!g.bossActive && g.enemies.every((e) => e.hp <= 0)) {
    g.bossActive = true;
    emit(g, "Le Bouffon embrasé ! Esquive ses boules de feu.", "boss");
  }
  if (!g.bossActive) h.x = Math.min(h.x, 2750);
  for (const e of g.enemies) {
    if (e.hp <= 0) continue;
    e.flash = Math.max(0, e.flash - dt);
    e.frozen = Math.max(0, e.frozen - dt);
    if (e.frozen > 0) continue;
    e.fireCooldown -= dt;
    e.smokeCooldown -= dt;
    const dx = center(h).x - center(e).x;
    const detected = h.invisible === 0 && Math.abs(dx) < 650;
    e.facing = detected ? Math.sign(dx) || e.facing : e.facing;
    if (detected && Math.abs(dx) > 240) e.x += Math.sign(dx) * 38 * dt;
    else if (!detected)
      e.x = clamp(
        e.x + Math.sin(g.time + e.home) * 18 * dt,
        e.home - 40,
        e.home + 40,
      );
    if (detected && e.fireCooldown <= 0) {
      const c = center(h),
        ec = center(e);
      const dy = c.y - ec.y;
      const len = Math.hypot(dx, dy);
      fire(
        g,
        e,
        (dx / len) * 330,
        (dy / len) * 330,
        "ice",
        12 * m.damage,
        "enemy",
      );
      e.fireCooldown = m.cadence;
    }
    if (e.smokeCooldown <= 0 && Math.abs(dx) < 400) {
      g.clouds.push({
        x: e.x + e.w / 2,
        y: WORLD.ground - 38,
        r: 65,
        ttl: 5,
        pulse: 0,
      });
      e.smokeCooldown = 8;
    }
    if (overlap(h, e)) hurtHero(g, 10 * m.damage);
  }
  const b = g.boss;
  if (g.bossActive && b.hp > 0) {
    b.flash = Math.max(0, b.flash - dt);
    b.frozen = Math.max(0, b.frozen - dt);
    const dx = center(h).x - center(b).x;
    b.facing = Math.sign(dx) || -1;
    b.phase = b.hp < b.maxHp * 0.5 ? 1 : 0;
    if (b.frozen <= 0) {
      b.fireCooldown -= dt;
      if (Math.abs(dx) > 300)
        b.x = clamp(b.x + Math.sign(dx) * 70 * dt, 2820, 3260);
      if (b.fireCooldown <= 0) {
        const dy = center(h).y - center(b).y;
        const angle = Math.atan2(dy, dx);
        for (const spread of b.phase ? [-0.22, 0, 0.22] : [-0.12, 0.12])
          fire(
            g,
            b,
            Math.cos(angle + spread) * 380,
            Math.sin(angle + spread) * 380,
            "fire",
            19,
            "enemy",
          );
        b.fireCooldown = b.phase ? 1 : 1.4;
        g.events.push({ kind: "fire" });
      }
    }
    if (overlap(h, b)) hurtHero(g, 22);
  }
  for (const s of g.shots) {
    s.ttl -= dt;
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    if (s.owner === "hero") {
      for (const e of [...g.enemies, ...(g.bossActive ? [b] : [])]) {
        if (e.hp <= 0) continue;
        if (
          overlap({ x: s.x - s.r, y: s.y - s.r, w: s.r * 2, h: s.r * 2 }, e)
        ) {
          hurtEnemy(g, e, s.damage);
          s.ttl = 0;
          break;
        }
      }
    } else if (
      overlap({ x: s.x - s.r, y: s.y - s.r, w: s.r * 2, h: s.r * 2 }, h)
    ) {
      const incoming =
        s.vx * h.facing < 0 && Math.sign(s.x - center(h).x) === h.facing;
      if (h.shield && incoming) {
        s.owner = "hero";
        s.vx = -s.vx;
        s.vy = -s.vy;
        s.damage = 2 + g.level * 0.5;
        s.type = "blue";
        s.x = center(h).x + h.facing * (h.w / 2 + 20);
        g.events.push({ kind: "reflect" });
      } else {
        hurtHero(g, s.damage);
        if (s.type === "ice") h.slow = 2;
        s.ttl = 0;
      }
    }
  }
  g.shots = g.shots.filter(
    (s) =>
      s.ttl > 0 &&
      s.x > -50 &&
      s.x < WORLD.width + 50 &&
      s.y > -200 &&
      s.y < WORLD.height + 100,
  );
  for (const c of g.clouds) {
    c.ttl -= dt;
    c.pulse -= dt;
    if (
      Math.hypot(center(h).x - c.x, center(h).y - c.y) < c.r &&
      c.pulse <= 0
    ) {
      hurtHero(g, 7 * m.damage);
      c.pulse = 0.8;
    }
  }
  g.clouds = g.clouds.filter((c) => c.ttl > 0);
  for (const p of g.pickups)
    if (
      !p.taken &&
      Math.abs(center(h).x - p.x) < h.w / 2 + p.r &&
      Math.abs(center(h).y - p.y) < h.h / 2 + p.r
    )
      collect(g, p);
  for (const e of g.effects) e.t += dt;
  g.effects = g.effects.filter((e) => e.t < e.max);
  if (g.bossActive && b.hp <= 0) g.portal = true;
  if (g.portal && h.x > 3270 && g.state === "playing") {
    g.state = "victory";
    g.score += 300;
    emit(g, "Le quartier est sauvé !", "victory");
  }
  g.camera = clamp(h.x - 400, 0, WORLD.width - 1280);
  g.previous = { ...input };
}
