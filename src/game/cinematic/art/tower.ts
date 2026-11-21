// Escena 3: una torre de oficinas de Downtown, de madrugada. La madre de Adrián limpia donde nadie sabe su nombre.
import { createRng } from '../../../core/rng';
import { PixelCanvas } from '../../../core/pixelCanvas';
import { PAL } from '../../../data/menuPalette';
import { buildGlowDisc, buildGlowEllipse } from '../../menu/art/glow';
import { ART_H, ART_W, eraseRect, layer, newArt, personActor, sky, stars, type SceneArt } from './kit';

const FLOOR_Y = 190;

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
  for (const x of [40, 130, 330, 440]) {
    const h = 36 + (x % 7) * 6;
    back.fillRect(x, 150 - h + 20, 26, h, 0x120a2a);
    back.fillRect(x, 150 - h + 20, 26, 1, 0x4b2d9a);
    for (let y = 150 - h + 24; y < 166; y += 5) back.fillRect(x + 3 + (y % 3) * 6, y, 2, 2, 0xffe9a8, 0.7);
  }

  // La oficina: techo con tiras de luz, pilares del ventanal, suelo brillante y mesas
  const c = newArt();
  c.fillGradientV(0, 0, ART_W, FLOOR_Y, [{ at: 0, color: 0x0b0618 }, { at: 1, color: 0x160d33 }], 8);
  eraseRect(c, 0, 22, ART_W, FLOOR_Y - 22);
  c.fillRect(0, 0, ART_W, 22, 0x0b0618);
  c.fillRect(0, 20, ART_W, 2, 0x2b1a63);
  for (let x = 30; x < ART_W; x += 120) {
    c.fillRect(x, 8, 70, 3, 0xdfe6ff, 0.9);
    c.fillRect(x - 2, 6, 74, 7, 0xdfe6ff, 0.12);
  }
  for (const x of [0, 118, 238, 358, 478]) {
    c.fillRect(x, 22, 7, FLOOR_Y - 22, 0x0b0618);
    c.fillRect(x + 6, 22, 1, FLOOR_Y - 22, 0x3a2a70, 0.7);
  }
  c.fillRect(0, 98, ART_W, 3, 0x0b0618, 0.9);
  // Suelo con reflejos de la ciudad
  c.fillGradientV(0, FLOOR_Y, ART_W, ART_H - FLOOR_Y, [{ at: 0, color: 0x1c1440 }, { at: 1, color: 0x05020d }], 8);
  c.fillRect(0, FLOOR_Y, ART_W, 1, 0x4b3a9a, 0.8);
  for (let x = 30; x < ART_W; x += 120) for (let i = 0; i < 40; i++) c.fillRect(x + 6 + (i % 5), FLOOR_Y + 4 + i, 58 - (i % 5) * 2, 1, 0xdfe6ff, 0.18 * (1 - i / 40));
  for (let x = 0; x < ART_W; x += 20) for (let i = 0; i < 14; i++) c.fillRect(x + 2, FLOOR_Y + 3 + i * 3, 3, 1, x % 40 === 0 ? PAL.pink : PAL.cyan, 0.1 * (1 - i / 14));
  // Mesas con monitores encendidos (derecha y fondo)
  for (const [dx, dy, w] of [[318, 150, 70], [404, 144, 76], [250, 160, 52]] as const) {
    c.fillRect(dx, dy, w, 4, 0x2a2550);
    c.fillRect(dx, dy + 4, w, 1, 0x4b3a9a, 0.7);
    c.fillRect(dx + 3, dy + 5, 3, FLOOR_Y - dy - 5, 0x161030);
    c.fillRect(dx + w - 6, dy + 5, 3, FLOOR_Y - dy - 5, 0x161030);
    c.fillRect(dx + 8, dy - 13, 22, 13, 0x05140f);
    c.strokeRect(dx + 8, dy - 13, 22, 13, 0x0b8fa8, 0.9);
    for (let y = dy - 11; y < dy - 2; y += 3) c.fillRect(dx + 10, y, 8 + (y % 4) * 3, 1, 0x1ff3a0, 0.55);
    c.fillRect(dx + 18, dy - 1, 4, 1, 0x4a4f7a);
    c.fillRect(dx + 40, dy - 8, 10, 8, 0x241a4a); // silla/papeles
    c.fillRect(dx + 41, dy - 7, 8, 1, 0xd8d2f0, 0.7);
  }
  // Emblema holográfico de la empresa (anillos, sin texto)
  const ex = 330;
  const ey = 66;
  for (let i = 0; i < 4; i++) c.strokeRect(ex - 22 + i * 4, ey - 22 + i * 4, 44 - i * 8, 44 - i * 8, i % 2 === 0 ? PAL.cyan : PAL.magenta, 0.55 - i * 0.08);
  c.fillCircle(ex, ey, 6, PAL.cyan, 0.5);
  c.fillCircle(ex, ey, 3, PAL.white, 0.8);
  c.blit(buildGlowDisc(34, PAL.cyan, 5, 0.2), ex - 34, ey - 34);
  // Carrito de limpieza y señal de suelo mojado
  c.fillRect(176, 150, 34, 4, 0x6a6a8a);
  c.fillRect(178, 154, 30, 22, 0x2a8a8a);
  c.fillRect(178, 154, 30, 2, 0x4acaca);
  c.fillRect(180, 138, 10, 12, 0xe8e8f8);
  c.fillRect(194, 140, 6, 10, 0xff6a9a);
  c.fillRect(176, 176, 34, 2, 0x2a2550);
  c.fillCircle(182, 180, 3, 0x05020d);
  c.fillCircle(204, 180, 3, 0x05020d);
  c.fillRect(176, 124, 2, 28, 0x8a8a9a);
  c.fillPolygon([{ x: 100, y: FLOOR_Y }, { x: 112, y: FLOOR_Y }, { x: 110, y: FLOOR_Y - 16 }, { x: 102, y: FLOOR_Y - 16 }], 0xffd23a);
  c.fillRect(104, FLOOR_Y - 12, 4, 6, 0x14101e);
  c.blit(buildGlowEllipse(46, 6, 0xdfe6ff, 4, 0.5), 170, FLOOR_Y - 4);

  // La madre empujando la fregona
  const mom = personActor({ x: 120, footY: FLOOR_Y + 8, height: 60, facing: 1, pose: 'offer', top: 0x2a8a8a, topLight: 0x4acaca, bottom: 0x1a2a4a, hair: 0x120a10, shoe: 0xd8d2f0, skin: 0xc98b5e }, 1, 2400);
  c.line(mom.at.hand.x, mom.at.hand.y, mom.at.hand.x + 14, FLOOR_Y + 6, 0x8a8a9a, 1);
  c.fillRect(mom.at.hand.x + 10, FLOOR_Y + 5, 12, 3, 0xe8e8f8);

  const front = new PixelCanvas(ART_W, ART_H);
  front.fillEllipse(24, 270, 40, 22, 0x05020d);
  front.fillRect(-2, 232, 18, 48, 0x05020d);
  front.fillEllipse(8, 224, 12, 16, 0x05140f);
  front.fillEllipse(20, 218, 10, 14, 0x07201a);
  front.fillEllipse(486, 272, 40, 22, 0x05020d);
  front.fillRect(486, 238, 16, 42, 0x05020d);
  front.fillRect(0, 0, ART_W, 3, 0x05020d, 0.9);
  return [layer(back, 0.25), layer(c, 1, { actors: [mom.actor] }), layer(front, 1.25)];
}
void ART_H;
