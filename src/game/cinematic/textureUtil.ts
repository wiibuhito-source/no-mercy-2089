import Phaser from 'phaser';
import type { PixelCanvas } from '../../core/pixelCanvas';

/** Crea (o repinta) una textura de Phaser con el contenido del lienzo. Sirve para el texto que va apareciendo letra a letra. */
export function redrawTexture(scene: Phaser.Scene, key: string, pc: PixelCanvas): void {
  const tex = scene.textures.exists(key) ? (scene.textures.get(key) as Phaser.Textures.CanvasTexture) : scene.textures.createCanvas(key, pc.width, pc.height);
  if (!tex) return;
  const ctx = tex.getContext();
  ctx.clearRect(0, 0, tex.width, tex.height);
  const data = ctx.createImageData(pc.width, pc.height);
  data.data.set(pc.data);
  ctx.putImageData(data, 0, 0);
  tex.refresh();
}
