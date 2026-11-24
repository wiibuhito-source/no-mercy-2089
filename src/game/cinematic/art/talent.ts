// Escena 7: el taller trasero. Adrián arregla un escáner "muerto"; detrás, dos tipos lo miran desde la puerta.
import { PixelCanvas } from '../../../core/pixelCanvas';
import { drawPixelText } from '../../../core/pixelText';
import { PAL } from '../../../data/menuPalette';
import { buildGlowDisc } from '../../menu/art/glow';
import { ART_W, contactShadow, haze, layer, lightShaft, newArt, personActor, powerLine, swayActor, type SceneArt } from './kit';
import { crate, poster, wallTexture } from './details';

const BENCH = 168;

export function buildTalentArt(): SceneArt {
  // --- Pared de herramientas y pantallas, con luz fría de tubo fluorescente
  const back = newArt();
  back.fillGradientV(0, 0, ART_W, 200, [{ at: 0, color: 0x0a1626 }, { at: 1, color: 0x163048 }], 12);
  for (let y = 20; y < 140; y += 6) for (let x = 12; x < 380; x += 6) back.putPixel(x, y, 0x24486a, 1);
  wallTexture(back, 0, 0, ART_W, 200, 41, 0.08, 0x05020d);
  // contornos de herramientas colgadas (con luz)
  const tools: ReadonlyArray<readonly [number, number, number, number, number]> = [[28, 30, 4, 38, 0x9ab0c8], [44, 34, 3, 30, 0xff7a6a], [58, 28, 4, 40, 0x9ab0c8], [76, 30, 3, 34, 0xffd36b], [94, 36, 14, 4, 0x9ab0c8], [96, 36, 3, 28, 0x9ab0c8]];
  for (const [x, y, w, h, col] of tools) { back.fillRect(x, y, w, h, col, 0.85); back.fillRect(x, y, 1, h, 0xffffff, 0.35); }
  back.fillCircle(120, 46, 11, 0x9ab0c8, 0.0);
  back.strokeRect(112, 34, 24, 24, 0x9ab0c8, 0.8);
  back.fillRect(124, 38, 2, 16, 0xff7a6a);
  // cajonera de piezas con etiquetas de colores
  back.fillRect(16, 90, 104, 52, 0x1c3248);
  back.strokeRect(16, 90, 104, 52, 0x4a7aa8);
  for (let r = 0; r < 4; r++) for (let k = 0; k < 6; k++) {
    back.strokeRect(19 + k * 16, 93 + r * 12, 14, 10, 0x2a5278);
    back.fillRect(22 + k * 16, 96 + r * 12, 8, 2, [PAL.cyan, PAL.sun, PAL.pink, 0x4fffc0][(r + k) % 4] ?? PAL.cyan, 0.95);
    back.fillRect(26 + k * 16, 99 + r * 12, 2, 1, 0xffffff, 0.8);
  }
  // pared de monitores con código
  for (const [x, y, w, h, col] of [[150, 30, 56, 36, PAL.cyan], [212, 30, 56, 36, 0x4fffc0], [150, 70, 56, 30, PAL.pink], [212, 70, 56, 30, PAL.sun]] as const) {
    back.fillRect(x, y, w, h, 0x04140f);
    back.strokeRect(x, y, w, h, col, 0.9);
    for (let i = 0; i < h - 6; i += 3) back.fillRect(x + 4, y + 4 + i, 6 + ((i * 7 + x) % (w - 16)), 1, col, 0.55);
    back.blit(buildGlowDisc(34, col, 4, 0.12), x - 4, y - 8);
  }
  // estante con cajas y un osciloscopio
  back.fillRect(290, 76, 80, 3, 0x6a8ab0);
  back.fillRect(296, 54, 44, 22, 0x0a1a24);
  back.strokeRect(296, 54, 44, 22, 0x6a8ab0);
  for (let i = 0; i < 40; i++) back.setPixel(298 + i, 65 + Math.sin(i * 0.8) * 7, 0x4fffc0, 0.95);
  back.fillRect(346, 60, 16, 16, 0x2a4a6a);
  back.fillRect(350, 64, 3, 3, PAL.red);
  poster(back, 282, 100, 18, 26, 7);
  back.fillRect(310, 100, 60, 22, 0x1c3248);
  drawPixelText(back, 'NO FIAR', 316, 106, { color: PAL.sun });
  haze(back, 0, 120, 0x9be9ff, 0.07, 0.0);
  // tubo fluorescente del techo
  back.fillRect(130, 6, 150, 4, 0xe8f6ff);
  back.fillRect(126, 4, 158, 8, 0xdfe6ff, 0.14);
  lightShaft(back, 205, 10, 120, 230, 150, 0xdfe6ff, 0.07);

  // --- Puerta entreabierta con la luz cálida del callejón, y los dos tipos
  const c = newArt();
  c.fillRect(402, 44, 72, 160, 0x05020d);
  c.fillRect(408, 50, 60, 154, 0x3a2410);
  for (let y = 50; y < 204; y++) c.fillRect(408, y, 60, 1, 0xffb347, 0.22 + (1 - (y - 50) / 154) * 0.5);
  c.fillRect(408, 50, 60, 3, 0xffe9a8, 0.85);
  c.blit(buildGlowDisc(90, PAL.amber, 5, 0.24), 352, 64);
  lightShaft(c, 438, 200, 60, 160, 70, 0xffb347, 0.22);
  c.fillRect(0, 200, ART_W, 80, 0x070d18);
  c.fillRect(0, 200, ART_W, 2, 0x2a5278);
  c.fillGradientV(372, 202, 120, 40, [{ at: 0, color: 0x8a5a1a }, { at: 1, color: 0x070d18 }], 8);
  crate(c, 32, 200, 18);
  crate(c, 54, 200, 14);
  crate(c, 40, 182, 14);
  const g1 = personActor({ x: 428, footY: 206, height: 68, facing: -1, pose: 'stand', top: 0x14122a, bottom: 0x0d0b1c, hood: true, shoe: 0x1a1a28, rim: PAL.amber }, 1, 2800);
  const g2 = personActor({ x: 456, footY: 208, height: 62, facing: -1, pose: 'stand', top: 0x1a1a38, topLight: 0x3a3a6a, bottom: 0x0d0b1c, outfit: 'jacket', hairStyle: 'short', shoe: 0x1a1a28, rim: PAL.amber, glasses: PAL.red }, 1, 3200, 1100);
  contactShadow(c, 428, 207, 26, 0.6);
  contactShadow(c, 456, 209, 24, 0.6);
  const kid = personActor({ x: 184, footY: 196, height: 62, facing: 1, pose: 'offer', hairStyle: 'messy', top: 0x3b6fd0, topLight: 0x6ab0ff, bottom: 0x1f3068, rim: PAL.cyan }, 1, 2200);
  kid.actor.canvas.line(kid.at.hand.x - kid.actor.x, kid.at.hand.y - kid.actor.y, kid.at.hand.x - kid.actor.x + 14, kid.at.hand.y - kid.actor.y + 3, 0xcfd8e8);
  kid.actor.canvas.fillRect(kid.at.hand.x - kid.actor.x + 13, kid.at.hand.y - kid.actor.y + 2, 2, 2, 0xff6a3a);

  // --- Banco de trabajo (delante del chaval): escáner abierto con su placa, soldador, lupa, dinero
  const bench = new PixelCanvas(ART_W, 280);
  bench.fillRect(40, BENCH, 360, 8, 0x5a4a6a);
  bench.fillRect(40, BENCH, 360, 1, 0xc8b8e0);
  bench.fillRect(40, BENCH + 8, 360, 46, 0x2a1f3c);
  bench.fillRect(40, BENCH + 8, 360, 2, 0x180f26);
  bench.fillRect(52, BENCH + 10, 6, 46, 0x1c1430);
  bench.fillRect(382, BENCH + 10, 6, 46, 0x1c1430);
  bench.fillRect(100, BENCH + 20, 100, 18, 0x1c1430);
  bench.strokeRect(100, BENCH + 20, 100, 18, 0x4a3f5a, 0.9);
  bench.fillRect(146, BENCH + 27, 14, 3, 0x8a7a9a);
  // escáner abierto: carcasa, tapa levantada, placa verde con chips y leds
  bench.fillRect(214, BENCH - 44, 86, 44, 0x2a3a52);
  bench.strokeRect(214, BENCH - 44, 86, 44, 0x6a8ab0);
  bench.fillPolygon([{ x: 214, y: BENCH - 44 }, { x: 300, y: BENCH - 44 }, { x: 292, y: BENCH - 58 }, { x: 222, y: BENCH - 58 }], 0x3a4a64);
  bench.fillRect(222, BENCH - 40, 56, 34, 0x0b3a2a);
  bench.strokeRect(222, BENCH - 40, 56, 34, 0x4fffc0, 0.9);
  for (const [cx, cy, cw, ch] of [[228, 34, 10, 8], [244, 30, 12, 12], [262, 36, 9, 6], [230, 20, 8, 8], [248, 18, 14, 6]] as const) {
    bench.fillRect(cx, BENCH - cy, cw, ch, 0x0a0a14);
    bench.strokeRect(cx, BENCH - cy, cw, ch, 0x6a6a8a, 0.8);
  }
  for (let i = 0; i < 6; i++) bench.line(226 + i * 8, BENCH - 8, 232 + i * 8, BENCH - 36 + (i % 2) * 6, 0xd8c26a, 0.5);
  for (const [lx, ly, col] of [[270, 12, PAL.red], [274, 12, 0x4fffc0], [278, 12, PAL.cyan]] as const) bench.fillRect(lx, BENCH - ly, 2, 2, col);
  drawPixelText(bench, 'OK', 282, BENCH - 36, { color: 0x4fffc0, shadow: 0x05140f });
  bench.fillRect(280, BENCH - 42, 16, 12, 0x05140f);
  bench.strokeRect(280, BENCH - 42, 16, 12, 0x4fffc0, 0.9);
  bench.blit(buildGlowDisc(56, PAL.cyan, 5, 0.2), 222, BENCH - 96);
  for (const [x1, y1, x2, y2, col] of [[300, BENCH - 30, 322, BENCH - 6, PAL.red], [300, BENCH - 22, 326, BENCH - 4, PAL.cyan], [300, BENCH - 14, 318, BENCH - 3, PAL.sun]] as const) bench.line(x1, y1, x2, y2, col, 0.95);
  // lupa articulada con luz, estación de soldar con humo, polímetro, taza, billetes
  bench.line(196, BENCH, 196, BENCH - 26, 0x9ab0c8);
  bench.line(196, BENCH - 26, 206, BENCH - 40, 0x9ab0c8);
  bench.fillCircle(207, BENCH - 41, 5, 0xdfe6ff, 0.55);
  bench.strokeRect(202, BENCH - 46, 10, 10, 0x9ab0c8, 0.9);
  bench.blit(buildGlowDisc(24, 0xfff0c0, 4, 0.3), 195, BENCH - 66);
  bench.fillRect(340, BENCH - 14, 22, 14, 0x24304a);
  bench.strokeRect(340, BENCH - 14, 22, 14, 0x6a8ab0);
  bench.fillRect(343, BENCH - 11, 8, 4, 0x05140f);
  bench.fillRect(343, BENCH - 11, 6, 1, 0x4fffc0);
  bench.fillRect(353, BENCH - 11, 3, 3, PAL.red);
  bench.fillRect(366, BENCH - 6, 16, 6, 0x2a5a3a);
  bench.strokeRect(366, BENCH - 6, 16, 6, 0x4a8a5a, 0.8);
  bench.fillRect(60, BENCH - 10, 9, 10, 0xfff0d2);
  bench.fillRect(69, BENCH - 8, 3, 5, 0xfff0d2, 0.7);
  bench.fillRect(116, BENCH - 8, 20, 8, 0x3a3a5a);
  bench.fillRect(120, BENCH - 14, 2, 6, 0xffd36b);
  bench.fillRect(126, BENCH - 16, 2, 8, 0xff7a6a);

  // --- Primer plano: bombilla colgando con cable, cajas y cables desenfocados
  const front = new PixelCanvas(ART_W, 280);
  front.fillRect(70, 0, 1, 56, 0x05020d);
  front.fillRect(66, 56, 9, 8, 0xffe9a8);
  front.blit(buildGlowDisc(30, 0xffe9a8, 4, 0.4), 41, 36);
  front.fillRect(0, 238, 60, 42, 0x05020d);
  front.fillRect(8, 224, 42, 16, 0x0a0a14);
  front.fillEllipse(486, 268, 36, 20, 0x05020d);
  const cable = new PixelCanvas(200, 40);
  powerLine(cable, 0, 4, 198, 6, 14, 0x05020d, 0.95);
  powerLine(cable, 0, 14, 198, 18, 10, 0x05020d, 0.8);
  return [layer(back, 0.4), layer(c, 1, { actors: [g1.actor, g2.actor, kid.actor] }), layer(bench, 1), layer(front, 1.25, { actors: [swayActor(cable, 100, 0, 1, 3000)] })];
}
void ART_W;
