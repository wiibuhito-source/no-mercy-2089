// Título "NO MERCY 2089" con acabado cromado de los 80 (arte PROVISIONAL; sin Phaser).
import { colorAtStops, PixelCanvas, type ColorStop, type Rgb } from '../../../core/pixelCanvas';
import { measureText, textPixels } from '../../../core/pixelFont';
import { buildGlowFromMask } from './glow';

const MAIN_TEXT = 'NO MERCY';
const MAIN_SCALE = 6;
const SUB_TEXT = '2089';
const SUB_SCALE = 5;
const GAP = 7;
const PAD = 12;
const DEPTH = 3;

const CHROME_PINK: readonly ColorStop[] = [
  { at: 0, color: 0xffffff },
  { at: 0.2, color: 0xffe0f8 },
  { at: 0.44, color: 0xff8ae6 },
  { at: 0.5, color: 0x4a1a8a },
  { at: 0.54, color: 0xff3fdc },
  { at: 0.8, color: 0xc41fd6 },
  { at: 1, color: 0x6a2bd6 }
];
const CHROME_CYAN: readonly ColorStop[] = [
  { at: 0, color: 0xffffff },
  { at: 0.25, color: 0xd6fdff },
  { at: 0.46, color: 0x6af6ff },
  { at: 0.5, color: 0x0a3a7a },
  { at: 0.54, color: 0x19e0ff },
  { at: 0.8, color: 0x1a8ae6 },
  { at: 1, color: 0x3a3ad6 }
];

export interface TitleArt {
  readonly canvas: PixelCanvas;
  readonly glow: PixelCanvas;
  readonly glowPad: number;
  /** Mitad de la línea del "2089", para colocar las barras de neón de los lados. */
  readonly subLine: { y: number; leftEnd: number; rightStart: number };
}

function lineMask(text: string, scale: number, width: number, height: number, ox: number, oy: number): PixelCanvas {
  const mask = new PixelCanvas(width, height);
  for (const p of textPixels(text)) mask.fillRect(ox + p.x * scale, oy + p.y * scale, scale, scale, 0xffffff);
  return mask;
}

function stamp(out: PixelCanvas, mask: PixelCanvas, dx: number, dy: number, colorAt: (x: number, y: number) => Rgb, alpha = 1): void {
  for (let y = 0; y < mask.height; y++) {
    for (let x = 0; x < mask.width; x++) {
      if (mask.alphaAt(x, y) > 0) out.setPixel(x + dx, y + dy, colorAt(x, y), alpha);
    }
  }
}

function paintLine(out: PixelCanvas, mask: PixelCanvas, top: number, textH: number, stops: readonly ColorStop[], edge: Rgb, depthColor: Rgb): void {
  for (let k = DEPTH; k >= 1; k--) stamp(out, mask, k, k, () => depthColor, 1); // grosor 3D
  stamp(out, mask, -1, -1, () => edge, 1); // borde de neón
  stamp(out, mask, 0, 0, (_x, y) => colorAtStops(stops, Math.min(1, Math.max(0, (y - top) / textH))), 1); // cara cromada
  // Brillo en el borde superior izquierdo de cada letra
  for (let y = 0; y < mask.height; y++) {
    for (let x = 0; x < mask.width; x++) {
      if (mask.alphaAt(x, y) === 0) continue;
      if (mask.alphaAt(x - 1, y) === 0 || mask.alphaAt(x, y - 1) === 0) out.setPixel(x, y, 0xffffff, 0.85);
    }
  }
  // Rayas de escáner en la mitad inferior (aspecto retro)
  for (let y = Math.round(top + textH * 0.62); y < top + textH; y += 3) {
    for (let x = 0; x < mask.width; x++) if (mask.alphaAt(x, y) > 0) out.setPixel(x, y, 0x1a0a3a, 0.35);
  }
}

export function buildTitle(): TitleArt {
  const main = measureText(MAIN_TEXT);
  const sub = measureText(SUB_TEXT);
  const mainW = main.width * MAIN_SCALE;
  const mainH = main.height * MAIN_SCALE;
  const subW = sub.width * SUB_SCALE;
  const subH = sub.height * SUB_SCALE;
  const width = mainW + PAD * 2 + DEPTH;
  const height = PAD + mainH + GAP + subH + PAD + DEPTH;
  const out = new PixelCanvas(width, height);

  const mainX = Math.floor((width - DEPTH - mainW) / 2);
  const mainY = PAD;
  const subX = Math.floor((width - DEPTH - subW) / 2);
  const subY = PAD + mainH + GAP;

  const mainMask = lineMask(MAIN_TEXT, MAIN_SCALE, width, height, mainX, mainY);
  const subMask = lineMask(SUB_TEXT, SUB_SCALE, width, height, subX, subY);

  paintLine(out, mainMask, mainY, mainH, CHROME_PINK, 0x19f3ff, 0x5a1590);
  paintLine(out, subMask, subY, subH, CHROME_CYAN, 0xff2bd6, 0x1a1a8a);

  const both = new PixelCanvas(width, height);
  both.blit(mainMask, 0, 0);
  both.blit(subMask, 0, 0);
  const glowPad = 6;
  const glow = buildGlowFromMask(both, 0xff2bd6, [{ radius: 5, alpha: 0.07 }, { radius: 3, alpha: 0.12 }, { radius: 1, alpha: 0.2 }], glowPad);

  const lineY = subY + Math.floor(subH / 2);
  return { canvas: out, glow, glowPad, subLine: { y: lineY, leftEnd: subX - 12, rightStart: subX + subW + 12 } };
}
