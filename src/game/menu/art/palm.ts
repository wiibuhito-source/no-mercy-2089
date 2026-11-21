// Palmera de Little Havana con luz de neón (arte PROVISIONAL dibujado por código; sin Phaser).
// El tronco es una imagen; las hojas son imágenes que se animan cambiando de fotograma (balanceo).
import { PixelCanvas, type Point } from '../../../core/pixelCanvas';

export const FROND_W = 50;
export const FROND_H = 66;
/** Dónde nace la hoja dentro de su imagen. */
export const FROND_ORIGIN = { x: 2, y: 36 } as const;
export const TRUNK_W = 16;

const OUT = 0x04140f;
const LEAF_DARK = 0x08483f;
const LEAF_MID = 0x0f8a72;
const LEAF_LIGHT = 0x4ff0c0;
const FROND_LENGTH = 44;

/** Punto de una curva de Bézier cuadrática. */
function bezier(p0: Point, p1: Point, p2: Point, t: number): Point {
  const u = 1 - t;
  return { x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x, y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y };
}

function polar(from: Point, deg: number, len: number): Point {
  const r = (deg * Math.PI) / 180;
  return { x: from.x + Math.cos(r) * len, y: from.y + Math.sin(r) * len };
}

/**
 * Hoja apuntando a la derecha. `angle` es la dirección de salida en grados (negativo = hacia arriba, positivo = hacia abajo);
 * la hoja se curva después hacia abajo por su propio peso. `sway` (-1..1) la dobla unos grados (balanceo con el viento).
 */
export function buildFrond(angle: number, sway: number): PixelCanvas {
  const c = new PixelCanvas(FROND_W, FROND_H);
  const p0 = { x: FROND_ORIGIN.x, y: FROND_ORIGIN.y };
  const a = angle + sway * 4;
  const p1 = polar(p0, a, FROND_LENGTH * 0.5);
  const p2 = polar(p1, a + 58, FROND_LENGTH * 0.55);
  const steps = 13;
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const pa = bezier(p0, p1, p2, t);
    const pb = bezier(p0, p1, p2, (i + 1) / steps);
    const tx = pb.x - pa.x;
    const ty = pb.y - pa.y;
    const len = Math.hypot(tx, ty) || 1;
    const nx = -ty / len;
    const ny = tx / len;
    if (i > 1) {
      const leaf = 3 + 8 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.02)), 0.7);
      for (const side of [-1, 1]) {
        const dir = { x: (tx / len) * 0.7 + nx * side * 0.75, y: (ty / len) * 0.7 + ny * side * 0.75 + 0.35 };
        const dl = Math.hypot(dir.x, dir.y) || 1;
        const ex = pa.x + (dir.x / dl) * leaf;
        const ey = pa.y + (dir.y / dl) * leaf;
        const upper = side < 0;
        c.line(pa.x, pa.y, ex, ey, upper ? LEAF_MID : LEAF_DARK);
        if (upper) c.setPixel(ex, ey, LEAF_LIGHT, 1);
      }
    }
    c.line(pa.x, pa.y, pb.x, pb.y, LEAF_LIGHT);
  }
  c.outline(OUT);
  return c;
}

/** Tronco delgado y curvo con anillos; la base se ensancha. Alto `h`. */
export function buildTrunk(h: number): PixelCanvas {
  const c = new PixelCanvas(TRUNK_W, h);
  for (let y = 0; y < h; y++) {
    const t = y / h;
    const cx = 9 - Math.sin(t * Math.PI * 0.9) * 3.2; // curva suave
    const half = 1.6 + t * 1.4 + (y > h - 5 ? (y - (h - 5)) * 0.5 : 0);
    const ring = Math.floor(y / 2) % 2 === 0;
    const base = ring ? 0x6a4a3c : 0x4a3228;
    c.fillRect(Math.round(cx - half), y, Math.max(2, Math.round(half * 2)), 1, base);
    c.putPixel(Math.round(cx - half), y, 0x2c1c16, 1); // lado en sombra
    c.putPixel(Math.round(cx + half) - 1, y, 0xff6ad5, 0.8); // luz rosa del neón
  }
  c.fillRect(5, 0, 8, 3, 0x2c1c16); // nudo de la copa
  c.outline(OUT);
  return c;
}
