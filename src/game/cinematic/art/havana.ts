// Escena 1: Little Havana, 2078. Un chaval de 14 años con un cafecito, en la acera, de noche.
import { PixelCanvas } from '../../../core/pixelCanvas';
import { PAL } from '../../../data/menuPalette';
import { buildNeonSign } from '../../menu/art/neon';
import { buildGlowEllipse } from '../../menu/art/glow';
import { ART_H, ART_W, drawPerson, newArt, palmSilhouette, reflection, sky, skyline, stars, wetGround, windows } from './kit';

export function buildHavana(): PixelCanvas {
  const c = newArt();
  sky(c, 200, [
    { at: 0, color: PAL.ink },
    { at: 0.45, color: PAL.plum },
    { at: 0.8, color: 0x5a2a7a },
    { at: 1, color: 0x9a3a8a }
  ]);
  stars(c, 11, 90, 90);
  c.fillCircle(78, 52, 15, PAL.blush, 0.16);
  c.fillCircle(78, 52, 10, PAL.blush, 0.9);
  c.fillCircle(74, 49, 3, PAL.lilac, 0.35);
  skyline(c, 5, 170, 40, 100, 0x1a0f3d, 0.1);
  skyline(c, 9, 182, 26, 62, 0x120a2a, 0.18);

  // Bloque de apartamentos (derecha)
  const bx = 262;
  c.fillRect(bx, 36, 240, 164, 0x2a1c52);
  c.fillRect(bx, 36, 240, 3, 0x4b2d9a);
  c.fillRect(bx, 36, 3, 164, 0x1a1038);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 5; col++) {
      const wx = bx + 14 + col * 44;
      const wy = 50 + row * 36;
      c.fillRect(wx - 1, wy - 1, 22, 26, 0x140a2e);
      c.fillRect(wx, wy, 20, 24, 0x0c0620);
      c.fillRect(wx, wy + 11, 20, 1, 0x1f1045);
      c.fillRect(wx + 9, wy, 1, 24, 0x1f1045);
    }
    c.fillRect(bx, 40 + row * 36 + 30, 240, 2, 0x3a2a70, 0.6);
  }
  // Ventana encendida (la casa de Adrián) con balcón
  const lx = bx + 14 + 2 * 44;
  const ly = 50 + 2 * 36;
  c.fillRect(lx, ly, 20, 24, PAL.window);
  c.fillRect(lx + 2, ly + 2, 16, 20, 0xffcf6b);
  c.fillRect(lx + 9, ly, 1, 24, 0xb77a2a);
  c.fillRect(lx, ly + 11, 20, 1, 0xb77a2a);
  c.fillRect(lx - 3, ly + 24, 26, 2, 0x4a4f7a);
  for (let px = lx - 3; px < lx + 23; px += 4) c.fillRect(px, ly + 20, 1, 5, 0x4a4f7a);
  c.fillRect(lx - 4, ly + 25, 28, 1, PAL.cyan, 0.6);
  // Luz de otras ventanas
  windows(c, bx, 36, 240, 164, 31, 0.0);
  c.fillRect(bx + 14 + 44, 50 + 36, 20, 24, 0x3a6a8a, 0.55);
  c.fillRect(bx + 14 + 4 * 44, 50, 20, 24, 0x7a3a6a, 0.6);
  // Cartel vertical de neón
  const hotel = buildNeonSign('HOTEL', PAL.magenta, 1);
  c.blit(hotel.glow, bx - 2 - hotel.glowPad, 70 - hotel.glowPad, { alpha: 0.9 });
  c.blit(hotel.on, bx - 2, 70);

  // Cafetería (izquierda)
  c.fillRect(8, 108, 168, 92, 0x24174a);
  c.fillRect(8, 108, 168, 3, 0x4b2d9a);
  c.fillRect(20, 142, 70, 58, 0x120a2a);
  c.fillRect(22, 144, 66, 54, 0xffcf6b, 0.85);
  c.fillRect(22, 144, 66, 8, 0xffe9a8, 0.6);
  c.fillRect(30, 166, 12, 14, 0x7a4a2a, 0.9); // sillas/barra
  c.fillRect(52, 160, 28, 3, 0x7a4a2a, 0.9);
  c.fillRect(52, 163, 2, 18, 0x4a2a1a);
  c.fillRect(78, 163, 2, 18, 0x4a2a1a);
  for (let px = 18; px < 94; px += 8) {
    c.fillRect(px, 130, 4, 12, px % 16 === 2 ? PAL.magenta : PAL.blush, 0.95);
    c.fillRect(px + 4, 130, 4, 12, 0xffffff, 0.2);
  }
  c.fillRect(18, 128, 76, 2, 0x2a1850);
  const cafe = buildNeonSign('CAFÉ', PAL.cyan, 2);
  c.blit(cafe.glow, 100 - cafe.glowPad, 118 - cafe.glowPad);
  c.blit(cafe.on, 100, 118);
  c.fillRect(104, 150, 62, 26, 0x1a0f3d, 0.9);
  c.fillRect(104, 150, 62, 1, PAL.pink, 0.6);

  palmSilhouette(c, 224, 200, 110, 7);

  // Calle y acera
  wetGround(c, 200, 0x1a1236, 0x05020d);
  c.fillRect(0, 196, ART_W, 6, 0x2c2556);
  c.fillRect(0, 196, ART_W, 1, 0x5a4bd0, 0.7);
  c.fillRect(0, 201, ART_W, 1, 0x0a0618);
  reflection(c, 100, 204, 60, 16, PAL.cyan, 0.32);
  reflection(c, 20, 204, 70, 12, 0xffcf6b, 0.22);
  reflection(c, bx + 40, 204, 100, 12, PAL.magenta, 0.18);

  // Farola con su charco de luz
  c.fillRect(190, 108, 3, 90, 0x2c2556);
  c.fillRect(186, 106, 12, 3, 0x2c2556);
  c.fillRect(184, 108, 16, 3, PAL.window);
  const pool = buildGlowEllipse(46, 8, 0xffcf6b, 4, 0.45);
  c.blit(pool, 191 - pool.width / 2, 198);
  c.blit(buildGlowEllipse(14, 14, 0xffcf6b, 3, 0.3), 177, 102);

  // El chaval en el bordillo, con su cafecito (lejos de la farola para destacar su silueta)
  const kid = drawPerson(c, { x: 150, footY: 200, height: 40, facing: 1, pose: 'sit', top: 0x3b6fd0, topLight: 0x6ab0ff, bottom: 0x1f3068, rim: PAL.cyan });
  c.fillRect(kid.hand.x - 1, kid.hand.y - 3, 4, 4, 0xfff0d2);
  c.fillRect(kid.hand.x, kid.hand.y - 3, 2, 1, 0x7a4a2a);
  c.setPixel(kid.hand.x + 1, kid.hand.y - 6, PAL.white, 0.5);
  c.setPixel(kid.hand.x + 2, kid.hand.y - 9, PAL.white, 0.35);
  c.setPixel(kid.hand.x, kid.hand.y - 11, PAL.white, 0.25);
  void ART_H;
  return c;
}
