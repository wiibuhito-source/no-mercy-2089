import Phaser from 'phaser';
import { PixelCanvas } from '../../core/pixelCanvas';
import { drawPixelText, textSize } from '../../core/pixelText';
import { PROTOTYPE_SHORT } from '../../core/version';
import { HINTS, PANEL } from '../../data/menuLayout';
import { buildKeycap } from './art/ui';
import { DEPTH } from './animated';
import { ensureTexture } from './canvasTexture';

function buildHints(): PixelCanvas {
  const parts: { key: PixelCanvas; label: string }[] = [
    { key: buildKeycap('↑'), label: '' },
    { key: buildKeycap('↓'), label: 'MOVER' },
    { key: buildKeycap('ENTER'), label: 'ELEGIR' }
  ];
  let width = 0;
  for (const p of parts) width += p.key.width + 2 + (p.label ? textSize(p.label).width + 8 : 0);
  const c = new PixelCanvas(width, 12);
  let x = 0;
  for (const p of parts) {
    c.blit(p.key, x, 0);
    x += p.key.width + 2;
    if (p.label) {
      drawPixelText(c, p.label, x + 1, 3, { color: 0x9a92e0, shadow: 0x05020d });
      x += textSize(p.label).width + 8;
    }
  }
  return c;
}

function buildVersion(): PixelCanvas {
  const c = new PixelCanvas(textSize(PROTOTYPE_SHORT).width + 1, 8);
  drawPixelText(c, PROTOTYPE_SHORT, 0, 0, { color: 0x7a72c0, shadow: 0x05020d });
  return c;
}

/** Ayuda de teclas bajo el panel y etiqueta de versión abajo a la izquierda. */
export function createFooterHints(scene: Phaser.Scene): void {
  ensureTexture(scene, 'nm-hints', buildHints);
  ensureTexture(scene, 'nm-version', buildVersion);
  const hints = scene.add.image(PANEL.x + PANEL.w, HINTS.y, 'nm-hints').setOrigin(1, 0).setDepth(DEPTH.hints).setAlpha(0);
  scene.add.image(6, 262, 'nm-version').setOrigin(0, 0).setDepth(DEPTH.hints);
  scene.tweens.add({ targets: hints, alpha: 1, duration: 500, delay: 900 });
}
