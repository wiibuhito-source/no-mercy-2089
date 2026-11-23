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

/** Sprite suelto que respira (sube y baja un píxel) o vibra, por encima de su capa. */
export interface ArtActor {
  readonly canvas: PixelCanvas;
  readonly x: number;
  readonly y: number;
  readonly bobPx: number;
  readonly bobMs: number;
  readonly phaseMs: number;
  /** Se mece de lado con el viento (píxeles de ida y vuelta) y cada cuántos ms. */
  readonly swayPx?: number;
  readonly swayMs?: number;
}

/** Una capa de la ilustración. Cuanto mayor es `parallax`, más se mueve con la cámara (más cerca). */
export interface ArtLayer {
  readonly canvas: PixelCanvas;
  readonly parallax: number;
  /** Desplazamiento continuo en px/s (negativo = hacia la izquierda). Solo con `tile`. */
  readonly autoScrollX?: number;
  /** La capa se repite sin cortes (su ancho es el del arte). */
  readonly tile?: boolean;
  readonly actors?: readonly ArtActor[];
  /** La capa aparece (con un fundido) cuando empieza esta frase de la escena. */
  readonly revealAtLine?: number;
}

export type SceneArt = readonly ArtLayer[];

export function layer(canvas: PixelCanvas, parallax: number, extra: Partial<Omit<ArtLayer, 'canvas' | 'parallax'>> = {}): ArtLayer {
  return { canvas, parallax, ...extra };
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
  /** Altura de la cadera al sentarse, como fracción de la altura (0.22 = en el suelo; 0.3 = en una silla). */
  readonly seat?: number;
  /** Si existe, la mano se estira hasta este punto (coordenadas del lienzo). */
  readonly reachTo?: Point;
}

export interface PersonResult {
  /** Mano que se adelanta (para colocar objetos en ella). */
  readonly hand: Point;
  readonly head: Point;
}

interface RenderedPerson {
  readonly sprite: PixelCanvas;
  /** Posición del pie/centro dentro del sprite. */
  readonly ox: number;
  readonly foot: number;
  readonly hand: Point;
  readonly headY: number;
}

/** Persona sencilla hecha de cápsulas (siluetas legibles con contorno). Mide `height` píxeles de pies a cabeza. */
function renderPerson(s: PersonStyle): RenderedPerson {
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
  const hipY = s.pose === 'sit' ? foot - h * (s.seat ?? 0.22) : foot - h * 0.47;
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
    hand = s.reachTo ? { x: s.reachTo.x - (s.x - ox), y: s.reachTo.y - (s.footY - foot) } : { x: ox + f * h * 0.26, y: hipY - h * 0.12 };
    const elbow = { x: (ox + hand.x) / 2 + f * 1, y: Math.max(shoulderY + 6, (shoulderY + hand.y) / 2 + 3) };
    layer.thickLine(ox, shoulderY + 3, elbow.x, elbow.y, limb, s.top);
    layer.thickLine(elbow.x, elbow.y, hand.x, hand.y, limb, s.top);
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
  return { sprite: layer, ox, foot, hand, headY };
}

function toResult(r: RenderedPerson, s: PersonStyle): PersonResult {
  return { hand: { x: s.x - r.ox + r.hand.x, y: s.footY - r.foot + r.hand.y }, head: { x: s.x, y: s.footY - r.foot + r.headY } };
}

export function drawPerson(c: PixelCanvas, s: PersonStyle): PersonResult {
  const r = renderPerson(s);
  c.blit(r.sprite, s.x - r.ox, s.footY - r.foot);
  return toResult(r, s);
}

/** Igual que drawPerson, pero devuelve la persona como sprite aparte para que respire. */
export function personActor(s: PersonStyle, bobPx = 1, bobMs = 1800, phaseMs = 0): { actor: ArtActor; at: PersonResult } {
  const r = renderPerson(s);
  return { actor: { canvas: r.sprite, x: s.x - r.ox, y: s.footY - r.foot, bobPx, bobMs, phaseMs }, at: toResult(r, s) };
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

/**
 * Siluetas de rascacielos que se repiten sin cortes: cada edificio se dibuja también desplazado un ancho de lienzo,
 * así lo que sale por la derecha entra por la izquierda (para capas que se desplazan solas).
 */
export function skylineWrap(c: PixelCanvas, seed: number, baseY: number, minH: number, maxH: number, color: Rgb, lit: number, neon: readonly Rgb[] = []): void {
  const rnd = createRng(seed);
  let x = 0;
  while (x < c.width) {
    const w = 16 + Math.floor(rnd() * 24);
    const h = minH + Math.floor(rnd() * (maxH - minH));
    const winSeed = Math.floor(rnd() * 99999);
    const neonColor = neon.length > 0 && rnd() < 0.4 ? neon[Math.floor(rnd() * neon.length)] : undefined;
    const roof = rnd() < 0.3;
    for (const dx of [0, -c.width]) {
      c.fillRect(x + dx, baseY - h, w, h, color);
      c.fillRect(x + dx, baseY - h, w, 1, PAL.indigo, 0.9);
      if (roof) c.fillRect(x + dx + Math.floor(w / 2), baseY - h - 7, 1, 7, color);
      if (lit > 0) windows(c, x + dx, baseY - h, w, h, winSeed, lit);
      if (neonColor !== undefined) c.fillRect(x + dx + w - 2, baseY - h + 3, 1, Math.floor(h * 0.6), neonColor, 0.85);
    }
    x += w + Math.floor(rnd() * 3);
  }
}

/** Cable que cuelga entre dos puntos (parábola) con aisladores. */
export function powerLine(c: PixelCanvas, x0: number, y0: number, x1: number, y1: number, sag: number, color: Rgb = 0x0a0612, alpha = 0.95): void {
  let px = x0;
  let py = y0;
  const steps = Math.max(8, Math.floor(Math.abs(x1 - x0) / 4));
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = x0 + (x1 - x0) * t;
    const y = y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * sag;
    c.line(px, py, x, y, color, alpha);
    px = x;
    py = y;
  }
}

/** Cartel holográfico: panel translúcido con borde, líneas de escaneo y varias líneas de texto. */
export function holoPanel(c: PixelCanvas, x: number, y: number, w: number, h: number, color: Rgb, fill = 0x1a0a2e): void {
  c.fillRect(x, y, w, h, fill, 0.8);
  c.strokeRect(x, y, w, h, color, 0.95);
  c.strokeRect(x + 2, y + 2, w - 4, h - 4, color, 0.3);
  for (let yy = y + 4; yy < y + h - 2; yy += 3) c.fillRect(x + 3, yy, w - 6, 1, color, 0.07);
}

/** Coche aparcado de perfil (silueta con cristales, ruedas y faro). */
export function parkedCar(c: PixelCanvas, x: number, groundY: number, w: number, body: Rgb, glass: Rgb, light: Rgb, facing: 1 | -1 = 1): void {
  const h = Math.round(w * 0.3);
  const top = groundY - h - 4;
  c.fillRect(x, top + 6, w, h - 2, body);
  c.fillPolygon(
    [
      { x: x + w * 0.2, y: top + 6 },
      { x: x + w * 0.32, y: top },
      { x: x + w * 0.68, y: top },
      { x: x + w * 0.8, y: top + 6 }
    ],
    body
  );
  c.fillPolygon(
    [
      { x: x + w * 0.25, y: top + 5 },
      { x: x + w * 0.34, y: top + 1 },
      { x: x + w * 0.66, y: top + 1 },
      { x: x + w * 0.75, y: top + 5 }
    ],
    glass
  );
  c.fillRect(x + w * 0.5, top + 1, 1, 4, body);
  c.fillRect(x, top + 6, w, 1, PAL.indigo, 0.8);
  const frontX = facing > 0 ? x + w - 3 : x;
  c.fillRect(frontX, top + 9, 3, 2, light);
  c.fillRect(facing > 0 ? x : x + w - 3, top + 9, 3, 2, PAL.red, 0.9);
  for (const wx of [x + w * 0.22, x + w * 0.78]) {
    c.fillCircle(wx, groundY - 3, 4, 0x05020d);
    c.fillCircle(wx, groundY - 3, 1.6, 0x4a4f7a);
  }
  c.fillRect(x + 2, groundY - 1, w - 4, 1, 0x05020d, 0.6);
}

/** Caja de aire acondicionado en una pared, con rejilla y goteo. */
export function acUnit(c: PixelCanvas, x: number, y: number): void {
  c.fillRect(x, y, 14, 9, 0x4a4f7a);
  c.fillRect(x, y, 14, 1, 0x8a8fb5);
  for (let i = 0; i < 4; i++) c.fillRect(x + 2, y + 2 + i * 2, 10, 1, 0x1c1844);
  c.fillRect(x + 11, y + 6, 2, 1, PAL.red, 0.8);
  c.fillRect(x + 6, y + 9, 1, 3, PAL.cyan, 0.4);
}

/** Cuerda de tender con ropa colgada. */
export function laundryLine(c: PixelCanvas, x0: number, y0: number, x1: number, y1: number, seed: number): void {
  const rnd = createRng(seed);
  powerLine(c, x0, y0, x1, y1, 4, 0x6a6a8a, 0.9);
  const colors = [0xff7aa8, 0xffd36b, 0x6ad0ff, 0xf4f0ff, 0x9a6aff];
  for (let x = x0 + 6; x < x1 - 4; x += 8 + Math.floor(rnd() * 5)) {
    const t = (x - x0) / (x1 - x0);
    const y = y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * 4;
    c.fillRect(x, y, 5, 7 + Math.floor(rnd() * 4), colors[Math.floor(rnd() * colors.length)] ?? 0xffffff, 0.85);
  }
}

/** Bolsa de basura negra con brillo. */
export function trashBag(c: PixelCanvas, x: number, y: number): void {
  c.fillEllipse(x, y - 4, 6, 5, 0x0a0a16);
  c.fillRect(x - 1, y - 10, 2, 3, 0x0a0a16);
  c.setPixel(x - 3, y - 6, 0x4a4f7a, 0.7);
}

/** Cinta amarilla de precinto tendida entre dos puntos. */
export function crimeTape(c: PixelCanvas, x0: number, y0: number, x1: number, y1: number, sag: number): void {
  const steps = Math.floor(Math.abs(x1 - x0));
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const x = x0 + (x1 - x0) * t;
    const y = y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * sag;
    const stripe = Math.floor(i / 5) % 2 === 0;
    c.fillRect(x, y, 1, 4, stripe ? 0xffd23a : 0x14101e);
  }
}

/** Hoja de palmera curvada que cae, con hojuelas. (dirX, dirY) = hacia dónde sale del tronco. */
export function frond(c: PixelCanvas, x0: number, y0: number, dirX: number, dirY: number, len: number, color: Rgb, shine?: Rgb): void {
  let px = x0;
  let py = y0;
  const steps = Math.floor(len / 3);
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = x0 + dirX * len * t;
    const y = y0 + dirY * len * t + 0.022 * (len * t) * (len * t) * 0.35;
    c.thickLine(px, py, x, y, 1.3 - t * 0.6, color);
    if (shine !== undefined) c.line(px, py - 1, x, y - 1, shine, 0.7);
    if (i % 2 === 0) {
      const side = dirX >= 0 ? 1 : -1;
      c.line(x, y, x - side * 1 - 1, y + 5 + (1 - t) * 3, color, 0.95);
      c.line(x, y, x + side * 5, y + 4 + (1 - t) * 3, color, 0.95);
    }
    px = x;
    py = y;
  }
}

/** Borra un rectángulo (lo deja transparente): sirve para abrir ventanas en una pared y ver la capa de detrás. */
export function eraseRect(c: PixelCanvas, x: number, y: number, w: number, h: number): void {
  for (let yy = Math.floor(y); yy < Math.floor(y + h); yy++) for (let xx = Math.floor(x); xx < Math.floor(x + w); xx++) if (c.inBounds(xx, yy)) c.putPixel(xx, yy, 0, 0);
}

/** Pieza suelta que se mece de lado con el viento (ropa, hojas, cables, toldos). */
export function swayActor(canvas: PixelCanvas, x: number, y: number, swayPx = 1, swayMs = 3200, phaseMs = 0): ArtActor {
  return { canvas, x, y, bobPx: 0, bobMs: 1000, phaseMs, swayPx, swayMs };
}
