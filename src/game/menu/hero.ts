import Phaser from 'phaser';
import { breath, randomBetween } from '../../core/menu/motion';
import { createRng } from '../../core/rng';
import { PAL } from '../../data/menuPalette';
import { BREATH, SCENE } from '../../data/menuScene';
import { ADRIAN_CUP, ADRIAN_VISOR, buildAdrian } from './art/adrian';
import { CAR_ANCHORS, buildCar } from './art/car';
import { buildBeam, buildGlowDisc, buildGlowEllipse } from './art/glow';
import { buildDot, buildPuff } from './art/weather';
import { DEPTH, type Animated } from './animated';
import { cached, ensureTexture } from './canvasTexture';

/** Coche con Adrián sentado en el capó: respira, bebe café (con vapor), destella la visera y el coche ronronea. */
export function createHero(scene: Phaser.Scene, reduceMotion: boolean): Animated {
  const rnd = createRng(4711);
  const cx = SCENE.car.x;
  const cy = SCENE.car.y;
  const ax = cx + CAR_ANCHORS.adrianOrigin.x;
  const ay = cy + CAR_ANCHORS.adrianOrigin.y;

  ensureTexture(scene, 'nm-car', buildCar);
  const layers = cached('adrian', buildAdrian);
  ensureTexture(scene, 'nm-adrian-torso', () => layers.torso);
  ensureTexture(scene, 'nm-adrian-lower', () => layers.lower);
  ensureTexture(scene, 'nm-adrian-arm', () => layers.arm);
  ensureTexture(scene, 'nm-adrian-head', () => layers.head);
  ensureTexture(scene, 'nm-puff', buildPuff);
  ensureTexture(scene, 'nm-dot', buildDot);

  // Luces del coche
  ensureTexture(scene, 'nm-underglow', () => buildGlowEllipse(100, 8, PAL.magenta, 5, 0.75));
  ensureTexture(scene, 'nm-beam', () => buildBeam(120, 6, 40, 0xffe9a0, 0.22));
  ensureTexture(scene, 'nm-head-glow', () => buildGlowDisc(11, 0xfff3b0, 4, 0.7));
  ensureTexture(scene, 'nm-tail-glow', () => buildGlowDisc(8, PAL.red, 4, 0.7));
  const add = Phaser.BlendModes.ADD;
  const head = CAR_ANCHORS.headlight;
  const tail = CAR_ANCHORS.taillight;
  const underglow = scene.add
    .image(cx + CAR_ANCHORS.underglowCenter.x, SCENE.wheelBottomY - 1, 'nm-underglow')
    .setDepth(DEPTH.carFx)
    .setBlendMode(add);
  const beam = scene.add.image(cx + head.x, cy + head.y, 'nm-beam').setOrigin(0, 0.5).setDepth(DEPTH.carFx).setBlendMode(add);
  const headGlow = scene.add.image(cx + head.x, cy + head.y, 'nm-head-glow').setDepth(DEPTH.carFx).setBlendMode(add);
  const tailGlow = scene.add.image(cx + tail.x, cy + tail.y, 'nm-tail-glow').setDepth(DEPTH.carFx).setBlendMode(add);

  scene.add.image(cx, cy, 'nm-car').setOrigin(0, 0).setDepth(DEPTH.car);

  // Adrián, por capas (el torso va detrás de las piernas; el brazo y la cabeza, delante)
  const torso = scene.add.image(ax, ay, 'nm-adrian-torso').setOrigin(0, 0).setDepth(DEPTH.adrianTorso);
  scene.add.image(ax, ay, 'nm-adrian-lower').setOrigin(0, 0).setDepth(DEPTH.adrianLower);
  const arm = scene.add.image(ax, ay, 'nm-adrian-arm').setOrigin(0, 0).setDepth(DEPTH.adrianArm);
  const headLayer = scene.add.image(ax, ay, 'nm-adrian-head').setOrigin(0, 0).setDepth(DEPTH.adrianHead);
  const glint = scene.add.image(ax, ay, 'nm-dot').setOrigin(0, 0).setDepth(DEPTH.adrianHead + 0.1).setBlendMode(add).setAlpha(0);
  glint.setDisplaySize(2, 1);

  // Vapor del cafecito y del tubo de escape
  scene.add.particles(ax + ADRIAN_CUP.x + 2, ay + ADRIAN_CUP.y - 1, 'nm-puff', {
    lifespan: 1700,
    speedY: { min: -11, max: -6 },
    speedX: { min: -3, max: 3 },
    scale: { start: 0.35, end: 1 },
    alpha: { start: 0.55, end: 0 },
    frequency: reduceMotion ? 700 : 300,
    tint: 0xffffff
  }).setDepth(DEPTH.adrianHead + 0.2);
  scene.add.particles(cx + CAR_ANCHORS.exhaust.x - 2, cy + CAR_ANCHORS.exhaust.y, 'nm-puff', {
    lifespan: 1500,
    speedX: { min: -20, max: -10 },
    speedY: { min: -7, max: -2 },
    scale: { start: 0.5, end: 1.9 },
    alpha: { start: 0.3, end: 0 },
    frequency: 420,
    tint: 0xb8b0e8
  }).setDepth(DEPTH.carFx);

  let nextGlint = randomBetween(rnd, [2500, 5000]);
  let glintStart = -1;

  return {
    update(timeMs) {
      // Respiración: el torso y el brazo suben un píxel al inhalar; la cabeza los sigue un instante después
      const chest = -Math.round(breath(timeMs, BREATH.periodMs) * BREATH.torsoPx);
      const neck = -Math.round(breath(timeMs - BREATH.headLagMs, BREATH.periodMs) * BREATH.headPx);
      torso.setY(ay + chest);
      arm.setY(ay + chest);
      headLayer.setY(ay + neck);

      // Destello en la visera
      if (!reduceMotion) {
        if (glintStart < 0 && timeMs >= nextGlint) glintStart = timeMs;
        if (glintStart >= 0) {
          const p = (timeMs - glintStart) / 380;
          if (p >= 1) {
            glintStart = -1;
            nextGlint = timeMs + randomBetween(rnd, [3500, 7500]);
            glint.setAlpha(0);
          } else {
            glint.setPosition(ax + ADRIAN_VISOR.x + Math.round(p * (ADRIAN_VISOR.w - 2)), headLayer.y + ADRIAN_VISOR.y);
            glint.setAlpha(Math.sin(p * Math.PI));
          }
        }
      }

      // Luces del coche
      underglow.setAlpha(0.7 + 0.3 * Math.sin(timeMs / 800));
      beam.setAlpha(0.8 + 0.2 * Math.sin(timeMs / 1500));
      headGlow.setAlpha(0.85);
      tailGlow.setAlpha(0.7 + 0.3 * Math.sin(timeMs / 1100));
    }
  };
}

