import Phaser from 'phaser';
import { resetIntroSeen } from '../core/cinematic/introSeen';
import { renderText } from '../core/pixelText';
import { BASE_WIDTH } from '../core/version';
import { introStore } from '../game/introStore';
import { ensureTexture } from '../game/menu/canvasTexture';

/**
 * Truco para probar: F4 en el menú hace que la cinemática vuelva a verse como si fuera la primera vez
 * (en el navegador también sirve añadir ?intro al final de la dirección).
 */
export function createIntroReset(scene: Phaser.Scene): void {
  const kb = scene.input.keyboard;
  kb?.addCapture('F4');
  ensureTexture(scene, 'nm-intro-reset', () => renderText('HISTORIA REINICIADA: AL DAR A JUGAR LA VERAS DE NUEVO', { color: 0xffe66d, shadow: 0x05020d }));
  const toast = scene.add.image(BASE_WIDTH / 2, 246, 'nm-intro-reset').setDepth(1001).setAlpha(0);
  const backing = scene.add.rectangle(BASE_WIDTH / 2, 246, toast.width + 10, toast.height + 6, 0x05020d, 0.92).setDepth(1000).setAlpha(0);
  kb?.on('keydown-F4', () => {
    resetIntroSeen(introStore);
    scene.tweens.killTweensOf([toast, backing]);
    toast.setAlpha(1);
    backing.setAlpha(1);
    scene.tweens.add({ targets: [toast, backing], alpha: 0, duration: 600, delay: 2200 });
  });
}
