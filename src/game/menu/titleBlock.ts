import Phaser from 'phaser';
import { BASE_WIDTH } from '../../core/version';
import { PAL } from '../../data/menuPalette';
import { TITLE } from '../../data/menuScene';
import { PixelCanvas } from '../../core/pixelCanvas';
import { drawPixelText, textSize } from '../../core/pixelText';
import { randomBetween } from '../../core/menu/motion';
import { createRng } from '../../core/rng';
import { buildShineFrames } from './art/shine';
import { buildTitle } from './art/title';
import { DEPTH, type Animated } from './animated';
import { cached, ensureTexture } from './canvasTexture';

const SHINE_FRAMES = 22;
const TAGLINE = 'MIAMI NO PERDONA.';

function buildTagline(): PixelCanvas {
  const tw = textSize(TAGLINE).width;
  const c = new PixelCanvas(tw + 2, 9);
  drawPixelText(c, TAGLINE, 1, 1, { color: PAL.cyan, shadow: 0x0a0518 });
  return c;
}

/** Título con brillo cromado que lo recorre, resplandor rosa que respira, entrada con caída y un "glitch" ocasional. */
export function createTitleBlock(scene: Phaser.Scene, reduceMotion: boolean): Animated {
  const rnd = createRng(2089);
  const art = cached('title', buildTitle);
  ensureTexture(scene, 'nm-title', () => art.canvas);
  ensureTexture(scene, 'nm-title-glow', () => art.glow);
  const shine = cached('title-shine', () => buildShineFrames(art.canvas, SHINE_FRAMES, 30, 0.6, 0.85));
  shine.forEach((frame, i) => ensureTexture(scene, `nm-title-shine-${i}`, () => frame));
  ensureTexture(scene, 'nm-tagline', buildTagline);

  const baseX = Math.round((BASE_WIDTH - art.canvas.width) / 2);
  const baseY = TITLE.y;
  const add = Phaser.BlendModes.ADD;
  const glow = scene.add.image(baseX - art.glowPad, baseY - art.glowPad, 'nm-title-glow').setOrigin(0, 0).setDepth(DEPTH.title - 1).setBlendMode(add);
  const title = scene.add.image(baseX, baseY, 'nm-title').setOrigin(0, 0).setDepth(DEPTH.title);
  const sheen = scene.add.image(baseX, baseY, 'nm-title-shine-0').setOrigin(0, 0).setDepth(DEPTH.title + 0.1).setBlendMode(add).setVisible(false);

  // Barras de neón a los lados del 2089 y lema debajo
  const barY = baseY + art.subLine.y;
  const barL = scene.add.rectangle(baseX + 16, barY, art.subLine.leftEnd - 16, 3, PAL.cyan, 1).setOrigin(0, 0.5).setDepth(DEPTH.title);
  const barR = scene.add
    .rectangle(baseX + art.subLine.rightStart, barY, art.canvas.width - art.subLine.rightStart - 16, 3, PAL.magenta, 1)
    .setOrigin(0, 0.5)
    .setDepth(DEPTH.title);
  const tagY = baseY + art.canvas.height - 14;
  const tagline = scene.add.image(Math.round(BASE_WIDTH / 2), tagY, 'nm-tagline').setOrigin(0.5, 0).setDepth(DEPTH.title).setAlpha(0);

  // Entrada: el título cae y el lema aparece después
  const intro = { value: reduceMotion ? 1 : 0 };
  if (!reduceMotion) {
    scene.tweens.add({ targets: intro, value: 1, duration: 750, ease: 'Cubic.easeOut' });
    scene.tweens.add({ targets: tagline, alpha: 1, duration: 500, delay: 800 });
  } else tagline.setAlpha(1);

  let nextShine = 2200;
  let shineStart = -1;
  let nextGlitch = randomBetween(rnd, [6000, 11000]);
  let glitchUntil = 0;

  const parts: (Phaser.GameObjects.Image | Phaser.GameObjects.Rectangle)[] = [glow, title, sheen, barL, barR];
  const homeY = parts.map((p) => p.y);
  const homeX = parts.map((p) => p.x);

  return {
    update(timeMs) {
      const drop = -Math.round((1 - intro.value) * 70);
      const float = reduceMotion ? 0 : Math.round(Math.sin(timeMs / 1100));
      let jitter = 0;
      if (!reduceMotion) {
        if (timeMs >= nextGlitch) {
          glitchUntil = timeMs + 190;
          nextGlitch = timeMs + randomBetween(rnd, [7000, 12000]);
        }
        if (timeMs < glitchUntil) {
          jitter = Math.floor(timeMs / 38) % 2 === 0 ? -2 : 2;
          title.setAlpha(0.7 + 0.3 * (Math.floor(timeMs / 30) % 2));
        } else title.setAlpha(1);
      }
      parts.forEach((p, i) => p.setPosition((homeX[i] ?? 0) + jitter, (homeY[i] ?? 0) + drop + float));
      glow.setAlpha(0.8 + 0.2 * Math.sin(timeMs / 900));

      // Brillo que recorre las letras
      if (!reduceMotion) {
        if (shineStart < 0 && timeMs >= nextShine && intro.value >= 1) shineStart = timeMs;
        if (shineStart >= 0) {
          const p = (timeMs - shineStart) / 760;
          if (p >= 1) {
            shineStart = -1;
            nextShine = timeMs + 4200;
            sheen.setVisible(false);
          } else {
            sheen.setVisible(true).setTexture(`nm-title-shine-${Math.min(SHINE_FRAMES - 1, Math.floor(p * SHINE_FRAMES))}`);
          }
        }
      }
      tagline.setY(tagY + float);
    }
  };
}
