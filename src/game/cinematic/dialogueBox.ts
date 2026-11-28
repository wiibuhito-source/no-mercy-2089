import Phaser from 'phaser';
import { PixelCanvas } from '../../core/pixelCanvas';
import { drawPixelText, renderText } from '../../core/pixelText';
import { baselineOffset, revealWrapped, wrapText } from '../../core/cinematic/wrapText';
import { CINEMATIC } from '../../data/cinematic';
import { PAL } from '../../data/menuPalette';
import { ensureTexture } from '../menu/canvasTexture';
import { CIN_DEPTH } from './depth';
import { redrawTexture } from './textureUtil';

export interface DialogueBox {
  /** Prepara una frase nueva (todavía sin letras visibles). */
  setLine(text: string): void;
  /** Hace visibles las primeras `visible` letras. */
  reveal(visible: number): void;
  /** Nombre de quien habla, en su color (null = narra Adrián, sin nombre). */
  setSpeaker(name: string | null, color: number): void;
  /** Flechita parpadeante "pulsa para seguir". */
  setPrompt(on: boolean): void;
  clear(): void;
}

const KEY = 'cin-text';

export function createDialogueBox(scene: Phaser.Scene): DialogueBox {
  const t = CINEMATIC.text;
  const height = t.maxLines * t.lineHeight + 2;
  redrawTexture(scene, KEY, new PixelCanvas(t.width, height));
  scene.add.image(t.x, t.y, KEY).setOrigin(0, 0).setDepth(CIN_DEPTH.text);

  const promptKey = 'cin-prompt';
  if (!scene.textures.exists(promptKey)) redrawTexture(scene, promptKey, renderText('↓', { color: PAL.cyan, shadow: 0x05020d }));
  const prompt = scene.add.image(t.x + t.width - 8, t.y + height - 6, promptKey).setOrigin(0, 0).setDepth(CIN_DEPTH.prompt).setVisible(false);
  scene.tweens.add({ targets: prompt, alpha: 0.25, duration: 520, yoyo: true, repeat: -1 });

  let speaker: Phaser.GameObjects.Image | null = null;
  let lines: string[] = [];

  function paint(visible: number): void {
    const pc = new PixelCanvas(t.width, height);
    const partial = revealWrapped(lines, visible);
    partial.forEach((part, i) => {
      if (part === '') return;
      const dy = baselineOffset(lines[i] ?? part, part);
      drawPixelText(pc, part, 0, i * t.lineHeight + dy * t.scale, { color: t.color, scale: t.scale, shadow: t.shadow });
    });
    redrawTexture(scene, KEY, pc);
  }

  return {
    setLine(text) {
      lines = wrapText(text, t.width, t.scale);
      prompt.setVisible(false);
      paint(0);
    },
    reveal(visible) {
      paint(visible);
    },
    setSpeaker(name, color) {
      speaker?.destroy();
      speaker = null;
      if (name === null) return;
      const key = `cin-speaker-${name}-${color.toString(16)}`;
      ensureTexture(scene, key, () => renderText(name, { color, shadow: t.shadow }));
      speaker = scene.add.image(t.x, t.y - 12, key).setOrigin(0, 0).setDepth(CIN_DEPTH.text);
    },
    setPrompt(on) {
      prompt.setVisible(on);
    },
    clear() {
      speaker?.destroy();
      speaker = null;
      lines = [];
      prompt.setVisible(false);
      paint(0);
    }
  };
}
