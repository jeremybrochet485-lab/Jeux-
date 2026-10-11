// Musique et effets originaux ; aucun extrait de Spider-Man.
export class Sound {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.boss = false;
    this.timer = null;
    this.beat = 0;
  }
  async enable() {
    this.ctx ??= new AudioContext();
    await this.ctx.resume();
    this.enabled = true;
    this.music();
  }
  disable() {
    this.enabled = false;
    clearInterval(this.timer);
    this.timer = null;
    this.ctx?.suspend();
  }
  note(freq, duration, type = "sine", volume = 0.04) {
    if (!this.enabled || !this.ctx) return;
    const o = this.ctx.createOscillator(),
      gain = this.ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      this.ctx.currentTime + duration,
    );
    o.connect(gain).connect(this.ctx.destination);
    o.start();
    o.stop(this.ctx.currentTime + duration + 0.02);
  }
  music() {
    clearInterval(this.timer);
    this.timer = setInterval(
      () => {
        if (!this.enabled || this.paused) return;
        const scale = this.boss
          ? [110, 116.54, 130.81, 110, 155.56, 116.54, 103.83, 110]
          : [164.81, 196, 246.94, 293.66, 246.94, 196, 220, 196];
        const f = scale[this.beat++ % scale.length];
        this.note(f, 0.35, "triangle", 0.035);
        if (this.beat % 4 === 0) this.note(f / 2, 0.8, "sine", 0.06);
      },
      this.boss ? 210 : 300,
    );
  }
  setBoss(value) {
    if (this.boss === value) return;
    this.boss = value;
    this.beat = 0;
    if (this.enabled) this.music();
  }
  effect(kind) {
    const values = {
      shoot: [650, 0.09],
      tentacle: [150, 0.18],
      reflect: [920, 0.15],
      hit: [240, 0.1],
      upgrade: [880, 0.4],
      nova: [70, 0.7],
      boss: [95, 0.6],
      victory: [1046, 0.6],
      fire: [90, 0.2],
    };
    if (values[kind]) this.note(...values[kind], "triangle", 0.035);
  }
}
