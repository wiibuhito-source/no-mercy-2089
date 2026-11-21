// Coche de Adrián: berlina retro-futurista de perfil (arte PROVISIONAL dibujado por código; sin Phaser).
// Mira a la derecha. Adrián va aparte, sentado sobre el capó.
import { PAL } from '../../../data/menuPalette';
import { PixelCanvas, type Point } from '../../../core/pixelCanvas';

export const CAR_W = 168;
export const CAR_H = 52;
export const CAR_WHEEL_Y = 40;
export const CAR_WHEELS: readonly number[] = [38, 128];
/** Puntos importantes del coche (dentro de su imagen) para colocar luces, humo y a Adrián. */
export const CAR_ANCHORS = {
  headlight: { x: 163, y: 33 },
  taillight: { x: 4, y: 31 },
  exhaust: { x: 5, y: 44 },
  underglowCenter: { x: 84, y: 49 },
  /** Esquina de la imagen de Adrián cuando está sentado en el capó. */
  adrianOrigin: { x: 106, y: -13 }
} as const;

const OUTLINE = 0x0a0612;
const BODY = 0x2b2172;
const BODY_DARK = 0x191049;
const BODY_LIGHT = 0x5d4fd6;
const GLASS = 0x0a1a46;
const GLASS_LIGHT = 0x2c56c8;
const CHROME = 0x9aa0cc;

const BODY_POLY: readonly Point[] = [
  { x: 6, y: 45 },
  { x: 3, y: 36 },
  { x: 4, y: 28 },
  { x: 9, y: 24 },
  { x: 50, y: 23 },
  { x: 62, y: 8 },
  { x: 92, y: 8 },
  { x: 112, y: 22.5 },
  { x: 156, y: 27.5 },
  { x: 164, y: 33 },
  { x: 165, y: 45 }
];

function drawWheel(c: PixelCanvas, cx: number): void {
  c.fillCircle(cx, CAR_WHEEL_Y, 12, OUTLINE); // hueco del paso de rueda
  c.fillCircle(cx, CAR_WHEEL_Y, 9.8, 0x05030c); // neumático
  c.fillCircle(cx, CAR_WHEEL_Y, 8.2, 0x14102a);
  c.fillCircle(cx, CAR_WHEEL_Y, 6.2, 0x9aa0cc); // llanta
  c.fillCircle(cx, CAR_WHEEL_Y, 5.2, 0x5c6192);
  c.fillCircle(cx, CAR_WHEEL_Y, 2.4, 0x0b0618); // buje
  c.fillRect(cx - 1, CAR_WHEEL_Y - 1, 2, 2, PAL.cyan);
  for (let a = 0; a < 5; a++) {
    const ang = (a / 5) * Math.PI * 2 + 0.3;
    c.line(cx + Math.cos(ang) * 2.4, CAR_WHEEL_Y + Math.sin(ang) * 2.4, cx + Math.cos(ang) * 5.6, CAR_WHEEL_Y + Math.sin(ang) * 5.6, 0xc8ccee);
  }
  c.line(cx - 8, CAR_WHEEL_Y - 7, cx - 4, CAR_WHEEL_Y - 9, 0x3a3560, 0.9); // brillo del neumático
}

export function buildCar(): PixelCanvas {
  const c = new PixelCanvas(CAR_W, CAR_H);

  // Carrocería
  c.fillPolygon(BODY_POLY, BODY);
  c.fillRect(5, 38, 160, 7, BODY_DARK); // bajos
  c.fillRect(5, 37, 160, 1, 0x3c2f92); // línea del faldón
  // Luz en los bordes superiores (techo, capó, maletero)
  c.line(62, 8, 92, 8, BODY_LIGHT);
  c.line(92, 9, 111, 22, BODY_LIGHT);
  c.line(112, 23, 155, 28, BODY_LIGHT);
  c.line(10, 24, 49, 23, BODY_LIGHT);
  c.line(50, 24, 62, 9, 0x3c2f92);
  // Alerón trasero
  c.fillRect(5, 20, 16, 2, 0x0d0a1a);
  c.fillRect(8, 22, 2, 3, 0x0d0a1a);
  c.fillRect(5, 20, 16, 1, PAL.magenta);

  // Cabina: cristal con reflejos
  const glass: Point[] = [
    { x: 56, y: 22 },
    { x: 65, y: 10 },
    { x: 91, y: 10 },
    { x: 106, y: 22 }
  ];
  c.fillPolygon(glass, GLASS);
  c.fillGradientV(60, 10, 46, 12, [{ at: 0, color: 0x13306e }, { at: 1, color: GLASS }], 6);
  c.fillPolygon(glass.map((p) => ({ x: p.x, y: p.y })), GLASS, 0.0);
  c.line(70, 11, 62, 21, GLASS_LIGHT, 0.8); // reflejos
  c.line(75, 11, 68, 21, GLASS_LIGHT, 0.5);
  c.line(65, 10, 91, 10, 0x6a8cff, 0.7);
  c.fillRect(77, 10, 2, 12, BODY); // pilar central
  // Reposacabezas de los asientos
  c.fillRect(67, 14, 5, 6, 0x08122e);
  c.fillRect(84, 14, 5, 7, 0x08122e);
  c.line(50, 23, 106, 23, 0x3c2f92); // línea de cintura
  // Retrovisor
  c.fillRect(104, 20, 4, 3, 0x0d0a1a);
  c.putPixel(105, 20, PAL.cyan, 1);

  // Franja de neón lateral con su brillo
  c.fillRect(7, 33, 156, 3, PAL.magenta, 0.25);
  c.fillRect(7, 34, 156, 1, PAL.magenta);
  c.fillRect(7, 35, 156, 1, PAL.pink, 0.55);
  // Puertas, tirador y detalles
  c.line(77, 24, 77, 37, 0x120a2e);
  c.line(112, 24, 112, 37, 0x120a2e, 0.9);
  c.line(46, 24, 46, 37, 0x120a2e, 0.9);
  c.fillRect(84, 27, 7, 1, CHROME);
  c.fillRect(54, 27, 6, 1, CHROME);
  // Luces
  c.fillRect(3, 28, 4, 6, PAL.red);
  c.fillRect(3, 28, 2, 6, 0xff8a9c);
  c.fillRect(160, 29, 6, 5, 0xfff3b0);
  c.fillRect(160, 29, 6, 1, 0xffffff);
  c.fillRect(162, 36, 3, 2, PAL.amber);
  // Rejilla delantera y defensa
  for (let y = 38; y < 44; y += 2) c.fillRect(158, y, 6, 1, 0x3a3170);
  c.fillRect(5, 44, 161, 1, 0x0d0a1a);
  // Tubo de escape
  c.fillRect(1, 43, 5, 2, CHROME);
  c.fillRect(0, 43, 1, 2, 0x4a4f7a);

  c.outline(OUTLINE);
  drawWheel(c, CAR_WHEELS[0] ?? 38);
  drawWheel(c, CAR_WHEELS[1] ?? 128);
  return c;
}
