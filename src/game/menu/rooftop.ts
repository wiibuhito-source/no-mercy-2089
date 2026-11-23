import Phaser from 'phaser';
import { CatBrain, type CatPose } from '../../core/menu/catBrain';
import { breath, randomBetween } from '../../core/menu/motion';
import { createRng } from '../../core/rng';
import { PAL } from '../../data/menuPalette';
import { CAT } from '../../data/menuScene';
import type { NearAnchors } from './art/near';
import { CAT_FRAME_NAMES, buildCatFrame, type CatFrameName } from './art/cat';
import { GANGSTER_EMBER, GANGSTER_SEAT, buildGangster } from './art/gangster';
import { buildGlowDisc } from './art/glow';
import { buildDot, buildPuff } from './art/weather';
import { DEPTH, type Animated } from './animated';
import { cached, ensureTexture } from './canvasTexture';

function frameFor(pose: CatPose): CatFrameName {
  if (pose.phase === 'crouch') return 'crouch';
  if (pose.phase === 'land') return 'land';
  if (pose.phase === 'jump') return 'leap';
  return pose.tailUp ? 'sitFlick' : 'sit';
}

/** Azotea del edificio: un pandillero fumando sentado en el borde y un gatito que salta entre cajas, aire y depósito. */
export function createRooftop(scene: Phaser.Scene, anchors: NearAnchors, reduceMotion: boolean): Animated {
  const rnd = createRng(606);
  const add = Phaser.BlendModes.ADD;
  ensureTexture(scene, 'nm-puff', buildPuff);
  ensureTexture(scene, 'nm-dot', buildDot);

  // --- Pandillero ---
  const g = cached('gangster', buildGangster);
  ensureTexture(scene, 'nm-gangster', () => g.body);
  ensureTexture(scene, 'nm-gangster-eye', () => g.eye);
  ensureTexture(scene, 'nm-ember-glow', () => buildGlowDisc(5, PAL.orange, 3, 0.7));
  const gx = anchors.gangsterFeet.x - GANGSTER_SEAT.x;
  const gy = anchors.gangsterFeet.y - GANGSTER_SEAT.y;
  const body = scene.add.image(gx, gy, 'nm-gangster').setOrigin(0, 0).setDepth(DEPTH.roofCharacters);
  const eye = scene.add.image(gx, gy, 'nm-gangster-eye').setOrigin(0, 0).setDepth(DEPTH.roofCharacters + 0.1).setBlendMode(add);
  const emberX = gx + GANGSTER_EMBER.x;
  const emberY = gy + GANGSTER_EMBER.y;
  const emberGlow = scene.add.image(emberX, emberY, 'nm-ember-glow').setDepth(DEPTH.glows).setBlendMode(add).setAlpha(0.4);
  const ember = scene.add.image(emberX, emberY, 'nm-dot').setOrigin(0, 0).setDepth(DEPTH.roofCharacters + 0.2).setTint(PAL.orange);
  const smoke = scene.add.particles(emberX, emberY - 1, 'nm-puff', {
    lifespan: 2800,
    speedY: { min: -13, max: -8 },
    speedX: { min: -5, max: 1 },
    scale: { start: 0.45, end: 1.7 },
    alpha: { start: 0.32, end: 0 },
    frequency: 650,
    tint: 0xc8c0f0
  });
  smoke.setDepth(DEPTH.steam);
  let nextDrag = randomBetween(rnd, [4000, 7000]);
  let dragStart = -1;

  // --- Gato ---
  const brain = new CatBrain(CAT, createRng(88));
  for (const name of CAT_FRAME_NAMES) ensureTexture(scene, `nm-cat-${name}`, () => buildCatFrame(name));
  const cat = scene.add
    .image(0, 0, 'nm-cat-sit')
    .setOrigin(0.5, 1)
    .setDepth(DEPTH.roofCharacters + 0.3);
  const start = CAT.perches[0];
  if (start) cat.setPosition(start.x, start.y);
  let lastFrame: CatFrameName = 'sit';

  return {
    update(timeMs, deltaMs) {
      // Pandillero: respira despacio; cada tanto da una calada (brasa fuerte y más humo)
      body.setY(gy - Math.round(breath(timeMs, 3800)));
      eye.setY(body.y);
      eye.setAlpha(0.65 + 0.35 * Math.sin(timeMs / 500));
      if (!reduceMotion) {
        if (dragStart < 0 && timeMs >= nextDrag) {
          dragStart = timeMs;
          smoke.explode(3);
        }
        let glowLevel = 0.35 + 0.15 * Math.sin(timeMs / 700);
        if (dragStart >= 0) {
          const p = (timeMs - dragStart) / 1100;
          if (p >= 1) {
            dragStart = -1;
            nextDrag = timeMs + randomBetween(rnd, [5000, 9000]);
          } else {
            glowLevel = 0.35 + 0.65 * Math.sin(p * Math.PI);
          }
        }
        emberGlow.setAlpha(glowLevel);
      }
      ember.setAlpha(0.7 + 0.3 * Math.sin(timeMs / 330));

      // Gato
      if (reduceMotion) return;
      const pose = brain.update(deltaMs);
      const frame = frameFor(pose);
      if (frame !== lastFrame) {
        lastFrame = frame;
        cat.setTexture(`nm-cat-${frame}`);
      }
      cat.setFlipX(pose.facing < 0);
      cat.setPosition(Math.round(pose.x), Math.round(pose.y));
    }
  };
}

