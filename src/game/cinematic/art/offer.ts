// Escena 3: el callejón. Un tipo encapuchado le ofrece trescientos dólares por llevar una bolsa.
import { PixelCanvas } from '../../../core/pixelCanvas';
import { drawPixelText } from '../../../core/pixelText';
import { PAL } from '../../../data/menuPalette';
import { buildGlowDisc, buildGlowEllipse } from '../../menu/art/glow';
import { paintManhole } from '../../menu/art/props';
import { ART_W, bricks, drawPerson, newArt, reflection, wetGround } from './kit';

export function buildOffer(): PixelCanvas {
  const c = newArt();
  bricks(c, 0, 0, ART_W, 196, 0x241438, 0x120a2a, 21);
  c.fillGradientV(0, 0, ART_W, 60, [{ at: 0, color: 0x05020d }, { at: 1, color: 0x241438 }], 10);
  // Edificios laterales en perspectiva
  c.fillRect(0, 0, 36, 196, 0x140a2a);
  c.fillRect(464, 0, 36, 196, 0x140a2a);
  c.fillRect(36, 0, 2, 196, 0x3a2a70, 0.7);
  c.fillRect(462, 0, 2, 196, 0x3a2a70, 0.7);

  // Escalera de incendios (arriba a la derecha)
  for (let i = 0; i < 4; i++) {
    const y = 28 + i * 30;
    c.fillRect(380, y, 78, 2, 0x3a4468);
    for (let x = 380; x < 458; x += 6) c.fillRect(x, y - 8, 1, 8, 0x2a3250);
    c.line(380 + (i % 2) * 70, y + 2, 380 + ((i + 1) % 2) * 70, y + 30, 0x3a4468);
  }
  // Grafiti rosa
  c.line(70, 70, 96, 46, PAL.magenta, 0.85);
  c.line(96, 46, 108, 78, PAL.magenta, 0.85);
  c.line(108, 78, 130, 52, PAL.magenta, 0.85);
  c.line(60, 86, 140, 90, PAL.cyan, 0.7);
  c.fillCircle(150, 60, 3, PAL.magenta, 0.9);
  c.blit(buildGlowDisc(60, PAL.magenta, 4, 0.14), 56, 30);

  // Farola de pared
  c.fillRect(246, 50, 12, 4, 0x2c2556);
  c.fillRect(248, 54, 8, 4, 0xffcf6b);
  c.blit(buildGlowDisc(64, 0xffb347, 5, 0.34), 220, 24);
  for (let y = 58; y < 196; y++) {
    const a = 0.2 * (1 - (y - 58) / 138);
    c.fillRect(212 + (y - 58) * 0.25, y, 80 - (y - 58) * 0.5, 1, 0xffb347, a);
  }
  // Contenedor
  c.fillRect(380, 150, 76, 46, 0x0f4a52);
  c.fillRect(378, 146, 80, 6, 0x1a6a74);
  c.fillRect(382, 156, 72, 1, 0x0a3038);
  c.fillRect(392, 150, 2, 46, 0x0a3038);
  c.fillRect(430, 150, 2, 46, 0x0a3038);
  c.fillRect(380, 150, 76, 1, PAL.cyan, 0.5);

  // Suelo mojado
  wetGround(c, 196, 0x1a1236, 0x05020d);
  c.blit(buildGlowEllipse(70, 8, 0xffb347, 4, 0.4), 220, 194);
  reflection(c, 238, 200, 36, 16, 0xffb347, 0.3);
  c.fillEllipse(150, 206, 30, 5, PAL.cyan, 0.08);
  paintManhole(c, 120, 204);

  // El tipo (capucha, visor) y Adrián con la mano abierta
  const man = drawPerson(c, { x: 300, footY: 198, height: 64, facing: -1, pose: 'offer', top: 0x241a4a, topLight: 0x4b3a9a, bottom: 0x12122a, hood: true, visor: PAL.cyan, shoe: 0x4a4f7a, rim: PAL.magenta });
  const kid = drawPerson(c, { x: 196, footY: 198, height: 36, facing: 1, pose: 'offer', top: 0x3b6fd0, topLight: 0x6ab0ff, bottom: 0x1f3068, rim: PAL.cyan });
  // Bolsa en la mano del tipo
  const bx = man.hand.x - 5;
  const by = man.hand.y + 1;
  c.fillRect(bx, by, 13, 9, 0x0a0a1a);
  c.strokeRect(bx, by, 13, 9, 0x4a4f7a, 0.9);
  c.fillRect(bx + 2, by - 2, 9, 1, 0x4a4f7a);
  c.fillRect(bx + 3, by + 3, 7, 1, PAL.cyan);
  // Billetes
  const mid = (man.hand.x + kid.hand.x) / 2;
  c.fillRect(mid - 9, 100, 20, 10, 0xffc766, 0.0);
  c.fillRect(mid - 11, 98, 22, 14, 0x05020d, 0.7);
  c.strokeRect(mid - 11, 98, 22, 14, PAL.amber, 0.9);
  drawPixelText(c, '300', mid - 8, 102, { color: PAL.sun });
  c.blit(buildGlowDisc(26, PAL.amber, 4, 0.3), mid - 14, 92);
  return c;
}
