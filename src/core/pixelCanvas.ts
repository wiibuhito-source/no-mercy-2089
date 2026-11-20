// Lienzo de píxeles RGBA (lógica pura, sin Phaser).
// Es el "pincel" con el que el código dibuja el arte PROVISIONAL del menú. Al no depender
// de Phaser se puede probar con tests y también dibujar fuera del juego para revisar el arte.
import { lerpColor } from './color';

export type Rgb = number; // 0xRRGGBB

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface ColorStop {
  /** Posición en el degradado, de 0 (arriba) a 1 (abajo). */
  readonly at: number;
  readonly color: Rgb;
}

export interface BlitOptions {
  readonly flipX?: boolean;
  readonly alpha?: number;
}

// Matriz de tramado ordenado 4x4 (valores 0..15): reparte los colores como en el pixel art clásico.
const BAYER4: readonly number[] = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

/** Umbral de tramado (0..1) para el píxel (x, y). */
export function bayer(x: number, y: number): number {
  const idx = (((y % 4) + 4) % 4) * 4 + (((x % 4) + 4) % 4);
  return ((BAYER4[idx] ?? 0) + 0.5) / 16;
}

/** Color de un degradado en la posición t (0..1). */
export function colorAtStops(stops: readonly ColorStop[], t: number): Rgb {
  const first = stops[0];
  const last = stops[stops.length - 1];
  if (!first || !last) return 0;
  if (t <= first.at) return first.color;
  if (t >= last.at) return last.color;
  for (let i = 1; i < stops.length; i++) {
    const b = stops[i];
    const a = stops[i - 1];
    if (!a || !b) continue;
    if (t <= b.at) return lerpColor(a.color, b.color, (t - a.at) / Math.max(1e-6, b.at - a.at));
  }
  return last.color;
}

export class PixelCanvas {
  readonly width: number;
  readonly height: number;
  /** Bytes RGBA (alfa sin premultiplicar), fila a fila. */
  readonly data: Uint8ClampedArray;

  constructor(width: number, height: number) {
    this.width = Math.max(1, Math.floor(width));
    this.height = Math.max(1, Math.floor(height));
    this.data = new Uint8ClampedArray(this.width * this.height * 4);
  }

  inBounds(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  /** Opacidad (0..255) del píxel; fuera del lienzo es 0. */
  alphaAt(x: number, y: number): number {
    if (!this.inBounds(x, y)) return 0;
    return this.data[(y * this.width + x) * 4 + 3] ?? 0;
  }

  colorAt(x: number, y: number): Rgb {
    if (!this.inBounds(x, y)) return 0;
    const i = (y * this.width + x) * 4;
    return ((this.data[i] ?? 0) << 16) | ((this.data[i + 1] ?? 0) << 8) | (this.data[i + 2] ?? 0);
  }

  /** Pinta un píxel mezclándolo con lo que hubiera debajo (alpha 0..1). */
  setPixel(x: number, y: number, color: Rgb, alpha = 1): void {
    const px = Math.floor(x);
    const py = Math.floor(y);
    if (!this.inBounds(px, py) || alpha <= 0) return;
    const i = (py * this.width + px) * 4;
    const a = Math.min(1, alpha);
    const dstA = (this.data[i + 3] ?? 0) / 255;
    const outA = a + dstA * (1 - a);
    if (outA <= 0) return;
    const sr = (color >> 16) & 0xff;
    const sg = (color >> 8) & 0xff;
    const sb = color & 0xff;
    this.data[i] = Math.round((sr * a + (this.data[i] ?? 0) * dstA * (1 - a)) / outA);
    this.data[i + 1] = Math.round((sg * a + (this.data[i + 1] ?? 0) * dstA * (1 - a)) / outA);
    this.data[i + 2] = Math.round((sb * a + (this.data[i + 2] ?? 0) * dstA * (1 - a)) / outA);
    this.data[i + 3] = Math.round(outA * 255);
  }

  /** Sustituye el píxel (sin mezclar). Útil para borrar con alpha 0. */
  putPixel(x: number, y: number, color: Rgb, alpha = 1): void {
    if (!this.inBounds(x, y)) return;
    const i = (y * this.width + x) * 4;
    this.data[i] = (color >> 16) & 0xff;
    this.data[i + 1] = (color >> 8) & 0xff;
    this.data[i + 2] = color & 0xff;
    this.data[i + 3] = Math.round(Math.min(1, Math.max(0, alpha)) * 255);
  }

  fillRect(x: number, y: number, w: number, h: number, color: Rgb, alpha = 1): void {
    const x0 = Math.max(0, Math.floor(x));
    const y0 = Math.max(0, Math.floor(y));
    const x1 = Math.min(this.width, Math.floor(x + w));
    const y1 = Math.min(this.height, Math.floor(y + h));
    for (let py = y0; py < y1; py++) for (let px = x0; px < x1; px++) this.setPixel(px, py, color, alpha);
  }

  strokeRect(x: number, y: number, w: number, h: number, color: Rgb, alpha = 1): void {
    this.fillRect(x, y, w, 1, color, alpha);
    this.fillRect(x, y + h - 1, w, 1, color, alpha);
    this.fillRect(x, y + 1, 1, h - 2, color, alpha);
    this.fillRect(x + w - 1, y + 1, 1, h - 2, color, alpha);
  }

  /** Línea de 1 píxel (Bresenham). */
  line(x0: number, y0: number, x1: number, y1: number, color: Rgb, alpha = 1): void {
    let x = Math.round(x0);
    let y = Math.round(y0);
    const ex = Math.round(x1);
    const ey = Math.round(y1);
    const dx = Math.abs(ex - x);
    const dy = -Math.abs(ey - y);
    const sx = x < ex ? 1 : -1;
    const sy = y < ey ? 1 : -1;
    let err = dx + dy;
    for (let guard = 0; guard < 100000; guard++) {
      this.setPixel(x, y, color, alpha);
      if (x === ex && y === ey) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y += sy;
      }
    }
  }

  /** Línea gruesa (cápsula): sirve para brazos, piernas, troncos... `radius` en píxeles. */
  thickLine(x0: number, y0: number, x1: number, y1: number, radius: number, color: Rgb, alpha = 1): void {
    const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 2));
    const stamped = new Set<number>();
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const cx = x0 + (x1 - x0) * t;
      const cy = y0 + (y1 - y0) * t;
      const r = Math.max(0.5, radius);
      for (let py = Math.floor(cy - r); py <= Math.ceil(cy + r); py++) {
        for (let px = Math.floor(cx - r); px <= Math.ceil(cx + r); px++) {
          const ddx = px + 0.5 - cx;
          const ddy = py + 0.5 - cy;
          if (ddx * ddx + ddy * ddy <= r * r) stamped.add(py * 100000 + px);
        }
      }
    }
    for (const key of stamped) {
      const py = Math.floor(key / 100000);
      const px = key - py * 100000;
      this.setPixel(px, py, color, alpha);
    }
  }

  /** Relleno de un polígono (regla par-impar), mirando el centro de cada píxel. */
  fillPolygon(points: readonly Point[], color: Rgb, alpha = 1): void {
    if (points.length < 3) return;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const p of points) {
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    }
    const yStart = Math.max(0, Math.floor(minY));
    const yEnd = Math.min(this.height - 1, Math.ceil(maxY));
    for (let y = yStart; y <= yEnd; y++) {
      const cy = y + 0.5;
      const xs: number[] = [];
      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        const b = points[(i + 1) % points.length];
        if (!a || !b || a.y === b.y) continue;
        const lo = Math.min(a.y, b.y);
        const hi = Math.max(a.y, b.y);
        if (cy < lo || cy >= hi) continue;
        xs.push(a.x + ((cy - a.y) / (b.y - a.y)) * (b.x - a.x));
      }
      xs.sort((p, q) => p - q);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        const xa = xs[k] ?? 0;
        const xb = xs[k + 1] ?? 0;
        const from = Math.max(0, Math.ceil(xa - 0.5));
        const to = Math.min(this.width - 1, Math.ceil(xb - 0.5) - 1);
        for (let x = from; x <= to; x++) this.setPixel(x, y, color, alpha);
      }
    }
  }

  fillEllipse(cx: number, cy: number, rx: number, ry: number, color: Rgb, alpha = 1): void {
    if (rx <= 0 || ry <= 0) return;
    for (let py = Math.floor(cy - ry); py <= Math.ceil(cy + ry); py++) {
      for (let px = Math.floor(cx - rx); px <= Math.ceil(cx + rx); px++) {
        const nx = (px + 0.5 - cx) / rx;
        const ny = (py + 0.5 - cy) / ry;
        if (nx * nx + ny * ny <= 1) this.setPixel(px, py, color, alpha);
      }
    }
  }

  fillCircle(cx: number, cy: number, r: number, color: Rgb, alpha = 1): void {
    this.fillEllipse(cx, cy, r, r, color, alpha);
  }

  /** Dibuja un sprite hecho de texto: cada letra de `palette` es un color, "." es transparente. */
  drawRows(rows: readonly string[], palette: Readonly<Record<string, Rgb>>, ox: number, oy: number): void {
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const ch = row[x] ?? '.';
        if (ch === '.' || ch === ' ') continue;
        const color = palette[ch];
        if (color === undefined) throw new Error(`Letra sin color en la paleta: "${ch}"`);
        this.setPixel(ox + x, oy + y, color, 1);
      }
    });
  }

  /** Copia otro lienzo encima de éste (con transparencia). */
  blit(src: PixelCanvas, dx: number, dy: number, options: BlitOptions = {}): void {
    const gain = options.alpha ?? 1;
    for (let y = 0; y < src.height; y++) {
      for (let x = 0; x < src.width; x++) {
        const sx = options.flipX ? src.width - 1 - x : x;
        const i = (y * src.width + sx) * 4;
        const a = ((src.data[i + 3] ?? 0) / 255) * gain;
        if (a <= 0) continue;
        const color = ((src.data[i] ?? 0) << 16) | ((src.data[i + 1] ?? 0) << 8) | (src.data[i + 2] ?? 0);
        this.setPixel(dx + x, dy + y, color, a);
      }
    }
  }

  /** Borde de 1 píxel alrededor de lo dibujado (da el aspecto de pixel art con contorno). */
  outline(color: Rgb, diagonals = false): void {
    const todo: number[] = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.alphaAt(x, y) > 40) continue;
        const touches =
          this.alphaAt(x - 1, y) > 40 ||
          this.alphaAt(x + 1, y) > 40 ||
          this.alphaAt(x, y - 1) > 40 ||
          this.alphaAt(x, y + 1) > 40 ||
          (diagonals &&
            (this.alphaAt(x - 1, y - 1) > 40 ||
              this.alphaAt(x + 1, y - 1) > 40 ||
              this.alphaAt(x - 1, y + 1) > 40 ||
              this.alphaAt(x + 1, y + 1) > 40));
        if (touches) todo.push(y * this.width + x);
      }
    }
    for (const idx of todo) {
      const y = Math.floor(idx / this.width);
      this.putPixel(idx - y * this.width, y, color, 1);
    }
  }

  /** Degradado vertical con tramado ordenado (bandas con puntitos, como en el pixel art de 16 bits). */
  fillGradientV(x: number, y: number, w: number, h: number, stops: readonly ColorStop[], levels = 20): void {
    for (let row = 0; row < h; row++) {
      const t = (row + 0.5) / h;
      const p = t * levels;
      const band = Math.floor(p);
      const frac = p - band;
      const cLow = colorAtStops(stops, band / levels);
      const cHigh = colorAtStops(stops, Math.min(1, (band + 1) / levels));
      for (let col = 0; col < w; col++) {
        this.setPixel(x + col, y + row, frac > bayer(x + col, y + row) ? cHigh : cLow, 1);
      }
    }
  }

  /** Cuántos píxeles tienen algo de opacidad (sirve en los tests). */
  countOpaque(): number {
    let n = 0;
    for (let i = 3; i < this.data.length; i += 4) if ((this.data[i] ?? 0) > 0) n++;
    return n;
  }

  clone(): PixelCanvas {
    const copy = new PixelCanvas(this.width, this.height);
    copy.data.set(this.data);
    return copy;
  }
}
