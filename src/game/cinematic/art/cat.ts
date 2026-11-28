// Un gato blanco dormido sobre el banco del taller, dibujado por código (arte PROVISIONAL, sin Phaser).
// Es pequeño (un gato de verdad frente a Adrián, que mide 68 px) y está vivo: respira con suavidad, mueve la cola,
// le tiembla una oreja, sacude los bigotes, encoge una pata, entreabre un ojo (azul claro, nunca amarillo ni con pupila
// rasgada) y de vez en cuando le sube una "z" del sueño.
import { PixelCanvas, type Rgb } from '../../../core/pixelCanvas';
import { createRng } from '../../../core/rng';
import { OUTLINE } from './characters';

/** Tamaño del fotograma: el gato ocupa las 20 filas de abajo; arriba queda hueco para las "z". */
export const CAT_W = 40;
export const CAT_H = 30;
/** Filas de hueco encima del gato (para las "z"). */
export const CAT_HEADROOM = 10;
/** Número de fotogramas del ciclo. */
export const CAT_FRAMES = 16;

const FUR = 0xf4f0fb;
const FUR_SHADE = 0xcfc8e6;
const FUR_DEEP = 0xa39bcc;
const PATCH = 0xc2bcdc;
const PINK = 0xffb0c4;
const NOSE = 0xff93ae;
const LID = 0x3b2f55;
const IRIS = 0x8fc7ff;
const ZZZ = 0xe6e0ff;

export interface CatPose {
  /** 0 = espira, 1 = a medias, 2 = inspira del todo (el lomo sube hasta un píxel). */
  readonly breath: 0 | 1 | 2;
  /** Posición de la punta de la cola: 0 = reposo, 1 = se levanta, 2 = coletazo alto, 3 = baja hacia fuera. */
  readonly tail: 0 | 1 | 2 | 3;
  /** 0 = quieta, 1 y 2 = la oreja tiembla (dos grados). */
  readonly ear: 0 | 1 | 2;
  /** 0 = ojo cerrado, 1 = entreabierto (se ve un poco de iris azul claro). */
  readonly eye: 0 | 1;
  /** Bigotes: 0 = quietos, 1 = suben, 2 = bajan. */
  readonly whisker: 0 | 1 | 2;
  /** La pata delantera encoge los dedos (se adelanta un píxel). */
  readonly paw: boolean;
  /** Avance de la "z" del sueño (0 a 1), o -1 si no se ve. */
  readonly z: number;
}

function mul(c: Rgb, k: number): Rgb {
  const m = (v: number): number => Math.min(255, Math.max(0, Math.round(v * k)));
  return (m((c >> 16) & 255) << 16) | (m((c >> 8) & 255) << 8) | m(c & 255);
}

/** Dibuja una "z" de 4x4 píxeles. */
function drawZ(c: PixelCanvas, x: number, y: number, alpha: number): void {
  c.fillRect(x, y, 4, 1, ZZZ, alpha);
  c.setPixel(x + 2, y + 1, ZZZ, alpha);
  c.setPixel(x + 1, y + 2, ZZZ, alpha);
  c.fillRect(x, y + 3, 4, 1, ZZZ, alpha);
}

export function renderCat(p: CatPose): PixelCanvas {
  const c = new PixelCanvas(CAT_W, CAT_H);
  const rnd = createRng(7);
  const oy = CAT_HEADROOM;
  const b = p.breath * 0.5;
  // Todo se dibuja en coordenadas del gato (0..19 de alto, el suelo en y=19) y se baja `oy` filas.
  const Y = (y: number): number => y + oy;

  // --- Cuerpo y anca
  c.fillEllipse(13, Y(12.2 - b * 0.5), 11.6, 6.1 + b * 0.55, FUR);
  c.fillEllipse(9.8, Y(13.8), 7.4, 5.5, FUR_SHADE); // sombra a la derecha del anca: la marca como pierna
  c.fillEllipse(8.6, Y(13.6), 7.4, 5.5, FUR);
  c.fillEllipse(14, Y(17.3), 10.5, 1.9, FUR_SHADE); // barriga en sombra
  c.fillEllipse(11.5, Y(8.6 - b * 0.5), 5, 2.4, PATCH, 0.85); // mancha gris en el lomo
  c.fillEllipse(6, Y(11), 2.6, 1.8, PATCH, 0.8); // mancha en la grupa
  c.fillEllipse(13.5, Y(18), 3.4, 1.2, FUR); // pata trasera asomando

  // --- Cola: sale de la grupa, bordea la barriga por delante y la punta se levanta y se mueve (se ve delante del cuerpo)
  const tips: ReadonlyArray<readonly [number, number]> = [[19.6, 18.7], [20.2, 16.6], [20.6, 14], [21.2, 16.2]];
  const [tx, ty] = tips[p.tail] ?? [19.6, 18.7];
  const path: ReadonlyArray<readonly [number, number]> = [[2.8, 13.5], [1.3, 17], [5, 18.9], [14, 19], [tx - 2.6, ty + 0.2]];
  for (let i = 0; i + 1 < path.length; i++) {
    const [ax, ay] = path[i] ?? [0, 0];
    const [bx, by] = path[i + 1] ?? [0, 0];
    c.thickLine(ax, Y(ay + 0.9), bx, Y(by + 0.9), 1.3, FUR_DEEP, 0.55); // sombra bajo la cola
  }
  for (let i = 0; i + 1 < path.length; i++) {
    const [ax, ay] = path[i] ?? [0, 0];
    const [bx, by] = path[i + 1] ?? [0, 0];
    c.thickLine(ax, Y(ay), bx, Y(by), 1.5, FUR);
  }
  c.thickLine(tx - 2.6, Y(ty + 0.2), tx, Y(ty), 1.45, PATCH); // la punta es gris suave

  // --- Patas delanteras bajo la barbilla
  const pawX = p.paw ? 1 : 0;
  c.fillEllipse(24.6 + pawX, Y(17.6), 3.4, 1.6, FUR);
  c.fillEllipse(27.6 + pawX, Y(17.9), 3.2, 1.5, FUR);
  for (const x of [26.5, 28.5, 30]) c.fillRect(x + pawX, Y(18), 1, 1.4, FUR_DEEP, 0.7);

  // --- Cabeza redonda apoyada sobre las patas
  const hx = 27;
  const hy = 12.2;
  c.fillEllipse(hx - 1.3, Y(hy + 0.4), 5.6, 4.8, FUR_SHADE); // sombra del cuello: separa la cabeza del cuerpo
  c.fillEllipse(hx, Y(hy), 5.6, 4.8, FUR);
  c.fillEllipse(hx + 1.5, Y(hy + 2.4), 4.2, 2.2, FUR); // mejillas llenas
  c.fillEllipse(hx - 1.8, Y(hy - 3.4), 3, 1.6, PATCH, 0.85); // mancha sobre la oreja trasera
  // orejas (la delantera y la trasera), con el interior rosa
  const e = p.ear;
  c.fillPolygon([{ x: hx - 5, y: Y(hy - 2.4) }, { x: hx - 4.6 - e * 0.5, y: Y(hy - 8.4 - e * 0.9) }, { x: hx - 0.8, y: Y(hy - 4.2) }], FUR);
  c.fillPolygon([{ x: hx + 1, y: Y(hy - 4.2) }, { x: hx + 3.9 + e * 0.6, y: Y(hy - 8.8 - e * 0.9) }, { x: hx + 5.4, y: Y(hy - 2.2) }], FUR);
  c.fillPolygon([{ x: hx - 3.8, y: Y(hy - 3.8) }, { x: hx - 3.5 - e * 0.4, y: Y(hy - 6.8 - e * 0.7) }, { x: hx - 1.7, y: Y(hy - 4.4) }], PINK);
  c.fillPolygon([{ x: hx + 2, y: Y(hy - 4.4) }, { x: hx + 3.4 + e * 0.5, y: Y(hy - 7 - e * 0.7) }, { x: hx + 4.4, y: Y(hy - 3.4) }], PINK);

  // --- Cara: ojo cerrado (o entreabierto), nariz, boca y bigotes
  const ex = Math.floor(hx + 1.2);
  const eyeY = Math.floor(Y(hy - 0.4));
  if (p.eye === 0) {
    // ojo cerrado: una sonrisita hacia abajo, de gato que sueña
    c.setPixel(ex, eyeY, LID);
    c.setPixel(ex + 1, eyeY + 1, LID);
    c.setPixel(ex + 2, eyeY + 1, LID);
    c.setPixel(ex + 3, eyeY, LID);
  } else {
    // entreabierto: párpado y un poco de iris azul claro (sin pupila rasgada)
    c.fillRect(ex, eyeY, 4, 1, LID);
    c.fillRect(ex + 1, eyeY + 1, 2, 1, IRIS);
    c.setPixel(ex + 1, eyeY + 1, 0xffffff, 0.9);
  }
  c.fillRect(Math.floor(hx + 5), Math.floor(Y(hy + 1.6)), 2, 2, NOSE);
  c.setPixel(Math.floor(hx + 4), Math.floor(Y(hy + 3.6)), mul(FUR_DEEP, 0.85));
  c.setPixel(Math.floor(hx + 5), Math.floor(Y(hy + 4)), mul(FUR_DEEP, 0.85));
  c.setPixel(ex + 2, Math.floor(Y(hy + 2.4)), PINK, 0.6); // mejilla sonrosada

  // --- Pelaje: motas más claras y sombreadas (de forma fija)
  for (let i = 0; i < 70; i++) {
    const x = Math.floor(rnd() * CAT_W);
    const y = Math.floor(rnd() * CAT_H);
    if (c.alphaAt(x, y) > 128) c.putPixel(x, y, rnd() < 0.55 ? mul(c.colorAt(x, y), 0.93) : mul(c.colorAt(x, y), 1.04), 1);
  }
  // --- Sombra en el borde de abajo y contorno
  const mask: boolean[] = [];
  for (let y = 0; y < CAT_H; y++) for (let x = 0; x < CAT_W; x++) mask.push(c.alphaAt(x, y) > 128);
  const at = (x: number, y: number): boolean => x >= 0 && y >= 0 && x < CAT_W && y < CAT_H && (mask[y * CAT_W + x] ?? false);
  for (let y = 0; y < CAT_H; y++) {
    for (let x = 0; x < CAT_W; x++) {
      if (at(x, y) && at(x, y - 1) && !at(x, y + 1)) c.putPixel(x, y, mul(c.colorAt(x, y), 0.82), 1);
    }
  }
  c.outline(OUTLINE);

  // --- Bigotes (después del contorno, para que queden finos y claros)
  const wy = p.whisker === 1 ? -1 : p.whisker === 2 ? 1 : 0;
  for (const dy of [0, 1.8]) c.line(hx + 6.4, Y(hy + 2.6 + dy), hx + 9.4, Y(hy + 2.2 + dy * 1.3 + wy), 0xf4f0ff, 0.8);

  // --- La "z" del sueño sube y se desvanece (se dibuja encima del contorno)
  if (p.z >= 0) {
    const k = p.z;
    drawZ(c, Math.round(hx + 3 + k * 4), Math.round(oy - 2 - k * 7), Math.min(1, Math.sin(Math.PI * k) * 1.25));
  }
  return c;
}

/** Dieciséis fotogramas de un ciclo de ~3,5 s: respiración suave, coletazos, oreja, bigotes, pata, ojo y "z". */
export function buildCatFrames(): PixelCanvas[] {
  const TAIL: ReadonlyArray<CatPose['tail']> = [0, 0, 1, 2, 3, 2, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0];
  const EAR: ReadonlyArray<CatPose['ear']> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0];
  const EYE: ReadonlyArray<CatPose['eye']> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0];
  const WHISKER: ReadonlyArray<CatPose['whisker']> = [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const PAW: ReadonlyArray<boolean> = [false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false];
  return Array.from({ length: CAT_FRAMES }, (_, i) => {
    const breath = Math.round(1 + Math.sin((i / CAT_FRAMES) * Math.PI * 2 - Math.PI / 2)) as CatPose['breath'];
    const zStep = i % 8;
    return renderCat({
      breath,
      tail: TAIL[i] ?? 0,
      ear: EAR[i] ?? 0,
      eye: EYE[i] ?? 0,
      whisker: WHISKER[i] ?? 0,
      paw: PAW[i] ?? false,
      z: zStep < 7 ? zStep / 6 : -1
    });
  });
}
