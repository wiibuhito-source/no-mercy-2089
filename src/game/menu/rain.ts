import Phaser from 'phaser';
import { createRng } from '../../core/rng';
import { BASE_HEIGHT, BASE_WIDTH } from '../../core/version';
import { AMBIENCE } from '../../data/menuScene';
import type { NearAnchors } from './art/near';
import { RAIN_TILE, RIPPLE_FRAMES, buildRainTile, buildRipple } from './art/weather';
import { DEPTH, type Animated } from './animated';
import { ensureTexture } from './canvasTexture';

interface Ripple {
  readonly image: Phaser.GameObjects.Image;
  born: number;
  active: boolean;
}

const RIPPLE_MS = 520;
const POOL = 8;

/** Lluvia fina en dos capas y ondas en los charcos. Se puede apagar en `data/menuScene.ts` (AMBIENCE.rain). */
export function createRain(scene: Phaser.Scene, anchors: NearAnchors, reduceMotion: boolean): Animated {
  if (!AMBIENCE.rain.enabled || reduceMotion) return { update() {} };
  ensureTexture(scene, 'nm-rain-far', () => buildRainTile(11, 26, 5, 0x9aa4ff));
  ensureTexture(scene, 'nm-rain-near', () => buildRainTile(23, 14, 8, 0xd6dcff));
  for (let f = 0; f < RIPPLE_FRAMES; f++) ensureTexture(scene, `nm-ripple-${f}`, () => buildRipple(f));

  const far = scene.add.tileSprite(0, 0, BASE_WIDTH, BASE_HEIGHT, 'nm-rain-far').setOrigin(0, 0).setDepth(DEPTH.rain).setAlpha(AMBIENCE.rain.alpha * 0.8);
  const near = scene.add.tileSprite(0, 0, BASE_WIDTH, BASE_HEIGHT, 'nm-rain-near').setOrigin(0, 0).setDepth(DEPTH.rain).setAlpha(AMBIENCE.rain.alpha);

  const rnd = createRng(77);
  const pool: Ripple[] = [];
  for (let i = 0; i < POOL; i++) {
    pool.push({ image: scene.add.image(0, 0, 'nm-ripple-0').setDepth(DEPTH.props).setVisible(false), born: 0, active: false });
  }
  let nextDrop = 0;

  return {
    update(timeMs, deltaMs) {
      const dt = deltaMs / 1000;
      far.tilePositionY = (far.tilePositionY - AMBIENCE.rain.speedFar * dt) % RAIN_TILE;
      far.tilePositionX = (far.tilePositionX + AMBIENCE.rain.speedFar * dt * 0.25) % RAIN_TILE;
      near.tilePositionY = (near.tilePositionY - AMBIENCE.rain.speedNear * dt) % RAIN_TILE;
      near.tilePositionX = (near.tilePositionX + AMBIENCE.rain.speedNear * dt * 0.25) % RAIN_TILE;

      if (timeMs >= nextDrop) {
        nextDrop = timeMs + 110 + rnd() * 200;
        const spare = pool.find((r) => !r.active);
        const puddle = anchors.puddles[Math.min(anchors.puddles.length - 1, Math.floor(rnd() * anchors.puddles.length))];
        if (spare && puddle) {
          spare.active = true;
          spare.born = timeMs;
          spare.image.setPosition(Math.round(puddle.x + (rnd() - 0.5) * (puddle.w - 8)), Math.round(puddle.y + (rnd() - 0.5) * 3)).setVisible(true);
        }
      }
      for (const r of pool) {
        if (!r.active) continue;
        const p = (timeMs - r.born) / RIPPLE_MS;
        if (p >= 1) {
          r.active = false;
          r.image.setVisible(false);
        } else {
          r.image.setTexture(`nm-ripple-${Math.min(RIPPLE_FRAMES - 1, Math.floor(p * RIPPLE_FRAMES))}`);
        }
      }
    }
  };
}
