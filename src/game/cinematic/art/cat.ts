// Un gato naranja atigrado dormido, dibujado por código con pelaje, sombreado y animación (respira, mueve la cola,
// le tiembla una oreja y a veces entreabre un ojo). Arte PROVISIONAL.
import { PixelCanvas, type Rgb } from '../../../core/pixelCanvas';
import { createRng } from '../../../core/rng';
import { OUTLINE } from './characters';

export const CAT_W = 48;
export const CAT_H = 28;

const FUR = 0xe58a3a;
const FUR_DARK = 0xa5521c;
const FUR_LIGHT = 0xf7c58a;
const PINK = 0xff8aa0;

interface CatPose {
  /** 0 = espira, 1 = inspira (el cuerpo sube un píxel). */
  readonly breath: 0 | 1;
  /** 0 = cola enroscada, 1 = punta levantada, 2 = coletazo. */
  readonly tail: 0 | 1 | 2;
  readonly earTwitch: boolean;
  /** 0 = cerrado, 1 = entreabierto. */
  readonly eye: 0 | 1;
}

function mul(c: Rgb, k: number): Rgb {
  const m = (v: number): number => Math.min(255, Math.max(0, Math.round(v * k)));
  return (m((c >> 16) & 255) << 16) | (m((c >> 8) & 255) << 8) | m(c & 255);
}

function renderCat(p: CatPose): PixelCanvas {
  const c = new PixelCanvas(CAT_W, CAT_H);
  const rnd = createRng(7);
  const b = p.breath;
  // --- Cuerpo y anca
  c.fillEllipse(17, 15 - b * 0.5, 14, 7 + b * 0.8, FUR);
  c.fillEllipse(10, 16, 9, 8, mul(FUR, 0.96));
  c.fillEllipse(17, 20, 13, 3, FUR_LIGHT); // vientre claro
  // rayas de tigre
  for (let k = 0; k < 6; k++) {
    const x = 5 + k * 3.6;
    c.thickLine(x, 8 - b * 0.5, x + 1.5, 15, 0.9, FUR_DARK, 0.95);
  }
  c.thickLine(7, 13, 16, 12.5, 0.8, FUR_DARK, 0.7);
  // pata trasera recogida y patas delanteras bajo el pecho
  c.fillEllipse(13, 21, 5, 2.4, FUR_LIGHT);
  c.fillEllipse(26, 22, 5.5, 2.4, FUR_LIGHT);
  for (const x of [24, 26, 28]) c.fillRect(x, 23, 1, 2, FUR_DARK, 0.7);
  // pelusa del pecho y línea del cuello (separa la cabeza del cuerpo)
  c.fillEllipse(25, 17, 3, 4, FUR_LIGHT);
  c.line(26, 8, 24.5, 19, FUR_DARK, 0.55);

  // --- Cabeza apoyada sobre las patas
  const hx = 32;
  const hy = 15;
  c.fillEllipse(hx, hy, 7.4, 6, FUR);
  c.fillEllipse(hx + 2, hy + 2.5, 5, 2.8, FUR_LIGHT); // hocico y mejillas claras
  // orejas
  const eo = p.earTwitch ? 1.6 : 0;
  c.fillPolygon([{ x: hx - 5, y: hy - 3 }, { x: hx - 4 - eo, y: hy - 9 - eo }, { x: hx - 0.5, y: hy - 5 }], FUR);
  c.fillPolygon([{ x: hx + 0.5, y: hy - 5 }, { x: hx + 3 + eo, y: hy - 9.5 - eo }, { x: hx + 5.5, y: hy - 3 }], FUR);
  c.fillPolygon([{ x: hx - 3.6, y: hy - 4.4 }, { x: hx - 3.2 - eo * 0.8, y: hy - 7.5 - eo }, { x: hx - 1.3, y: hy - 5 }], PINK);
  c.fillPolygon([{ x: hx + 1.6, y: hy - 5 }, { x: hx + 3 + eo * 0.8, y: hy - 7.8 - eo }, { x: hx + 4.4, y: hy - 4 }], PINK);
  // rayas de la frente
  for (const dx of [-2, 0, 2]) c.fillRect(hx + dx, hy - 5, 1, 2, FUR_DARK);
  c.fillRect(hx - 5, hy - 1, 3, 1, FUR_DARK, 0.8); // raya de la mejilla
  // ojo cerrado (o entreabierto), nariz, boca, bigotes
  if (p.eye === 0) {
    c.fillRect(hx + 2, hy - 0.5, 3, 1, 0x2a140a);
    c.setPixel(hx + 1.5, hy - 1, 0x2a140a, 0.7);
  } else {
    c.fillRect(hx + 2, hy - 0.5, 3, 1, 0x2a140a);
    c.fillRect(hx + 3, hy - 0.5, 1, 1, 0xc8e86a);
  }
  c.fillRect(hx + 6, hy + 1.5, 2, 1.5, PINK);
  c.putPixel(hx + 6, hy + 3, 0x7a3a1a, 1);
  for (const dy of [0, 1.5, 3]) c.line(hx + 7, hy + 2.5, hx + 11, hy + 1.5 + dy, 0xe8d8c8, 0.4);

  // --- Cola: sale del anca, bordea la barriga y se enrosca por delante; la punta se mueve
  const tipY = p.tail === 0 ? 25 : p.tail === 1 ? 22 : 18;
  const tipX = p.tail === 2 ? 38 : 36;
  c.thickLine(3, 17, 1.5, 23, 2.3, FUR);
  c.thickLine(1.5, 23, 8, 26, 2.3, FUR);
  c.thickLine(8, 26, 22, 26.5, 2.2, FUR);
  c.thickLine(22, 26.5, tipX - 3, tipY + 0.5, 2, FUR);
  c.thickLine(tipX - 3, tipY + 0.5, tipX, tipY, 1.9, FUR_DARK);
  for (const x of [6, 11, 16, 21]) c.fillRect(x, 25, 1, 3, FUR_DARK);

  // --- Textura de pelaje: motitas más claras y oscuras
  for (let i = 0; i < 90; i++) {
    const x = Math.floor(rnd() * CAT_W);
    const y = Math.floor(rnd() * CAT_H);
    if (c.alphaAt(x, y) > 0.5) c.putPixel(x, y, mul(c.colorAt(x, y), rnd() < 0.5 ? 1.12 : 0.88), 1);
  }
  // --- Luz arriba, sombra abajo, y contorno
  const mask: boolean[] = [];
  for (let y = 0; y < CAT_H; y++) for (let x = 0; x < CAT_W; x++) mask.push(c.alphaAt(x, y) > 0.5);
  const at = (x: number, y: number): boolean => x >= 0 && y >= 0 && x < CAT_W && y < CAT_H && (mask[y * CAT_W + x] ?? false);
  for (let y = 0; y < CAT_H; y++) {
    for (let x = 0; x < CAT_W; x++) {
      if (!at(x, y)) continue;
      const col = c.colorAt(x, y);
      if (!at(x, y - 1)) c.putPixel(x, y, mul(col, 1.22), 1);
      else if (!at(x, y + 1)) c.putPixel(x, y, mul(col, 0.7), 1);
    }
  }
  c.outline(OUTLINE);
  return c;
}

/** Ocho fotogramas de un ciclo de ~3 s: respiración, coletazo, oreja que tiembla y ojo que se entreabre. */
export function buildCatFrames(): PixelCanvas[] {
  const poses: CatPose[] = [
    { breath: 0, tail: 0, earTwitch: false, eye: 0 },
    { breath: 1, tail: 0, earTwitch: false, eye: 0 },
    { breath: 0, tail: 1, earTwitch: false, eye: 0 },
    { breath: 1, tail: 2, earTwitch: false, eye: 0 },
    { breath: 0, tail: 2, earTwitch: false, eye: 0 },
    { breath: 1, tail: 0, earTwitch: true, eye: 0 },
    { breath: 0, tail: 0, earTwitch: false, eye: 1 },
    { breath: 1, tail: 1, earTwitch: false, eye: 0 }
  ];
  return poses.map(renderCat);
}
