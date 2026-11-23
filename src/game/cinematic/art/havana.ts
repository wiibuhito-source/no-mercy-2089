// Escena 2: Little Havana, 2078. Un chaval de 14 años con un cafecito, sentado en la terraza, de noche y bajo la lluvia.
import { PixelCanvas } from '../../../core/pixelCanvas';
import { drawPixelText } from '../../../core/pixelText';
import { PAL } from '../../../data/menuPalette';
import { buildNeonSign } from '../../menu/art/neon';
import { buildGlowEllipse } from '../../menu/art/glow';
import { acUnit, frond, holoPanel, layer, newArt, palmSilhouette, parkedCar, personActor, powerLine, reflection, sky, skyline, stars, swayActor, trashBag, wetGround, type SceneArt } from './kit';
import { antenna, balcony, bistroTable, chair, dish, graffiti, hydrant, mailbox, plantPot, poster, scooter, trashCan, umbrellaPerson, wallTexture, waterTank, windowLit, type WindowKind } from './details';

const G = 200; // suelo de la acera

export function buildHavanaArt(): SceneArt {
  const back = newArt();
  sky(back, 200, [{ at: 0, color: PAL.ink }, { at: 0.45, color: PAL.plum }, { at: 0.8, color: 0x5a2a7a }, { at: 1, color: 0x9a3a8a }]);
  stars(back, 11, 90, 90);
  back.fillCircle(78, 52, 15, PAL.blush, 0.16);
  back.fillCircle(78, 52, 10, PAL.blush, 0.9);
  back.fillCircle(74, 49, 3, PAL.lilac, 0.35);
  for (const [x, y, w] of [[20, 70, 90], [150, 40, 70], [320, 56, 100]] as const) back.fillEllipse(x + w / 2, y, w / 2, 3, 0x7a3a8a, 0.3);
  skyline(back, 5, 170, 40, 100, 0x1a0f3d, 0.1);
  skyline(back, 9, 182, 26, 62, 0x120a2a, 0.18);

  const c = newArt();
  // --- Edificio de apartamentos (derecha)
  const bx = 262;
  c.fillRect(bx, 36, 240, 164, 0x2a1c52);
  c.fillRect(bx, 36, 240, 3, 0x4b2d9a);
  c.fillRect(bx, 36, 3, 164, 0x1a1038);
  wallTexture(c, bx, 40, 240, 156, 3, 0.06, 0x120a2a);
  const kinds: WindowKind[] = ['dark', 'warm', 'tv', 'curtain', 'person', 'plant', 'dark', 'blinds', 'warm', 'dark'];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 5; col++) {
      const wx = bx + 14 + col * 44;
      const wy = 50 + row * 36;
      const isHome = row === 2 && col === 2;
      windowLit(c, wx, wy, 20, 24, isHome ? 'warm' : (kinds[(row * 5 + col * 3) % kinds.length] ?? 'dark'), row * 7 + col);
      if (row % 2 === 0 && col % 2 === 1) balcony(c, wx - 3, wy + 24, 26, true, row + col);
      else c.fillRect(wx - 2, wy + 24, 24, 2, 0x3a3f6a);
    }
    c.fillRect(bx, 40 + row * 36 + 30, 240, 2, 0x3a2a70, 0.6);
  }
  acUnit(c, bx + 14 + 3 * 44 + 4, 50 + 36 + 6);
  acUnit(c, bx + 14 + 4, 50 + 36 * 3 + 6);
  waterTank(c, bx + 30, 22);
  antenna(c, bx + 170, 36, 22);
  dish(c, bx + 100, 44);
  c.fillRect(bx + 14 + 44 * 2 - 4, 50 + 36 * 2 + 24, 28, 1, PAL.cyan, 0.6); // luz del balcón de casa
  const hotel = buildNeonSign('HOTEL', PAL.magenta, 1);
  c.blit(hotel.glow, bx - 2 - hotel.glowPad, 70 - hotel.glowPad, { alpha: 0.9 });
  c.blit(hotel.on, bx - 2, 70);
  // Planta baja del edificio: portal, carteles y grafiti
  c.fillRect(bx, 164, 240, 36, 0x20153f);
  c.fillRect(bx + 36, 168, 26, 32, 0x0a0618);
  c.fillRect(bx + 36, 168, 26, 2, 0x4a4f7a);
  c.fillRect(bx + 56, 184, 3, 3, PAL.sun);
  for (let i = 0; i < 3; i++) c.fillRect(bx + 34 + i * 0, 200 - i * 2, 30, 2, 0x3a3f6a);
  poster(c, bx + 84, 170, 12, 18, 5);
  poster(c, bx + 100, 174, 10, 14, 9);
  graffiti(c, bx + 120, 182, PAL.cyan, 4);
  graffiti(c, bx + 168, 176, PAL.pink, 8);

  // --- Cafetería (izquierda)
  c.fillRect(8, 108, 168, 92, 0x24174a);
  c.fillRect(8, 108, 168, 3, 0x4b2d9a);
  wallTexture(c, 8, 112, 168, 86, 12, 0.05, 0x120a2a);
  c.fillRect(20, 142, 70, 58, 0x120a2a);
  c.fillRect(22, 144, 66, 54, 0xffcf6b, 0.85);
  c.fillRect(22, 144, 66, 8, 0xffe9a8, 0.6);
  c.fillRect(30, 166, 12, 14, 0x7a4a2a, 0.9);
  c.fillRect(52, 160, 28, 3, 0x7a4a2a, 0.9);
  c.fillRect(52, 163, 2, 18, 0x4a2a1a);
  c.fillRect(78, 163, 2, 18, 0x4a2a1a);
  c.fillCircle(61, 156, 3, 0xfff0d2, 0.9);
  c.fillRect(34, 146, 10, 8, 0x1a0f2a); // cuadro dentro
  c.fillRect(36, 148, 6, 4, PAL.pink, 0.8);
  for (let px = 18; px < 94; px += 8) {
    c.fillRect(px, 130, 4, 12, px % 16 === 2 ? PAL.magenta : PAL.blush, 0.95);
    c.fillRect(px + 4, 130, 4, 12, 0xffffff, 0.2);
  }
  c.fillRect(18, 128, 76, 2, 0x2a1850);
  const cafe = buildNeonSign('CAFÉ', PAL.cyan, 2);
  c.blit(cafe.glow, 100 - cafe.glowPad, 118 - cafe.glowPad);
  c.blit(cafe.on, 100, 118);
  holoPanel(c, 104, 150, 64, 26, PAL.pink, 0x1a0f3d);
  drawPixelText(c, 'CAFECITO', 109, 155, { color: PAL.blush });
  drawPixelText(c, '24 HORAS', 109, 165, { color: PAL.cyan });
  for (const wx of [140, 156]) windowLit(c, wx, 112, 10, 8, wx === 140 ? 'warm' : 'dark', wx);
  c.fillRect(96, 176, 22, 22, 0x1a0f2a); // pizarra del menú
  c.strokeRect(96, 176, 22, 22, 0x7a4a2a);
  c.fillRect(99, 180, 16, 1, 0xf4f0ff, 0.7);
  c.fillRect(99, 184, 12, 1, 0xf4f0ff, 0.5);
  c.fillRect(99, 188, 14, 1, 0xf4f0ff, 0.5);
  plantPot(c, 14, G, 22);

  // --- Calle y acera
  wetGround(c, G, 0x1a1236, 0x05020d);
  c.fillRect(0, 196, 500, 6, 0x2c2556);
  c.fillRect(0, 196, 500, 1, 0x5a4bd0, 0.7);
  c.fillRect(0, 201, 500, 1, 0x0a0618);
  reflection(c, 100, 204, 60, 16, PAL.cyan, 0.32);
  reflection(c, 20, 204, 70, 12, 0xffcf6b, 0.22);
  reflection(c, bx + 40, 204, 100, 12, PAL.magenta, 0.18);
  c.fillEllipse(238, 206, 20, 3, 0xffcf6b, 0.12);

  palmSilhouette(c, 172, G, 112, 7);
  // Farola
  c.fillRect(190, 108, 3, 90, 0x2c2556);
  c.fillRect(186, 106, 12, 3, 0x2c2556);
  c.fillRect(184, 108, 16, 3, PAL.window);
  c.blit(buildGlowEllipse(46, 8, 0xffcf6b, 4, 0.45), 168, 198);

  // --- Mobiliario de la calle
  umbrellaPerson(c, 282, G, 34, 0xb0405a, -1);
  hydrant(c, 302, G);
  parkedCar(c, 330, 208, 78, 0x2a2a66, 0x0a0a1e, 0xffe9a8, -1);
  trashCan(c, 428, G);
  trashBag(c, 416, G);
  mailbox(c, 448, G);
  scooter(c, 476, G + 2);

  // --- La terraza: silla para Adrián, mesa con una taza y una silla vacía con otra taza
  chair(c, 216, G, 1, 0x6a6fa0, 12);
  bistroTable(c, 240, G, 22, 18);
  c.fillRect(236, G - 22, 5, 4, 0xfff0d2);
  c.fillRect(241, G - 21, 2, 2, 0xfff0d2, 0.8);
  chair(c, 264, G, -1, 0x6a6fa0, 12);
  c.fillRect(255, G - 22, 7, 8, 0x6a3a8a, 0.9); // chaqueta de su madre en el respaldo
  c.fillRect(255, G - 22, 7, 1, 0x9a6ac0, 0.9);

  // --- Adrián con su cafecito (respira)
  const kid = personActor({ x: 210, footY: G, height: 40, facing: 1, pose: 'sit', seat: 0.3, top: 0x3b6fd0, topLight: 0x6ab0ff, bottom: 0x1f3068, rim: PAL.cyan }, 1, 2200);
  const hx = kid.at.hand.x - kid.actor.x;
  const hy = kid.at.hand.y - kid.actor.y;
  kid.actor.canvas.fillRect(hx - 1, hy - 3, 4, 4, 0xfff0d2);
  kid.actor.canvas.fillRect(hx, hy - 3, 2, 1, 0x7a4a2a);

  // --- Ropa tendida que se mece con el viento
  const laundryCanvas = new PixelCanvas(100, 30);
  powerLine(laundryCanvas, 0, 6, 98, 2, 5, 0x6a6a8a, 0.9);
  const cloths: ReadonlyArray<readonly [number, number, number]> = [[8, 0xff7aa8, 9], [20, 0xffd36b, 11], [34, 0x6ad0ff, 8], [48, 0xf4f0ff, 10], [62, 0x9a6aff, 9], [78, 0xff7aa8, 12]];
  for (const [lx, col, len] of cloths) {
    const t = lx / 98;
    const y = 6 - 4 * t + Math.sin(t * Math.PI) * 5;
    laundryCanvas.fillRect(lx, y, 6, len, col, 0.9);
    laundryCanvas.fillRect(lx, y, 6, 1, 0xffffff, 0.3);
  }
  const laundry = swayActor(laundryCanvas, 176, 88, 2, 2600);

  // --- Primer plano: cables, hojas de palmera y un cartel de neón que cuelga
  const front = new PixelCanvas(500, 280);
  powerLine(front, -4, 14, 250, 30, 12);
  powerLine(front, 250, 30, 504, 8, 14);
  powerLine(front, -4, 24, 250, 40, 10, 0x0a0612, 0.8);
  front.fillRect(0, 0, 6, 70, 0x05020d, 0.0);
  const fronds: ReturnType<typeof swayActor>[] = [];
  for (const [i, dy, len] of [[0, 0.25, 96], [1, 0.5, 70]] as const) {
    const f = new PixelCanvas(110, 80);
    frond(f, 4, 4 + i * 8, 1, dy, len, 0x07120f, 0x0f3a34);
    fronds.push(swayActor(f, 0, 0, 2, 2400, i * 700));
  }
  return [layer(back, 0.3), layer(c, 1, { actors: [kid.actor, laundry] }), layer(front, 1.25, { actors: fronds })];
}
