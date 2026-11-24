// Escena 11: 2089. Adrián en su taller, con su cafecito. Suena el teléfono: número desconocido.
import { PixelCanvas } from '../../../core/pixelCanvas';
import { drawPixelText } from '../../../core/pixelText';
import { PAL } from '../../../data/menuPalette';
import { buildGlowDisc, buildGlowEllipse } from '../../menu/art/glow';
import { buildNeonSign } from '../../menu/art/neon';
import { ART_W, contactShadow, eraseRect, haze, holoPanel, layer, lightShaft, newArt, personActor, powerLine, reflectDown, skyline, stars, swayActor, type ArtActor, type SceneArt } from './kit';
import { poster, wallTexture } from './details';

const FLOOR = 206;
const BENCH = 176;

export function buildPresentArt(): SceneArt {
  // La ciudad al otro lado del portón
  const back = newArt();
  back.fillGradientV(0, 0, ART_W, 200, [{ at: 0, color: PAL.ink }, { at: 0.7, color: 0x4a1f6a }, { at: 1, color: 0xa03a8a }], 14);
  stars(back, 5, 50, 100);
  back.fillCircle(440, 54, 9, 0xf6d4e6);
  skyline(back, 13, 170, 24, 110, 0x241450, 0.34);
  skyline(back, 14, 186, 12, 50, 0x0d0722, 0.24);
  back.fillRect(0, 186, ART_W, 94, 0x0d0722);

  const c = newArt();
  c.fillGradientV(0, 0, ART_W, FLOOR, [{ at: 0, color: 0x0b0618 }, { at: 1, color: 0x1c1244 }], 12);
  wallTexture(c, 0, 0, 360, FLOOR, 51, 0.08, 0x05020d);
  // portón enrollable abierto: se ve la ciudad
  const gx = 346, gy = 28, gw = 140, gh = 142;
  eraseRect(c, gx, gy, gw, gh);
  for (let y = gy; y < gy + 14; y += 4) c.fillRect(gx, y, gw, 3, 0x241a5a);
  c.strokeRect(gx - 2, gy - 2, gw + 4, gh + 4, 0x4a3a90);
  lightShaft(c, gx + gw / 2, gy + gh, 60, 150, 36, PAL.magenta, 0.12);
  // pared de herramientas con contornos luminosos
  for (let y = 20; y < 150; y += 6) for (let x = 12; x < 210; x += 6) c.putPixel(x, y, 0x2a1c5a, 1);
  for (const [x, y, w, h, col] of [[22, 40, 4, 40, 0x9ab0c8], [38, 34, 3, 46, 0xff7a6a], [52, 42, 12, 4, 0x9ab0c8], [52, 42, 3, 30, 0x9ab0c8], [76, 36, 4, 44, 0xffd36b], [92, 40, 3, 36, 0x9ab0c8]] as const) {
    c.fillRect(x, y, w, h, col, 0.85);
    c.fillRect(x, y, 1, h, 0xffffff, 0.3);
  }
  // radio, reloj, calendario y estante con piezas
  c.fillRect(100, 58, 32, 18, 0x4a3a62);
  c.strokeRect(100, 58, 32, 18, 0x9a8ac2);
  c.fillRect(104, 62, 15, 8, 0x1a0f2a);
  c.fillRect(106, 65, 11, 1, PAL.sun, 0.95);
  c.fillCircle(125, 66, 3, 0x2a1a4a);
  c.line(130, 58, 142, 40, 0x9a8ac2);
  c.blit(buildGlowDisc(16, PAL.sun, 3, 0.28), 102, 52);
  c.fillCircle(176, 56, 11, 0x0a0a1e);
  c.fillCircle(176, 56, 9, 0xcfc8e8);
  c.fillCircle(176, 56, 8, 0x1a1030);
  for (let i = 0; i < 12; i++) c.setPixel(176 + Math.cos(i * 0.5236) * 7, 56 + Math.sin(i * 0.5236) * 7, 0xcfc8e8, 0.9);
  c.line(176, 56, 176, 50, PAL.sun);
  c.line(176, 56, 180, 58, PAL.sun);
  poster(c, 56, 96, 16, 22, 3);
  c.fillRect(196, 84, 70, 3, 0x6a5a9a);
  for (const [x, w, h, col] of [[200, 14, 12, 0x2a2a52], [218, 10, 18, 0x24304a], [232, 16, 10, 0x3a2a5a], [252, 10, 14, 0x2a2a52]] as const) c.fillRect(x, 84 - h, w, h, col);
  c.fillRect(204, 76, 3, 3, PAL.cyan);
  const sign = buildNeonSign('TALLER', PAL.cyan, 2);
  c.blit(sign.glow, 262 - sign.glowPad, 36 - sign.glowPad);
  c.blit(sign.on, 262, 36);
  // el coche, medio desmontado, subido en el elevador (detrás del banco)
  c.fillRect(214, 112, 4, 84, 0x3a3a5a);
  c.fillRect(352, 112, 4, 84, 0x3a3a5a);
  c.fillRect(210, 108, 150, 4, 0x6a6a9a);
  c.fillPolygon([{ x: 226, y: 140 }, { x: 246, y: 120 }, { x: 330, y: 120 }, { x: 352, y: 140 }, { x: 362, y: 140 }, { x: 362, y: 168 }, { x: 222, y: 168 }, { x: 222, y: 142 }], 0x1a2a6a);
  c.fillPolygon([{ x: 250, y: 124 }, { x: 266, y: 124 }, { x: 266, y: 138 }, { x: 240, y: 138 }], 0x0a0a1e);
  c.fillPolygon([{ x: 274, y: 124 }, { x: 326, y: 124 }, { x: 342, y: 138 }, { x: 274, y: 138 }], 0x0a0a1e);
  c.fillRect(222, 140, 140, 2, 0x4a6aff, 0.8);
  c.fillRect(226, 156, 136, 1, PAL.cyan, 0.6);
  c.fillRect(222, 164, 140, 4, 0x0a0a1e);
  c.fillRect(248, 112, 62, 8, 0x4a3a62); // capó abierto
  c.fillCircle(246, 170, 12, 0x05020d);
  c.fillCircle(246, 170, 6, 0x2a2a52);
  c.fillCircle(332, 170, 12, 0x05020d);
  c.fillCircle(332, 170, 6, 0x2a2a52);
  c.blit(buildGlowEllipse(76, 10, PAL.cyan, 4, 0.25), 214, 164);
  // suelo con mancha de aceite, neumáticos y barril
  c.fillRect(0, FLOOR, ART_W, 74, 0x0a0618);
  c.fillRect(0, FLOOR, ART_W, 2, 0x3a2a80);
  c.fillEllipse(280, 232, 56, 6, 0x14102a, 0.9);
  for (let i = 0; i < 3; i++) {
    c.fillEllipse(34, 200 - i * 9, 22, 5, 0x0a0a14);
    c.fillEllipse(34, 200 - i * 9, 9, 2, 0x2a2a42);
  }
  c.fillRect(470, 164, 22, 40, 0x2a5a8a);
  c.fillRect(470, 164, 22, 3, 0x4a8aca);
  for (const y of [172, 188]) c.fillRect(470, y, 22, 2, 0x1a3a5a);
  // lámpara colgante con su cono de luz
  c.fillRect(160, 0, 1, 74, 0x3a3a5a);
  c.fillRect(150, 74, 22, 6, 0x4a4a6a);
  c.fillRect(153, 80, 16, 3, PAL.window);
  c.blit(buildGlowDisc(64, 0xffcf6b, 5, 0.26), 129, 54);
  lightShaft(c, 161, 84, 16, 130, 92, 0xffcf6b, 0.14);
  haze(c, FLOOR - 28, FLOOR, 0x6a5ab0, 0.0, 0.1);

  // --- Adrián, adulto, sentado en un taburete con su cafecito
  const st = { x: 78, g: FLOOR };
  c.fillRect(st.x - 9, st.g - 27, 18, 3, 0x6a6a9a);
  c.fillRect(st.x - 9, st.g - 27, 18, 1, 0xffffff, 0.3);
  c.fillRect(st.x - 7, st.g - 24, 2, 24, 0x3a3a5a);
  c.fillRect(st.x + 5, st.g - 24, 2, 24, 0x3a3a5a);
  c.fillRect(st.x - 7, st.g - 12, 14, 1, 0x3a3a5a);
  contactShadow(c, st.x, st.g, 28, 0.6);
  const adrian = personActor({ x: st.x, footY: st.g, height: 66, facing: 1, pose: 'sit', seat: 28 / 66, top: 0x2d2478, topLight: 0x5a4bd0, bottom: 0x1f3068, outfit: 'jacket', glasses: PAL.cyan, hairStyle: 'messy', rim: PAL.magenta, shoe: 0xece6fa, noShadow: true }, 1, 2800);
  const hx = adrian.at.hand.x - adrian.actor.x;
  const hy = adrian.at.hand.y - adrian.actor.y;
  adrian.actor.canvas.fillRect(hx - 1, hy - 4, 5, 5, 0xfff0d2);
  adrian.actor.canvas.fillRect(hx + 4, hy - 3, 2, 3, 0xfff0d2, 0.7);
  adrian.actor.canvas.fillRect(hx, hy - 4, 3, 1, 0x7a4a2a);

  // --- El banco de trabajo, con sus cosas y un gato dormido (delante del coche)
  const bench = new PixelCanvas(ART_W, 280);
  bench.fillRect(110, BENCH, 360, 8, 0x5a4a72);
  bench.fillRect(110, BENCH, 360, 1, 0xc8b8e8);
  bench.fillRect(110, BENCH + 8, 360, 36, 0x2a1f44);
  bench.fillRect(120, BENCH + 10, 6, 34, 0x1a1230);
  bench.fillRect(450, BENCH + 10, 6, 34, 0x1a1230);
  bench.fillRect(190, BENCH + 16, 90, 16, 0x1a1230);
  bench.strokeRect(190, BENCH + 16, 90, 16, 0x4a3f6a, 0.9);
  bench.fillRect(228, BENCH + 22, 14, 3, 0x8a7a9a);
  bench.fillRect(430, BENCH - 8, 24, 8, 0x6a6a7a);
  bench.fillRect(404, BENCH - 6, 20, 6, 0x4a5a7a);
  bench.fillRect(140, BENCH - 12, 20, 12, 0x24304a);
  bench.strokeRect(140, BENCH - 12, 20, 12, 0x6a8ab0);
  bench.fillRect(143, BENCH - 9, 14, 6, 0x05140f);
  bench.fillRect(143, BENCH - 9, 8, 1, 0x4fffc0);
  bench.fillRect(168, BENCH - 8, 10, 8, 0xfff0d2);
  const catC = new PixelCanvas(28, 15);
  catC.fillEllipse(13, 10, 12, 5, 0xe8883a);
  catC.fillCircle(23, 8, 4.5, 0xe8883a);
  catC.fillPolygon([{ x: 20, y: 4 }, { x: 21, y: 0 }, { x: 23, y: 3 }], 0xe8883a);
  catC.fillPolygon([{ x: 24, y: 3 }, { x: 26, y: 0 }, { x: 27, y: 5 }], 0xe8883a);
  for (let i = 0; i < 3; i++) catC.fillRect(7 + i * 5, 6, 1, 7, 0xb8602a, 0.8);
  catC.line(2, 11, -1, 7, 0xe8883a);
  catC.setPixel(24, 8, 0x1a0a0a, 1);
  const cat: ArtActor = { canvas: catC, x: 380, y: BENCH - 14, bobPx: 1, bobMs: 2200, phaseMs: 300 };

  // --- El teléfono vibra y la llamada aparece en holograma (cuando suena)
  const call = new PixelCanvas(ART_W, 280);
  const px = 246, py = 54, pw = 140, ph = 72;
  holoPanel(call, px, py, pw, ph, PAL.magenta, 0x1a0a2e);
  drawPixelText(call, 'LLAMADA ENTRANTE', px + 18, py + 8, { color: PAL.pink });
  drawPixelText(call, '???', px + 44, py + 22, { color: PAL.white, scale: 4, shadow: 0x5a0a60 });
  drawPixelText(call, 'NÚMERO DESCONOCIDO', px + 12, py + 56, { color: PAL.blush });
  call.line(300, py + ph, 304, BENCH - 8, PAL.magenta, 0.5);
  call.blit(buildGlowDisc(38, PAL.magenta, 4, 0.34), 285, BENCH - 36);
  const phoneSprite = new PixelCanvas(16, 8);
  phoneSprite.fillRect(0, 4, 16, 4, 0x0a0612);
  phoneSprite.fillRect(2, 2, 12, 3, PAL.magenta);
  const phone: ArtActor = { canvas: phoneSprite, x: 296, y: BENCH - 8, bobPx: 1, bobMs: 90, phaseMs: 0 };

  // --- Primer plano: neumáticos y cables desenfocados
  const front = new PixelCanvas(ART_W, 280);
  front.fillEllipse(24, 266, 44, 26, 0x05020d);
  front.fillEllipse(34, 248, 26, 14, 0x0a0a14);
  front.fillEllipse(484, 272, 40, 20, 0x05020d);
  const cable = new PixelCanvas(120, 30);
  powerLine(cable, 0, 2, 118, 8, 18, 0x05020d, 0.95);
  const comp = new PixelCanvas(ART_W, 280);
  comp.blit(c, 0, 0);
  void reflectDown;
  return [layer(back, 0.3), layer(c, 1, { actors: [adrian.actor] }), layer(bench, 1, { actors: [cat] }), layer(call, 1, { revealAtLine: 2, actors: [phone] }), layer(front, 1.25, { actors: [swayActor(cable, 330, 0, 1, 3200)] })];
}
void ART_W;
void stars;
