// Herramientas de dibujo compartidas por las ilustraciones de la cinemática (arte PROVISIONAL; sin Phaser).
import { createRng } from '../../../core/rng';
import { PixelCanvas, type ColorStop, type Point, type Rgb } from '../../../core/pixelCanvas';
import { PAL } from '../../../data/menuPalette';
import { drawPixelText } from '../../../core/pixelText';
import { buildGlowDisc } from '../../menu/art/glow';
import { renderCharacter, type PersonStyle, type RenderedPerson } from './characters';

/** Las ilustraciones son un poco más grandes que la pantalla (480x270) para poder deslizar la cámara sin enseñar bordes. */
export const ART_W = 500;
export const ART_H = 280;

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
  /** Si existe, el sprite se anima cambiando de fotograma cada `frameMs` (ciclo de correr, el gato...). */
  readonly frames?: readonly PixelCanvas[];
  readonly frameMs?: number;
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
  /** La capa desaparece (con un fundido) cuando empieza esta frase de la escena. */
  readonly hideAtLine?: number;
  /** Duración del fundido al aparecer/desaparecer (ms); 450 por defecto. Corto sirve para cambiar de postura. */
  readonly fadeMs?: number;
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

export type { PersonStyle } from './characters';
export { OUTLINE } from './characters';

export interface PersonResult {
  /** Mano que se adelanta (para colocar objetos en ella). */
  readonly hand: Point;
  readonly head: Point;
}

function toResult(r: RenderedPerson, s: PersonStyle): PersonResult {
  return { hand: { x: s.x - r.ox + r.hand.x, y: s.footY - r.foot + r.hand.y }, head: { x: s.x, y: s.footY - r.foot + r.headY } };
}

/** Dibuja un personaje directamente en el lienzo. */
export function drawPerson(c: PixelCanvas, s: PersonStyle): PersonResult {
  const r = renderCharacter(s);
  c.blit(r.sprite, s.x - r.ox, s.footY - r.foot);
  return toResult(r, s);
}

/**
 * Personaje animado: `count` fotogramas de un ciclo de andar o correr (cada uno con las articulaciones en otro punto).
 * `decorate` permite dibujar algo en la mano de cada fotograma (una bolsa, un móvil...), que así se mueve con el brazo.
 */
export function personFrames(
  s: PersonStyle,
  count: number,
  frameMs: number,
  decorate?: (canvas: PixelCanvas, hand: Point, frame: number) => void
): { actor: ArtActor; at: PersonResult } {
  const rs = Array.from({ length: count }, (_, i) => {
    const r = renderCharacter({ ...s, phase: i / count });
    decorate?.(r.sprite, r.hand, i);
    return r;
  });
  const first = rs[0];
  if (!first) throw new Error('personFrames necesita al menos un fotograma');
  return {
    actor: { canvas: first.sprite, x: s.x - first.ox, y: s.footY - first.foot, bobPx: 0, bobMs: 1000, phaseMs: 0, frames: rs.map((r) => r.sprite), frameMs },
    at: toResult(first, s)
  };
}

/** Copia de un actor animado con transparencia y desfasado `delay` fotogramas: la "estela" de quien corre. */
export function ghostOf(actor: ArtActor, delay: number, alpha: number, dx: number): ArtActor {
  const frames = actor.frames ?? [actor.canvas];
  const out = frames.map((_, i) => {
    const src = frames[(((i - delay) % frames.length) + frames.length) % frames.length] ?? actor.canvas;
    const g = new PixelCanvas(src.width, src.height);
    g.blit(src, 0, 0, { alpha });
    return g;
  });
  return { ...actor, canvas: out[0] ?? actor.canvas, frames: out, x: actor.x + dx };
}

/**
 * Personaje sentado que de vez en cuando da un sorbo a su taza: el ciclo alterna "taza en el regazo" y "taza en la boca".
 * La taza se dibuja en cada fotograma, en la mano.
 */
export function sipActor(s: PersonStyle, frameMs = 460, sipFrames = 2, restFrames = 6): { actor: ArtActor; at: PersonResult } {
  const draw = (c: PixelCanvas, hand: Point): void => {
    c.fillRect(hand.x - 1, hand.y - 4, 5, 5, 0xfff0d2);
    c.fillRect(hand.x + 4, hand.y - 3, 2, 3, 0xfff0d2, 0.75);
    c.fillRect(hand.x, hand.y - 4, 3, 1, 0x7a4a2a);
  };
  const rest = renderCharacter(s);
  draw(rest.sprite, rest.hand);
  const base = toResult(rest, s);
  const mouth = { x: base.head.x + s.facing * (s.height * 0.1), y: base.head.y + s.height * 0.045 };
  const sip = renderCharacter({ ...s, reachTo: mouth });
  draw(sip.sprite, sip.hand);
  const frames = [...Array.from({ length: restFrames }, () => rest.sprite), ...Array.from({ length: sipFrames }, () => sip.sprite)];
  return {
    actor: { canvas: rest.sprite, x: s.x - rest.ox, y: s.footY - rest.foot, bobPx: 1, bobMs: 2600, phaseMs: 0, frames, frameMs },
    at: base
  };
}

/** Igual que drawPerson, pero devuelve la persona como sprite aparte para que respire. */
export function personActor(s: PersonStyle, bobPx = 1, bobMs = 1800, phaseMs = 0): { actor: ArtActor; at: PersonResult } {
  const r = renderCharacter(s);
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

/** Reflejo de espejo hacia abajo (suelo mojado, agua): copia lo que hay por encima de `y0` dándole la vuelta. */
export function reflectDown(dst: PixelCanvas, src: PixelCanvas, y0: number, depth: number, strength = 0.5, wobble = 1.5, x0 = 0, x1 = src.width): void {
  for (let i = 0; i < depth; i++) {
    const sy = y0 - 1 - i;
    if (sy < 0) break;
    const k = Math.pow(1 - i / depth, 1.3) * strength;
    const dx = Math.round(Math.sin(i * 0.8) * wobble * (0.3 + i / depth));
    for (let x = x0; x < x1; x++) {
      const a = src.alphaAt(x + dx, sy);
      if (a > 0.05) dst.setPixel(x, y0 + i, src.colorAt(x + dx, sy), k * a);
    }
  }
}

/** Banda de bruma: transparencia que varía de arriba a abajo. */
export function haze(c: PixelCanvas, y0: number, y1: number, color: Rgb, aTop: number, aBottom: number, x = 0, w = c.width): void {
  for (let y = y0; y < y1; y++) c.fillRect(x, y, w, 1, color, aTop + (aBottom - aTop) * ((y - y0) / Math.max(1, y1 - y0)));
}

/** Haz de luz que se ensancha hacia abajo (farola, ventana, foco). */
export function lightShaft(c: PixelCanvas, x: number, y: number, w0: number, w1: number, len: number, color: Rgb, alpha: number): void {
  for (let i = 0; i < len; i++) {
    const k = i / len;
    const w = w0 + (w1 - w0) * k;
    c.fillRect(x - w / 2, y + i, w, 1, color, alpha * (1 - k) * (1 - k * 0.3));
  }
}

/** Sombra de contacto bajo un objeto. */
export function contactShadow(c: PixelCanvas, x: number, y: number, w: number, alpha = 0.55): void {
  for (let i = 0; i < 3; i++) c.fillEllipse(x, y + 0.4, w * (0.5 - i * 0.1), 1.2 + i * 0.4, 0x05020d, alpha * (0.55 - i * 0.12));
}

/** Hoja de palmera gruesa y bonita: silueta con nervio y borde iluminado. (dx, dy) = hacia dónde sale. */
export function leaf(c: PixelCanvas, x0: number, y0: number, dx: number, dy: number, len: number, color: Rgb, light: Rgb, droop = 0.55): void {
  const steps = Math.max(6, Math.floor(len / 2));
  let px = x0;
  let py = y0;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = x0 + dx * len * t;
    const y = y0 + dy * len * t + droop * len * t * t * 0.9;
    const r = (1 - t) * 3.1 + 0.5;
    c.thickLine(px, py, x, y, r, color);
    c.line(px, py - r * 0.7, x, y - r * 0.7, light, 0.75);
    if (i % 2 === 0) {
      const side = dx >= 0 ? 1 : -1;
      c.line(x, y, x - side * 2, y + r * 2.6 + 2, color, 0.95);
      c.line(x, y, x + side * 4, y + r * 2.2 + 1, color, 0.95);
    }
    px = x;
    py = y;
  }
}

/** Refleja un sprite suelto (personaje, carrito...) en el suelo brillante, bajo sus pies. */
export function reflectActor(dst: PixelCanvas, actor: ArtActor, footY: number, depth: number, strength = 0.35): void {
  const tmp = new PixelCanvas(dst.width, dst.height);
  tmp.blit(actor.canvas, actor.x, actor.y);
  reflectDown(dst, tmp, footY, depth, strength, 1);
}

/** Rótulo de neón vertical (letras apiladas) que sobresale de una pared. */
export function bladeSign(c: PixelCanvas, x: number, y: number, text: string, color: Rgb): void {
  const h = text.length * 9 + 6;
  c.fillRect(x, y, 12, h, 0x0a0618);
  c.strokeRect(x, y, 12, h, color, 0.95);
  c.fillRect(x + 5, y - 6, 2, 6, 0x4a4f7a);
  for (let i = 0; i < text.length; i++) drawPixelText(c, text[i] ?? '', x + 3, y + 4 + i * 9, { color: 0xffffff, shadow: color });
  c.blit(buildGlowDisc(Math.max(16, h / 2), color, 4, 0.22), x - Math.max(16, h / 2) + 6, y + h / 2 - Math.max(16, h / 2));
}
