import Phaser from 'phaser';
import { createRng } from '../../core/rng';
import { randomBetween } from '../../core/menu/motion';
import type { NeonSign } from './art/neon';
import { DEPTH, type Animated } from './animated';
import { ensureTexture } from './canvasTexture';

/** Secuencia de un neón "averiado": apagado, encendido, apagado... (milisegundos de cada tramo). */
const FLICKER_MS: readonly number[] = [70, 50, 110, 40, 60];

/** Cartel de neón con resplandor que respira y un parpadeo de tubo averiado cada cierto tiempo. */
export function createNeonSign(
  scene: Phaser.Scene,
  key: string,
  art: NeonSign,
  x: number,
  y: number,
  seed: number,
  reduceMotion: boolean
): Animated {
  ensureTexture(scene, `${key}-on`, () => art.on);
  ensureTexture(scene, `${key}-off`, () => art.off);
  ensureTexture(scene, `${key}-glow`, () => art.glow);
  const sign = scene.add.image(x, y, `${key}-on`).setOrigin(0, 0).setDepth(DEPTH.signs);
  const glow = scene.add
    .image(x - art.glowPad, y - art.glowPad, `${key}-glow`)
    .setOrigin(0, 0)
    .setDepth(DEPTH.glows)
    .setBlendMode(Phaser.BlendModes.ADD);

  const rnd = createRng(seed);
  let lit = true;
  let phase = -1;
  let phaseEnd = 0;
  let next = randomBetween(rnd, [3000, 8000]);

  const setLit = (value: boolean): void => {
    lit = value;
    sign.setTexture(`${key}-${value ? 'on' : 'off'}`);
  };

  return {
    update(timeMs) {
      if (!reduceMotion) {
        if (phase < 0) {
          if (timeMs >= next) {
            phase = 0;
            phaseEnd = timeMs + (FLICKER_MS[0] ?? 60);
            setLit(false);
          }
        } else if (timeMs >= phaseEnd) {
          phase++;
          if (phase >= FLICKER_MS.length) {
            phase = -1;
            setLit(true);
            next = timeMs + randomBetween(rnd, [5000, 12000]);
          } else {
            setLit(phase % 2 === 1);
            phaseEnd = timeMs + (FLICKER_MS[phase] ?? 60);
          }
        }
      }
      glow.setAlpha(lit ? 0.75 + 0.25 * Math.sin(timeMs / 650 + seed) : 0.12);
    }
  };
}
