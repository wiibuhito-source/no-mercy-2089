import Phaser from 'phaser';
import { renderText } from '../../core/pixelText';
import { CINEMATIC } from '../../data/cinematic';
import { PAL } from '../../data/menuPalette';
import { ensureTexture } from '../menu/canvasTexture';
import { CIN_DEPTH } from './depth';

export interface SkipHold {
  update(deltaMs: number): void;
}

/** Mantener ESC un rato salta la cinemática entera. Una pulsación suelta no hace nada (evita saltarla sin querer). */
export function createSkipHold(scene: Phaser.Scene, onSkip: () => void): SkipHold {
  const key = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  ensureTexture(scene, 'cin-skip-hint', () => renderText('MANTÉN ESC PARA SALTAR', { color: 0x9a92e0, shadow: 0x05020d }));
  const y = CINEMATIC.text.y + CINEMATIC.text.maxLines * CINEMATIC.text.lineHeight + 8;
  scene.add.image(CINEMATIC.text.x, y, 'cin-skip-hint').setOrigin(0, 0).setDepth(CIN_DEPTH.hint).setAlpha(0.7);
  const bar = scene.add.rectangle(CINEMATIC.text.x, y + 11, 0, 2, PAL.cyan).setOrigin(0, 0).setDepth(CIN_DEPTH.hint);
  let held = 0;
  let fired = false;
  return {
    update(deltaMs) {
      if (fired) return;
      held = key?.isDown ? held + deltaMs : 0;
      bar.width = Math.min(1, held / CINEMATIC.skipHoldMs) * 120;
      if (held >= CINEMATIC.skipHoldMs) {
        fired = true;
        onSkip();
      }
    }
  };
}
