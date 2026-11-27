// Escena 3: una torre de oficinas de Downtown, de madrugada. La madre de Adrián limpia donde nadie sabe su nombre.
import { createRng } from '../../../core/rng';
import { PixelCanvas } from '../../../core/pixelCanvas';
import { drawPixelText } from '../../../core/pixelText';
import { PAL } from '../../../data/menuPalette';
import { buildGlowDisc, buildGlowEllipse } from '../../menu/art/glow';
import { ART_H, ART_W, contactShadow, eraseRect, haze, layer, leaf, lightShaft, newArt, personActor, powerLine, reflectActor, reflectDown, sky, stars, swayActor, type SceneArt } from './kit';
import { plantPot, vent } from './details';

const FLOOR_Y = 190;

/** Mesa de oficina con monitor, lámpara, teclado, papeles y silla giratoria. */
function desk(c: PixelCanvas, dx: number, dy: number, w: number, seed: number): void {
  const rnd = createRng(seed);
  c.fillRect(dx, dy, w, 4, 0x3a3478);
  c.fillRect(dx, dy, w, 1, 0x8a7ad0, 0.8);
  c.fillRect(dx, dy + 4, w, 1, 0x1a1236);
  c.fillRect(dx + 3, dy + 5, 3, FLOOR_Y - dy - 5, 0x1c1644);
  c.fillRect(dx + w - 6, dy + 5, 3, FLOOR_Y - dy - 5, 0x1c1644);
  c.fillRect(dx + 8, dy - 15, 25, 15, 0x05140f);
  c.strokeRect(dx + 8, dy - 15, 25, 15, 0x19f3ff, 0.95);
  for (let y = dy - 13; y < dy - 2; y += 3) c.fillRect(dx + 10, y, 7 + ((y + seed) % 4) * 4, 1, rnd() < 0.3 ? PAL.pink : 0x1ff3a0, 0.7);
  c.fillRect(dx + 19, dy - 1, 5, 1, 0x4a4f7a);
  c.fillRect(dx + 10, dy - 2, 12, 1, 0x6a6a9a);
  c.fillRect(dx + 36, dy - 8, 8, 8, 0xf4f0ff, 0.9);
  c.fillRect(dx + 37, dy - 7, 6, 1, 0x1a1030, 0.7);
  c.fillRect(dx + 49, dy - 5, 2, 5, PAL.sun);
  // lámpara de mesa
  c.fillRect(dx + w - 14, dy - 12, 1, 12, 0x6a6a8a);
  c.fillPolygon([{ x: dx + w - 19, y: dy - 10 }, { x: dx + w - 9, y: dy - 10 }, { x: dx + w - 12, y: dy - 16 }, { x: dx + w - 16, y: dy - 16 }], 0xffd36b);
  c.blit(buildGlowDisc(14, 0xffcf6b, 3, 0.35), dx + w - 28, dy - 28);
  // silla giratoria
  c.fillRect(dx + 14, dy + 12, 14, 3, 0x241c5a);
  c.fillRect(dx + 11, dy + 3, 3, 13, 0x241c5a);
  c.fillRect(dx + 20, dy + 15, 2, FLOOR_Y - dy - 16, 0x3a3478);
  c.fillRect(dx + 13, FLOOR_Y - 1, 16, 1, 0x3a3478);
}

export function buildTowerArt(): SceneArt {
  // --- Lo que se ve por el ventanal: la ciudad desde las alturas, con nubes bajas
  const back = newArt();
  sky(back, 150, [{ at: 0, color: PAL.ink }, { at: 0.5, color: 0x1a0f3d }, { at: 1, color: 0x8a2a7a }]);
  stars(back, 31, 120, 110);
  back.fillGradientV(0, 150, ART_W, ART_H - 150, [{ at: 0, color: 0x2a1450 }, { at: 1, color: 0x07040f }], 10);
  const rnd = createRng(44);
  const lightColors = [0xffe9a8, 0xffcf6b, PAL.cyan, PAL.pink, 0xffffff];
  for (let row = 0; row < 16; row++) {
    const y = 152 + row * 7 + (row * row) % 3;
    for (let x = rnd() * 5; x < ART_W; x += 2 + rnd() * (2.5 + row * 0.4)) if (rnd() < 0.82) back.setPixel(x, y + rnd() * 3, lightColors[Math.floor(rnd() * lightColors.length)] ?? 0xffffff, 0.4 + rnd() * 0.6);
  }
  for (const [x, w, h] of [[28, 30, 70], [84, 22, 52], [124, 34, 84], [178, 24, 60], [232, 38, 96], [296, 26, 66], [340, 32, 78], [402, 28, 58], [444, 36, 90], [478, 24, 64]] as const) {
    back.fillRect(x, 168 - h, w, h, 0x120a2a);
    back.fillRect(x, 168 - h, w, 1, 0x6a3ab0, 0.9);
    back.fillRect(x, 168 - h, 2, h, 0x241450);
    for (let y = 168 - h + 4; y < 164; y += 5) for (let k = 3; k < w - 3; k += 5) if (rnd() < 0.42) back.fillRect(x + k, y, 2, 2, lightColors[Math.floor(rnd() * 3)] ?? 0xffe9a8, 0.85);
    back.fillRect(x + w / 2, 168 - h - 10, 1, 10, 0x4a4f7a);
    back.fillRect(x + w / 2 - 1, 168 - h - 12, 3, 2, PAL.red, 0.9);
  }
  haze(back, 150, 180, 0xff7ab8, 0.0, 0.22);
  for (let i = 0; i < 5; i++) back.fillRect(0, 172 + i * 14, ART_W, 1, 0xffcf6b, 0.07);

  // --- La oficina: techo con paneles de luz, pilares, mesas con vida
  const c = newArt();
  c.fillGradientV(0, 0, ART_W, FLOOR_Y, [{ at: 0, color: 0x0b0618 }, { at: 1, color: 0x1a1040 }], 8);
  eraseRect(c, 0, 24, ART_W, FLOOR_Y - 24);
  c.fillRect(0, 0, ART_W, 24, 0x0b0618);
  c.fillRect(0, 22, ART_W, 2, 0x3a2a80);
  for (let x = 6; x < ART_W; x += 38) c.fillRect(x, 14, 22, 5, 0x1c1644);
  vent(c, 440, 3);
  vent(c, 70, 3);
  for (let x = 24; x < ART_W; x += 120) {
    c.fillRect(x, 6, 76, 4, 0xeef2ff);
    c.fillRect(x - 3, 4, 82, 8, 0xdfe6ff, 0.16);
    lightShaft(c, x + 38, 12, 60, 150, 150, 0xdfe6ff, 0.05);
  }
  for (const x of [0, 118, 238, 358, 478]) {
    c.fillRect(x, 24, 8, FLOOR_Y - 24, 0x0b0618);
    c.fillRect(x + 7, 24, 1, FLOOR_Y - 24, 0x4a3a90, 0.8);
    c.fillRect(x + 1, 24, 1, FLOOR_Y - 24, 0x2a1a60, 0.8);
  }
  c.fillRect(0, 98, ART_W, 3, 0x0b0618, 0.9);
  // reflejos diagonales en el cristal
  for (const [x, w] of [[30, 26], [150, 18], [270, 30], [390, 20]] as const) for (let y = 30; y < FLOOR_Y - 10; y += 2) c.fillRect(x + (FLOOR_Y - y) * 0.35, y, w, 1, 0xdfe6ff, 0.05);
  // cartel de salida y reloj
  c.fillRect(412, 28, 24, 10, 0x05140f);
  c.strokeRect(412, 28, 24, 10, 0x1ff3a0, 0.95);
  drawPixelText(c, 'EXIT', 417, 31, { color: 0x4fffc0 });
  c.blit(buildGlowDisc(18, 0x1ff3a0, 3, 0.2), 409, 18);
  // suelo
  c.fillGradientV(0, FLOOR_Y, ART_W, ART_H - FLOOR_Y, [{ at: 0, color: 0x241a5a }, { at: 1, color: 0x07040f }], 10);
  c.fillRect(0, FLOOR_Y, ART_W, 1, 0x6a5ab0, 0.9);
  for (let x = 0; x < ART_W; x += 52) c.fillRect(x, FLOOR_Y + 1, 1, ART_H - FLOOR_Y, 0x3a2a80, 0.3);
  // cubículos al fondo a la izquierda
  for (const [dx, w] of [[10, 52], [70, 44]] as const) {
    c.fillRect(dx, 136, w, 54, 0x1c1644);
    c.strokeRect(dx, 136, w, 54, 0x4a3a90, 0.9);
    c.fillRect(dx + 4, 148, 18, 12, 0x05140f);
    c.strokeRect(dx + 4, 148, 18, 12, 0x19f3ff, 0.9);
    c.fillRect(dx + 6, 151, 12, 1, 0x1ff3a0, 0.7);
    c.fillRect(dx + 6, 154, 8, 1, 0x1ff3a0, 0.5);
    c.fillRect(dx + w - 12, 142, 8, 8, PAL.pink, 0.8);
  }
  desk(c, 318, 150, 70, 1);
  desk(c, 404, 144, 76, 2);
  desk(c, 250, 160, 52, 3);
  plantPot(c, 482, FLOOR_Y, 34);
  plantPot(c, 244, FLOOR_Y, 22);
  // emblema holográfico y pantalla de datos
  const ex = 330;
  const ey = 68;
  for (let i = 0; i < 5; i++) c.strokeRect(ex - 24 + i * 4, ey - 24 + i * 4, 48 - i * 8, 48 - i * 8, i % 2 === 0 ? PAL.cyan : PAL.magenta, 0.6 - i * 0.08);
  c.fillCircle(ex, ey, 6, PAL.cyan, 0.55);
  c.fillCircle(ex, ey, 3, PAL.white, 0.9);
  c.blit(buildGlowDisc(38, PAL.cyan, 5, 0.22), ex - 38, ey - 38);
  c.fillRect(380, 42, 62, 38, 0x0a1a24, 0.75);
  c.strokeRect(380, 42, 62, 38, PAL.cyan, 0.8);
  for (let i = 0; i < 8; i++) c.fillRect(386 + i * 6, 74 - (6 + ((i * 17) % 22)), 4, 6 + ((i * 17) % 22), i % 3 === 0 ? PAL.pink : PAL.cyan, 0.85);
  drawPixelText(c, 'Q3', 386, 46, { color: PAL.sun });
  // señal de suelo mojado y cubo con ruedas
  c.fillPolygon([{ x: 86, y: FLOOR_Y + 12 }, { x: 100, y: FLOOR_Y + 12 }, { x: 98, y: FLOOR_Y - 8 }, { x: 88, y: FLOOR_Y - 8 }], 0xffd23a);
  c.fillRect(91, FLOOR_Y - 4, 4, 8, 0x14101e);
  c.fillRect(91, FLOOR_Y - 6, 4, 1, 0x14101e);
  c.blit(buildGlowEllipse(46, 6, 0xdfe6ff, 4, 0.5), 150, FLOOR_Y + 8);
  // papeles tirados
  for (const [px, py] of [[40, 220], [300, 228], [372, 214], [470, 222]] as const) {
    c.fillRect(px, py, 8, 4, 0xf4f0ff, 0.6);
    c.fillRect(px + 1, py + 1, 5, 1, 0x1a1030, 0.5);
  }
  // el carrito de limpieza, bien apoyado: bolsa, botes, cubo y fregona
  const CART_X = 214;
  const wheelY = FLOOR_Y + 22;
  contactShadow(c, CART_X + 17, wheelY + 1, 38, 0.7);
  c.fillRect(CART_X, wheelY - 44, 36, 4, 0x8a8aaa);
  c.fillRect(CART_X + 2, wheelY - 40, 32, 32, 0x2a9a9a);
  c.fillRect(CART_X + 2, wheelY - 40, 32, 2, 0x5aeaea);
  c.fillRect(CART_X + 2, wheelY - 8, 32, 2, 0x1a5a5a);
  for (let i = 0; i < 4; i++) c.fillRect(CART_X + 5, wheelY - 34 + i * 6, 26, 1, 0x1a7a7a, 0.8);
  c.fillRect(CART_X + 6, wheelY - 60, 10, 16, 0xf4f0ff);
  c.fillRect(CART_X + 7, wheelY - 58, 8, 1, 0x1a1030, 0.6);
  c.fillRect(CART_X + 20, wheelY - 56, 6, 12, 0xff6a9a);
  c.fillRect(CART_X + 21, wheelY - 60, 4, 4, 0xff6a9a);
  c.fillRect(CART_X + 28, wheelY - 52, 6, 8, 0x6ad0ff);
  c.fillRect(CART_X, wheelY - 74, 2, 32, 0x8a8aaa);
  c.fillRect(CART_X - 2, wheelY - 74, 9, 2, 0x8a8aaa);
  c.fillCircle(CART_X + 6, wheelY - 3, 3.2, 0x05020d);
  c.fillCircle(CART_X + 30, wheelY - 3, 3.2, 0x05020d);
  c.fillCircle(CART_X + 6, wheelY - 3, 1.2, 0x8a8aaa);
  c.fillCircle(CART_X + 30, wheelY - 3, 1.2, 0x8a8aaa);
  // cubo amarillo con fregona
  c.fillRect(176, FLOOR_Y + 8, 16, 12, 0xffd23a);
  c.fillRect(176, FLOOR_Y + 8, 16, 2, 0xfff0a0);
  c.fillRect(176, FLOOR_Y + 18, 16, 2, 0xb08a1a);
  c.fillCircle(180, FLOOR_Y + 21, 2, 0x05020d);
  c.fillCircle(188, FLOOR_Y + 21, 2, 0x05020d);

  const mom = personActor({ x: 140, footY: FLOOR_Y + 22, height: 66, facing: 1, pose: 'offer', top: 0x2a9a9a, topLight: 0x5aeaea, bottom: 0x1a2a4a, hair: 0x120a10, hairStyle: 'bun', outfit: 'uniform', shoe: 0xd8d2f0, skin: 0xc98b5e, rim: PAL.cyan }, 1, 2400);
  c.line(mom.at.hand.x, mom.at.hand.y, mom.at.hand.x + 12, FLOOR_Y + 20, 0x8a8aaa, 1);
  c.fillRect(mom.at.hand.x + 6, FLOOR_Y + 19, 14, 3, 0xe8e8f8);

  // --- Suelo brillante: refleja el ventanal, las mesas y las figuras
  const comp = new PixelCanvas(ART_W, ART_H);
  comp.blit(back, 0, 0);
  comp.blit(c, 0, 0);
  reflectDown(c, comp, FLOOR_Y + 1, 52, 0.3, 1.2);
  reflectActor(c, mom.actor, FLOOR_Y + 22, 40, 0.38);
  haze(c, FLOOR_Y + 2, FLOOR_Y + 30, 0x6a5ab0, 0.0, 0.12);

  // --- Primer plano: sillas y plantas desenfocadas; cables que cuelgan
  const front = new PixelCanvas(ART_W, ART_H);
  front.fillEllipse(30, 276, 50, 26, 0x05020d);
  front.fillRect(10, 232, 28, 50, 0x05020d);
  front.fillRect(0, 0, ART_W, 3, 0x05020d, 0.9);
  powerLine(front, 250, 0, 330, 4, 16, 0x05020d, 0.9);
  const leaves: ReturnType<typeof swayActor>[] = [];
  for (const [x, dx, ph] of [[4, 1, 0], [488, -1, 900]] as const) {
    const l = new PixelCanvas(70, 90);
    for (let i = 0; i < 3; i++) leaf(l, dx > 0 ? 6 : 64, 88, dx * (0.35 + i * 0.3), -0.8 + i * 0.1, 56 - i * 6, 0x051a14, 0x14503e, 0.45);
    leaves.push(swayActor(l, x - (dx > 0 ? 0 : 60), 188, 1, 3000, ph));
  }
  return [layer(back, 0.25), layer(c, 1, { actors: [mom.actor] }), layer(front, 1.25, { actors: leaves })];
}
void ART_H;
