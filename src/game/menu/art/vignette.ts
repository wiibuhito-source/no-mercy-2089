// Viñeta: oscurece los bordes de la pantalla en escalones (arte PROVISIONAL; sin Phaser).
import { bayer, PixelCanvas } from '../../../core/pixelCanvas';

export function buildVignette(width: number, height: number): PixelCanvas {
  const c = new PixelCanvas(width, height);
  const cx = width / 2;
  const cy = height / 2;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const nx = (x - cx) / cx;
      const ny = (y - cy) / cy;
      const d = Math.sqrt(nx * nx * 0.85 + ny * ny * 1.15);
      const k = Math.max(0, (d - 0.62) / 0.55); // 0 en el centro, 1 en las esquinas
      const level = Math.min(5, Math.floor(k * 5 + (bayer(x, y) - 0.5) * 0.9)); // escalones con tramado
      if (level > 0) c.putPixel(x, y, 0x05020d, (level / 5) * 0.48);
    }
  }
  return c;
}
