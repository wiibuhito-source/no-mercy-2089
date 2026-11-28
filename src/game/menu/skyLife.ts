import Phaser from 'phaser';
import { createRng } from '../../core/rng';
import { randomBetween } from '../../core/menu/motion';
import { BASE_WIDTH } from '../../core/version';
import { AMBIENCE } from '../../data/menuScene';
import { buildCloud, twinkleStars } from './art/sky';
import { buildShootingStar } from './art/weather';
import { DEPTH, type Animated } from './animated';
import { ensureTexture } from './canvasTexture';

interface Cloud {
  readonly image: Phaser.GameObjects.Image;
  readonly speed: number;
}

/** Estrellas que titilan, nubes que pasan despacio y, de vez en cuando, una estrella fugaz. */
export function createSkyLife(scene: Phaser.Scene, reduceMotion: boolean): Animated {
  const rnd = createRng(515);

  for (const star of twinkleStars(AMBIENCE.starTwinkles, BASE_WIDTH, 100)) {
    const dot = scene.add.rectangle(star.x, star.y, 1, 1, star.color, 1).setOrigin(0, 0).setDepth(DEPTH.stars);
    if (reduceMotion) {
      dot.setAlpha(0.7);
      continue;
    }
    dot.setAlpha(0.15);
    scene.tweens.add({
      targets: dot,
      alpha: 1,
      duration: 700 + rnd() * 1600,
      yoyo: true,
      repeat: -1,
      delay: rnd() * 2000,
      ease: 'Sine.easeInOut'
    });
  }

  const clouds: Cloud[] = [];
  [
    { y: 46, w: 110, h: 9, seed: 5, speed: 3.2, x: 40 },
    { y: 70, w: 80, h: 7, seed: 9, speed: 2.1, x: 300 },
    { y: 28, w: 96, h: 8, seed: 12, speed: 1.5, x: 210 }
  ].forEach((spec) => {
    const key = `nm-cloud-${spec.seed}`;
    ensureTexture(scene, key, () => buildCloud(spec.w, spec.h, spec.seed));
    const image = scene.add.image(spec.x, spec.y, key).setOrigin(0, 0).setDepth(DEPTH.clouds).setAlpha(0.8);
    clouds.push({ image, speed: reduceMotion ? 0 : spec.speed });
  });

  // Estrella fugaz (rara)
  ensureTexture(scene, 'nm-shooting-star', () => buildShootingStar());
  const streak = scene.add.image(0, 0, 'nm-shooting-star').setOrigin(1, 0.5).setDepth(DEPTH.stars).setAlpha(0).setBlendMode(Phaser.BlendModes.ADD);
  let nextStar = randomBetween(rnd, [9000, 16000]);
  let starStart = -1;

  return {
    update(timeMs, deltaMs) {
      const dt = deltaMs / 1000;
      for (const cloud of clouds) {
        cloud.image.x -= cloud.speed * dt;
        if (cloud.image.x < -cloud.image.width) cloud.image.x = BASE_WIDTH + 10;
      }
      if (reduceMotion) return;
      if (starStart < 0 && timeMs >= nextStar) {
        starStart = timeMs;
        streak.setPosition(60 + rnd() * 120, 8 + rnd() * 30);
      }
      if (starStart >= 0) {
        const p = (timeMs - starStart) / 520;
        if (p >= 1) {
          starStart = -1;
          streak.setAlpha(0);
          nextStar = timeMs + randomBetween(rnd, [12000, 24000]);
        } else {
          streak.setAlpha(Math.sin(p * Math.PI));
          streak.x += 150 * dt;
          streak.y += 52 * dt;
        }
      }
    }
  };
}
