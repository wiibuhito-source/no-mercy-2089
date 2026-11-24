// Escena 4: el dormitorio de la madre, convertido en una pequeña clínica en casa. El implante late; la suscripción vence.
import { PixelCanvas } from '../../../core/pixelCanvas';
import { drawPixelText } from '../../../core/pixelText';
import { PAL } from '../../../data/menuPalette';
import { buildGlowDisc, buildGlowEllipse } from '../../menu/art/glow';
import { ART_W, eraseRect, holoPanel, layer, newArt, personActor, powerLine, skyline, stars, swayActor, type ArtActor, type SceneArt } from './kit';
import { chair, plantPot, poster, wallTexture } from './details';

const FLOOR = 176;
const SKIN = 0xc98b5e;

export function buildImplantArt(): SceneArt {
  // La ciudad que se ve por la ventana, con luna
  const back = newArt();
  back.fillGradientV(0, 0, ART_W, 180, [{ at: 0, color: PAL.ink }, { at: 0.7, color: 0x4a1f6a }, { at: 1, color: 0xa03a8a }], 14);
  stars(back, 3, 80, 100);
  back.fillCircle(440, 52, 9, 0xf6d4e6);
  back.blit(buildGlowDisc(26, PAL.blush, 4, 0.2), 414, 26);
  skyline(back, 12, 150, 30, 90, 0x1a0f3d, 0.34);
  skyline(back, 17, 170, 14, 44, 0x0d0722, 0.24);
  back.fillRect(0, 170, ART_W, 110, 0x0d0722);

  const c = newArt();
  // --- Pared con papel pintado y friso, suelo de tablas y alfombra
  c.fillGradientV(0, 0, ART_W, FLOOR, [{ at: 0, color: 0x0b0618 }, { at: 1, color: 0x1c1040 }], 12);
  for (let x = 0; x < ART_W; x += 10) c.fillRect(x, 0, 1, 118, 0x2b1a63, 0.4);
  wallTexture(c, 0, 0, ART_W, 118, 21, 0.05, 0x05020d);
  c.fillRect(0, 118, ART_W, 58, 0x160d36);
  c.fillRect(0, 118, ART_W, 2, 0x3a2a80);
  for (let x = 6; x < ART_W; x += 38) c.strokeRect(x, 124, 30, 44, 0x24174f, 0.9);
  c.fillRect(0, FLOOR - 4, ART_W, 4, 0x2b1a63);
  c.fillRect(0, FLOOR - 1, ART_W, 1, 0x4a3aa0, 0.6);
  c.fillRect(0, FLOOR, ART_W, 104, 0x0a0618);
  for (const y of [186, 198, 212, 230, 252]) c.fillRect(0, y, ART_W, 1, 0x140a2e);
  for (let r = 0; r < 5; r++) for (let x = (r * 37) % 60; x < ART_W; x += 60) c.fillRect(x, 178 + r * 18, 1, 14, 0x120a2a);
  c.fillEllipse(210, 226, 150, 24, 0x2a1450);
  c.fillEllipse(210, 226, 136, 20, 0x3a1a6a);
  c.fillEllipse(210, 226, 116, 15, 0x4a2a7a, 0.7);
  for (let i = 0; i < 12; i++) c.fillRect(110 + i * 17, 222 + (i % 2) * 6, 7, 2, 0xff7aa8, 0.5);
  // luz de luna sobre el suelo (viene de la ventana)
  c.fillPolygon([{ x: 372, y: FLOOR }, { x: 480, y: FLOOR }, { x: 440, y: 270 }, { x: 330, y: 270 }], 0xc9c0ff, 0.0);
  for (let y = FLOOR; y < 270; y++) c.fillRect(372 - (y - FLOOR) * 0.4, y, 108 + (y - FLOOR) * 0.1, 1, 0xc9c0ff, 0.07 * (1 - (y - FLOOR) / 94));

  // --- Ventana abierta a la ciudad
  const wx = 372, wy = 28, ww = 108, wh = 104;
  eraseRect(c, wx, wy, ww, wh);
  c.strokeRect(wx - 2, wy - 2, ww + 4, wh + 4, 0x3a2a70);
  c.fillRect(wx + ww / 2 - 1, wy, 2, wh, 0x1c1040);
  c.fillRect(wx, wy + wh / 2 - 1, ww, 2, 0x1c1040);
  c.fillRect(wx - 6, wy + wh + 2, ww + 12, 3, 0x2b1a63);
  c.fillRect(wx - 14, wy - 8, ww + 28, 3, 0x6a5a1a); // barra de la cortina
  c.fillRect(wx - 14, wy - 9, 3, 5, 0xffd36b);
  c.fillRect(wx + ww + 11, wy - 9, 3, 5, 0xffd36b);

  // --- Puerta con luz por debajo y una silla de ruedas plegada
  c.fillRect(10, 62, 46, 114, 0x2b1a63);
  c.fillRect(13, 65, 40, 111, 0x120a2a);
  c.strokeRect(17, 70, 14, 34, 0x24174f, 0.9);
  c.strokeRect(35, 70, 14, 34, 0x24174f, 0.9);
  c.strokeRect(17, 110, 14, 54, 0x24174f, 0.9);
  c.strokeRect(35, 110, 14, 54, 0x24174f, 0.9);
  c.fillRect(46, 122, 3, 3, PAL.sun);
  c.fillRect(13, FLOOR - 2, 40, 2, 0xffcf6b, 0.85);
  c.fillPolygon([{ x: 13, y: FLOOR }, { x: 53, y: FLOOR }, { x: 76, y: 214 }, { x: -10, y: 214 }], 0xffcf6b, 0.0);
  for (let y = FLOOR; y < 206; y++) c.fillRect(13 - (y - FLOOR) * 0.5, y, 40 + (y - FLOOR), 1, 0xffcf6b, 0.16 * (1 - (y - FLOOR) / 30));
  c.fillCircle(66, FLOOR - 9, 9, 0x05020d);
  c.fillCircle(66, FLOOR - 9, 7, 0x1a1236);
  c.fillCircle(66, FLOOR - 9, 2, 0x4a4f7a);
  for (let a = 0; a < 6; a++) c.line(66, FLOOR - 9, 66 + Math.cos(a * 1.05) * 7, FLOOR - 9 + Math.sin(a * 1.05) * 7, 0x3a3f6a, 0.8);
  c.fillRect(72, FLOOR - 26, 2, 22, 0x2a2e48);
  c.fillRect(70, FLOOR - 28, 8, 2, 0x2a2e48);
  c.fillRect(56, FLOOR - 18, 16, 3, 0x2a2e48);

  // --- Altar con la Virgen y una vela, cuadro de familia
  c.fillRect(70, 100, 38, 3, 0x7a4a2a);
  c.fillRect(70, 103, 38, 1, 0x3a2410);
  c.fillPolygon([{ x: 80, y: 99 }, { x: 90, y: 99 }, { x: 88, y: 84 }, { x: 82, y: 84 }], 0xffd36b);
  c.fillRect(82, 84, 6, 4, 0x4a8aff);
  c.fillCircle(85, 81, 2.6, 0xf0d0b0);
  c.fillRect(83, 77, 5, 2, 0xffd36b);
  c.fillRect(97, 90, 4, 9, 0xf4f0ff);
  c.fillRect(98, 87, 2, 3, PAL.sun);
  c.fillRect(99, 85, 1, 2, 0xff8a3a);
  c.fillRect(72, 62, 28, 22, 0x1c1040);
  c.strokeRect(72, 62, 28, 22, 0x9a7a3a, 0.95);
  c.fillRect(75, 65, 22, 16, 0x2a2a52);
  c.fillCircle(82, 73, 2.4, SKIN);
  c.fillRect(80, 76, 5, 5, 0x3b6fd0);
  c.fillCircle(91, 71, 2, SKIN);
  c.fillRect(89, 74, 4, 7, 0x2a8a8a);
  c.fillRect(75, 80, 22, 1, 0x05020d, 0.5);

  // --- Monitor médico grande en la pared, con constantes
  c.fillRect(112, 50, 102, 66, 0x05020d);
  c.strokeRect(112, 50, 102, 66, 0x4a4f7a);
  c.strokeRect(114, 52, 98, 62, 0x1f1045);
  c.fillRect(158, 116, 10, 8, 0x2a2e48);
  c.fillRect(150, 124, 26, 3, 0x2a2e48);
  const ecg = [88, 88, 88, 88, 82, 94, 72, 96, 88, 88, 88, 88, 88, 88, 88, 88, 82, 94, 72, 96, 88, 88, 88, 88, 88, 88];
  for (let i = 0; i < ecg.length - 1; i++) c.line(118 + i * 3.4, (ecg[i] ?? 88) - 16, 118 + (i + 1) * 3.4, (ecg[i + 1] ?? 88) - 16, PAL.cyan);
  for (let x = 118; x < 205; x++) c.setPixel(x, 94 + Math.sin(x * 0.28) * 4, 0x4fffc0, 0.85);
  drawPixelText(c, 'IMPLANTE', 118, 56, { color: PAL.teal });
  drawPixelText(c, '72', 184, 58, { color: 0x4fffc0, scale: 2, shadow: 0x05140f });
  drawPixelText(c, 'O2 96', 118, 102, { color: PAL.cyan });
  c.fillRect(200, 56, 4, 4, PAL.red);

  // --- Gotero con su bolsa y su tubo
  c.fillRect(230, 44, 2, FLOOR - 44, 0x8a8fb5);
  c.fillRect(224, 42, 14, 2, 0x8a8fb5);
  c.fillRect(221, 44, 10, 20, 0x9ad0ff, 0.5);
  c.fillRect(222, 52, 8, 11, 0x4a9aff, 0.7);
  c.strokeRect(221, 44, 10, 20, 0xdfe6ff, 0.6);
  c.fillRect(224, 66, 4, 7, 0xdfe6ff, 0.6);
  c.fillRect(225, 69, 2, 2, 0x6ad0ff);
  powerLine(c, 226, 74, 138, 150, 20, 0xcfd8ff, 0.7);
  for (const dx of [-8, -3, 3, 8]) c.line(231, FLOOR - 2, 231 + dx * 1.4, FLOOR + 1, 0x8a8fb5);
  c.fillCircle(222, FLOOR + 1, 1.5, 0x05020d);
  c.fillCircle(241, FLOOR + 1, 1.5, 0x05020d);

  // --- Cama (somier, cabecero, pies, ruedas), colcha de cuadros, almohada y la madre
  c.fillRect(70, 164, 270, 12, 0x24174a);
  c.fillRect(70, 164, 270, 1, 0x4a3aa0, 0.7);
  c.fillRect(62, 118, 12, 60, 0x3a2a70);
  c.fillRect(62, 118, 12, 3, 0x6a5ab0);
  c.fillRect(336, 142, 8, 36, 0x3a2a70);
  c.fillRect(336, 142, 8, 2, 0x6a5ab0);
  c.fillCircle(74, 178, 3, 0x05020d);
  c.fillCircle(338, 178, 3, 0x05020d);
  c.fillRect(74, 146, 262, 18, 0x2f2270);
  c.fillRect(74, 146, 262, 2, 0x5a4bd0, 0.8);
  c.fillRect(120, 146, 216, 18, 0x3a2a8a);
  for (let y = 0; y < 3; y++) for (let x = 0; x < 27; x++) if ((x + y) % 2 === 0) c.fillRect(120 + x * 8, 148 + y * 6, 8, 6, 0x4a3aa0, 0.8);
  for (let x = 128; x < 336; x += 8) c.fillRect(x, 148, 1, 16, 0x24176a, 0.5);
  c.fillRect(120, 146, 216, 2, 0x7a6af0, 0.7);
  c.fillRect(120, 144, 5, 20, 0xd8d2f0); // doblez de la sábana
  c.fillRect(74, 164, 262, 2, 0x140a2e);
  c.fillEllipse(96, 144, 20, 8, 0xd8d2f0);
  c.fillEllipse(94, 142, 18, 6, 0xece6fa, 0.7);
  c.fillCircle(98, 138, 8, SKIN);
  c.fillEllipse(95, 133, 9, 6, 0x1a0f14);
  c.fillEllipse(87, 140, 7, 9, 0x1a0f14);
  for (let i = 0; i < 4; i++) c.line(84 + i * 2, 138, 82 + i * 2, 146, 0x1a0f14, 0.7);
  c.fillRect(100, 138, 4, 1, 0x3a1a1a); // ojo cerrado
  c.putPixel(104, 140, 0x9a5a3a, 1);
  c.fillRect(100, 143, 3, 1, 0x7a3a3a, 0.8);
  c.fillCircle(92, 139, 1.4, 0xb67a4e);
  // Su mano sobre la colcha, donde Adrián se la coge
  c.fillEllipse(127, 160, 4, 2, SKIN);
  c.fillRect(124, 159, 7, 1, 0xb67a4e, 0.7);
  // Tablilla en los pies de la cama y zapatillas
  c.fillRect(322, 150, 10, 13, 0xcfc8e8);
  c.fillRect(324, 153, 6, 1, 0x1a1030, 0.7);
  c.fillRect(324, 156, 5, 1, 0x1a1030, 0.7);
  c.fillEllipse(186, 183, 5, 2, 0xff7aa8);
  c.fillEllipse(196, 184, 5, 2, 0xff7aa8);
  // Cable del implante al monitor
  powerLine(c, 132, 146, 150, 124, 8, 0x05020d, 0.95);
  powerLine(c, 133, 146, 151, 124, 8, 0x4a4f7a, 0.5);

  // --- Mesilla con lámpara, pastillero, vaso y móvil
  c.fillRect(350, 148, 30, 30, 0x24174a);
  c.fillRect(350, 148, 30, 3, 0x4b2d9a);
  c.fillRect(352, 156, 26, 1, 0x140a2e);
  c.fillRect(363, 164, 4, 2, PAL.sun);
  c.fillRect(358, 132, 14, 16, 0x3a2a70);
  c.fillPolygon([{ x: 354, y: 134 }, { x: 376, y: 134 }, { x: 370, y: 122 }, { x: 360, y: 122 }], 0xffd36b, 0.95);
  c.fillRect(364, 148, 2, 4, 0x6a5a1a);
  for (let i = 0; i < 7; i++) c.fillRect(353 + i * 3, 144, 2, 4, [PAL.pink, PAL.cyan, PAL.sun, PAL.red][i % 4] ?? PAL.pink, 0.9);
  c.fillRect(372, 140, 4, 8, 0x6ad0ff, 0.6);
  c.fillRect(380, 146, 10, 2, 0x05020d);
  c.fillRect(381, 147, 8, 1, PAL.cyan, 0.8);
  c.blit(buildGlowDisc(34, 0xffcf6b, 4, 0.3), 348, 108);
  for (let y = 134; y < FLOOR; y++) c.fillRect(354 - (y - 134) * 0.35, y, 22 + (y - 134) * 0.7, 1, 0xffcf6b, 0.07 * (1 - (y - 134) / 42));

  // --- Cómoda bajo la ventana con fotos y flores
  c.fillRect(396, 150, 84, 28, 0x24174a);
  c.fillRect(396, 150, 84, 3, 0x4b2d9a);
  for (const x of [398, 428, 458]) { c.strokeRect(x, 156, 22, 18, 0x140a2e); c.fillRect(x + 9, 164, 4, 2, PAL.sun); }
  for (const [x, col] of [[404, 0xffb3d1], [420, 0x6ab0ff], [440, 0xffd36b]] as const) {
    c.fillRect(x, 138, 11, 12, 0x1c1040);
    c.strokeRect(x, 138, 11, 12, 0x9a7a3a, 0.9);
    c.fillRect(x + 2, 140, 7, 8, col, 0.5);
    c.fillCircle(x + 5, 143, 1.6, SKIN);
  }
  c.fillRect(462, 142, 6, 8, 0x4a8aff, 0.8);
  for (const [dx, dy, col] of [[-1, -4, 0xff7aa8], [2, -7, 0xffd36b], [4, -3, 0xf4f0ff]] as const) c.fillCircle(465 + dx, 142 + dy, 2, col, 0.95);

  // --- Adrián, en una silla junto a la cama, cogiéndole la mano a su madre
  chair(c, 150, 198, -1, 0x8a8fc0, 9);
  const kid = personActor({ x: 142, footY: 198, height: 46, facing: -1, pose: 'sit', seat: 0.26, hairStyle: 'messy', top: 0x3b6fd0, topLight: 0x6ab0ff, bottom: 0x1f3068, rim: PAL.magenta, reachTo: { x: 129, y: 162 } }, 1, 2000, 500);

  // --- El pecho de la madre sube y baja; el implante brilla encima
  const chest = new PixelCanvas(36, 14);
  chest.fillEllipse(18, 10, 17, 6, 0x3a2a8a);
  chest.fillEllipse(18, 9, 16, 4, 0x4a3aa0, 0.8);
  chest.fillRect(10, 4, 14, 7, 0x0a0612);
  chest.fillRect(11, 5, 12, 5, 0x0b8fa8);
  chest.fillRect(13, 6, 8, 3, PAL.cyan);
  chest.fillRect(15, 5, 4, 5, PAL.white, 0.9);
  chest.strokeRect(9, 3, 16, 9, PAL.aqua, 0.5);
  const breathing: ArtActor = { canvas: chest, x: 112, y: 138, bobPx: 1, bobMs: 2600, phaseMs: 0 };

  // --- Cortinas y planta que se mecen con el aire de la ventana
  const curtain = (flip: boolean, phase: number): ArtActor => {
    const k = new PixelCanvas(18, 118);
    for (let y = 0; y < 118; y++) k.fillRect(0, y, 18, 1, 0x3a1a5a);
    for (let x = 1; x < 18; x += 4) k.fillRect(x, 0, 2, 118, 0x5a2a7a, 0.7);
    for (let x = 3; x < 18; x += 4) k.fillRect(x, 0, 1, 118, 0x24103a, 0.8);
    k.fillRect(0, 112, 18, 6, 0x24103a);
    return swayActor(k, flip ? wx + ww - 4 : wx - 14, 24, 2, 3600, phase);
  };
  const plantLeaves = new PixelCanvas(40, 44);
  for (let i = 0; i < 7; i++) plantLeaves.thickLine(20, 44, 20 + (i - 3) * 6, 4 + (i % 3) * 5, 1.6, i % 2 ? PAL.leafMid : PAL.leafDark);
  const plant = swayActor(plantLeaves, 468, 128, 1, 2800, 400);
  plantPot(c, 488, FLOOR + 6, 0);

  // --- Holograma de impago (aparece cuando se habla de la empresa)
  const holo = new PixelCanvas(ART_W, 280);
  const hx = 250, hy = 40, hw = 114, hh = 60;
  holoPanel(holo, hx, hy, hw, hh, PAL.red, 0x2a0a1a);
  drawPixelText(holo, 'PAGO PENDIENTE', hx + 14, hy + 7, { color: 0xffc8d2 });
  drawPixelText(holo, '48 H', hx + 25, hy + 20, { color: PAL.red, scale: 3, shadow: 0x5a0a20 });
  drawPixelText(holo, 'IMPLANTE SE APAGARA', hx + 4, hy + 47, { color: PAL.orange });
  holo.blit(buildGlowDisc(70, PAL.red, 4, 0.12), hx - 12, hy - 20);

  // --- Primer plano: oscuridad en los bordes, mantel de la mesa y una planta desenfocada
  const front = new PixelCanvas(ART_W, 280);
  front.fillRect(-2, 236, 520, 50, 0x05020d, 0.55);
  front.fillEllipse(8, 258, 18, 34, 0x05140f);
  front.fillEllipse(24, 252, 12, 26, 0x07201a);
  front.fillRect(0, 0, 14, 280, 0x05020d, 0.5);
  poster(front, 470, 262, 0, 0, 1);
  front.blit(buildGlowEllipse(60, 10, 0xffcf6b, 3, 0.1), 330, 262);

  return [
    layer(back, 0.3),
    layer(c, 1, { actors: [kid.actor, breathing, plant, curtain(false, 0), curtain(true, 1200)] }),
    layer(holo, 1, { revealAtLine: 1 }),
    layer(front, 1.25)
  ];
}
void eraseRect;
