// Escena 7: el taller trasero. Adrián arregla un escáner "muerto"; detrás, dos tipos lo miran desde la puerta.
import { PixelCanvas } from '../../../core/pixelCanvas';
import { drawPixelText } from '../../../core/pixelText';
import { PAL } from '../../../data/menuPalette';
import { buildGlowDisc } from '../../menu/art/glow';
import { ART_W, layer, newArt, personActor, powerLine, type SceneArt } from './kit';

export function buildTalentArt(): SceneArt {
  // Pared de herramientas
  const back = newArt();
  back.fillGradientV(0, 0, ART_W, 197, [{ at: 0, color: 0x07101c }, { at: 1, color: 0x10243a }], 12);
  for (let y = 16; y < 130; y += 6) for (let x = 14; x < 360; x += 6) back.putPixel(x, y, 0x1c3550, 1);
  const tools: ReadonlyArray<readonly [number, number, number, number, number]> = [[30, 30, 3, 36, 0x4a5a7a], [64, 28, 2, 40, 0x5a6a8a], [96, 30, 3, 26, 0x4a5a7a], [200, 24, 3, 40, 0x6a5a4a], [250, 30, 2, 36, 0x5a6a8a], [290, 26, 3, 30, 0x4a5a7a]];
  for (const [x, y, w, h, col] of tools) back.fillRect(x, y, w, h, col);
  back.fillRect(26, 26, 11, 6, 0x4a5a7a);
  back.fillRect(60, 24, 10, 4, 0x8a4a4a);
  back.fillRect(96, 30, 18, 3, 0x4a5a7a);
  back.fillRect(140, 28, 26, 14, 0x24304a);
  back.strokeRect(140, 28, 26, 14, 0x4a5a7a, 0.8);
  for (const [dx, col] of [[144, PAL.red], [150, PAL.sun], [156, PAL.cyan]] as const) back.fillRect(dx, 33, 3, 3, col);
  // Osciloscopio y estante
  back.fillRect(300, 70, 60, 3, 0x4a5a7a);
  back.fillRect(308, 48, 40, 22, 0x0a1a24);
  back.strokeRect(308, 48, 40, 22, 0x4a5a7a);
  for (let i = 0; i < 36; i++) back.setPixel(310 + i, 59 + Math.sin(i * 0.7) * 7, 0x4fffc0, 0.85);
  back.fillRect(210, 70, 60, 3, 0x4a5a7a);
  back.fillRect(214, 56, 10, 14, 0x2a2a52);
  back.fillRect(228, 60, 12, 10, 0x24304a);
  back.fillRect(244, 52, 14, 18, 0x2a2a52);
  back.fillRect(218, 60, 3, 3, PAL.sun);

  const c = newArt();
  // Puerta entreabierta con luz cálida
  c.fillRect(404, 50, 66, 148, 0x05020d);
  c.fillRect(410, 56, 54, 142, 0x3a2410);
  for (let y = 56; y < 198; y++) c.fillRect(410, y, 54, 1, 0xffb347, 0.2 + (1 - (y - 56) / 142) * 0.45);
  c.fillRect(410, 56, 54, 3, 0xffe9a8, 0.8);
  c.blit(buildGlowDisc(80, PAL.amber, 5, 0.22), 358, 70);
  c.fillRect(0, 196, ART_W, 84, 0x070d18);
  c.fillRect(0, 196, ART_W, 2, 0x1c3550);
  c.fillGradientV(380, 198, 110, 50, [{ at: 0, color: 0x6a4a1a }, { at: 1, color: 0x070d18 }], 8);
  const g1 = personActor({ x: 432, footY: 200, height: 58, facing: -1, pose: 'stand', top: 0x0b0a18, bottom: 0x0b0a18, skin: 0x1a1020, hair: 0x05030a, shoe: 0x1a1a28, hood: true, rim: PAL.amber }, 1, 2800);
  const g2 = personActor({ x: 458, footY: 202, height: 54, facing: -1, pose: 'stand', top: 0x0b0a18, bottom: 0x0b0a18, skin: 0x1a1020, hair: 0x05030a, shoe: 0x1a1a28, rim: PAL.amber }, 1, 3200, 1100);
  const kid = personActor({ x: 178, footY: 178, height: 54, facing: 1, pose: 'offer', top: 0x3b6fd0, topLight: 0x6ab0ff, bottom: 0x1f3068, rim: PAL.cyan }, 1, 2200);
  kid.actor.canvas.line(kid.at.hand.x - kid.actor.x, kid.at.hand.y - kid.actor.y, kid.at.hand.x - kid.actor.x + 12, kid.at.hand.y - kid.actor.y + 2, 0x8a8a9a);

  // Banco, escáner abierto y dinero (delante del chaval)
  const bench = new PixelCanvas(ART_W, 280);
  bench.fillRect(40, 150, 350, 8, 0x4a3a52);
  bench.fillRect(40, 150, 350, 1, 0x8a7a92);
  bench.fillRect(40, 158, 350, 50, 0x251b34);
  bench.fillRect(40, 158, 350, 2, 0x140e20);
  bench.fillRect(52, 160, 6, 48, 0x1a1228);
  bench.fillRect(372, 160, 6, 48, 0x1a1228);
  bench.fillRect(100, 176, 90, 16, 0x1a1228);
  bench.strokeRect(100, 176, 90, 16, 0x3a2f4a, 0.9);
  bench.fillRect(140, 182, 12, 3, 0x6a5a7a);
  bench.fillRect(208, 112, 78, 38, 0x1c2438);
  bench.strokeRect(208, 112, 78, 38, 0x4a5a7a);
  bench.fillRect(214, 118, 52, 26, 0x05140f);
  bench.strokeRect(214, 118, 52, 26, 0x0b8fa8);
  for (let y = 121; y < 142; y += 3) bench.fillRect(217, y, 46, 1, 0x1ff3a0, 0.28);
  drawPixelText(bench, 'OK', 232, 126, { color: 0x4fffc0 });
  bench.fillRect(270, 118, 10, 6, PAL.red);
  bench.fillRect(270, 128, 10, 6, PAL.cyan);
  bench.fillRect(270, 138, 10, 4, PAL.sun);
  bench.line(286, 125, 300, 140, PAL.red);
  bench.line(286, 131, 304, 146, PAL.cyan);
  bench.line(286, 137, 298, 148, PAL.sun);
  bench.blit(buildGlowDisc(52, PAL.cyan, 5, 0.22), 217, 92);
  bench.fillRect(324, 138, 30, 12, 0x2a5a3a);
  bench.strokeRect(324, 138, 30, 12, 0x4a8a5a, 0.8);
  bench.fillRect(324, 142, 30, 1, 0x4a8a5a, 0.7);
  bench.fillRect(306, 146, 14, 3, 0x6a6a7a);
  bench.fillRect(60, 138, 8, 12, 0xfff0d2); // taza
  bench.fillRect(68, 141, 3, 5, 0xfff0d2, 0.7);

  // Primer plano: bombilla colgando y cajas desenfocadas
  const front = new PixelCanvas(ART_W, 280);
  front.fillRect(70, 0, 1, 52, 0x05020d);
  front.fillRect(66, 52, 9, 7, 0xffe9a8);
  front.blit(buildGlowDisc(24, 0xffe9a8, 4, 0.4), 49, 34);
  powerLine(front, -4, 14, 70, 4, 8);
  front.fillRect(0, 232, 56, 48, 0x05020d);
  front.fillRect(10, 220, 40, 14, 0x0a0a14);
  front.fillEllipse(486, 262, 34, 20, 0x05020d);
  return [layer(back, 0.4), layer(c, 1, { actors: [g1.actor, g2.actor, kid.actor] }), layer(bench, 1), layer(front, 1.25)];
}
