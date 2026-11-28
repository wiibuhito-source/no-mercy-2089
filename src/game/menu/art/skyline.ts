// Rascacielos de fondo en dos niveles (arte PROVISIONAL dibujado por código; sin Phaser).
// El nivel lejano es una silueta con bruma; el cercano tiene ventanas, neones y antenas.
import { PAL } from '../../../data/menuPalette';
import { createRng } from '../../../core/rng';
import { PixelCanvas, type Point } from '../../../core/pixelCanvas';

export interface Rect {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

export interface MidSkyline {
  readonly canvas: PixelCanvas;
  /** Luces rojas de las antenas (parpadean). */
  readonly beacons: readonly Point[];
  /** Ventanas que se encienden y apagan. */
  readonly windows: readonly Point[];
  /** Hueco donde va el holograma publicitario. */
  readonly billboard: Rect;
}

const WINDOW_COLORS = [PAL.window, PAL.window, PAL.cyan, PAL.pink] as const;

/** Bruma que funde los edificios con el resplandor del horizonte, en franjas limpias (solo sobre lo ya dibujado). */
function haze(c: PixelCanvas, fromY: number, toY: number, color: number, maxAlpha: number): void {
  const bands = 4;
  for (let y = fromY; y < toY; y++) {
    const band = Math.floor(((y - fromY) / (toY - fromY)) * bands);
    const alpha = (band / bands) * maxAlpha;
    if (alpha <= 0) continue;
    for (let x = 0; x < c.width; x++) {
      if (c.alphaAt(x, y) >= 200) c.setPixel(x, y, color, alpha);
    }
  }
}

function tower(c: PixelCanvas, rnd: () => number, x: number, w: number, top: number, base: number, color: number): void {
  const style = Math.floor(rnd() * 5);
  c.fillRect(x, top, w, base - top, color);
  if (style === 1 && w > 14) {
    c.fillRect(x + 3, top - 8, w - 6, 8, color); // retranqueo
  } else if (style === 2) {
    c.fillRect(x + Math.floor(w / 2), top - 12, 1, 12, color); // aguja
  } else if (style === 3) {
    c.fillPolygon(
      [
        { x, y: top },
        { x: x + w, y: top - 7 },
        { x: x + w, y: top }
      ],
      color
    );
  } else if (style === 4 && w > 12) {
    c.fillEllipse(x + w / 2, top, w / 2, 5, color); // cúpula
  }
}

/** Siluetas lejanas, con bruma y alguna ventana tenue. Altura total `height`, edificios apoyados abajo. */
export function buildFarSkyline(width: number, height: number): PixelCanvas {
  const c = new PixelCanvas(width, height);
  const rnd = createRng(2089);
  let x = -4;
  while (x < width) {
    const w = 14 + Math.floor(rnd() * 20);
    const h = 38 + Math.floor(rnd() * 46);
    tower(c, rnd, x, w, height - h, height, 0x28124f);
    c.fillRect(x + w - 1, height - h, 1, h, 0x3d1d73); // borde con volumen
    for (let k = 0; k < w * h * 0.012; k++) {
      c.setPixel(x + 2 + Math.floor(rnd() * (w - 4)), height - h + 4 + Math.floor(rnd() * (h - 10)), rnd() < 0.5 ? PAL.cyan : PAL.pink, 0.45);
    }
    x += w + Math.floor(rnd() * 3);
  }
  haze(c, height - 70, height, 0xd6347f, 0.6);
  return c;
}

/** Edificios cercanos con ventanas, neones, antenas y el soporte del cartel holográfico. */
export function buildMidSkyline(width: number, height: number, billboardX: number): MidSkyline {
  const c = new PixelCanvas(width, height);
  const rnd = createRng(4242);
  const beacons: Point[] = [];
  const windows: Point[] = [];
  let billboard: Rect = { x: 0, y: 0, w: 0, h: 0 };
  let placedBoard = false;
  let x = -6;
  while (x < width) {
    const isBoard = !placedBoard && x >= billboardX - 20;
    const w = isBoard ? 70 : 20 + Math.floor(rnd() * 26);
    const h = isBoard ? 48 : 38 + Math.floor(rnd() * 52);
    const top = height - h;
    c.fillRect(x, top, w, h, 0x120826);
    c.fillRect(x + w - 2, top, 2, h, 0x2a1360); // borde lateral iluminado
    c.fillRect(x, top, w, 1, 0x241150);
    const accent = rnd() < 0.5 ? PAL.cyan : PAL.magenta;
    if (rnd() < 0.55) c.fillRect(x, top, w, 1, accent, 0.9); // luz de azotea
    if (rnd() < 0.3) c.fillRect(x + w - 1, top, 1, h, accent, 0.7); // tubo de neón vertical
    // Ventanas: por plantas, con rachas encendidas
    const warm = rnd() < 0.6;
    for (let wy = top + 6; wy < height - 6; wy += 6) {
      const floorLit = rnd();
      for (let wx = x + 3; wx < x + w - 5; wx += 4) {
        if (rnd() > (floorLit < 0.25 ? 0.9 : 0.22)) continue;
        const color = warm ? (rnd() < 0.8 ? PAL.window : PAL.cyan) : (WINDOW_COLORS[Math.floor(rnd() * WINDOW_COLORS.length)] ?? PAL.window);
        c.fillRect(wx, wy, 2, 3, color, 0.9);
        if (rnd() < 0.25) windows.push({ x: wx, y: wy });
      }
    }
    // Detalles de azotea
    if (!isBoard && rnd() < 0.5) {
      const ax = x + 4 + Math.floor(rnd() * Math.max(1, w - 8));
      c.fillRect(ax, top - 12, 1, 12, 0x2a1360);
      beacons.push({ x: ax, y: top - 13 });
    } else if (!isBoard && rnd() < 0.5) {
      c.fillRect(x + 4, top - 4, 7, 4, 0x1a0d38); // maquinaria
      c.fillRect(x + 5, top - 5, 5, 1, 0x1a0d38);
    }
    if (isBoard) {
      // Soporte del holograma: marco oscuro con patas
      const bx = x + 4;
      const by = top - 36;
      c.fillRect(bx + 4, by + 30, 3, 36, 0x1a0d38);
      c.fillRect(bx + w - 14, by + 30, 3, 36, 0x1a0d38);
      c.fillRect(bx - 1, by - 1, w - 6, 34, 0x0a0518);
      c.strokeRect(bx - 1, by - 1, w - 6, 34, PAL.cyan, 0.55);
      billboard = { x: bx, y: by, w: w - 8, h: 32 };
      placedBoard = true;
    }
    x += w + 1 + Math.floor(rnd() * 3);
  }
  haze(c, height - 40, height, 0x6a1a8a, 0.4);
  return { canvas: c, beacons, windows, billboard };
}
