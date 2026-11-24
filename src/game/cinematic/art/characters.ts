// Personajes de la cinemática (arte PROVISIONAL dibujado por código, sin Phaser).
// Figuras de perfil con proporciones reales: cabeza pequeña, cuello, torso con ropa, brazos y piernas articulados,
// cara (ojo, ceja, nariz), pelo, zapatillas, sombreado automático y luz de borde (neón).
import { PixelCanvas, type Point, type Rgb } from '../../../core/pixelCanvas';

export const OUTLINE = 0x0a0612;

export type Pose = 'stand' | 'walk' | 'run' | 'sit' | 'offer';
export type HairStyle = 'short' | 'messy' | 'long' | 'bun' | 'bald';
export type Outfit = 'hoodie' | 'jacket' | 'tee' | 'uniform';

export interface PersonStyle {
  readonly x: number;
  /** Altura de los pies (suelo). */
  readonly footY: number;
  readonly height: number;
  /** 1 = mira a la derecha, -1 = a la izquierda. */
  readonly facing: 1 | -1;
  readonly pose: Pose;
  readonly skin?: Rgb;
  readonly hair?: Rgb;
  readonly hairStyle?: HairStyle;
  readonly top: Rgb;
  readonly topLight?: Rgb;
  readonly bottom: Rgb;
  readonly shoe?: Rgb;
  readonly outfit?: Outfit;
  /** Capucha puesta: cara en sombra con visor. */
  readonly hood?: boolean;
  readonly visor?: Rgb;
  /** Luz de borde (neón) en el lado contrario al que mira. */
  readonly rim?: Rgb;
  /** Altura de la cadera al sentarse, como fracción de la altura (0.26 = silla normal). */
  readonly seat?: number;
  /** Si existe, la mano se estira hasta este punto (coordenadas del lienzo). */
  readonly reachTo?: Point;
  /** De espaldas: sin cara. */
  readonly back?: boolean;
  /** Gafas de visor (como las de Adrián de adulto). */
  readonly glasses?: Rgb;
  /** Sin sombra en el suelo (si la escena ya la dibuja). */
  readonly noShadow?: boolean;
}

export interface RenderedPerson {
  readonly sprite: PixelCanvas;
  /** Posición del pie/centro dentro del sprite. */
  readonly ox: number;
  readonly foot: number;
  readonly hand: Point;
  readonly headY: number;
}

function mul(c: Rgb, k: number): Rgb {
  const r = Math.min(255, Math.max(0, Math.round(((c >> 16) & 255) * k)));
  const g = Math.min(255, Math.max(0, Math.round(((c >> 8) & 255) * k)));
  const b = Math.min(255, Math.max(0, Math.round((c & 255) * k)));
  return (r << 16) | (g << 8) | b;
}

function mix(a: Rgb, b: Rgb, t: number): Rgb {
  const ch = (s: number): number => Math.round(((a >> s) & 255) * (1 - t) + ((b >> s) & 255) * t);
  return (ch(16) << 16) | (ch(8) << 8) | ch(0);
}

/** Dibuja una extremidad de dos tramos con articulación redonda. */
function limb(c: PixelCanvas, a: Point, b: Point, d: Point, w: number, color: Rgb): void {
  c.thickLine(a.x, a.y, b.x, b.y, w / 2, color);
  c.thickLine(b.x, b.y, d.x, d.y, w / 2, color);
  c.fillCircle(b.x, b.y, w / 2, color);
}

export function renderCharacter(s: PersonStyle): RenderedPerson {
  const h = s.height;
  const pad = Math.ceil(h * 0.7);
  const size = Math.ceil(h + pad * 2);
  const c = new PixelCanvas(size, size);
  const ox = Math.floor(size / 2);
  const foot = size - pad;
  const f = s.facing;
  const skin = s.skin ?? 0xe0a878;
  const skinShade = mul(skin, 0.78);
  const hairC = s.hair ?? 0x1a0f14;
  const top = s.top;
  const topShade = mul(top, 0.7);
  const topLight = s.topLight ?? mix(top, 0xffffff, 0.28);
  const bottom = s.bottom;
  const bottomShade = mul(bottom, 0.72);
  const shoe = s.shoe ?? 0xf0eaff;
  const outfit: Outfit = s.outfit ?? (s.hood ? 'hoodie' : 'hoodie');
  const seat = s.seat ?? 0.26;

  const headH = Math.max(6, Math.round(h * 0.165));
  const headW = Math.max(5, Math.round(headH * 0.84));
  const neck = Math.max(1, Math.round(h * 0.03));
  const torsoLen = h * 0.3;
  const legLen = h * 0.46;
  const armW = Math.max(2.6, h * 0.078);
  const legW = Math.max(3.2, h * 0.108);

  // ---- Esqueleto según la postura (coordenadas del sprite; el eje x se multiplica por f)
  const sit = s.pose === 'sit';
  const hipY = sit ? foot - h * seat : foot - legLen;
  const lean = s.pose === 'run' ? h * 0.1 : s.pose === 'walk' ? h * 0.025 : sit ? h * 0.01 : 0;
  const shY = hipY - torsoLen;
  const P = (x: number, y: number): Point => ({ x: ox + f * x, y });
  const hip = P(-0.01 * h, hipY);
  const shoulder = P(lean + 0.005 * h, shY + h * 0.035);

  let legNear: [Point, Point, Point];
  let legFar: [Point, Point, Point];
  let armNear: [Point, Point, Point];
  let armFar: [Point, Point, Point];
  let handNear: Point;

  if (s.pose === 'walk') {
    legNear = [hip, P(0.09 * h, hipY + legLen * 0.52), P(0.15 * h, foot - 1)];
    legFar = [hip, P(-0.05 * h, hipY + legLen * 0.54), P(-0.13 * h, foot - h * 0.03)];
    handNear = P(lean - 0.08 * h, shY + h * 0.27);
    armNear = [shoulder, P(lean - 0.04 * h, shY + h * 0.2), handNear];
    armFar = [shoulder, P(lean + 0.06 * h, shY + h * 0.2), P(lean + 0.1 * h, shY + h * 0.3)];
  } else if (s.pose === 'run') {
    legNear = [hip, P(0.17 * h, hipY + legLen * 0.1), P(0.1 * h, hipY + legLen * 0.62)];
    legFar = [hip, P(-0.07 * h, hipY + legLen * 0.5), P(-0.22 * h, foot - 1)];
    handNear = P(lean + 0.2 * h, shY + h * 0.1);
    armNear = [shoulder, P(lean + 0.1 * h, shY + h * 0.2), handNear];
    armFar = [shoulder, P(lean - 0.09 * h, shY + h * 0.17), P(lean - 0.15 * h, shY + h * 0.08)];
  } else if (sit) {
    const kneeX = 0.22 * h;
    legNear = [hip, P(kneeX, hipY - h * 0.005), P(kneeX + 0.02 * h, foot - 1)];
    legFar = [hip, P(kneeX - 0.04 * h, hipY + h * 0.005), P(kneeX - 0.02 * h, foot - 1)];
    const free = P(lean + 0.19 * h, hipY - h * 0.14);
    if (s.reachTo) handNear = { x: s.reachTo.x - (s.x - ox), y: s.reachTo.y - (s.footY - foot) };
    else handNear = free;
    const elbow = s.reachTo ? P(lean + (handNear.x - ox) * f * 0.5 + 0.02 * h, Math.max(shY + h * 0.2, (shoulder.y + handNear.y) / 2 + 3)) : P(lean + 0.07 * h, hipY - h * 0.1);
    armNear = [shoulder, elbow, handNear];
    armFar = [shoulder, P(lean + 0.05 * h, hipY - h * 0.1), P(lean + 0.12 * h, hipY - h * 0.1)];
  } else if (s.pose === 'offer') {
    legNear = [hip, P(0.01 * h, hipY + legLen * 0.5), P(0.03 * h, foot - 1)];
    legFar = [hip, P(-0.02 * h, hipY + legLen * 0.5), P(-0.05 * h, foot - 1)];
    handNear = P(lean + 0.4 * h, shY + h * 0.13);
    armNear = [shoulder, P(lean + 0.2 * h, shY + h * 0.14), handNear];
    armFar = [shoulder, P(lean - 0.01 * h, shY + h * 0.22), P(lean + 0.03 * h, shY + h * 0.31)];
  } else {
    legNear = [hip, P(0.012 * h, hipY + legLen * 0.5), P(0.035 * h, foot - 1)];
    legFar = [hip, P(-0.015 * h, hipY + legLen * 0.5), P(-0.05 * h, foot - 1)];
    handNear = P(lean + 0.035 * h, shY + h * 0.3);
    armNear = [shoulder, P(lean + 0.01 * h, shY + h * 0.19), handNear];
    armFar = [shoulder, P(lean - 0.03 * h, shY + h * 0.19), P(lean - 0.02 * h, shY + h * 0.3)];
  }

  const drawShoe = (p: Point, dark: boolean): void => {
    const len = Math.max(4, h * 0.15);
    const col = dark ? mul(shoe, 0.75) : shoe;
    c.fillPolygon([{ x: p.x - f * 1.5, y: p.y - h * 0.045 }, { x: p.x + f * len * 0.55, y: p.y - h * 0.04 }, { x: p.x + f * len, y: p.y - 1 }, { x: p.x + f * len, y: p.y + 0.5 }, { x: p.x - f * 2, y: p.y + 0.5 }], col);
    c.fillRect(Math.min(p.x - f * 2, p.x + f * len), p.y, len + 2, 1, mul(col, 0.45)); // suela
  };

  // ---- Capas: pierna lejana, brazo lejano, tronco, pierna cercana, brazo cercano, cabeza
  limb(c, legFar[0], legFar[1], legFar[2], legW, bottomShade);
  drawShoe(legFar[2], true);
  limb(c, armFar[0], armFar[1], armFar[2], armW, topShade);
  c.fillCircle(armFar[2].x, armFar[2].y, armW * 0.55, skinShade);

  // Torso (perfil: más ancho en el pecho que en la cintura)
  const T = (x: number, y: number): Point => ({ x: ox + f * (lean * (1 - (y - shY) / torsoLen) + x), y });
  c.fillPolygon([T(-0.1 * h, shY + 0.01 * h), T(0.065 * h, shY), T(0.1 * h, shY + 0.1 * h), T(0.09 * h, hipY + 0.03 * h), T(-0.095 * h, hipY + 0.03 * h)], top);
  // pantalón/cadera asomando bajo la chaqueta
  c.fillRect(Math.min(ox - f * 0.08 * h, ox + f * 0.07 * h), hipY + 0.01 * h, Math.abs(0.15 * h), Math.max(2, 0.04 * h), bottom);
  // sombra en la espalda y luz en el pecho
  c.thickLine(T(-0.08 * h, shY + 0.04 * h).x, shY + 0.04 * h, T(-0.08 * h, hipY).x, hipY, 0.9, topShade);
  c.thickLine(T(0.05 * h, shY + 0.03 * h).x, shY + 0.03 * h, T(0.07 * h, shY + 0.14 * h).x, shY + 0.14 * h, 0.7, topLight);

  if (outfit === 'hoodie') {
    c.fillEllipse(T(-0.075 * h, shY + 0.005 * h).x, shY + 0.01 * h, Math.max(2, 0.05 * h), Math.max(1.5, 0.035 * h), topShade); // capucha doblada
    const px = T(0.0, 0).x;
    c.fillRect(Math.min(px, px + f * 0.075 * h), shY + 0.19 * h, Math.abs(0.075 * h), Math.max(2, 0.07 * h), topShade, 0.9); // bolsillo
    c.fillRect(T(0.07 * h, 0).x, shY + 0.045 * h, 1, Math.max(2, 0.07 * h), 0xf4f0ff, 0.85); // cordón
  } else if (outfit === 'jacket') {
    c.line(T(0.062 * h, 0).x, shY + 0.02 * h, T(0.075 * h, 0).x, hipY, mul(top, 0.55)); // cremallera
    c.fillRect(Math.min(T(0.0, 0).x, T(0.07 * h, 0).x), shY, Math.abs(0.07 * h) + 1, 2, mul(top, 0.6)); // cuello
    c.fillRect(T(-0.085 * h, 0).x, hipY - 1, 1.5 * f, 2, topLight);
  } else if (outfit === 'uniform') {
    c.fillRect(Math.min(T(0.0, 0).x, T(0.07 * h, 0).x), shY, Math.abs(0.07 * h) + 1, 2, 0xf4f0ff, 0.9);
    c.fillRect(T(0.03 * h, 0).x, shY + 0.1 * h, 2 * f, 2, 0xffd36b); // identificador
    c.fillRect(Math.min(T(-0.085 * h, 0).x, T(0.08 * h, 0).x), hipY - 1, Math.abs(0.165 * h), 2, mul(top, 0.55)); // cinturón
  } else {
    c.fillRect(Math.min(T(0.0, 0).x, T(0.07 * h, 0).x), shY, Math.abs(0.07 * h) + 1, 1, mul(top, 0.7)); // cuello camiseta
  }

  // Piernas cercanas
  limb(c, legNear[0], legNear[1], legNear[2], legW * 1.05, bottom);
  c.thickLine(legNear[0].x, legNear[0].y + 1, legNear[1].x, legNear[1].y, 0.5, mix(bottom, 0xffffff, 0.18)); // luz en el muslo
  c.fillRect(legNear[1].x - 1, legNear[1].y + 1, 2, 1, bottomShade); // pliegue de la rodilla
  drawShoe(legNear[2], false);
  if (s.pose === 'run' || s.pose === 'walk') {
    c.fillRect(legNear[2].x + f * 0.06 * h, legNear[2].y - h * 0.02, 1, 1, s.rim ?? 0xff7aa8); // detalle de la zapatilla
  }

  // Brazo cercano con manga y puño
  limb(c, armNear[0], armNear[1], armNear[2], armW * 1.05, top);
  c.thickLine(armNear[0].x, armNear[0].y, armNear[1].x, armNear[1].y, 0.5, topLight);
  const cuff = mix(top, 0xffffff, 0.15);
  c.fillCircle(armNear[2].x - (armNear[2].x - armNear[1].x) * 0.18, armNear[2].y - (armNear[2].y - armNear[1].y) * 0.18, armW * 0.62, cuff);
  c.fillCircle(armNear[2].x, armNear[2].y, Math.max(1.3, armW * 0.55), skin);

  // Cuello y cabeza
  const hx = ox + f * (lean + 0.012 * h);
  const hy = shY - neck - headH / 2 + 1;
  c.fillRect(hx - f * 1, shY - neck, 2, neck + 2, skinShade);
  const rx = headW / 2;
  const ry = headH / 2;
  if (s.hood) {
    c.fillEllipse(hx - f * 0.6, hy, rx + 1.6, ry + 1.3, top);
    c.fillEllipse(hx - f * 1.8, hy + 0.5, rx + 0.8, ry + 0.8, topShade);
    c.fillEllipse(hx + f * 1.2, hy + 0.5, rx * 0.72, ry * 0.8, 0x0a0612);
    if (s.visor !== undefined) {
      c.fillRect(hx + f * 1.2 - 2, hy, 4, 1, s.visor);
      c.fillRect(hx + f * 1.2 - 2, hy - 1, 4, 1, s.visor, 0.3);
    }
    c.line(hx - f * 0.5, hy - ry, hx + f * 2.2, hy - ry + 1, topLight, 0.9);
  } else {
    // pelo detrás, cara, y pelo por delante
    const style: HairStyle = s.hairStyle ?? 'short';
    if (style === 'long') {
      c.fillEllipse(hx - f * 1.2, hy + 0.5, rx + 0.8, ry + 0.8, hairC);
      c.thickLine(hx - f * (rx * 0.6), hy, hx - f * (rx * 0.9 + 0.5), shY + h * 0.12, 1.9, hairC);
    }
    c.fillEllipse(hx, hy, rx, ry, skin);
    c.fillRect(hx + f * (rx * 0.3), hy + ry * 0.55, Math.max(1, rx * 0.8), 1, skinShade, 0.5); // sombra bajo el labio
    if (style !== 'bald') {
      c.fillEllipse(hx - f * 0.6, hy - ry * 0.45, rx + 0.5, ry * 0.7, hairC);
      c.fillRect(hx - f * (rx + 0.5), hy - ry * 0.4, Math.max(1, 1.4), ry * 1.0, hairC); // nuca
      if (style === 'messy') for (const dx of [-0.9, -0.1, 0.8]) c.fillRect(hx + f * dx * rx - 0.5, hy - ry - 1, 1, 2, hairC);
      if (style === 'bun') c.fillCircle(hx - f * (rx * 0.8), hy - ry - 0.5, 2.1, hairC);
      c.fillEllipse(hx + f * rx * 0.45, hy + ry * 0.12, rx * 0.62, ry * 0.7, skin); // frente despejada
      c.fillRect(hx + f * (rx * 0.1), hy - ry * 0.12, Math.max(1, rx * 0.7), 1, mul(hairC, 1.3), 0.7); // flequillo
    }
    // oreja, ojo, ceja, nariz
    c.putPixel(hx - f * 0.6, Math.round(hy + 0.3), skinShade, 1);
    if (!s.back) {
      const ex = hx + f * (rx * 0.5);
      if (s.glasses !== undefined) {
        c.fillRect(ex - f * 1.5 - (f < 0 ? 2 : 0), hy - 0.5, 4, 2, 0x0a0612);
        c.fillRect(ex - f * 1 - (f < 0 ? 1 : 0), hy - 0.5, 3, 1, s.glasses);
      } else {
        c.putPixel(ex, Math.round(hy - 0.2), 0x1a0f14, 1);
        c.putPixel(ex + f, Math.round(hy - 0.2), 0xffffff, 0.35);
      }
      c.fillRect(ex - (f < 0 ? 1 : 0), hy - 1.8, 2, 1, mul(hairC, 0.9));
      c.putPixel(hx + f * (rx + 0.4), Math.round(hy + ry * 0.2), mix(skin, 0xffffff, 0.15), 1);
    }
  }

  // ---- Sombreado automático de bordes: luz arriba, sombra debajo, luz de neón por detrás
  const mask: boolean[] = [];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) mask.push(c.alphaAt(x, y) > 0.5);
  const at = (x: number, y: number): boolean => x >= 0 && y >= 0 && x < size && y < size && (mask[y * size + x] ?? false);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!at(x, y)) continue;
      const col = c.colorAt(x, y);
      if (!at(x, y - 1)) c.putPixel(x, y, mix(col, 0xffffff, 0.22), 1);
      else if (!at(x, y + 1)) c.putPixel(x, y, mul(col, 0.7), 1);
      if (s.rim !== undefined && !at(x - f, y) && y < hipY + h * 0.2 && y > hy - 1) c.putPixel(x, y, mix(col, s.rim, 0.55), 1);
    }
  }
  c.outline(OUTLINE);
  if (!s.noShadow) {
    for (let i = 0; i < 4; i++) c.fillEllipse(ox + f * h * 0.04, foot + 0.5 + i * 0.2, h * (0.3 - i * 0.04), 1.4 + i * 0.3, 0x05020d, 0.0);
  }
  return { sprite: c, ox, foot, hand: handNear, headY: hy };
}
