// Adrián Vega sentado en el capó, relajado (arte PROVISIONAL dibujado por código; sin Phaser).
// Va en capas separadas para poder animar la respiración: torso, piernas, brazo y cabeza.
import { PAL } from '../../../data/menuPalette';
import { PixelCanvas } from '../../../core/pixelCanvas';

export const ADRIAN_W = 54;
export const ADRIAN_H = 42;
/** Dónde sale el vapor del cafecito (boca de la taza) dentro de la capa del brazo. */
export const ADRIAN_CUP = { x: 31, y: 19 } as const;
/** Cristal de las gafas de neón dentro de la capa de la cabeza (para el destello). */
export const ADRIAN_VISOR = { x: 16, y: 9, w: 5, h: 2 } as const;

const OUTLINE = 0x0a0612;
const JACKET = 0x2d2478;
const JACKET_DARK = 0x1c1654;
const JACKET_LIGHT = 0x5a4bd0;
const TEE = 0xece6fa;
const TEE_SHADE = 0xb4abd8;
const JEANS = 0x1f3068;
const JEANS_LIGHT = 0x3b58b4;
const JEANS_DARK = 0x131c46;
const SHOE = 0xf4f1ff;
const SHOE_SHADE = 0xc3bce6;
const CUP = 0xfff0d2;

export interface AdrianLayers {
  readonly torso: PixelCanvas;
  readonly lower: PixelCanvas;
  readonly arm: PixelCanvas;
  readonly head: PixelCanvas;
}

function drawTorso(c: PixelCanvas): void {
  // Chaqueta bomber abierta (inclinada hacia atrás) con camiseta blanca asomando
  c.thickLine(12.5, 17, 16.5, 33, 5.4, JACKET);
  c.thickLine(11, 18, 14.5, 32, 2.2, JACKET_DARK); // sombra de la espalda
  c.thickLine(16, 19, 19, 31, 2.0, TEE);
  c.line(18, 21, 20, 30, TEE_SHADE);
  // Luz del neón en el hombro y el pecho (lado derecho)
  c.line(14, 14, 18, 18, JACKET_LIGHT);
  c.line(18, 17, 20, 18, JACKET_LIGHT);
  c.line(20, 20, 21, 27, JACKET_LIGHT, 0.8);
  // Solapa con ribete cian y bajo con ribete rosa
  c.line(14, 16, 17, 22, PAL.cyan);
  c.line(10, 34, 21, 34, PAL.magenta);
  c.outline(OUTLINE);
}

function drawLower(c: PixelCanvas): void {
  // Pierna lejana (estirada sobre el capó), más oscura
  c.thickLine(20, 37, 43, 37, 2.4, JEANS_DARK);
  c.fillRect(43, 36, 9, 4, SHOE);
  c.fillRect(43, 39, 9, 1, SHOE_SHADE);
  c.fillRect(43, 40, 9, 1, PAL.cyan);
  c.fillRect(51, 36, 1, 4, SHOE_SHADE);
  // Cadera y pierna cercana (rodilla arriba)
  c.fillEllipse(18, 36, 5.2, 3.6, JEANS);
  c.thickLine(18, 35, 31, 28.5, 3.3, JEANS);
  c.thickLine(31, 28.5, 35, 37, 2.7, JEANS);
  c.line(19, 33, 30, 27, JEANS_LIGHT);
  c.line(32, 30, 34, 36, JEANS_LIGHT);
  c.line(16, 38, 29, 33, JEANS_DARK);
  // Zapatilla cercana con suela de neón
  c.fillRect(33, 36, 10, 4, SHOE);
  c.fillRect(33, 39, 10, 1, SHOE_SHADE);
  c.fillRect(33, 40, 10, 1, PAL.cyan);
  c.fillRect(42, 36, 1, 4, SHOE_SHADE);
  c.fillRect(36, 37, 3, 1, PAL.magenta);
  c.outline(OUTLINE);
}

function drawArm(c: PixelCanvas): void {
  // Brazo apoyado sobre el muslo con el cafecito en la mano
  c.thickLine(13.5, 20, 18.5, 29, 2.7, JACKET);
  c.line(15, 21, 19, 28, JACKET_LIGHT);
  c.fillRect(16, 28, 5, 2, PAL.magenta); // puño de la chaqueta
  c.thickLine(21, 29, 29.5, 25.5, 1.9, PAL.skin); // antebrazo (manga remangada)
  c.line(22, 29, 29, 26, PAL.cyan); // implante luminoso
  c.fillCircle(30.5, 25, 2.2, PAL.skinLight); // mano
  // Taza de cafecito
  c.fillRect(29, 20, 6, 5, CUP);
  c.fillRect(29, 20, 6, 1, 0xffffff);
  c.fillRect(30, 21, 4, 1, 0x6b3a22); // café
  c.fillRect(34, 21, 2, 3, CUP);
  c.putPixel(35, 22, OUTLINE, 1);
  c.fillRect(29, 24, 6, 1, 0xd9c9a6);
  c.outline(OUTLINE);
}


function drawHead(c: PixelCanvas): void {
  // Cuello
  c.fillRect(11, 14, 3, 3, PAL.skinShade);
  // Cráneo y cara
  c.fillEllipse(13.5, 9.5, 4.6, 5.3, PAL.skin);
  c.fillRect(17, 8, 3, 3, PAL.skin);
  c.fillRect(19, 10, 1, 2, PAL.skinLight); // nariz
  c.fillRect(17, 12, 3, 2, PAL.skin); // boca y barbilla
  c.putPixel(18, 12, PAL.skinShade, 1); // labios
  c.fillRect(13, 13, 5, 2, PAL.skinShade); // mandíbula con barba corta
  c.fillRect(12, 10, 2, 2, PAL.skinShade); // oreja
  c.line(16, 5, 18, 7, PAL.skinLight); // frente iluminada
  // Pelo corto peinado hacia atrás con tupé
  c.fillPolygon(
    [
      { x: 8, y: 13 },
      { x: 8, y: 7 },
      { x: 10, y: 3 },
      { x: 14, y: 1 },
      { x: 19, y: 2 },
      { x: 21, y: 4 },
      { x: 18, y: 4 },
      { x: 16, y: 6 },
      { x: 13, y: 7 },
      { x: 12, y: 9 },
      { x: 11, y: 13 }
    ],
    PAL.hair
  );
  c.line(11, 3, 18, 2, PAL.hairShine);
  c.line(10, 5, 14, 4, PAL.hairShine, 0.7);
  // Gafas de neón con su patilla
  c.line(12, 9, 16, 9, OUTLINE);
  c.fillRect(ADRIAN_VISOR.x, ADRIAN_VISOR.y, ADRIAN_VISOR.w, ADRIAN_VISOR.h, PAL.cyan);
  c.putPixel(ADRIAN_VISOR.x, ADRIAN_VISOR.y, PAL.white, 1);
  c.putPixel(ADRIAN_VISOR.x + 1, ADRIAN_VISOR.y, PAL.aqua, 1);
  c.outline(OUTLINE);
}

/** Construye las cuatro capas (mismo tamaño y mismo origen: se apilan sin desplazar). */
export function buildAdrian(): AdrianLayers {
  const torso = new PixelCanvas(ADRIAN_W, ADRIAN_H);
  const lower = new PixelCanvas(ADRIAN_W, ADRIAN_H);
  const arm = new PixelCanvas(ADRIAN_W, ADRIAN_H);
  const head = new PixelCanvas(ADRIAN_W, ADRIAN_H);
  drawTorso(torso);
  drawLower(lower);
  drawArm(arm);
  drawHead(head);
  return { torso, lower, arm, head };
}

/** Las capas juntas, en orden (para tests y para revisar el arte). */
export function composeAdrian(layers: AdrianLayers = buildAdrian()): PixelCanvas {
  const out = new PixelCanvas(ADRIAN_W, ADRIAN_H);
  out.blit(layers.torso, 0, 0);
  out.blit(layers.lower, 0, 0);
  out.blit(layers.arm, 0, 0);
  out.blit(layers.head, 0, 0);
  return out;
}
