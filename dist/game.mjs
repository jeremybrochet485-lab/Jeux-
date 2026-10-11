import { createGame, step } from "./engine.mjs";
import { renderer } from "./render.mjs";
import { Sound } from "./audio.mjs";
const $ = (id) => document.getElementById(id),
  canvas = $("game"),
  draw = renderer(canvas),
  sound = new Sound();
let g = createGame(),
  started = false,
  last = 0,
  toastTimer = 0,
  displayedState = "menu";
const keys = new Set(),
  pressed = new Set(),
  touchPressed = new Set(),
  touches = new Map();
const bindings = {
  left: ["ArrowLeft", "KeyA", "KeyQ"],
  right: ["ArrowRight", "KeyD"],
  jump: ["Space", "ArrowUp", "KeyW", "KeyZ"],
  shoot: ["KeyJ"],
  tentacle: ["KeyK", "KeyX"],
  shield: ["KeyL", "KeyC"],
  nova: ["KeyE", "KeyM"],
  invisible: ["KeyI"],
  special: ["KeyR"],
};
let record = 0;
try {
  record = Number(localStorage.getItem("heros-bleu-record")) || 0;
} catch {}
$("record").textContent = record.toLocaleString("fr-FR");
function clearInput() {
  keys.clear();
  pressed.clear();
  touchPressed.clear();
  touches.clear();
  document
    .querySelectorAll("[data-control]")
    .forEach((b) => b.classList.remove("active"));
  g.previous = {};
}
function input() {
  const result = {};
  for (const [action, codes] of Object.entries(bindings))
    result[action] =
      codes.some((k) => keys.has(k) || pressed.has(k)) ||
      touchPressed.has(action) ||
      [...touches.values()].includes(action);
  return result;
}
function showToast(text) {
  $("toast").textContent = text;
  $("toast").classList.add("show");
  toastTimer = 3;
}
function showOverlay(state) {
  displayedState = state;
  $("overlay").hidden = false;
  $("difficulty").hidden = state !== "menu";
  $("restart").hidden = state === "menu";
  $("menu-note").hidden = state !== "menu";
  const data = {
    pause: [
      "UNE PAUSE BIEN MÉRITÉE",
      "On reprend<br>son souffle.",
      "Le quartier peut attendre un instant. Tes pouvoirs et les ennemis sont en pause.",
      "Reprendre l’aventure",
    ],
    defeat: [
      "CHAQUE HÉROS SE RELÈVE",
      "Encore un<br>petit effort.",
      "Esquive la glace et utilise le bouclier. Le boss annonce ses attaques : garde tes distances !",
      "Réessayer",
    ],
    victory: [
      "MISSION ACCOMPLIE",
      "Le quartier<br>est sauvé !",
      `Bravo, héros ! ${g.coins} pièces, rang ${g.level + 1} et ${g.score.toLocaleString("fr-FR")} points. Le niveau 1 est terminé.`,
      "Rejouer le niveau",
    ],
  };
  if (data[state]) {
    const [k, t, d, b] = data[state];
    $("menu-kicker").textContent = k;
    $("menu-title").innerHTML = t;
    $("menu-description").textContent = d;
    $("play").innerHTML = b + " <span>→</span>";
  }
  $("pause").setAttribute("aria-label", "Reprendre le jeu");
}
function begin() {
  const mode = document.querySelector('input[name="difficulty"]:checked').value;
  g = createGame(mode);
  started = true;
  displayedState = "playing";
  $("overlay").hidden = true;
  sound.setBoss(false);
  sound.paused = false;
  clearInput();
  canvas.focus();
  $("pause").setAttribute("aria-label", "Mettre en pause");
}
function pause() {
  if (!started || !["playing", "pause"].includes(g.state)) return;
  clearInput();
  if (g.state === "playing") {
    g.state = "pause";
    sound.paused = true;
    showOverlay("pause");
  } else {
    g.state = "playing";
    sound.paused = false;
    $("overlay").hidden = true;
    displayedState = "playing";
    canvas.focus();
    $("pause").setAttribute("aria-label", "Mettre en pause");
  }
}
$("play").onclick = () => (displayedState === "pause" ? pause() : begin());
$("restart").onclick = begin;
$("pause").onclick = pause;
$("audio").onclick = async () => {
  try {
    if (sound.enabled) sound.disable();
    else await sound.enable();
    $("audio").innerHTML =
      "♫ <span>" + (sound.enabled ? "Son activé" : "Son désactivé") + "</span>";
    $("audio").setAttribute("aria-pressed", String(sound.enabled));
    $("audio").setAttribute(
      "aria-label",
      sound.enabled ? "Désactiver le son" : "Activer le son",
    );
  } catch {
    showToast("Le son n’est pas disponible dans ce navigateur.");
  }
};
$("help-button").onclick = () => {
  $("help").hidden = !$("help").hidden;
  $("help-button").setAttribute("aria-expanded", String(!$("help").hidden));
};
window.addEventListener("keydown", (e) => {
  if (e.target.closest("button,input,a")) return;
  if (
    Object.values(bindings).flat().includes(e.code) ||
    ["KeyP", "Escape"].includes(e.code)
  ) {
    e.preventDefault();
    if (["KeyP", "Escape"].includes(e.code)) {
      if (!e.repeat) pause();
    } else {
      keys.add(e.code);
      if (!e.repeat) pressed.add(e.code);
    }
  }
});
window.addEventListener("keyup", (e) => keys.delete(e.code));
window.addEventListener("blur", () => {
  clearInput();
  if (started && g.state === "playing") pause();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && started && g.state === "playing") pause();
});
canvas.addEventListener("pointerdown", (e) => {
  if (g.state !== "playing" || !started) return;
  canvas.focus();
  canvas.setPointerCapture(e.pointerId);
  touches.set(e.pointerId, "shoot");
  touchPressed.add("shoot");
});
for (const b of document.querySelectorAll("[data-control]")) {
  b.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    b.setPointerCapture(e.pointerId);
    touches.set(e.pointerId, b.dataset.control);
    touchPressed.add(b.dataset.control);
    b.classList.add("active");
  });
  const release = (e) => {
    touches.delete(e.pointerId);
    if (![...touches.values()].includes(b.dataset.control))
      b.classList.remove("active");
  };
  b.addEventListener("pointerup", release);
  b.addEventListener("pointercancel", release);
  b.addEventListener("lostpointercapture", release);
}
window.addEventListener("pointerup", (e) => touches.delete(e.pointerId));
window.addEventListener("pointercancel", (e) => touches.delete(e.pointerId));
function hud() {
  const h = g.hero;
  $("health-fill").style.width = h.hp + "%";
  $("health-text").textContent = Math.ceil(h.hp) + " / 100";
  $("energy-fill").style.width = h.energy + "%";
  $("energy-text").textContent = Math.floor(h.energy) + " %";
  $("special-fill").style.width = g.specialCharge + "%";
  $("special-text").textContent = g.special
    ? "PRÊT"
    : Math.floor(g.specialCharge) + " %";
  $("coins").innerHTML =
    g.coins + " <small>/ " + (g.level + 1) * 10 + "</small>";
  $("score").textContent = String(Math.floor(g.score)).padStart(5, "0");
  $("invisible-status").textContent =
    h.invisible > 0
      ? Math.ceil(h.invisible) + " s actif"
      : h.invisCooldown > 0
        ? "Recharge " + Math.ceil(h.invisCooldown) + " s"
        : "10 secondes";
  $("special-status").textContent = g.special || "Charge ta barre";
  $("boss-hud").hidden = !g.bossActive || g.boss.hp <= 0;
  $("boss-fill").style.width = (g.boss.hp / g.boss.maxHp) * 100 + "%";
  $("objective-text").textContent = g.portal
    ? "Rejoins le portail : le quartier est sauvé."
    : g.bossActive
      ? "Vaincs le Bouffon embrasé."
      : `Libère le parc · ${g.enemies.filter((e) => e.hp <= 0).length} / 8 gardes`;
}
function frame(ms) {
  const dt = Math.min((ms - last) / 1000, 0.04) || 0;
  last = ms;
  if (started) {
    step(g, dt, input());
    pressed.clear();
    touchPressed.clear();
  } else g.time += dt;
  for (const event of g.events) {
    if (event.text) showToast(event.text);
    sound.effect(event.kind);
  }
  g.events = [];
  sound.setBoss(g.bossActive && g.boss.hp > 0);
  if (
    started &&
    ["defeat", "victory"].includes(g.state) &&
    displayedState !== g.state
  ) {
    sound.paused = true;
    clearInput();
    if (g.score > record) {
      record = Math.floor(g.score);
      try {
        localStorage.setItem("heros-bleu-record", record);
      } catch {}
      $("record").textContent = record.toLocaleString("fr-FR");
    }
    showOverlay(g.state);
  }
  if (toastTimer > 0) {
    toastTimer -= dt;
    if (toastTimer <= 0) $("toast").classList.remove("show");
  }
  draw(g);
  hud();
  requestAnimationFrame(frame);
}
// Accès de test uniquement avec ?test=1 ; jamais requis pour jouer.
if (new URLSearchParams(location.search).get("test") === "1")
  window.__test = {
    get game() {
      return g;
    },
    step: (dt, i) => step(g, dt, i),
  };
requestAnimationFrame(frame);
