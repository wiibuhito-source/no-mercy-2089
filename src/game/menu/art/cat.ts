// Gatito naranja con collar de neón, en cinco poses (arte PROVISIONAL dibujado por código; sin Phaser).
// Mira a la derecha; para mirar a la izquierda se vuelca la imagen. Los pies quedan en (CAT_FEET.x, CAT_FEET.y).
import { PixelCanvas } from '../../../core/pixelCanvas';

export const CAT_W = 24;
export const CAT_H = 18;
export const CAT_FEET = { x: 12, y: 17 } as const;
export type CatFrameName = 'sit' | 'sitFlick' | 'crouch' | 'leap' | 'land';
export const CAT_FRAME_NAMES: readonly CatFrameName[] = ['sit', 'sitFlick', 'crouch', 'leap', 'land'];

const OUT = 0x1c0d12;
const FUR = 0xf08a3c;
const FUR_LIGHT = 0xffb86b;
const FUR_DARK = 0xb94d1c;
const CREAM = 0xffe6c4;
const EYE = 0xd8ff5a;
const COLLAR = 0x19f3ff;
const NOSE = 0xff8aa8;

function ear(c: PixelCanvas, x: number, y: number, dir: 1 | -1): void {
  c.fillPolygon(
    [
      { x, y: y + 3 },
      { x: x + 1 * dir, y },
      { x: x + 3.4 * dir, y: y + 2.6 }
    ],
    FUR
  );
}

function head(c: PixelCanvas, hx: number, hy: number, tilt = 0): void {
  c.fillCircle(hx, hy, 3.4, FUR);
  ear(c, hx - 2.8, hy - 5.6 + tilt, 1);
  ear(c, hx + 0.6, hy - 5.8 + tilt, 1);
  c.fillRect(hx + 1, hy, 3, 2, CREAM); // hocico
  c.putPixel(hx + 3, hy, NOSE, 1);
  c.putPixel(hx + 1, hy - 1, EYE, 1); // ojo
  c.putPixel(hx - 1, hy - 3, FUR_DARK, 1); // rayas de la frente
  c.putPixel(hx, hy - 3, FUR_DARK, 1);
  c.line(hx - 2, hy + 3, hx + 2, hy + 3, COLLAR); // collar
  c.putPixel(hx + 1, hy + 4, 0xff2bd6, 1);
}

function stripes(c: PixelCanvas, pts: readonly (readonly [number, number, number, number])[]): void {
  for (const [x0, y0, x1, y1] of pts) c.line(x0, y0, x1, y1, FUR_DARK);
}

function drawSit(c: PixelCanvas, flick: boolean): void {
  // Cola
  if (flick) {
    c.thickLine(5, 15, 3, 12, 0.9, FUR);
    c.thickLine(3, 12, 4, 7, 0.9, FUR);
    c.putPixel(4, 7, FUR_DARK, 1);
    c.putPixel(3, 9, FUR_DARK, 1);
  } else {
    c.thickLine(5, 16, 9, 17, 0.9, FUR);
    c.thickLine(9, 17, 15, 16.5, 0.9, FUR);
    c.putPixel(14, 16, FUR_DARK, 1);
    c.putPixel(11, 16, FUR_DARK, 1);
  }
  c.fillEllipse(8.5, 12.5, 4.6, 4.4, FUR); // anca
  c.fillEllipse(11.5, 10, 3.3, 5.6, FUR); // pecho y lomo
  c.fillEllipse(12.8, 11, 1.5, 3.6, CREAM);
  c.fillRect(11, 13, 3, 4, FUR_LIGHT); // patas delanteras
  c.fillRect(12, 14, 2, 3, CREAM);
  c.fillRect(6, 16, 6, 1, FUR_DARK, 0.0);
  stripes(c, [[6, 9, 9, 11], [6, 12, 8, 14]]);
  head(c, 13, 5.2);
  c.outline(OUT);
}

function drawCrouch(c: PixelCanvas): void {
  c.thickLine(4, 14, 1, 11, 0.9, FUR);
  c.fillEllipse(9, 13.5, 6.4, 3.2, FUR); // cuerpo agazapado
  c.fillEllipse(6, 12, 3.4, 3.2, FUR); // cuartos traseros en alto
  c.fillRect(13, 14, 4, 3, FUR_LIGHT);
  stripes(c, [[5, 10, 8, 12], [9, 11, 11, 13]]);
  c.fillCircle(16.5, 11.5, 3.1, FUR);
  ear(c, 14.4, 6.6, 1);
  ear(c, 17.2, 6.4, 1);
  c.fillRect(17.5, 12, 3, 2, CREAM);
  c.putPixel(19, 12, NOSE, 1);
  c.putPixel(17.5, 10.5, EYE, 1);
  c.line(14, 14, 18, 14.5, COLLAR);
  c.outline(OUT);
}

function drawLeap(c: PixelCanvas): void {
  c.thickLine(2, 6, 7, 8, 0.9, FUR); // cola hacia atrás
  c.fillPolygon(
    [
      { x: 6, y: 8 },
      { x: 17, y: 6 },
      { x: 19, y: 9 },
      { x: 8, y: 12 }
    ],
    FUR
  );
  c.thickLine(7, 10, 2, 14, 1.1, FUR); // patas traseras estiradas
  c.thickLine(17, 9, 22, 12, 1.1, FUR_LIGHT); // delanteras
  c.fillRect(21, 11, 2, 2, CREAM);
  stripes(c, [[8, 8, 10, 10], [12, 7, 13, 9]]);
  c.fillCircle(18.6, 6, 3, FUR);
  ear(c, 16.6, 1.4, 1);
  ear(c, 19.4, 1.2, 1);
  c.fillRect(20.5, 6.5, 3, 2, CREAM);
  c.putPixel(21, 5, EYE, 1);
  c.line(16, 8.5, 19, 9, COLLAR);
  c.outline(OUT);
}

function drawLand(c: PixelCanvas): void {
  c.thickLine(4, 14, 1, 13, 0.9, FUR);
  c.fillEllipse(9.5, 13.6, 6.8, 3.1, FUR);
  c.fillEllipse(6, 13, 3.2, 3.2, FUR);
  c.fillRect(13, 14, 4, 3, FUR_LIGHT);
  stripes(c, [[5, 11, 8, 13], [9, 11, 12, 13]]);
  c.fillCircle(16.4, 10.4, 3.2, FUR);
  ear(c, 14.2, 5.4, 1);
  ear(c, 17, 5.2, 1);
  c.fillRect(17.5, 11, 3, 2, CREAM);
  c.putPixel(19, 11, NOSE, 1);
  c.putPixel(17.5, 9.5, EYE, 1);
  c.line(14, 13, 18, 13.5, COLLAR);
  c.outline(OUT);
}

/** Dibuja una de las poses del gato. */
export function buildCatFrame(name: CatFrameName): PixelCanvas {
  const c = new PixelCanvas(CAT_W, CAT_H);
  if (name === 'sit') drawSit(c, false);
  else if (name === 'sitFlick') drawSit(c, true);
  else if (name === 'crouch') drawCrouch(c);
  else if (name === 'leap') drawLeap(c);
  else drawLand(c);
  return c;
}
