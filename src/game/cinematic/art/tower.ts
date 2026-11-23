// Escena 3: una torre de oficinas de Downtown, de madrugada. La madre de Adrián limpia donde nadie sabe su nombre.
import { createRng } from '../../../core/rng';
import { PixelCanvas } from '../../../core/pixelCanvas';
import { drawPixelText } from '../../../core/pixelText';
import { PAL } from '../../../data/menuPalette';
import { buildGlowDisc, buildGlowEllipse } from '../../menu/art/glow';
import { ART_H, ART_W, eraseRect, layer, newArt, personActor, powerLine, sky, stars, swayActor, type SceneArt } from './kit';
import { plantPot, vent } from './details';

const FLOOR_Y = 190;

/** Mesa de oficina con monitor, teclado y papeles. */
function desk(c: PixelCanvas, dx: number, dy: number, w: number, seed: number): void {
  const rnd = createRng(seed);
  c.fillRect(dx, dy, w, 4, 0x2a2550);
  c.fillRect(dx, dy + 4, w, 1, 0x4b3a9a, 0.7);
  c.fillRect(dx + 3, dy + 5, 3, FLOOR_Y - dy - 5, 0x161030);
  c.fillRect(dx + w - 6, dy + 5, 3, FLOOR_Y - dy - 5, 0x161030);
  c.fillRect(dx + 8, dy - 13, 22, 13, 0x05140f);
  c.strokeRect(dx + 8, dy - 13, 22, 13, 0x0b8fa8, 0.9);
  for (let y = dy - 11; y < dy - 2; y += 3) c.fillRect(dx + 10, y, 8 + (y % 4) * 3, 1, 0x1ff3a0, 0.55);
  c.fillRect(dx + 18, dy - 1, 4, 1, 0x4a4f7a);
  c.fillRect(dx + 10, dy - 2, 12, 1, 0x4a4f7a);
  c.fillRect(dx + 34, dy - 7, 8, 7, 0xf4f0ff, 0.85); // papeles
  c.fillRect(dx + 35, dy - 6, 6, 1, 0x1a1030, 0.7);
  c.fillRect(dx + 46 + rnd() * 6, dy - 5, 2, 5, PAL.sun, 0.9); // nota adhesiva
  // silla giratoria
  c.fillRect(dx + 14, dy + 12, 12, 3, 0x1a1236);
  c.fillRect(dx + 11, dy + 4, 3, 12, 0x1a1236);
  c.fillRect(dx + 19, dy + 15, 2, FLOOR_Y - dy - 16, 0x2a2550);
  c.fillRect(dx + 14, FLOOR_Y - 1, 12, 1, 0x2a2550);
}

export function buildTowerArt(): SceneArt {
  // Lo que se ve por el ventanal: cielo y un mar de luces de la ciudad
  const back = newArt();
  sky(back, 150, [{ at: 0, color: PAL.ink }, { at: 0.55, color: 0x1a0f3d }, { at: 1, color: 0x6a2a7a }]);
  stars(back, 31, 110, 120);
  back.fillGradientV(0, 150, ART_W, ART_H - 150, [{ at: 0, color: 0x1a0f3d }, { at: 1, color: 0x07040f }], 10);
  const rnd = createRng(44);
  const lightColors = [0xffe9a8, 0xffcf6b, PAL.cyan, PAL.pink, 0xffffff];
  for (let row = 0; row < 14; row++) {
    const y = 152 + row * 8 + (row * row) % 3;
    for (let x = rnd() * 6; x < ART_W; x += 3 + rnd() * (3 + row * 0.5)) if (rnd() < 0.78) back.setPixel(x, y + rnd() * 3, lightColors[Math.floor(rnd() * lightColors.length)] ?? 0xffffff, 0.35 + rnd() * 0.6);
  }
  for (const x of [40, 130, 330, 440, 230, 90]) {
    const h = 36 + (x % 7) * 6;
    back.fillRect(x, 150 - h + 20, 26, h, 0x120a2a);
    back.fillRect(x, 150 - h + 20, 26, 1, 0x4b2d9a);
    for (let y = 150 - h + 24; y < 166; y += 5) back.fillRect(x + 3 + (y % 3) * 6, y, 2, 2, 0xffe9a8, 0.7);
    back.fillRect(x + 12, 150 - h + 12, 1, 8, 0x4a4f7a);
    back.fillRect(x + 11, 150 - h + 10, 3, 2, PAL.red, 0.8);
  }
  // Carreteras de luz entre los edificios
  for (let i = 0; i < 4; i++) back.fillRect(0, 168 + i * 17, ART_W, 1, 0xffcf6b, 0.07);

  // La oficina
  const c = newArt();
  c.fillGradientV(0, 0, ART_W, FLOOR_Y, [{ at: 0, color: 0x0b0618 }, { at: 1, color: 0x160d33 }], 8);
  eraseRect(c, 0, 22, ART_W, FLOOR_Y - 22);
  c.fillRect(0, 0, ART_W, 22, 0x0b0618);
  c.fillRect(0, 20, ART_W, 2, 0x2b1a63);
  for (let x = 30; x < ART_W; x += 120) {
    c.fillRect(x, 8, 70, 3, 0xdfe6ff, 0.9);
    c.fillRect(x - 2, 6, 74, 7, 0xdfe6ff, 0.12);
  }
  for (let x = 6; x < ART_W; x += 38) c.fillRect(x, 14, 20, 4, 0x1a1236); // conducto de aire
  vent(c, 440, 2);
  vent(c, 70, 2);
  for (const x of [0, 118, 238, 358, 478]) {
    c.fillRect(x, 22, 7, FLOOR_Y - 22, 0x0b0618);
    c.fillRect(x + 6, 22, 1, FLOOR_Y - 22, 0x3a2a70, 0.7);
  }
  c.fillRect(0, 98, ART_W, 3, 0x0b0618, 0.9);
  // Cartel de salida y reloj
  c.fillRect(412, 26, 22, 9, 0x05140f);
  c.strokeRect(412, 26, 22, 9, 0x1ff3a0, 0.9);
  drawPixelText(c, 'EXIT', 416, 28, { color: 0x4fffc0 });
  c.fillCircle(100, 40, 7, 0x0a0a1e);
  c.strokeRect(93, 33, 14, 14, 0x4a4f7a, 0.0);
  c.line(100, 40, 100, 35, 0x9be9ff);
  c.line(100, 40, 104, 41, 0x9be9ff);
  // Suelo brillante con reflejos
  c.fillGradientV(0, FLOOR_Y, ART_W, ART_H - FLOOR_Y, [{ at: 0, color: 0x1c1440 }, { at: 1, color: 0x05020d }], 8);
  c.fillRect(0, FLOOR_Y, ART_W, 1, 0x4b3a9a, 0.8);
  for (let x = 30; x < ART_W; x += 120) for (let i = 0; i < 40; i++) c.fillRect(x + 6 + (i % 5), FLOOR_Y + 4 + i, 58 - (i % 5) * 2, 1, 0xdfe6ff, 0.18 * (1 - i / 40));
  for (let x = 0; x < ART_W; x += 20) for (let i = 0; i < 14; i++) c.fillRect(x + 2, FLOOR_Y + 3 + i * 3, 3, 1, x % 40 === 0 ? PAL.pink : PAL.cyan, 0.1 * (1 - i / 14));
  for (let x = 0; x < ART_W; x += 48) c.fillRect(x, FLOOR_Y + 2, 1, ART_H - FLOOR_Y, 0x2b1a63, 0.35);
  // Papeles tirados y una papelera
  for (const [px, py] of [[40, 214], [96, 224], [280, 218], [380, 210]] as const) {
    c.fillRect(px, py, 7, 4, 0xf4f0ff, 0.55);
    c.fillRect(px + 1, py + 1, 4, 1, 0x1a1030, 0.5);
  }
  // Cubículos al fondo a la izquierda
  for (const [dx, w] of [[10, 52], [70, 44]] as const) {
    c.fillRect(dx, 138, w, 52, 0x161030);
    c.strokeRect(dx, 138, w, 52, 0x2b1a63, 0.9);
    c.fillRect(dx + 4, 150, 16, 11, 0x05140f);
    c.strokeRect(dx + 4, 150, 16, 11, 0x0b8fa8, 0.9);
    c.fillRect(dx + 5, 153, 10, 1, 0x1ff3a0, 0.6);
    c.fillRect(dx + 5, 156, 7, 1, 0x1ff3a0, 0.4);
  }
  // Mesas con monitores encendidos (derecha y fondo)
  desk(c, 318, 150, 70, 1);
  desk(c, 404, 144, 76, 2);
  desk(c, 250, 160, 52, 3);
  // Planta junto al ventanal
  plantPot(c, 480, FLOOR_Y, 30);
  // Emblema holográfico de la empresa (anillos, sin texto)
  const ex = 330;
  const ey = 66;
  for (let i = 0; i < 4; i++) c.strokeRect(ex - 22 + i * 4, ey - 22 + i * 4, 44 - i * 8, 44 - i * 8, i % 2 === 0 ? PAL.cyan : PAL.magenta, 0.55 - i * 0.08);
  c.fillCircle(ex, ey, 6, PAL.cyan, 0.5);
  c.fillCircle(ex, ey, 3, PAL.white, 0.8);
  c.blit(buildGlowDisc(34, PAL.cyan, 5, 0.2), ex - 34, ey - 34);
  // Pantalla holográfica con gráficas
  c.fillRect(380, 40, 60, 38, 0x0a1a24, 0.7);
  c.strokeRect(380, 40, 60, 38, PAL.cyan, 0.7);
  for (let i = 0; i < 8; i++) c.fillRect(386 + i * 6, 72 - (6 + ((i * 17) % 22)), 4, 6 + ((i * 17) % 22), i % 3 === 0 ? PAL.pink : PAL.cyan, 0.8);
  // Señal de suelo mojado
  c.fillPolygon([{ x: 100, y: FLOOR_Y + 6 }, { x: 112, y: FLOOR_Y + 6 }, { x: 110, y: FLOOR_Y - 10 }, { x: 102, y: FLOOR_Y - 10 }], 0xffd23a);
  c.fillRect(104, FLOOR_Y - 6, 4, 6, 0x14101e);
  c.blit(buildGlowEllipse(46, 6, 0xdfe6ff, 4, 0.5), 150, FLOOR_Y + 2);

  // La madre empujando la fregona, y su carrito APOYADO EN EL SUELO con sombra y reflejo
  const CART_X = 196;
  const wheelY = FLOOR_Y + 18;
  c.fillEllipse(CART_X + 17, wheelY + 3, 22, 3, 0x05020d, 0.7);
  c.fillRect(CART_X, wheelY - 40, 34, 4, 0x6a6a8a);
  c.fillRect(CART_X + 2, wheelY - 36, 30, 28, 0x2a8a8a);
  c.fillRect(CART_X + 2, wheelY - 36, 30, 2, 0x4acaca);
  c.fillRect(CART_X + 2, wheelY - 8, 30, 2, 0x1a5a5a);
  c.fillRect(CART_X + 5, wheelY - 54, 10, 14, 0xe8e8f8);
  c.fillRect(CART_X + 19, wheelY - 52, 6, 12, 0xff6a9a);
  c.fillRect(CART_X + 27, wheelY - 46, 5, 6, 0x6ad0ff);
  c.fillRect(CART_X, wheelY - 66, 2, 28, 0x8a8a9a);
  c.fillRect(CART_X - 2, wheelY - 66, 8, 2, 0x8a8a9a);
  c.fillCircle(CART_X + 6, wheelY - 3, 3, 0x05020d);
  c.fillCircle(CART_X + 28, wheelY - 3, 3, 0x05020d);
  c.fillCircle(CART_X + 6, wheelY - 3, 1, 0x6a6a8a);
  c.fillCircle(CART_X + 28, wheelY - 3, 1, 0x6a6a8a);
  for (let i = 0; i < 10; i++) c.fillRect(CART_X + 2, wheelY + i * 2, 30, 1, 0x2a8a8a, 0.18 * (1 - i / 10));

  const mom = personActor({ x: 140, footY: FLOOR_Y + 14, height: 62, facing: 1, pose: 'offer', top: 0x2a8a8a, topLight: 0x4acaca, bottom: 0x1a2a4a, hair: 0x120a10, shoe: 0xd8d2f0, skin: 0xc98b5e }, 1, 2400);
  c.line(mom.at.hand.x, mom.at.hand.y, mom.at.hand.x + 14, FLOOR_Y + 12, 0x8a8a9a, 1);
  c.fillRect(mom.at.hand.x + 10, FLOOR_Y + 11, 12, 3, 0xe8e8f8);

  // Primer plano: plantas desenfocadas, cables que cuelgan del techo
  const front = new PixelCanvas(ART_W, ART_H);
  front.fillEllipse(24, 270, 40, 22, 0x05020d);
  front.fillRect(-2, 232, 18, 48, 0x05020d);
  front.fillEllipse(486, 272, 40, 22, 0x05020d);
  front.fillRect(486, 238, 16, 42, 0x05020d);
  front.fillRect(0, 0, ART_W, 3, 0x05020d, 0.9);
  powerLine(front, 250, 0, 330, 4, 16, 0x05020d, 0.9);
  const leaves: ReturnType<typeof swayActor>[] = [];
  for (const [x, flip] of [[8, 1], [486, -1]] as const) {
    const l = new PixelCanvas(30, 40);
    for (let i = 0; i < 4; i++) l.thickLine(flip > 0 ? 4 : 26, 40, (flip > 0 ? 4 : 26) + flip * (4 + i * 5), 4 + i * 3, 2, i % 2 ? 0x07201a : 0x05140f);
    leaves.push(swayActor(l, x - (flip > 0 ? 0 : 20), 190, 1, 3000, flip > 0 ? 0 : 900));
  }
  return [layer(back, 0.25), layer(c, 1, { actors: [mom.actor] }), layer(front, 1.25, { actors: leaves })];
}
void ART_H;
