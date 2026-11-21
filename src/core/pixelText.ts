// Dibuja texto con la fuente de píxeles sobre un PixelCanvas (lógica pura, sin Phaser).
import { measureText, textPixels } from './pixelFont';
import { PixelCanvas, type Rgb } from './pixelCanvas';

export interface TextStyle {
  readonly color: Rgb;
  readonly scale?: number;
  /** Sombra de 1 píxel (en píxeles finales) hacia abajo y a la derecha. */
  readonly shadow?: Rgb;
}

/** Tamaño final en píxeles que ocupará el texto con ese estilo. */
export function textSize(text: string, scale = 1, shadow = false): { width: number; height: number } {
  const m = measureText(text);
  return { width: m.width * scale + (shadow ? 1 : 0), height: m.height * scale + (shadow ? 1 : 0) };
}

/** Escribe `text` con su esquina superior izquierda en (x, y). */
export function drawPixelText(canvas: PixelCanvas, text: string, x: number, y: number, style: TextStyle): void {
  const scale = style.scale ?? 1;
  const pixels = textPixels(text);
  if (style.shadow !== undefined) {
    for (const p of pixels) canvas.fillRect(x + p.x * scale + 1, y + p.y * scale + 1, scale, scale, style.shadow);
  }
  for (const p of pixels) canvas.fillRect(x + p.x * scale, y + p.y * scale, scale, scale, style.color);
}

/** Crea un lienzo del tamaño justo con el texto ya escrito. */
export function renderText(text: string, style: TextStyle): PixelCanvas {
  const size = textSize(text, style.scale ?? 1, style.shadow !== undefined);
  const canvas = new PixelCanvas(Math.max(1, size.width), Math.max(1, size.height));
  drawPixelText(canvas, text, 0, 0, style);
  return canvas;
}
