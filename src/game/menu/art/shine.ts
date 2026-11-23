// Destello que recorre un dibujo en diagonal (arte PROVISIONAL; sin Phaser).
// Se calcula como una serie de imágenes translúcidas que se superponen con mezcla aditiva.
import { PixelCanvas } from '../../../core/pixelCanvas';

/** `frames` imágenes del mismo tamaño que `base`: sólo tienen píxeles blancos donde pasa el destello sobre `base`. */
export function buildShineFrames(base: PixelCanvas, frames: number, bandWidth: number, slope = 0.6, peak = 0.75): PixelCanvas[] {
  const span = base.width + base.height * slope + bandWidth * 2;
  const out: PixelCanvas[] = [];
  for (let f = 0; f < frames; f++) {
    const center = -bandWidth + (span * f) / Math.max(1, frames - 1);
    const c = new PixelCanvas(base.width, base.height);
    for (let y = 0; y < base.height; y++) {
      for (let x = 0; x < base.width; x++) {
        if (base.alphaAt(x, y) < 128) continue;
        const d = Math.abs(x + y * slope - center);
        if (d >= bandWidth / 2) continue;
        const level = Math.ceil((1 - d / (bandWidth / 2)) * 3) / 3; // 3 escalones
        c.setPixel(x, y, 0xffffff, level * peak);
      }
    }
    out.push(c);
  }
  return out;
}
