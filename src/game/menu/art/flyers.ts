// Coches voladores y dirigible publicitario (arte PROVISIONAL dibujado por código; sin Phaser).
import { PAL } from '../../../data/menuPalette';
import { PixelCanvas, type Rgb } from '../../../core/pixelCanvas';

export const FLYER_W = 26;
export const FLYER_H = 10;

const OUT = 0x07030f;

/** Coche volador de perfil (mira a la derecha), con luz de cola y propulsor de neón. */
export function buildFlyingCar(body: Rgb, glow: Rgb): PixelCanvas {
  const c = new PixelCanvas(FLYER_W, FLYER_H);
  c.fillPolygon(
    [
      { x: 2, y: 7 },
      { x: 3, y: 4 },
      { x: 8, y: 3 },
      { x: 12, y: 1 },
      { x: 18, y: 1 },
      { x: 22, y: 4 },
      { x: 24, y: 6 },
      { x: 22, y: 8 },
      { x: 4, y: 8 }
    ],
    body
  );
  c.fillRect(11, 2, 7, 2, 0x0a1a46); // cabina
  c.line(11, 2, 17, 2, 0x6a8cff);
  c.fillRect(3, 6, 20, 1, glow, 0.9);
  c.fillRect(2, 5, 2, 2, PAL.red);
  c.fillRect(22, 5, 2, 2, 0xfff3b0);
  c.outline(OUT);
  c.fillRect(6, 9, 14, 1, glow, 0.55); // propulsor
  return c;
}

export const BLIMP_W = 70;
export const BLIMP_H = 26;
/** Pantalla LED del dirigible, dentro de su imagen. */
export const BLIMP_SCREEN = { x: 14, y: 6, w: 42, h: 11 } as const;

/** Dirigible: globo con paneles, góndola y aletas. La pantalla LED se pone aparte. */
export function buildBlimp(): PixelCanvas {
  const c = new PixelCanvas(BLIMP_W, BLIMP_H);
  c.fillEllipse(35, 11, 33, 10, 0x3a2a78);
  c.fillEllipse(35, 9, 31, 7, 0x55409a);
  c.fillEllipse(35, 16, 30, 4, 0x24184e);
  // Aletas de cola
  c.fillPolygon([{ x: 6, y: 9 }, { x: 0, y: 2 }, { x: 11, y: 7 }], 0x24184e);
  c.fillPolygon([{ x: 6, y: 13 }, { x: 0, y: 21 }, { x: 11, y: 15 }], 0x24184e);
  // Góndola y luces
  c.fillRect(28, 20, 14, 4, 0x1a1238);
  c.fillRect(30, 21, 10, 1, PAL.cyan, 0.8);
  c.fillRect(33, 18, 4, 2, 0x1a1238);
  c.fillRect(66, 10, 3, 2, PAL.red);
  c.outline(OUT);
  c.fillRect(BLIMP_SCREEN.x - 1, BLIMP_SCREEN.y - 1, BLIMP_SCREEN.w + 2, BLIMP_SCREEN.h + 2, 0x07030f);
  c.fillRect(BLIMP_SCREEN.x, BLIMP_SCREEN.y, BLIMP_SCREEN.w, BLIMP_SCREEN.h, 0x120826);
  return c;
}
