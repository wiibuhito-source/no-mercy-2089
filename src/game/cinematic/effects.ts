import Phaser from 'phaser';
import { LIGHTNING_FLASHES, lightningLevel, nextGapMs, particleAlpha, stepParticle, type Particle } from '../../core/cinematic/effectMath';
import type { SceneEffect } from '../../core/cinematic/storyTypes';
import { PixelCanvas } from '../../core/pixelCanvas';
import { createRng } from '../../core/rng';
import { BASE_HEIGHT, BASE_WIDTH } from '../../core/version';
import { ensureTexture } from '../menu/canvasTexture';
import { RIPPLE_FRAMES, buildRipple } from '../menu/art/weather';
import { CIN_DEPTH } from './depth';

/** Lo que un efecto necesita del escenario. */
export interface EffectHost {
  readonly scene: Phaser.Scene;
  /** Capa de efectos que se mueve con la cámara (profundidad 1). */
  readonly world: Phaser.GameObjects.Container;
  /** Contenedor de cada capa de la ilustración (para meter cosas "detrás" de otras). */
  readonly layers: readonly Phaser.GameObjects.Container[];
}

export interface Effect {
  update(deltaMs: number, timeMs: number): void;
  destroy(): void;
}

function whiteSquare(size: number, round: boolean): () => PixelCanvas {
  return () => {
    const c = new PixelCanvas(size, size);
    if (round) c.fillCircle((size - 1) / 2, (size - 1) / 2, size / 2, 0xffffff);
    else c.fillRect(0, 0, size, size, 0xffffff);
    return c;
  };
}

function ensureEffectTextures(scene: Phaser.Scene): void {
  ensureTexture(scene, 'cin-puff', whiteSquare(5, true));
  ensureTexture(scene, 'cin-spark', whiteSquare(2, false));
  ensureTexture(scene, 'cin-mote', whiteSquare(2, true));
  ensureTexture(scene, 'cin-leaf', () => {
    const c = new PixelCanvas(4, 3);
    c.fillRect(0, 1, 3, 1, 0xffffff);
    c.fillRect(1, 0, 2, 1, 0xffffff);
    c.fillRect(1, 2, 3, 1, 0xffffff, 0.8);
    return c;
  });
  for (let f = 0; f < RIPPLE_FRAMES; f++) ensureTexture(scene, `cin-ripple-${f}`, () => buildRipple(f));
  ensureTexture(scene, 'cin-fog', () => {
    // Banda de niebla que se repite sin cortes a lo ancho (el ruido usa solo ondas con periodo exacto)
    const w = 256;
    const h = 48;
    const c = new PixelCanvas(w, h);
    for (let y = 0; y < h; y++) {
      const v = Math.exp(-(((y - h / 2) / (h * 0.26)) ** 2));
      for (let x = 0; x < w; x++) {
        const a = (2 * Math.PI * x) / w;
        const n = 0.5 + 0.25 * Math.sin(a * 2 + y * 0.11) + 0.15 * Math.sin(a * 5 + 1.7 + y * 0.07) + 0.1 * Math.sin(a * 11 + 0.4);
        const alpha = Math.round(v * Math.max(0, n) * 5) / 5; // 5 niveles: aspecto de píxel, no de degradado liso
        if (alpha > 0.05) c.setPixel(x, y, 0xffffff, alpha);
      }
    }
    return c;
  });
  ensureTexture(scene, 'cin-car', () => {
    const c = new PixelCanvas(16, 6);
    c.fillRect(1, 2, 14, 3, 0xffffff);
    c.fillRect(4, 0, 8, 3, 0xffffff);
    return c;
  });
}

interface Live {
  readonly img: Phaser.GameObjects.Image;
  readonly p: Particle;
  readonly grow: number;
}

/** Humo o vapor que sube. */
function createSmoke(host: EffectHost, def: Extract<SceneEffect, { type: 'smoke' }>, seed: number): Effect {
  const rnd = createRng(seed);
  const live: Live[] = [];
  let since = def.everyMs;
  return {
    update(dt) {
      since += dt;
      while (since >= def.everyMs) {
        since -= def.everyMs;
        const life = 1700 + rnd() * 900;
        const p: Particle = { x: def.x + (rnd() - 0.5) * 3, y: def.y, vx: def.drift + (rnd() - 0.5) * 5, vy: -def.rise, gravity: -3, life, maxLife: life, size: 1 };
        const img = host.scene.add.image(p.x, p.y, 'cin-puff').setTint(def.color).setAlpha(0).setScale(0.6);
        host.world.add(img);
        live.push({ img, p, grow: 1.4 + rnd() * 0.8 });
      }
      for (let i = live.length - 1; i >= 0; i--) {
        const l = live[i];
        if (!l) continue;
        if (!stepParticle(l.p, dt)) {
          l.img.destroy();
          live.splice(i, 1);
          continue;
        }
        const age = 1 - l.p.life / l.p.maxLife;
        l.img.setPosition(Math.round(l.p.x), Math.round(l.p.y)).setAlpha(particleAlpha(l.p, def.alpha)).setScale(0.6 + age * l.grow);
      }
    },
    destroy() {
      for (const l of live) l.img.destroy();
      live.length = 0;
    }
  };
}

/** Chispas en ráfagas. */
function createSparks(host: EffectHost, def: Extract<SceneEffect, { type: 'sparks' }>, seed: number): Effect {
  const rnd = createRng(seed);
  const live: Live[] = [];
  let since = def.everyMs * 0.4;
  return {
    update(dt) {
      since += dt;
      if (since >= def.everyMs) {
        since = 0;
        for (let i = 0; i < def.count; i++) {
          const life = 320 + rnd() * 420;
          const p: Particle = { x: def.x, y: def.y, vx: (rnd() - 0.3) * 90, vy: -(30 + rnd() * 70), gravity: 260, life, maxLife: life, size: 1 };
          const img = host.scene.add.image(p.x, p.y, 'cin-spark').setTint(def.color).setBlendMode(Phaser.BlendModes.ADD);
          host.world.add(img);
          live.push({ img, p, grow: 0 });
        }
      }
      for (let i = live.length - 1; i >= 0; i--) {
        const l = live[i];
        if (!l) continue;
        if (!stepParticle(l.p, dt)) {
          l.img.destroy();
          live.splice(i, 1);
          continue;
        }
        l.img.setPosition(Math.round(l.p.x), Math.round(l.p.y)).setAlpha(particleAlpha(l.p, 1));
      }
    },
    destroy() {
      for (const l of live) l.img.destroy();
      live.length = 0;
    }
  };
}

/** Coches voladores lejanos cruzando de lado a lado. */
function createTraffic(host: EffectHost, def: Extract<SceneEffect, { type: 'traffic' }>, seed: number): Effect {
  const rnd = createRng(seed);
  const parent = def.layer !== undefined ? (host.layers[def.layer] ?? host.world) : host.world;
  const cars = Array.from({ length: def.count }, (_, i) => {
    const container = host.scene.add.container(0, 0);
    const scale = 0.6 + rnd() * 0.5;
    const body = host.scene.add.image(0, 0, 'cin-car').setTint(def.color).setOrigin(0.5);
    const light = host.scene.add.image(def.dir * 7, 1, 'cin-spark').setTint(def.lightColor).setBlendMode(Phaser.BlendModes.ADD);
    const tail = host.scene.add.image(-def.dir * 7, 1, 'cin-spark').setTint(0xff3b5c).setBlendMode(Phaser.BlendModes.ADD);
    container.add([body, light, tail]).setScale(scale * def.dir, scale);
    parent.add(container);
    const span = BASE_WIDTH + 120;
    return { container, x: ((i + rnd() * 0.6) / def.count) * span - 60, speed: def.speed * (0.8 + rnd() * 0.5), y: def.y + (rnd() - 0.5) * 14 };
  });
  return {
    update(dt) {
      for (const c of cars) {
        c.x += (c.speed * def.dir * dt) / 1000;
        if (def.dir > 0 && c.x > BASE_WIDTH + 60) c.x = -60;
        if (def.dir < 0 && c.x < -60) c.x = BASE_WIDTH + 60;
        c.container.setPosition(Math.round(c.x), Math.round(c.y));
      }
    },
    destroy() {
      for (const c of cars) c.container.destroy();
    }
  };
}

/** Motas de polvo que flotan por toda la pantalla (no siguen a la cámara). */
function createDust(host: EffectHost, def: Extract<SceneEffect, { type: 'dust' }>, seed: number): Effect {
  const rnd = createRng(seed);
  const motes = Array.from({ length: def.count }, () => ({
    img: host.scene.add.image(0, 0, 'cin-mote').setTint(def.color).setDepth(CIN_DEPTH.rain + 1).setAlpha(0),
    x: rnd() * BASE_WIDTH,
    y: rnd() * BASE_HEIGHT,
    vx: (rnd() - 0.5) * 7,
    vy: -2 - rnd() * 5,
    phase: rnd() * 6.28,
    rate: 0.0007 + rnd() * 0.0012
  }));
  return {
    update(dt, t) {
      for (const m of motes) {
        m.x += (m.vx * dt) / 1000;
        m.y += (m.vy * dt) / 1000;
        if (m.y < -4) m.y = BASE_HEIGHT + 4;
        if (m.x < -4) m.x = BASE_WIDTH + 4;
        if (m.x > BASE_WIDTH + 4) m.x = -4;
        m.img.setPosition(Math.round(m.x), Math.round(m.y)).setAlpha(def.alpha * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * m.rate + m.phase))));
      }
    },
    destroy() {
      for (const m of motes) m.img.destroy();
    }
  };
}

/** Rayas de velocidad horizontales. */
function createSpeedlines(host: EffectHost, def: Extract<SceneEffect, { type: 'speedlines' }>, seed: number): Effect {
  const rnd = createRng(seed);
  const lines = Array.from({ length: def.count }, () => {
    const len = 24 + rnd() * 70;
    return {
      img: host.scene.add.image(0, 0, 'cin-spark').setOrigin(0, 0.5).setTint(def.color).setDepth(CIN_DEPTH.rain + 2).setScale(len / 2, 0.5).setAlpha(def.alpha * (0.4 + rnd() * 0.6)),
      x: rnd() * BASE_WIDTH,
      y: 14 + rnd() * (BASE_HEIGHT - 90),
      speed: def.speed * (0.6 + rnd() * 0.8),
      len
    };
  });
  return {
    update(dt) {
      for (const l of lines) {
        l.x -= (l.speed * dt) / 1000;
        if (l.x < -l.len) {
          l.x = BASE_WIDTH + rnd() * 80;
          l.y = 14 + rnd() * (BASE_HEIGHT - 90);
        }
        l.img.setPosition(Math.round(l.x), Math.round(l.y));
      }
    },
    destroy() {
      for (const l of lines) l.img.destroy();
    }
  };
}

/** Rayos: destello blanco y sacudida. */
function createLightning(host: EffectHost, def: Extract<SceneEffect, { type: 'lightning' }>, seed: number): Effect {
  const rnd = createRng(seed);
  const flash = host.scene.add.rectangle(0, 0, BASE_WIDTH, BASE_HEIGHT, 0xdfe6ff).setOrigin(0, 0).setDepth(15).setAlpha(0);
  let wait = nextGapMs(rnd, def.minGapMs * 0.5, def.maxGapMs * 0.7);
  let elapsed = -1;
  const total = LIGHTNING_FLASHES[LIGHTNING_FLASHES.length - 1]?.atMs ?? 0;
  return {
    update(dt) {
      if (elapsed < 0) {
        wait -= dt;
        if (wait <= 0) {
          elapsed = 0;
          if (def.shake) host.scene.cameras.main.shake(180, 0.0035);
        }
        return;
      }
      elapsed += dt;
      flash.setAlpha(lightningLevel(elapsed) * 0.5);
      if (elapsed > total) {
        elapsed = -1;
        flash.setAlpha(0);
        wait = nextGapMs(rnd, def.minGapMs, def.maxGapMs);
      }
    },
    destroy() {
      flash.destroy();
    }
  };
}

/** Viento: hojas y papeles que cruzan volando, a ráfagas. */
function createWind(host: EffectHost, def: Extract<SceneEffect, { type: 'wind' }>, seed: number): Effect {
  const rnd = createRng(seed);
  const items = Array.from({ length: def.count }, () => ({
    img: host.scene.add.image(0, 0, 'cin-leaf').setTint(def.colors[Math.floor(rnd() * def.colors.length)] ?? 0xffffff).setDepth(CIN_DEPTH.rain + 3),
    x: rnd() * BASE_WIDTH,
    y: def.y0 + rnd() * (def.y1 - def.y0),
    speed: def.speed * (0.5 + rnd()),
    amp: 2 + rnd() * 5,
    freq: 0.002 + rnd() * 0.004,
    phase: rnd() * 6.28,
    fall: 2 + rnd() * 6
  }));
  return {
    update(dt, t) {
      const gust = 1 + 0.6 * Math.sin(t / 2300) + 0.25 * Math.sin(t / 530);
      for (const m of items) {
        m.x += (m.speed * gust * dt) / 1000;
        m.y += (m.fall * dt) / 1000;
        if (def.speed > 0 && m.x > BASE_WIDTH + 8) m.x = -8;
        if (def.speed < 0 && m.x < -8) m.x = BASE_WIDTH + 8;
        if (m.y > def.y1) m.y = def.y0;
        m.img.setPosition(Math.round(m.x), Math.round(m.y + Math.sin(t * m.freq + m.phase) * m.amp)).setAlpha(0.85);
        m.img.setFlipX(Math.sin(t * m.freq * 2 + m.phase) > 0);
      }
    },
    destroy() {
      for (const m of items) m.img.destroy();
    }
  };
}

/** Ondas que dibujan las gotas al caer en los charcos. */
function createRipples(host: EffectHost, def: Extract<SceneEffect, { type: 'ripples' }>, seed: number): Effect {
  const rnd = createRng(seed);
  const live: { img: Phaser.GameObjects.Image; age: number }[] = [];
  let since = 0;
  return {
    update(dt) {
      since += dt;
      const gap = def.everyMs * (0.5 + rnd());
      if (since >= gap) {
        since = 0;
        const img = host.scene.add.image(Math.round(def.x0 + rnd() * (def.x1 - def.x0)), Math.round(def.y0 + rnd() * (def.y1 - def.y0)), 'cin-ripple-0').setTint(def.color);
        host.world.add(img);
        live.push({ img, age: 0 });
      }
      for (let i = live.length - 1; i >= 0; i--) {
        const r = live[i];
        if (!r) continue;
        r.age += dt;
        const frame = Math.floor(r.age / 130);
        if (frame >= RIPPLE_FRAMES) {
          r.img.destroy();
          live.splice(i, 1);
        } else r.img.setTexture(`cin-ripple-${frame}`);
      }
    },
    destroy() {
      for (const r of live) r.img.destroy();
      live.length = 0;
    }
  };
}

/** Niebla baja: dos bandas que pasan a distinta velocidad. */
function createFog(host: EffectHost, def: Extract<SceneEffect, { type: 'fog' }>): Effect {
  const height = Math.max(8, def.y1 - def.y0);
  const bands = [0, 1].map((i) => {
    const tile = host.scene.add.tileSprite(0, def.y0 + i * (height * 0.25), BASE_WIDTH, 48, 'cin-fog').setOrigin(0, 0).setTint(def.color).setAlpha(def.alpha * (i === 0 ? 1 : 0.7)).setDepth(CIN_DEPTH.rain - 0.5);
    tile.setScale(1, (height * (i === 0 ? 1 : 0.8)) / 48);
    return { tile, k: i === 0 ? 1 : -0.6, pos: i * 90 };
  });
  return {
    update(dt) {
      for (const b of bands) {
        b.pos += (def.speed * b.k * dt) / 1000;
        b.tile.tilePositionX = Math.floor(b.pos);
      }
    },
    destroy() {
      for (const b of bands) b.tile.destroy();
    }
  };
}

export function createEffect(host: EffectHost, def: SceneEffect, seed: number): Effect {
  ensureEffectTextures(host.scene);
  switch (def.type) {
    case 'smoke':
      return createSmoke(host, def, seed);
    case 'sparks':
      return createSparks(host, def, seed);
    case 'traffic':
      return createTraffic(host, def, seed);
    case 'dust':
      return createDust(host, def, seed);
    case 'wind':
      return createWind(host, def, seed);
    case 'ripples':
      return createRipples(host, def, seed);
    case 'fog':
      return createFog(host, def);
    case 'speedlines':
      return createSpeedlines(host, def, seed);
    case 'lightning':
      return createLightning(host, def, seed);
  }
}
