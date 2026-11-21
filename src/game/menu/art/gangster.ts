// Pandillero sentado en el borde de la azotea, con las rodillas arriba, fumando (arte PROVISIONAL dibujado por código; sin Phaser).
// Mira a la izquierda (hacia la ciudad). Sus pies quedan en la fila GANGSTER_SEAT.y, apoyados en el borde.
import { PAL } from '../../../data/menuPalette';
import { PixelCanvas } from '../../../core/pixelCanvas';

export const GANGSTER_W = 28;
export const GANGSTER_H = 30;
/** Cadera: x es el centro del asiento e y la fila justo bajo la que está el suelo. */
export const GANGSTER_SEAT = { x: 17, y: 30 } as const;
/** Punta del cigarro (para la brasa y el humo). */
export const GANGSTER_EMBER = { x: 3, y: 10 } as const;
/** Ojo con implante (para el destello). */
export const GANGSTER_EYE = { x: 8, y: 7 } as const;

const OUT = 0x07030f;
const HOOD = 0x2e1c62;
const HOOD_LIGHT = 0x6a46c8;
const HOOD_DARK = 0x1a0f3c;
const PANTS = 0x1b1636;
const PANTS_LIGHT = 0x38306a;

export interface GangsterLayers {
  readonly body: PixelCanvas;
  /** Capa con el ojo del implante (se anima aparte). */
  readonly eye: PixelCanvas;
}

export function buildGangster(): GangsterLayers {
  const c = new PixelCanvas(GANGSTER_W, GANGSTER_H);
  // Piernas: muslo hacia arriba y a la izquierda, espinilla de vuelta al suelo
  c.thickLine(19, 25, 11, 17, 3, PANTS);
  c.thickLine(11, 17, 7, 26, 2.6, PANTS);
  c.line(18, 22, 12, 16, PANTS_LIGHT);
  c.line(10, 19, 7, 25, PANTS_LIGHT);
  c.fillRect(2, 26, 9, 3, 0x0d0a1a); // zapatilla
  c.fillRect(2, 28, 9, 1, PAL.magenta);
  c.fillRect(2, 26, 3, 1, 0x5a54a0);
  // Torso encorvado con sudadera
  c.thickLine(20, 11, 20, 25, 5.4, HOOD);
  c.thickLine(23, 13, 23, 24, 2.2, HOOD_DARK);
  c.line(17, 13, 17, 23, HOOD_LIGHT);
  c.line(17, 12, 19, 10, HOOD_LIGHT);
  c.fillRect(15, 22, 6, 3, HOOD_DARK); // bolsillo
  // Brazo apoyado en la rodilla con la mano colgando
  c.thickLine(16, 14, 14, 20, 2.3, HOOD);
  c.thickLine(14, 20, 10, 18, 1.9, HOOD);
  c.fillRect(8, 16, 3, 3, PAL.skinShade); // mano con guante sin dedos
  c.fillRect(13, 18, 3, 1, PAL.magenta); // ribete de la manga
  // Capucha y cabeza en sombra
  c.fillEllipse(16, 6, 6.2, 6.2, HOOD);
  c.fillEllipse(9.5, 7, 3.2, 3.6, 0x0c0714);
  c.line(11, 1, 18, 1, HOOD_LIGHT);
  c.line(19, 2, 21, 5, HOOD_LIGHT, 0.9);
  c.fillRect(8, 9, 3, 2, PAL.skinShade); // mentón
  // Cigarro
  c.fillRect(3, 10, 4, 1, 0xf2eef8);
  c.putPixel(3, 10, PAL.orange, 1);
  c.outline(OUT);
  const eye = new PixelCanvas(GANGSTER_W, GANGSTER_H);
  eye.fillRect(GANGSTER_EYE.x, GANGSTER_EYE.y, 2, 1, PAL.magenta);
  eye.putPixel(GANGSTER_EYE.x, GANGSTER_EYE.y, PAL.blush, 1);
  return { body: c, eye };
}
