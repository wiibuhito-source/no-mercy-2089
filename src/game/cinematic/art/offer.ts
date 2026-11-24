// Escena 6: el callejón. Un tipo encapuchado le ofrece trescientos dólares por llevar una bolsa.
import { PixelCanvas } from '../../../core/pixelCanvas';
import { drawPixelText } from '../../../core/pixelText';
import { PAL } from '../../../data/menuPalette';
import { buildGlowDisc, buildGlowEllipse } from '../../menu/art/glow';
import { paintManhole } from '../../menu/art/props';
import { ART_W, acUnit, bricks, layer, newArt, personActor, powerLine, reflection, swayActor, trashBag, wetGround, type SceneArt } from './kit';
import { crate, graffiti, poster, wallTexture, windowLit } from './details';

export function buildOfferArt(): SceneArt {
  // Pared del fondo, con una ventana enrejada y neón rosa
  const back = newArt();
  bricks(back, 0, 0, ART_W, 200, 0x1e1232, 0x0e0820, 21);
  back.fillGradientV(0, 0, ART_W, 70, [{ at: 0, color: 0x05020d }, { at: 1, color: 0x1e1232 }], 10);
  back.fillRect(66, 62, 34, 46, 0x05020d);
  back.strokeRect(66, 62, 34, 46, 0x3a2a70);
  for (let x = 72; x < 98; x += 6) back.fillRect(x, 64, 1, 42, 0x4a4f7a);
  back.fillRect(68, 70, 30, 24, PAL.magenta, 0.12);
  back.line(120, 118, 146, 94, PAL.magenta, 0.85);
  back.line(146, 94, 158, 126, PAL.magenta, 0.85);
  back.line(158, 126, 180, 100, PAL.magenta, 0.85);
  back.line(112, 136, 190, 140, PAL.cyan, 0.7);
  back.fillCircle(198, 108, 3, PAL.magenta, 0.9);
  back.blit(buildGlowDisc(64, PAL.magenta, 4, 0.14), 110, 84);
  acUnit(back, 300, 80);
  acUnit(back, 340, 60);
  wallTexture(back, 0, 0, ART_W, 200, 31, 0.08, 0x05020d);
  windowLit(back, 250, 118, 18, 22, 'blinds', 3);
  windowLit(back, 410, 96, 18, 22, 'warm', 5);
  poster(back, 206, 140, 12, 18, 4);
  graffiti(back, 300, 150, PAL.cyan, 9);

  const c = newArt();
  // Edificios laterales y escalera de incendios
  c.fillRect(0, 0, 36, 196, 0x140a2a);
  c.fillRect(464, 0, 36, 196, 0x140a2a);
  c.fillRect(36, 0, 2, 196, 0x3a2a70, 0.7);
  c.fillRect(462, 0, 2, 196, 0x3a2a70, 0.7);
  for (let i = 0; i < 4; i++) {
    const y = 28 + i * 30;
    c.fillRect(380, y, 78, 2, 0x3a4468);
    for (let x = 380; x < 458; x += 6) c.fillRect(x, y - 8, 1, 8, 0x2a3250);
    c.line(380 + (i % 2) * 70, y + 2, 380 + ((i + 1) % 2) * 70, y + 30, 0x3a4468);
  }
  // Farola de pared con su cono de luz
  c.fillRect(246, 50, 12, 4, 0x2c2556);
  c.fillRect(248, 54, 8, 4, 0xffcf6b);
  c.blit(buildGlowDisc(64, 0xffb347, 5, 0.34), 220, 24);
  for (let y = 58; y < 196; y++) c.fillRect(212 + (y - 58) * 0.25, y, 80 - (y - 58) * 0.5, 1, 0xffb347, 0.2 * (1 - (y - 58) / 138));
  // Contenedor con un gato encima
  c.fillRect(380, 150, 76, 46, 0x0f4a52);
  c.fillRect(378, 146, 80, 6, 0x1a6a74);
  c.fillRect(382, 156, 72, 1, 0x0a3038);
  c.fillRect(392, 150, 2, 46, 0x0a3038);
  c.fillRect(430, 150, 2, 46, 0x0a3038);
  c.fillRect(380, 150, 76, 1, PAL.cyan, 0.5);
  c.fillEllipse(440, 142, 8, 5, 0x0a0612);
  c.fillCircle(447, 137, 3.4, 0x0a0612);
  c.fillRect(445, 133, 2, 3, 0x0a0612);
  c.fillRect(449, 133, 2, 3, 0x0a0612);
  c.setPixel(446, 137, PAL.sun, 1);
  c.setPixel(449, 137, PAL.sun, 1);
  c.line(432, 142, 426, 134, 0x0a0612);
  trashBag(c, 366, 197);
  trashBag(c, 356, 197);
  // Cajas apiladas, una tubería de bajada y cables
  crate(c, 54, 196, 16);
  crate(c, 72, 196, 14);
  crate(c, 62, 180, 12);
  c.fillRect(40, 0, 3, 196, 0x2a2e48);
  for (let y = 20; y < 196; y += 34) c.fillRect(39, y, 5, 2, 0x4a4f7a);
  c.fillRect(40, 70, 56, 2, 0x2a2e48);
  c.fillRect(94, 70, 2, 14, 0x2a2e48);

  wetGround(c, 196, 0x1a1236, 0x05020d);
  c.blit(buildGlowEllipse(70, 8, 0xffb347, 4, 0.4), 220, 194);
  reflection(c, 238, 200, 36, 16, 0xffb347, 0.3);
  c.fillEllipse(150, 206, 30, 5, PAL.cyan, 0.08);
  paintManhole(c, 120, 204);

  const man = personActor({ x: 300, footY: 198, height: 64, facing: -1, pose: 'offer', top: 0x241a4a, topLight: 0x4b3a9a, bottom: 0x12122a, hood: true, visor: PAL.cyan, shoe: 0x4a4f7a, rim: PAL.magenta }, 1, 2400);
  const kid = personActor({ x: 196, footY: 198, height: 36, facing: 1, pose: 'offer', top: 0x3b6fd0, topLight: 0x6ab0ff, bottom: 0x1f3068, rim: PAL.cyan }, 1, 1900, 700);
  // Bolsa en la mano del tipo
  const bx = man.at.hand.x - man.actor.x - 5;
  const by = man.at.hand.y - man.actor.y + 1;
  const bag = man.actor.canvas;
  bag.fillRect(bx, by, 13, 9, 0x0a0a1a);
  bag.strokeRect(bx, by, 13, 9, 0x4a4f7a, 0.9);
  bag.fillRect(bx + 2, by - 2, 9, 1, 0x4a4f7a);
  bag.fillRect(bx + 3, by + 3, 7, 1, PAL.cyan);

  // Etiqueta con la cifra (aparece cuando se nombra el dinero)
  const tag = new PixelCanvas(ART_W, 280);
  const mid = (man.at.hand.x + kid.at.hand.x) / 2;
  tag.fillRect(mid - 15, 96, 30, 16, 0x05020d, 0.75);
  tag.strokeRect(mid - 15, 96, 30, 16, PAL.amber, 0.95);
  drawPixelText(tag, '300', mid - 9, 101, { color: PAL.sun, scale: 1 });
  tag.fillRect(mid - 13, 112, 26, 1, PAL.amber, 0.4);
  tag.blit(buildGlowDisc(28, PAL.amber, 4, 0.3), mid - 28, 86);

  // Ropa tendida de lado a lado del callejón, que se mece con el viento
  const lineC = new PixelCanvas(430, 34);
  powerLine(lineC, 0, 4, 428, 8, 8, 0x6a6a8a, 0.9);
  for (const [x, col, len] of [[40, 0xff7aa8, 12], [58, 0xf4f0ff, 10], [76, 0x6ad0ff, 13], [210, 0xffd36b, 11], [226, 0x9a6aff, 12], [340, 0xff7aa8, 10], [356, 0xf4f0ff, 13]] as const) {
    const t = x / 428;
    const y = 4 + 4 * t + Math.sin(t * Math.PI) * 8;
    lineC.fillRect(x, y, 7, len, col, 0.9);
    lineC.fillRect(x, y, 7, 1, 0xffffff, 0.3);
  }
  const laundry = swayActor(lineC, 36, 44, 2, 2700);

  // Primer plano: cables, tubería y bolsas desenfocadas
  const front = new PixelCanvas(ART_W, 280);
  powerLine(front, -4, 22, 250, 46, 16);
  powerLine(front, 250, 46, 504, 14, 18);
  front.fillRect(0, 0, 10, 280, 0x05020d);
  front.fillRect(490, 0, 10, 280, 0x05020d);
  front.fillEllipse(30, 256, 34, 20, 0x05020d);
  front.fillEllipse(470, 262, 40, 20, 0x05020d);
  return [layer(back, 0.4), layer(c, 1, { actors: [man.actor, kid.actor, laundry] }), layer(tag, 1, { revealAtLine: 1 }), layer(front, 1.25)];
}
