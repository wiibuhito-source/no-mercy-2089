// Herramientas de dibujo compartidas por las ilustraciones de la cinemática (arte PROVISIONAL; sin Phaser).
import { createRng } from '../../../core/rng';
import { PixelCanvas, type ColorStop, type Point, type Rgb } from '../../../core/pixelCanvas';
import { PAL } from '../../../data/menuPalette';

/** Las ilustraciones son un poco más grandes que la pantalla (480x270) para poder deslizar la cámara sin enseñar bordes. */
export const ART_W = 500;
export const ART_H = 280;
export const OUTLINE = 0x0a0612;

export function newArt(): PixelCanvas {
  return new PixelCanvas(ART_W, ART_H);
}

export function sky(c: PixelCanvas, bottomY: number, stops: readonly ColorStop[]): void {
  c.fillGradientV(0, 0, c.width, bottomY, stops, 24);
}

export function stars(c: PixelCanvas, seed: number, count: number, maxY: number): void {
  const rnd = createRng(seed);
  for (let i = 0; i < count; i++) {
    const x = Math.floor(rnd() * c.width);
    const y = Math.floor(rnd() * maxY);
    c.setPixel(x, y, rnd() < 0.2 ? PAL.aqua : PAL.blush, 0.35 + rnd() * 0.55);
  }
}

/** Ventanas encendidas al azar dentro de un edificio. */
export function windows(c: PixelCanvas, x: number, y: number, w: number, h: number, seed: number, lit = 0.28, colors: readonly Rgb[] = [PAL.window, PAL.window, PAL.cyan, PAL.pink]): void {
  const rnd = createRng(seed);
  for (let py = y + 3; py < y + h - 3; py += 6) {
    for (let px = x + 3; px < x + w - 3; px += 5) {
      if (rnd() < lit) c.fillRect(px, py, 2, 3, colors[Math.floor(rnd() * colors.length)] ?? PAL.window, 0.9);
    }
  }
}

/** Silueta de rascacielos a lo largo del lienzo. */
export function skyline(c: PixelCanvas, seed: number, baseY: number, minH: number, maxH: number, color: Rgb, lit: number): void {
  const rnd = createRng(seed);
  let x = -4;
  while (x < c.width) {
    const w = 14 + Math.floor(rnd() * 22);
    const h = minH + Math.floor(rnd() * (maxH - minH));
    c.fillRect(x, baseY - h, w, h, color);
    c.fillRect(x, baseY - h, w, 1, PAL.indigo, 0.9);
    if (rnd() < 0.3) c.fillRect(x + Math.floor(w / 2), baseY - h - 8, 1, 8, color);
    if (lit > 0) windows(c, x, baseY - h, w, h, Math.floor(rnd() * 99999), lit);
    x += w + Math.floor(rnd() * 4);
  }
}

/** Ladrillos en una pared (rayas de mortero). */
export function bricks(c: PixelCanvas, x: number, y: number, w: number, h: number, base: Rgb, mortar: Rgb, seed: number): void {
  const rnd = createRng(seed);
  c.fillRect(x, y, w, h, base);
  for (let row = 0, py = y; py < y + h; row++, py += 5) {
    c.fillRect(x, py, w, 1, mortar, 0.7);
    const off = row % 2 === 0 ? 0 : 6;
    for (let px = x + off; px < x + w; px += 12) {
      c.fillRect(px, py, 1, 5, mortar, 0.7);
      if (rnd() < 0.18) c.fillRect(px + 2, py + 1, 8, 3, PAL.dusk, 0.35);
    }
  }
}

/** Charco con reflejo de color (franjas verticales que se apagan hacia abajo). */
export function reflection(c: PixelCanvas, x: number, y: number, w: number, h: number, color: Rgb, strength = 0.35): void {
  for (let i = 0; i < h; i++) {
    const a = strength * (1 - i / h);
    const jitter = i % 3 === 0 ? 1 : 0;
    c.fillRect(x + jitter, y + i, w - jitter * 2, 1, color, a);
  }
}

export interface PersonStyle {
  readonly x: number;
  /** Altura de los pies (suelo). */
  readonly footY: number;
  readonly height: number;
  /** 1 = mira a la derecha, -1 = a la izquierda. */
  readonly facing: 1 | -1;
  readonly pose: 'stand' | 'offer' | 'sit' | 'walk';
  readonly skin?: Rgb;
  readonly hair?: Rgb;
  readonly top: Rgb;
  readonly topLight?: Rgb;
  readonly bottom: Rgb;
  readonly shoe?: Rgb;
  /** Capucha en vez de pelo; cara en sombra con visor. */
  readonly hood?: boolean;
  readonly visor?: Rgb;
  /** Luz de borde (neón) en el lado contrario al que mira. */
  readonly rim?: Rgb;
}

export interface PersonResult {
  /** Mano que se adelanta (para colocar objetos en ella). */
  readonly hand: Point;
  readonly head: Point;
}

/** Persona sencilla hecha de cápsulas (siluetas legibles con contorno). Mide `height` píxeles de pies a cabeza. */
export function drawPerson(c: PixelCanvas, s: PersonStyle): PersonResult {
  const pad = Math.ceil(s.height * 0.6);
  const size = Math.ceil(s.height + pad * 2);
  const layer = new PixelCanvas(size, size);
  const ox = Math.floor(size / 2);
  const foot = size - pad;
  const h = s.height;
  const f = s.facing;
  const skin = s.skin ?? PAL.skin;
  const hr = Math.max(2.5, h * 0.11);
  const headY = foot - h + hr;
  const shoulderY = headY + hr + h * 0.06;
  const hipY = s.pose === 'sit' ? foot - h * 0.22 : foot - h * 0.47;
  const limb = Math.max(1.2, h * 0.052);
  const body = Math.max(2, h * 0.1);
  const shoe = s.shoe ?? PAL.white;

  // Piernas
  if (s.pose === 'sit') {
    layer.thickLine(ox, hipY, ox + f * h * 0.34, hipY, limb, s.bottom);
    layer.thickLine(ox + f * h * 0.34, hipY, ox + f * h * 0.34, foot - 1, limb, s.bottom);
    layer.fillRect(ox + f * h * 0.34 - 1 + (f > 0 ? 0 : -2), foot - 2, 4, 2, shoe);
  } else if (s.pose === 'walk') {
    layer.thickLine(ox, hipY, ox - f * h * 0.12, foot - 1, limb, s.bottom);
    layer.thickLine(ox, hipY, ox + f * h * 0.16, foot - 2, limb, s.bottom);
    layer.fillRect(ox - f * h * 0.12 - 1, foot - 2, 4, 2, shoe);
    layer.fillRect(ox + f * h * 0.16 - 1, foot - 3, 4, 2, shoe);
  } else {
    layer.thickLine(ox - h * 0.07, hipY, ox - h * 0.08, foot - 1, limb, s.bottom);
    layer.thickLine(ox + h * 0.07, hipY, ox + h * 0.08, foot - 1, limb, s.bottom);
    layer.fillRect(ox - h * 0.08 - 2, foot - 2, 4, 2, shoe);
    layer.fillRect(ox + h * 0.08 - 1, foot - 2, 4, 2, shoe);
  }
  // Torso y chaqueta
  layer.thickLine(ox, shoulderY + 1, ox, hipY, body, s.top);
  layer.line(ox + f * Math.ceil(body * 0.6), shoulderY + 2, ox + f * Math.ceil(body * 0.6), hipY - 1, s.topLight ?? s.top);
  // Brazos
  let hand: Point = { x: ox + f * h * 0.12, y: hipY };
  if (s.pose === 'offer') {
    hand = { x: ox + f * h * 0.42, y: shoulderY + h * 0.1 };
    layer.thickLine(ox, shoulderY + 2, ox + f * h * 0.2, shoulderY + h * 0.12, limb, s.top);
    layer.thickLine(ox + f * h * 0.2, shoulderY + h * 0.12, hand.x, hand.y, limb, s.top);
    layer.fillCircle(hand.x, hand.y, Math.max(1.2, limb * 0.9), skin);
    layer.thickLine(ox, shoulderY + 3, ox - f * h * 0.06, hipY - 2, limb, s.top);
  } else if (s.pose === 'sit') {
    hand = { x: ox + f * h * 0.26, y: hipY - h * 0.12 };
    layer.thickLine(ox, shoulderY + 3, hand.x, hand.y, limb, s.top);
    layer.fillCircle(hand.x, hand.y, Math.max(1.2, limb * 0.9), skin);
  } else {
    hand = { x: ox + f * h * 0.1, y: hipY + h * 0.02 };
    layer.thickLine(ox, shoulderY + 3, ox - h * 0.14, hipY - 1, limb, s.top);
    layer.thickLine(ox, shoulderY + 3, ox + h * 0.14, hipY - 1, limb, s.top);
    layer.fillCircle(ox + h * 0.14, hipY, Math.max(1, limb * 0.8), skin);
    layer.fillCircle(ox - h * 0.14, hipY, Math.max(1, limb * 0.8), skin);
  }
  // Cabeza
  if (s.hood) {
    layer.fillCircle(ox, headY, hr + 1.2, s.top);
    layer.fillEllipse(ox + f * 1.2, headY + 0.5, hr * 0.7, hr * 0.78, 0x0a0612);
    if (s.visor !== undefined) layer.fillRect(ox + f * 1.2 - 2, headY, 4, 1, s.visor);
  } else {
    layer.fillCircle(ox, headY, hr, skin);
    layer.fillEllipse(ox, headY - hr * 0.35, hr * 1.02, hr * 0.7, s.hair ?? PAL.hair);
    layer.fillRect(ox - f * hr * 0.2 + (f > 0 ? 0 : -1), headY - hr * 0.1, Math.max(1, hr * 0.6), 1, PAL.hair, 0.9); // cejas
    layer.putPixel(ox + f * Math.ceil(hr * 0.5), Math.floor(headY + 0.5), OUTLINE, 1);
  }
  if (s.rim !== undefined) {
    layer.line(ox - f * Math.ceil(body), shoulderY + 2, ox - f * Math.ceil(body), hipY - 1, s.rim, 0.8);
    layer.line(ox - f * Math.ceil(hr), headY - 1, ox - f * Math.ceil(hr), headY + 2, s.rim, 0.8);
  }
  layer.outline(OUTLINE);
  c.blit(layer, s.x - ox, s.footY - foot);
  return { hand: { x: s.x - ox + hand.x, y: s.footY - foot + hand.y }, head: { x: s.x, y: s.footY - foot + headY } };
}

/** Suelo oscuro con un degradado y destellos (asfalto mojado). */
export function wetGround(c: PixelCanvas, y: number, top: Rgb, bottom: Rgb): void {
  c.fillGradientV(0, y, c.width, c.height - y, [{ at: 0, color: top }, { at: 1, color: bottom }], 10);
  c.fillRect(0, y, c.width, 1, PAL.indigo, 0.8);
}

/** Palmera de silueta (tronco curvo y hojas caídas). */
export function palmSilhouette(c: PixelCanvas, x: number, baseY: number, h: number, seed: number): void {
  const rnd = createRng(seed);
  const topX = x + 6;
  const topY = baseY - h;
  c.thickLine(x, baseY, x + 2, baseY - h * 0.5, 2, 0x0d2a2e);
  c.thickLine(x + 2, baseY - h * 0.5, topX, topY, 1.6, 0x0d2a2e);
  for (let i = 0; i < 9; i++) {
    const ang = -Math.PI + (i / 8) * Math.PI;
    const len = 20 + rnd() * 8;
    const mx = topX + Math.cos(ang) * len * 0.6;
    const my = topY + Math.sin(ang) * len * 0.45 - 3;
    const ex = topX + Math.cos(ang) * len;
    const ey = topY + Math.sin(ang) * len * 0.3 + 9;
    c.thickLine(topX, topY, mx, my, 1.1, PAL.leafDark);
    c.thickLine(mx, my, ex, ey, 0.8, PAL.leafDark);
    c.line(topX, topY - 1, mx, my - 1, PAL.leafMid, 0.9);
  }
}
