// Detalles reutilizables para dar vida a las ilustraciones: mobiliario urbano, ventanas con gente, sillas, paraguas...
// Todo dibujado por código (arte PROVISIONAL). Las posiciones son del lienzo; `g` = altura del suelo donde se apoya.
import type { PixelCanvas, Rgb } from '../../../core/pixelCanvas';
import { createRng } from '../../../core/rng';
import { PAL } from '../../../data/menuPalette';
import { OUTLINE } from './kit';

/** Manchas, humedad y desconchones en una pared. */
export function wallTexture(c: PixelCanvas, x: number, y: number, w: number, h: number, seed: number, specks = 0.05, stain: Rgb = 0x0a0618): void {
  const rnd = createRng(seed);
  const n = Math.floor(w * h * specks * 0.1);
  for (let i = 0; i < n; i++) c.setPixel(x + rnd() * w, y + rnd() * h, rnd() < 0.5 ? 0xffffff : stain, 0.06 + rnd() * 0.1);
  for (let i = 0; i < Math.max(2, Math.floor(w / 40)); i++) {
    const sx = x + rnd() * w;
    const len = 8 + rnd() * Math.min(h - 8, 50);
    for (let k = 0; k < len; k++) c.setPixel(sx + Math.sin(k * 0.5) * 0.6, y + 6 + k, stain, 0.16 * (1 - k / len));
  }
}

export type WindowKind = 'warm' | 'tv' | 'curtain' | 'person' | 'plant' | 'dark' | 'blinds';

/** Ventana con vida: luz cálida, tele azul, cortinas, alguien asomado, plantas... */
export function windowLit(c: PixelCanvas, x: number, y: number, w: number, h: number, kind: WindowKind, seed = 1): void {
  const rnd = createRng(seed);
  c.fillRect(x - 1, y - 1, w + 2, h + 2, 0x140a2e);
  switch (kind) {
    case 'dark':
      c.fillRect(x, y, w, h, 0x0c0620);
      c.fillRect(x + 1, y + 1, w * 0.4, 2, PAL.cyan, 0.12);
      break;
    case 'warm':
    case 'curtain':
    case 'person':
      c.fillRect(x, y, w, h, 0xe9a640);
      c.fillRect(x + 1, y + 1, w - 2, h - 2, 0xffcf6b);
      if (kind === 'curtain') {
        c.fillRect(x, y, w * 0.3, h, 0xb0405a);
        c.fillRect(x + w * 0.7, y, w * 0.3, h, 0xb0405a);
        for (let i = 0; i < h; i += 3) c.fillRect(x, y + i, w * 0.3, 1, 0x7a2a40, 0.5);
      }
      if (kind === 'person') {
        c.fillCircle(x + w / 2, y + h * 0.5, 2.6, 0x4a2a1a);
        c.fillRect(x + w / 2 - 4, y + h * 0.5 + 2, 8, h * 0.5, 0x4a2a1a);
      }
      break;
    case 'tv':
      c.fillRect(x, y, w, h, 0x0c1a3a);
      c.fillRect(x + 2, y + h * 0.4, w - 4, h * 0.3, 0x3a8aff, 0.8);
      c.fillRect(x + 2, y + h * 0.4, (w - 4) * rnd(), 2, 0xffffff, 0.5);
      c.fillCircle(x + w - 4, y + h - 5, 2, 0x1a2a5a);
      break;
    case 'plant':
      c.fillRect(x, y, w, h, 0x2a1450);
      for (let i = 0; i < 6; i++) c.fillEllipse(x + 3 + rnd() * (w - 6), y + h - 4 - rnd() * (h * 0.6), 3, 5, i % 2 ? PAL.leafDark : PAL.leafMid, 0.95);
      c.fillRect(x + w * 0.35, y + h - 4, w * 0.3, 4, 0x7a4a2a);
      break;
    case 'blinds':
      c.fillRect(x, y, w, h, 0xcf9a4a);
      for (let i = 0; i < h; i += 3) c.fillRect(x, y + i, w, 1, 0x7a5a2a, 0.9);
      break;
  }
  c.fillRect(x + w / 2, y, 1, h, 0x1f1045, 0.8);
  c.fillRect(x, y + h / 2, w, 1, 0x1f1045, 0.8);
}

/** Balcón con barandilla y macetas. */
export function balcony(c: PixelCanvas, x: number, y: number, w: number, plants = true, seed = 1): void {
  const rnd = createRng(seed);
  c.fillRect(x, y, w, 2, 0x4a4f7a);
  for (let px = x; px < x + w; px += 4) c.fillRect(px, y - 8, 1, 8, 0x4a4f7a);
  c.fillRect(x, y - 8, w, 1, 0x6a6a9a);
  if (plants) {
    for (let px = x + 3; px < x + w - 6; px += 9 + Math.floor(rnd() * 6)) {
      c.fillRect(px, y - 4, 5, 4, 0x7a3a2a);
      c.fillEllipse(px + 2, y - 7, 4, 4, PAL.leafMid, 0.95);
      c.fillEllipse(px + 1, y - 9, 3, 3, PAL.leafDark);
    }
  }
}

export function hydrant(c: PixelCanvas, x: number, g: number, color: Rgb = 0xc83a3a): void {
  c.fillRect(x - 3, g - 12, 6, 12, color);
  c.fillRect(x - 4, g - 14, 8, 3, color);
  c.fillRect(x - 5, g - 8, 2, 3, color);
  c.fillRect(x + 3, g - 8, 2, 3, color);
  c.fillRect(x - 3, g - 12, 1, 12, 0xffffff, 0.25);
  c.fillRect(x - 4, g, 8, 1, 0x05020d, 0.5);
}

export function mailbox(c: PixelCanvas, x: number, g: number): void {
  c.fillRect(x - 1, g - 10, 2, 10, 0x2a2550);
  c.fillRect(x - 6, g - 18, 12, 9, 0x2a58c8);
  c.fillRect(x - 6, g - 18, 12, 2, 0x4a8aff);
  c.fillRect(x - 4, g - 13, 8, 1, 0x0a1a3a);
  c.fillRect(x + 4, g - 20, 1, 3, 0xffcf6b);
}

export function trashCan(c: PixelCanvas, x: number, g: number): void {
  c.fillRect(x - 5, g - 14, 10, 14, 0x4a4f6a);
  c.fillRect(x - 6, g - 16, 12, 3, 0x6a6a8a);
  for (let i = 0; i < 4; i++) c.fillRect(x - 4 + i * 3, g - 12, 1, 10, 0x2a2e48);
  c.fillRect(x - 5, g - 14, 1, 14, 0xffffff, 0.2);
}

export function bench(c: PixelCanvas, x: number, g: number, w: number): void {
  c.fillRect(x, g - 9, w, 2, 0x7a4a2a);
  c.fillRect(x, g - 17, w, 2, 0x7a4a2a);
  c.fillRect(x, g - 14, w, 1, 0x7a4a2a);
  c.fillRect(x + 2, g - 7, 2, 7, 0x2a2550);
  c.fillRect(x + w - 4, g - 7, 2, 7, 0x2a2550);
  c.fillRect(x, g - 17, w, 1, 0xffffff, 0.15);
}

export function crate(c: PixelCanvas, x: number, g: number, s = 10): void {
  c.fillRect(x, g - s, s, s, 0x6a4a2a);
  c.strokeRect(x, g - s, s, s, 0x3a2410);
  c.line(x, g - s, x + s - 1, g - 1, 0x3a2410);
  c.fillRect(x, g - s, s, 1, 0xa07a4a, 0.7);
}

/** Máquina expendedora que brilla. */
export function vending(c: PixelCanvas, x: number, g: number, color: Rgb): void {
  c.fillRect(x, g - 30, 18, 30, 0x1c1844);
  c.fillRect(x + 2, g - 27, 11, 20, 0x0a0a1e);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) c.fillRect(x + 3 + j * 3, g - 25 + i * 6, 2, 4, i === 1 ? PAL.pink : color, 0.9);
  c.fillRect(x + 14, g - 26, 3, 6, color);
  c.fillRect(x + 3, g - 5, 11, 3, 0x05020d);
  c.strokeRect(x, g - 30, 18, 30, 0x4a4f7a, 0.8);
}

/** Poste con una señal. */
export function streetSign(c: PixelCanvas, x: number, g: number, h: number, color: Rgb): void {
  c.fillRect(x, g - h, 2, h, 0x3a3a5a);
  c.fillRect(x - 7, g - h - 2, 16, 8, color);
  c.strokeRect(x - 7, g - h - 2, 16, 8, 0xffffff, 0.6);
  c.fillRect(x - 4, g - h + 1, 10, 1, 0xffffff, 0.8);
}

/** Transeúnte en silueta bajo un paraguas. */
export function umbrellaPerson(c: PixelCanvas, x: number, g: number, h: number, umbrella: Rgb, facing: 1 | -1 = 1): void {
  const col = 0x0b0a1c;
  c.fillCircle(x, g - h + 6, 2.6, col);
  c.fillRect(x - 3, g - h + 8, 6, h * 0.42, col);
  c.fillRect(x - 3, g - h * 0.5, 2, h * 0.5, col);
  c.fillRect(x + 1, g - h * 0.5, 2, h * 0.5, col);
  c.line(x + facing * 3, g - h + 10, x + facing * 5, g - h + 2, col);
  c.fillPolygon([{ x: x + facing * 5 - 10, y: g - h + 3 }, { x: x + facing * 5 + 10, y: g - h + 3 }, { x: x + facing * 5, y: g - h - 3 }], umbrella);
  c.fillRect(x + facing * 5 - 10, g - h + 3, 20, 1, 0x05020d, 0.5);
  c.fillRect(x + facing * 5, g - h - 3, 1, 3, 0xffffff, 0.3);
}

export function waterTank(c: PixelCanvas, x: number, y: number): void {
  c.fillRect(x, y, 16, 14, 0x3a3a5a);
  c.fillRect(x, y, 16, 2, 0x5a5a7a);
  c.fillPolygon([{ x, y }, { x: x + 8, y: y - 6 }, { x: x + 16, y }], 0x2a2a48);
  for (const lx of [x + 1, x + 14]) c.fillRect(lx, y + 14, 1, 6, 0x2a2550);
  for (let i = 3; i < 14; i += 4) c.fillRect(x, y + i, 16, 1, 0x1c1844, 0.7);
}

export function antenna(c: PixelCanvas, x: number, y: number, h: number): void {
  c.fillRect(x, y - h, 1, h, 0x4a4f7a);
  for (let i = 0; i < 4; i++) c.fillRect(x - 4 + i, y - h + 3 + i * 5, 9 - i * 2, 1, 0x4a4f7a);
  c.fillRect(x - 1, y - h - 2, 3, 2, PAL.red, 0.9);
}

export function dish(c: PixelCanvas, x: number, y: number): void {
  c.fillEllipse(x, y, 6, 5, 0x8a8fb5);
  c.fillEllipse(x + 1, y, 4, 3, 0x5a5f85);
  c.line(x, y, x + 5, y - 5, 0x4a4f7a);
}

/** Cartel pegado y rasgado en una pared. */
export function poster(c: PixelCanvas, x: number, y: number, w: number, h: number, seed: number): void {
  const rnd = createRng(seed);
  const cols = [PAL.pink, PAL.cyan, 0xffd23a, PAL.magenta, 0xf4f0ff];
  c.fillRect(x, y, w, h, 0xcfc8e8, 0.85);
  c.fillRect(x + 2, y + 2, w - 4, h * 0.45, cols[Math.floor(rnd() * cols.length)] ?? PAL.pink, 0.85);
  c.fillRect(x + 3, y + h * 0.6, w - 6, 1, 0x1a1030, 0.7);
  c.fillRect(x + 3, y + h * 0.7, w * 0.6, 1, 0x1a1030, 0.7);
  c.fillRect(x + w - 3, y, 3, 3, 0x0a0618, 0.5);
}

/** Garabato de grafiti con goteo. */
export function graffiti(c: PixelCanvas, x: number, y: number, color: Rgb, seed: number): void {
  const rnd = createRng(seed);
  let px = x;
  let py = y;
  for (let i = 0; i < 6; i++) {
    const nx = px + 6 + rnd() * 8;
    const ny = y + (rnd() - 0.5) * 18;
    c.thickLine(px, py, nx, ny, 1.2, color, 0.85);
    px = nx;
    py = ny;
  }
  for (let i = 0; i < 3; i++) c.line(x + 6 + i * 10, y + 4, x + 6 + i * 10, y + 10 + rnd() * 8, color, 0.5);
}

/** Silla de terraza con respaldo (de perfil). `facing` = hacia dónde mira quien se sienta. */
export function chair(c: PixelCanvas, x: number, g: number, facing: 1 | -1, color: Rgb = 0x6a6fa0, seatH = 12): void {
  const back = x - facing * 5;
  c.fillRect(x - 6, g - seatH, 12, 2, color);
  c.fillRect(x - 6, g - seatH, 12, 1, 0xffffff, 0.3);
  c.fillRect(back, g - seatH - 14, 2, 14 + 2, color);
  c.fillRect(back - (facing > 0 ? 0 : -0), g - seatH - 14, 1, 14, 0xffffff, 0.25);
  c.fillRect(x - 5, g - seatH + 2, 1, seatH - 2, color);
  c.fillRect(x + 4, g - seatH + 2, 1, seatH - 2, color);
  c.fillRect(x - 6, g, 12, 1, 0x05020d, 0.5);
}

/** Mesa redonda de terraza. */
export function bistroTable(c: PixelCanvas, x: number, g: number, w = 22, h = 18): void {
  c.fillRect(x - w / 2, g - h, w, 2, 0xcfc8e8);
  c.fillRect(x - w / 2, g - h, w, 1, 0xffffff, 0.5);
  c.fillRect(x - 1, g - h + 2, 2, h - 2, 0x4a4f7a);
  c.fillRect(x - 6, g - 1, 12, 1, 0x4a4f7a);
  c.fillRect(x - w / 2 + 1, g - h + 2, w - 2, 1, 0x05020d, 0.4);
}

/** Maceta con planta grande. */
export function plantPot(c: PixelCanvas, x: number, g: number, h = 22): void {
  c.fillRect(x - 5, g - 9, 10, 9, 0x8a4a2a);
  c.fillRect(x - 6, g - 10, 12, 2, 0xa05a3a);
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI / 2 + (i - 3) * 0.38;
    c.thickLine(x, g - 10, x + Math.cos(a) * h * 0.7, g - 10 + Math.sin(a) * h, 1.3, i % 2 ? PAL.leafMid : PAL.leafDark);
  }
}

/** Scooter aparcado. */
export function scooter(c: PixelCanvas, x: number, g: number): void {
  c.fillCircle(x - 9, g - 4, 4, 0x05020d);
  c.fillCircle(x + 9, g - 4, 4, 0x05020d);
  c.fillCircle(x - 9, g - 4, 1.5, 0x6a6a8a);
  c.fillCircle(x + 9, g - 4, 1.5, 0x6a6a8a);
  c.fillRect(x - 8, g - 9, 16, 4, 0xc8409a);
  c.fillRect(x + 6, g - 16, 2, 9, 0x4a4f7a);
  c.fillRect(x + 4, g - 17, 6, 2, 0x2a2550);
  c.fillRect(x - 6, g - 11, 9, 3, 0x2a2550);
  c.fillRect(x + 9, g - 14, 2, 2, 0xffe9a8);
}

/** Boca de ventilación en pared con rejilla. */
export function vent(c: PixelCanvas, x: number, y: number): void {
  c.fillRect(x, y, 12, 8, 0x2a2e48);
  for (let i = 0; i < 4; i++) c.fillRect(x + 1, y + 1 + i * 2, 10, 1, 0x05020d);
  c.strokeRect(x, y, 12, 8, 0x4a4f7a, 0.8);
}

/** Cajero automático que brilla en verde (en una pared). */
export function atm(c: PixelCanvas, x: number, y: number): void {
  c.fillRect(x, y, 22, 30, 0x2a2e48);
  c.fillRect(x + 3, y + 3, 16, 10, 0x05140f);
  c.strokeRect(x + 3, y + 3, 16, 10, 0x1ff3a0, 0.9);
  c.fillRect(x + 5, y + 5, 12, 1, 0x1ff3a0, 0.7);
  c.fillRect(x + 5, y + 8, 8, 1, 0x1ff3a0, 0.5);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) c.fillRect(x + 4 + j * 4, y + 16 + i * 3, 3, 2, 0x4a4f7a);
  c.fillRect(x + 6, y + 26, 10, 2, 0x05020d);
  void OUTLINE;
}

/** Marquesina de parada de autobús con panel luminoso. */
export function busStop(c: PixelCanvas, x: number, g: number, w: number, color: Rgb): void {
  c.fillRect(x, g - 40, 2, 40, 0x3a3a5a);
  c.fillRect(x + w, g - 40, 2, 40, 0x3a3a5a);
  c.fillRect(x - 2, g - 42, w + 6, 3, 0x4a4f7a);
  c.fillRect(x + 4, g - 38, w - 6, 24, 0x0a0a1e, 0.55);
  c.fillRect(x + w - 16, g - 36, 14, 26, color, 0.85);
  c.strokeRect(x + w - 16, g - 36, 14, 26, 0xffffff, 0.5);
  c.fillRect(x + w - 13, g - 32, 8, 8, 0xffffff, 0.35);
  c.fillRect(x + 6, g - 9, w - 18, 2, 0x7a4a2a);
  c.fillRect(x + 8, g - 7, 2, 7, 0x2a2550);
}
