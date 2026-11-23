import Phaser from 'phaser';
import { createRng } from '../../core/rng';
import { randomBetween } from '../../core/menu/motion';
import { PAL } from '../../data/menuPalette';
import type { NearAnchors } from './art/near';
import { buildGlowDisc, buildLightCone } from './art/glow';
import { buildDot, buildPuff } from './art/weather';
import { DEPTH, type Animated } from './animated';
import { ensureTexture } from './canvasTexture';

/** Farola con luz que a veces falla y polillas, vapor que sale de la alcantarilla y calor en la ventanita del café. */
export function createStreetLife(scene: Phaser.Scene, anchors: NearAnchors, reduceMotion: boolean): Animated {
  const rnd = createRng(321);
  ensureTexture(scene, 'nm-puff', buildPuff);
  ensureTexture(scene, 'nm-dot', buildDot);
  ensureTexture(scene, 'nm-lamp-glow', () => buildGlowDisc(22, PAL.amber, 5, 0.55));
  ensureTexture(scene, 'nm-lamp-cone', () => buildLightCone(8, 64, 78, PAL.window, 0.11));
  ensureTexture(scene, 'nm-cafe-glow', () => buildGlowDisc(26, PAL.amber, 4, 0.35));

  const lamp = anchors.lampLight;
  const cone = scene.add.image(lamp.x, lamp.y + 2, 'nm-lamp-cone').setOrigin(0.5, 0).setDepth(DEPTH.glows).setBlendMode(Phaser.BlendModes.ADD);
  const glow = scene.add.image(lamp.x, lamp.y, 'nm-lamp-glow').setDepth(DEPTH.glows).setBlendMode(Phaser.BlendModes.ADD);
  const cafe = anchors.cafeWindow;
  const cafeGlow = scene.add.image(cafe.x, cafe.y + 10, 'nm-cafe-glow').setDepth(DEPTH.glows).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.6);

  // Polillas alrededor de la farola
  const moths = [0, 1, 2].map((i) => ({
    dot: scene.add.image(lamp.x, lamp.y, 'nm-dot').setDepth(DEPTH.glows + 1).setAlpha(0.8),
    speed: 0.0021 + i * 0.0007,
    radius: 7 + i * 4,
    phase: i * 2.1
  }));

  // Vapor de la alcantarilla
  scene.add.particles(anchors.steamVent.x, anchors.steamVent.y, 'nm-puff', {
    lifespan: 2600,
    speedY: { min: -20, max: -12 },
    speedX: { min: -4, max: 6 },
    scale: { start: 0.9, end: 3 },
    alpha: { start: 0.3, end: 0 },
    frequency: reduceMotion ? 900 : 260,
    tint: 0xb8b0f0
  }).setDepth(DEPTH.steam);

  // Chimenea de la cafetera: vapor cálido sobre la ventanita
  scene.add.particles(cafe.x + 2, cafe.y + 2, 'nm-puff', {
    lifespan: 1800,
    speedY: { min: -9, max: -5 },
    speedX: { min: -2, max: 2 },
    scale: { start: 0.5, end: 1.6 },
    alpha: { start: 0.28, end: 0 },
    frequency: 520,
    tint: 0xffe6b0
  }).setDepth(DEPTH.steam);

  let flickerAt = randomBetween(rnd, [6000, 12000]);
  let flickerEnd = 0;

  return {
    update(timeMs) {
      let level = 1;
      if (!reduceMotion) {
        if (timeMs >= flickerAt) {
          flickerEnd = timeMs + 340;
          flickerAt = timeMs + randomBetween(rnd, [7000, 15000]);
        }
        if (timeMs < flickerEnd) level = Math.floor(timeMs / 55) % 2 === 0 ? 0.25 : 1;
        for (const m of moths) {
          const a = timeMs * m.speed + m.phase;
          m.dot.setPosition(Math.round(lamp.x + Math.cos(a) * m.radius), Math.round(lamp.y + Math.sin(a * 1.3) * m.radius * 0.6));
        }
      }
      glow.setAlpha(level * (0.85 + 0.15 * Math.sin(timeMs / 900)));
      cone.setAlpha(level);
      cafeGlow.setAlpha(0.55 + 0.1 * Math.sin(timeMs / 1300));
    }
  };
}
