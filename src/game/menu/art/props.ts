// Objetos de calle y de azotea (arte PROVISIONAL dibujado por código; sin Phaser).
import { PAL } from '../../../data/menuPalette';
import { PixelCanvas } from '../../../core/pixelCanvas';

const OUT = 0x0a0612;
const METAL = 0x3a3470;
const METAL_LIGHT = 0x5a54a0;
const METAL_DARK = 0x221c48;
const PAD = 4;

/** Dibuja un objeto en su propio lienzo, le pone contorno y lo pega: así el contorno no rodea el resto de la escena. */
function outlined(c: PixelCanvas, x: number, y: number, w: number, h: number, draw: (t: PixelCanvas, ox: number, oy: number) => void): void {
  const t = new PixelCanvas(w + PAD * 2, h + PAD * 2);
  draw(t, PAD, PAD);
  t.outline(OUT);
  c.blit(t, x - PAD, y - PAD);
}

/** Aire acondicionado de azotea con ventilador (22x8). La esquina (x, y) es la superior izquierda. */
export function paintRoofAc(c: PixelCanvas, x: number, y: number): void {
  c.fillRect(x, y, 22, 8, METAL);
  c.fillRect(x, y, 22, 1, METAL_LIGHT);
  c.fillRect(x, y + 7, 22, 1, METAL_DARK);
  c.fillCircle(x + 7, y + 4, 2.6, 0x120c2c);
  c.line(x + 5, y + 4, x + 9, y + 4, 0x6a64c0);
  c.line(x + 7, y + 2, x + 7, y + 6, 0x6a64c0);
  for (let k = 0; k < 4; k++) c.fillRect(x + 13 + k * 2, y + 2, 1, 4, 0x15102e);
  c.putPixel(x + 20, y + 2, PAL.cyan, 1);
  c.fillRect(x + 1, y + 8, 2, 2, METAL_DARK);
  c.fillRect(x + 19, y + 8, 2, 2, METAL_DARK);
}

/** Dos cajas apiladas (12x10). */
export function paintCrates(c: PixelCanvas, x: number, y: number): void {
  c.fillRect(x, y + 5, 12, 5, 0x5a3a2a);
  c.fillRect(x + 2, y, 9, 5, 0x6a4632);
  for (const [bx, by, bw] of [[x, y + 5, 12], [x + 2, y, 9]] as const) {
    c.strokeRect(bx, by, bw, 5, 0x2f1c14);
    c.line(bx, by, bx + bw - 1, by + 4, 0x3a241a);
  }
  c.line(x + 2, y, x + 10, y, 0x8a6044);
}

/** Depósito de agua sobre patas (24x24). El tope plano queda en (x+12, y). */
function drawWaterTank(c: PixelCanvas, x: number, y: number): void {
  c.fillRect(x + 1, y + 16, 2, 8, METAL_DARK); // patas
  c.fillRect(x + 21, y + 16, 2, 8, METAL_DARK);
  c.fillRect(x + 11, y + 16, 2, 8, METAL_DARK);
  c.line(x + 2, y + 20, x + 21, y + 20, METAL_DARK);
  c.fillRect(x, y + 2, 24, 15, 0x4a3a86); // barril
  c.fillRect(x, y + 2, 4, 15, 0x6a58b8);
  c.fillRect(x + 20, y + 2, 4, 15, 0x2c2260);
  for (const by of [5, 9, 13]) c.fillRect(x, y + by, 24, 1, 0x211a4a); // aros
  c.fillRect(x - 1, y, 26, 3, 0x2c2260); // tapa
  c.fillRect(x - 1, y, 26, 1, 0x7a6ad0);
  c.fillRect(x + 9, y - 2, 6, 2, 0x2c2260); // tapón
  c.line(x + 4, y + 3, x + 4, y + 15, 0x8a78e0, 0.6); // reflejo
}

/** Antena con travesaños (7x34). La luz roja queda en (x+3, y). */
export function paintAntenna(c: PixelCanvas, x: number, y: number): void {
  c.fillRect(x + 3, y, 1, 34, METAL_DARK);
  for (let k = 0; k < 4; k++) {
    const ty = y + 6 + k * 7;
    c.line(x + 3 - 3 + k * 0, ty, x + 3 + 3, ty, METAL);
    c.line(x + 3, ty, x + 3 - (3 - k), ty + 5, METAL_DARK);
  }
  c.fillRect(x + 1, y + 3, 5, 1, METAL_LIGHT);
}

/** Barandilla de azotea (ancho w, alto 9). */
export function paintRailing(c: PixelCanvas, x: number, y: number, w: number): void {
  c.fillRect(x, y, w, 1, METAL_LIGHT);
  c.fillRect(x, y + 4, w, 1, METAL);
  for (let px = x; px < x + w; px += 7) c.fillRect(px, y, 1, 9, METAL);
}

/** Boca de incendios (7x11). */
function drawHydrant(c: PixelCanvas, x: number, y: number): void {
  c.fillRect(x + 1, y + 2, 5, 9, 0xc22a4a);
  c.fillRect(x, y + 4, 7, 2, 0xe03a5e);
  c.fillRect(x + 1, y, 5, 3, 0xe03a5e);
  c.fillRect(x + 2, y - 1, 3, 1, 0xe03a5e);
  c.fillRect(x - 1, y + 5, 1, 2, 0xe03a5e);
  c.fillRect(x + 7, y + 5, 1, 2, 0xe03a5e);
  c.fillRect(x + 5, y + 2, 1, 8, 0xff7a96, 0.8);
  c.fillRect(x, y + 10, 7, 1, 0x7a1830);
}

/** Cubo de basura con tapa (9x13). */
function drawTrashCan(c: PixelCanvas, x: number, y: number): void {
  c.fillRect(x, y + 2, 9, 11, 0x3a4a60);
  c.fillRect(x - 1, y, 11, 3, 0x56688a);
  c.fillRect(x + 1, y + 4, 1, 8, 0x5a6c8a);
  c.fillRect(x + 4, y + 4, 1, 8, 0x2a3648);
  c.fillRect(x + 7, y + 4, 1, 8, 0x2a3648);
  c.fillRect(x + 6, y + 2, 2, 1, PAL.cyan, 0.8);
}

/** Poste de farola retro-futurista. La luz queda en (x + 7, y + 2). Alto `h`. */
function drawLampPost(c: PixelCanvas, x: number, y: number, h: number): void {
  c.fillRect(x + 6, y + 6, 3, h - 6, 0x2c2556);
  c.fillRect(x + 6, y + 6, 1, h - 6, 0x4a4290);
  c.fillRect(x + 4, y + h - 4, 7, 4, 0x2c2556); // base
  c.fillRect(x + 5, y + h - 6, 5, 2, 0x3a3270);
  c.fillRect(x + 6, y + 3, 9, 3, 0x2c2556); // brazo
  c.fillRect(x + 12, y + 5, 6, 2, 0x2c2556);
  c.fillRect(x + 11, y + 6, 8, 3, PAL.window); // luminaria
  c.fillRect(x + 12, y + 6, 6, 1, 0xffffff);
  c.fillRect(x + 11, y + 9, 8, 1, 0xffb347);
}

/** Tapa de alcantarilla vista en perspectiva (ellipse). */
export function paintManhole(c: PixelCanvas, cx: number, cy: number): void {
  c.fillEllipse(cx, cy, 11, 3.2, 0x05030c);
  c.fillEllipse(cx, cy, 9.5, 2.5, 0x1a1236);
  for (let k = -3; k <= 3; k++) c.line(cx + k * 2.6 - 1, cy - 1, cx + k * 2.6 + 1, cy + 1, 0x302660);
  c.line(cx - 8, cy - 2, cx + 8, cy - 2, 0x3a3070, 0.6);
}

/** Depósito de agua sobre patas (24x24). El tope plano queda en (x+12, y). */
export function paintWaterTank(c: PixelCanvas, x: number, y: number): void {
  outlined(c, x, y, 24, 24, (t, ox, oy) => drawWaterTank(t, ox, oy));
}

/** Boca de incendios (7x11). */
export function paintHydrant(c: PixelCanvas, x: number, y: number): void {
  outlined(c, x, y, 8, 11, (t, ox, oy) => drawHydrant(t, ox, oy));
}

/** Cubo de basura con tapa (9x13). */
export function paintTrashCan(c: PixelCanvas, x: number, y: number): void {
  outlined(c, x, y, 10, 13, (t, ox, oy) => drawTrashCan(t, ox, oy));
}

/** Poste de farola retro-futurista. La luz queda en (x + 15, y + 7). Alto `h`. */
export function paintLampPost(c: PixelCanvas, x: number, y: number, h: number): void {
  outlined(c, x, y, 20, h, (t, ox, oy) => drawLampPost(t, ox, oy, h));
}
