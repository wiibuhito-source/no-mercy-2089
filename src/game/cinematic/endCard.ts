import Phaser from 'phaser';
import { renderText } from '../../core/pixelText';
import { BASE_HEIGHT, BASE_WIDTH } from '../../core/version';
import { CINEMATIC } from '../../data/cinematic';
import { PAL } from '../../data/menuPalette';
import { ensureTexture } from '../menu/canvasTexture';
import { CIN_DEPTH } from './depth';

/** Pantalla negra con el lema, tras la última escena. Llama a `done` cuando ha pasado su tiempo. */
export function showEndCard(scene: Phaser.Scene, done: () => void): void {
  const card = CINEMATIC.endCard;
  const black = scene.add.rectangle(0, 0, BASE_WIDTH, BASE_HEIGHT, 0x05020d).setOrigin(0, 0).setDepth(CIN_DEPTH.endCard).setAlpha(0);
  scene.tweens.add({ targets: black, alpha: 1, duration: 450 });
  ensureTexture(scene, 'cin-end-title', () => renderText(card.text, { color: PAL.magenta, scale: card.scale, shadow: PAL.cyan }));
  const title = scene.add.image(BASE_WIDTH / 2, BASE_HEIGHT / 2, 'cin-end-title').setDepth(CIN_DEPTH.endCard + 1).setAlpha(0);
  scene.time.delayedCall(450, () => {
    scene.tweens.add({ targets: title, alpha: 1, duration: card.fadeInMs });
  });
  scene.time.delayedCall(450 + card.fadeInMs + card.holdMs, done);
}
