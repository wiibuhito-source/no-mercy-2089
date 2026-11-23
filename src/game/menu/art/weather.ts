// Lluvia, ondas en los charcos y pequeñas partículas (arte PROVISIONAL; sin Phaser).
import { createRng } from '../../../core/rng';
import { PixelCanvas, type Rgb } from '../../../core/pixelCanvas';

export const RAIN_TILE = 64;
export const RIPPLE_FRAMES = 3;

/** Baldosa de lluvia que se repite sin costuras: rayas inclinadas (cada una baja 1 columna por cada 4 filas). */
export function buildRainTile(seed: number, streaks: number, length: number, color: Rgb): PixelCanvas {
  const c = new PixelCanvas(RAIN_TILE, RAIN_TILE);
  const rnd = createRng(seed);
  for (let i = 0; i < streaks; i++) {
    const x0 = Math.floor(rnd() * RAIN_TILE);
    const y0 = Math.floor(rnd() * RAIN_TILE);
    for (let k = 0; k < length; k++) {
      const px = (((x0 - Math.floor(k / 4)) % RAIN_TILE) + RAIN_TILE) % RAIN_TILE;
      const py = (y0 + k) % RAIN_TILE;
      c.setPixel(px, py, color, 0.35 + (k / length) * 0.65);
    }
  }
  return c;
}

/** Anillo de una onda en un charco; `frame` 0..2 va de pequeño a grande y se desvanece. */
export function buildRipple(frame: number): PixelCanvas {
  const rx = 2 + frame * 3;
  const ry = 1 + frame;
  const c = new PixelCanvas(rx * 2 + 3, ry * 2 + 3);
  for (let a = 0; a < 48; a++) {
    const ang = (a / 48) * Math.PI * 2;
    c.setPixel(c.width / 2 + Math.cos(ang) * rx, c.height / 2 + Math.sin(ang) * ry, 0xcfd8ff, 0.8 - frame * 0.22);
  }
  return c;
}

/** Bolita de humo/vapor con borde suave (5x5). */
export function buildPuff(): PixelCanvas {
  const c = new PixelCanvas(6, 6);
  c.fillCircle(3, 3, 2.9, 0xffffff, 0.35);
  c.fillCircle(3, 3, 2.1, 0xffffff, 0.6);
  c.fillCircle(3, 3, 1.2, 0xffffff, 1);
  return c;
}

/** Un solo píxel blanco (chispas, brasas, polillas...). */
export function buildDot(): PixelCanvas {
  const c = new PixelCanvas(1, 1);
  c.setPixel(0, 0, 0xffffff, 1);
  return c;
}

/** Estela de una estrella fugaz, de la cola tenue a la cabeza brillante (apunta a la derecha). */
export function buildShootingStar(length = 14): PixelCanvas {
  const c = new PixelCanvas(length, 2);
  for (let x = 0; x < length; x++) {
    c.setPixel(x, 0, 0xffffff, Math.pow(x / length, 1.6));
    if (x > length * 0.5) c.setPixel(x, 1, 0x9afcff, ((x / length - 0.5) / 0.5) * 0.4);
  }
  return c;
}
