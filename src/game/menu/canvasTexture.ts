import Phaser from 'phaser';
import type { PixelCanvas } from '../../core/pixelCanvas';

const cache = new Map<string, unknown>();

/** Calcula algo pesado (un dibujo) una sola vez y lo recuerda entre pantallas. */
export function cached<T>(key: string, build: () => T): T {
  if (!cache.has(key)) cache.set(key, build());
  return cache.get(key) as T;
}

/** Convierte un PixelCanvas en textura de Phaser (si ya existe con ese nombre, no la repite). */
export function ensureTexture(scene: Phaser.Scene, key: string, build: () => PixelCanvas): void {
  if (scene.textures.exists(key)) return;
  const pc = build();
  const tex = scene.textures.createCanvas(key, pc.width, pc.height);
  if (!tex) return;
  const ctx = tex.getContext();
  const data = ctx.createImageData(pc.width, pc.height);
  data.data.set(pc.data);
  ctx.putImageData(data, 0, 0);
  tex.refresh();
}

/** Textura + imagen con la esquina superior izquierda en (x, y). */
export function addPixelImage(
  scene: Phaser.Scene,
  key: string,
  build: () => PixelCanvas,
  x: number,
  y: number,
  depth: number
): Phaser.GameObjects.Image {
  ensureTexture(scene, key, build);
  return scene.add.image(x, y, key).setOrigin(0, 0).setDepth(depth);
}
