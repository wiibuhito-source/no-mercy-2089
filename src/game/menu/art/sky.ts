// Cielo nocturno, sol retro y nubes (arte PROVISIONAL dibujado por código; sin Phaser).
import { PAL } from '../../../data/menuPalette';
import { createRng } from '../../../core/rng';
import { PixelCanvas, colorAtStops } from '../../../core/pixelCanvas';

/** Cielo con degradado tramado y estrellas fijas. */
export function buildSky(width: number, height: number): PixelCanvas {
  const c = new PixelCanvas(width, height);
  c.fillGradientV(
    0,
    0,
    width,
    height,
    [
      { at: 0, color: 0x04010c },
      { at: 0.3, color: 0x140731 },
      { at: 0.55, color: 0x34105f },
      { at: 0.75, color: 0x7a1d86 },
      { at: 0.9, color: 0xc92f7a },
      { at: 1, color: 0xff7b54 }
    ],
    22
  );
  const rnd = createRng(77);
  for (let i = 0; i < 70; i++) {
    const x = Math.floor(rnd() * width);
    const y = Math.floor(rnd() * height * 0.55);
    c.setPixel(x, y, rnd() < 0.2 ? PAL.aqua : PAL.white, 0.25 + rnd() * 0.5);
  }
  return c;
}

/** Posiciones de las estrellas que titilan (se dibujan aparte para poder animarlas). */
export function twinkleStars(count: number, width: number, maxY: number): { x: number; y: number; color: number }[] {
  const rnd = createRng(31);
  const stars: { x: number; y: number; color: number }[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({ x: Math.floor(rnd() * width), y: Math.floor(rnd() * maxY), color: rnd() < 0.3 ? PAL.aqua : PAL.white });
  }
  return stars;
}

export const SUN_SIZE = 108;

const SUN_STOPS = [
  { at: 0, color: 0xfff08a },
  { at: 0.45, color: 0xff9a4d },
  { at: 0.75, color: 0xff3fa5 },
  { at: 1, color: 0xc41fd6 }
] as const;

/** Sol retro de franjas (synthwave) con halo escalonado. */
export function buildSun(): PixelCanvas {
  const c = new PixelCanvas(SUN_SIZE, SUN_SIZE);
  const cx = SUN_SIZE / 2;
  const cy = SUN_SIZE / 2;
  const r = 44;
  for (const [extra, alpha] of [[10, 0.07], [6, 0.1], [3, 0.14]] as const) c.fillCircle(cx, cy, r + extra, PAL.magenta, alpha);
  for (let dy = -r; dy < r; dy++) {
    // Franjas que se hacen más gruesas hacia abajo
    if (dy > -34 && (dy + 34) % 8 < Math.round(1 + ((dy + 34) / (r + 34)) * 5)) continue;
    const half = Math.sqrt(r * r - (dy + 0.5) * (dy + 0.5));
    const left = Math.ceil(cx - half);
    const right = Math.floor(cx + half);
    c.fillRect(left, cy + dy, right - left, 1, colorAtStops(SUN_STOPS, (dy + r) / (2 * r)));
  }
  return c;
}

/** Nube alargada iluminada desde abajo por el sol y la ciudad. */
export function buildCloud(width: number, height: number, seed: number): PixelCanvas {
  const c = new PixelCanvas(width, height);
  const rnd = createRng(seed);
  for (let i = 0; i < width / 4; i++) {
    const x = rnd() * width;
    const rx = 5 + rnd() * 10;
    const ry = 1.4 + rnd() * (height / 3);
    const y = height / 2 + (rnd() - 0.5) * (height / 3);
    c.fillEllipse(x, y, rx, ry, 0x3a1a6e, 0.55);
    c.fillEllipse(x, y + ry * 0.45, rx * 0.9, ry * 0.5, PAL.magenta, 0.32);
  }
  return c;
}
