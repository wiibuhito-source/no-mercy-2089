// Escena 4: el dormitorio de la madre, convertido en una pequeña clínica en casa. El implante late; la suscripción vence.
// Todo a escala de las personas: la cama mide lo que debe y la madre cabe en ella.
import { PixelCanvas } from '../../../core/pixelCanvas';
import { drawPixelText } from '../../../core/pixelText';
import { PAL } from '../../../data/menuPalette';
import { buildGlowDisc, buildGlowEllipse } from '../../menu/art/glow';
import { ART_W, contactShadow, eraseRect, haze, holoPanel, layer, lightShaft, newArt, personActor, powerLine, skyline, stars, swayActor, type ArtActor, type SceneArt } from './kit';
import { SCALE } from './characters';
import { chair, plantPot, wallTexture } from './details';

const WALL = 190; // donde la pared toca el suelo
const SKIN = 0xc98b5e;
const SKIN_SHADE = 0xa86f46;

export function buildImplantArt(): SceneArt {
  // --- La ciudad que se ve por la ventana, con luna
  const back = newArt();
  back.fillGradientV(0, 0, ART_W, 200, [{ at: 0, color: PAL.ink }, { at: 0.7, color: 0x4a1f6a }, { at: 1, color: 0xa03a8a }], 14);
  stars(back, 3, 80, 100);
  back.fillCircle(412, 62, 9, 0xf6d4e6);
  back.blit(buildGlowDisc(26, PAL.blush, 4, 0.2), 386, 36);
  skyline(back, 12, 160, 30, 100, 0x1a0f3d, 0.34);
  skyline(back, 17, 186, 14, 50, 0x0d0722, 0.24);
  back.fillRect(0, 186, ART_W, 94, 0x0d0722);

  const c = newArt();
  // --- Pared con papel pintado y friso; suelo de tablas y alfombra
  c.fillGradientV(0, 0, ART_W, WALL, [{ at: 0, color: 0x0b0618 }, { at: 1, color: 0x1c1040 }], 12);
  for (let x = 0; x < ART_W; x += 10) c.fillRect(x, 0, 1, 132, 0x2b1a63, 0.4);
  wallTexture(c, 0, 0, ART_W, 132, 21, 0.05, 0x05020d);
  c.fillRect(0, 132, ART_W, WALL - 132, 0x160d36);
  c.fillRect(0, 132, ART_W, 2, 0x3a2a80);
  for (let x = 8; x < ART_W; x += 40) c.strokeRect(x, 138, 32, 46, 0x24174f, 0.9);
  c.fillRect(0, WALL - 4, ART_W, 4, 0x2b1a63);
  c.fillRect(0, WALL - 1, ART_W, 1, 0x4a3aa0, 0.6);
  c.fillRect(0, WALL, ART_W, 90, 0x0a0618);
  for (const y of [198, 210, 226, 246]) c.fillRect(0, y, ART_W, 1, 0x140a2e);
  for (let r = 0; r < 5; r++) for (let x = (r * 37) % 60; x < ART_W; x += 60) c.fillRect(x, 192 + r * 14, 1, 12, 0x120a2a);
  c.fillEllipse(190, 226, 130, 20, 0x2a1450);
  c.fillEllipse(190, 226, 118, 16, 0x3a1a6a);
  c.fillEllipse(190, 226, 98, 12, 0x4a2a7a, 0.7);
  for (let i = 0; i < 10; i++) c.fillRect(110 + i * 16, 222 + (i % 2) * 5, 7, 2, 0xff7aa8, 0.5);

  // --- Ventana abierta a la ciudad
  const wx = 330, wy = 34, ww = 110, wh = 96;
  eraseRect(c, wx, wy, ww, wh);
  c.strokeRect(wx - 2, wy - 2, ww + 4, wh + 4, 0x3a2a70);
  c.fillRect(wx + ww / 2 - 1, wy, 2, wh, 0x1c1040);
  c.fillRect(wx, wy + wh / 2 - 1, ww, 2, 0x1c1040);
  c.fillRect(wx - 6, wy + wh + 2, ww + 12, 3, 0x2b1a63);
  c.fillRect(wx - 16, wy - 9, ww + 32, 3, 0x7a6a1a);
  c.fillRect(wx - 16, wy - 10, 3, 5, 0xffd36b);
  c.fillRect(wx + ww + 13, wy - 10, 3, 5, 0xffd36b);
  for (let y = WALL; y < 258; y++) c.fillRect(wx - (y - WALL) * 0.5, y, ww + (y - WALL) * 0.2, 1, 0xc9c0ff, 0.07 * (1 - (y - WALL) / 68)); // luz de luna en el suelo

  // --- Puerta (a altura de puerta), con luz por debajo, y una silla de ruedas plegada
  c.fillRect(14, 100, 48, 90, 0x2b1a63);
  c.fillRect(17, 103, 42, 87, 0x120a2a);
  for (const [x, y, w, h] of [[21, 108, 14, 30], [41, 108, 14, 30], [21, 144, 14, 40], [41, 144, 14, 40]] as const) c.strokeRect(x, y, w, h, 0x24174f, 0.9);
  c.fillRect(50, 148, 3, 3, PAL.sun);
  c.fillRect(17, WALL - 2, 42, 2, 0xffcf6b, 0.85);
  for (let y = WALL; y < 214; y++) c.fillRect(17 - (y - WALL) * 0.5, y, 42 + (y - WALL), 1, 0xffcf6b, 0.15 * (1 - (y - WALL) / 24));
  c.fillCircle(78, WALL - 11, 11, 0x05020d);
  c.fillCircle(78, WALL - 11, 9, 0x1a1236);
  c.fillCircle(78, WALL - 11, 2, 0x4a4f7a);
  for (let a = 0; a < 6; a++) c.line(78, WALL - 11, 78 + Math.cos(a * 1.05) * 9, WALL - 11 + Math.sin(a * 1.05) * 9, 0x3a3f6a, 0.8);
  c.fillRect(86, WALL - 34, 2, 26, 0x2a2e48);
  c.fillRect(83, WALL - 36, 9, 2, 0x2a2e48);
  c.fillRect(68, WALL - 20, 24, 3, 0x2a2e48);

  // --- Altar con la Virgen y una vela; cuadro de familia
  c.fillRect(100, 116, 44, 3, 0x7a4a2a);
  c.fillRect(100, 119, 44, 1, 0x3a2410);
  c.fillPolygon([{ x: 112, y: 115 }, { x: 124, y: 115 }, { x: 122, y: 98 }, { x: 114, y: 98 }], 0xffd36b);
  c.fillRect(114, 98, 8, 5, 0x4a8aff);
  c.fillCircle(118, 94, 3, 0xf0d0b0);
  c.fillRect(115, 89, 6, 2, 0xffd36b);
  c.fillRect(130, 104, 5, 11, 0xf4f0ff);
  c.fillRect(131, 101, 3, 3, PAL.sun);
  c.fillRect(132, 99, 1, 2, 0xff8a3a);
  c.fillRect(104, 76, 32, 24, 0x1c1040);
  c.strokeRect(104, 76, 32, 24, 0x9a7a3a, 0.95);
  c.fillRect(107, 79, 26, 18, 0x2a2a52);
  c.fillCircle(115, 88, 2.6, SKIN);
  c.fillRect(112, 91, 6, 6, 0x3b6fd0);
  c.fillCircle(126, 86, 2.2, SKIN);
  c.fillRect(123, 89, 5, 8, 0x2a9a9a);

  // --- Monitor médico en la pared, con las constantes bien repartidas
  c.fillRect(150, 48, 84, 58, 0x05020d);
  c.strokeRect(150, 48, 84, 58, 0x4a4f7a);
  c.strokeRect(152, 50, 80, 54, 0x1f1045);
  c.fillRect(186, 106, 12, 8, 0x2a2e48);
  c.fillRect(176, 114, 32, 3, 0x2a2e48);
  drawPixelText(c, 'IMPLANTE', 156, 54, { color: PAL.teal });
  drawPixelText(c, '72', 204, 54, { color: 0x4fffc0, scale: 2, shadow: 0x05140f });
  const ecg = [0, 0, 0, 0, -4, 5, -12, 8, 0, 0, 0, 0, 0, 0, 0, 0, -4, 5, -12, 8, 0, 0, 0];
  for (let i = 0; i < ecg.length - 1; i++) c.line(156 + i * 3.2, 80 + (ecg[i] ?? 0), 156 + (i + 1) * 3.2, 80 + (ecg[i + 1] ?? 0), PAL.cyan);
  for (let x = 156; x < 226; x++) c.setPixel(x, 94 + Math.sin(x * 0.3) * 3, 0x4fffc0, 0.85);
  drawPixelText(c, 'O2 96', 156, 97, { color: PAL.cyan });
  c.fillRect(224, 52, 4, 4, PAL.red);

  // --- Gotero con su bolsa y el tubo hasta el brazo de la madre
  c.fillRect(262, 44, 2, WALL - 44, 0x8a8fb5);
  c.fillRect(255, 42, 16, 2, 0x8a8fb5);
  c.fillRect(252, 44, 12, 24, 0x9ad0ff, 0.5);
  c.fillRect(253, 54, 10, 13, 0x4a9aff, 0.7);
  c.strokeRect(252, 44, 12, 24, 0xdfe6ff, 0.6);
  c.fillRect(256, 70, 5, 8, 0xdfe6ff, 0.6);
  c.fillRect(257, 73, 3, 2, 0x6ad0ff);
  powerLine(c, 258, 80, 170, 168, 24, 0xcfd8ff, 0.75);
  for (const dx of [-9, -4, 4, 9]) c.line(263, WALL - 2, 263 + dx * 1.5, WALL + 1, 0x8a8fb5);
  c.fillCircle(250, WALL + 1, 1.6, 0x05020d);
  c.fillCircle(277, WALL + 1, 1.6, 0x05020d);

  // --- Cama de la madre y mesilla: se dibujan aparte y se bajan para que el colchón quede a la altura de la cintura de quien se sienta
  const BED_DY = 10;
  const t = newArt();
  t.fillRect(110, 172, 130, 12, 0x24174a);
  t.fillRect(110, 172, 130, 1, 0x4a3aa0, 0.7);
  t.fillRect(104, 128, 10, 62, 0x3a2a70);
  t.fillRect(104, 128, 10, 3, 0x6a5ab0);
  t.fillRect(106, 132, 6, 50, 0x2a1d58);
  t.fillRect(236, 154, 8, 36, 0x3a2a70);
  t.fillRect(236, 154, 8, 2, 0x6a5ab0);
  t.fillCircle(114, WALL, 3, 0x05020d);
  t.fillCircle(240, WALL, 3, 0x05020d);
  contactShadow(t, 176, WALL + 2 - BED_DY, 150, 0.45);
  t.fillRect(114, 160, 122, 14, 0x2f2270); // colchón
  t.fillRect(114, 160, 122, 2, 0x5a4bd0, 0.8);
  // almohada, pelo extendido y cabeza (proporción real: ~10 px de alto)
  t.fillEllipse(126, 158, 15, 5.5, 0xd8d2f0);
  t.fillEllipse(125, 157, 13, 3.8, 0xece6fa, 0.75);
  for (let i = 0; i < 6; i++) t.line(114 + i, 156 + (i % 3), 120, 158, 0x1a0f14, 0.85);
  t.fillEllipse(119, 155, 6.5, 6, 0x1a0f14);
  t.fillCircle(126, 154, 5.4, SKIN);
  t.fillEllipse(124, 150.5, 6, 3.6, 0x1a0f14);
  t.fillRect(128, 153, 3, 1, 0x3a1a1a); // ojo cerrado
  t.putPixel(131, 155, 0x9a5a3a, 1);
  t.fillRect(128, 157, 2, 1, 0x7a3a3a, 0.8);
  t.fillCircle(122, 155, 1.2, SKIN_SHADE);
  t.fillRect(129, 158, 6, 2, SKIN_SHADE); // cuello
  // el cuerpo bajo la colcha (cabeza a pies = 68 px), con colcha de cuadros
  t.fillEllipse(166, 156, 20, 6, 0x3a2a8a);
  t.fillEllipse(196, 157, 18, 5.6, 0x3a2a8a);
  t.fillEllipse(224, 159, 8, 4.4, 0x3a2a8a);
  t.fillRect(136, 158, 100, 16, 0x3a2a8a);
  for (let y = 0; y < 3; y++) for (let x = 0; x < 13; x++) if ((x + y) % 2 === 0) t.fillRect(136 + x * 7.6, 160 + y * 5, 7.6, 5, 0x4a3aa0, 0.8);
  t.fillRect(136, 158, 100, 2, 0x7a6af0, 0.7);
  t.fillRect(134, 155, 5, 19, 0xd8d2f0); // doblez de la sábana
  t.fillRect(114, 174, 122, 2, 0x140a2e);
  // su mano sobre la colcha (aquí se la coge Adrián)
  t.thickLine(150, 157, 164, 160, 1.8, SKIN);
  t.fillEllipse(167, 160.5, 3, 2, SKIN);
  t.fillRect(163, 159, 4, 1, SKIN_SHADE, 0.7);
  powerLine(t, 150, 154, 176, 108, 12, 0x05020d, 0.95); // cable del implante al monitor
  powerLine(t, 151, 154, 177, 108, 12, 0x4a4f7a, 0.5);
  t.fillRect(220, 150, 12, 15, 0xcfc8e8); // tablilla en los pies
  t.fillRect(222, 153, 8, 1, 0x1a1030, 0.7);
  t.fillRect(222, 156, 6, 1, 0x1a1030, 0.7);
  t.fillEllipse(190, 196, 6, 2.2, 0xff7aa8); // zapatillas
  t.fillEllipse(201, 197, 6, 2.2, 0xff7aa8);

  // --- Mesilla con lámpara, pastillero, vaso y móvil
  t.fillRect(250, 154, 32, 36, 0x24174a);
  t.fillRect(250, 154, 32, 3, 0x4b2d9a);
  t.fillRect(252, 166, 28, 1, 0x140a2e);
  t.fillRect(263, 174, 5, 2, PAL.sun);
  t.fillRect(260, 134, 14, 20, 0x3a2a70);
  t.fillPolygon([{ x: 254, y: 138 }, { x: 280, y: 138 }, { x: 274, y: 124 }, { x: 260, y: 124 }], 0xffd36b, 0.95);
  t.fillRect(266, 154, 2, 4, 0x6a5a1a);
  for (let i = 0; i < 7; i++) t.fillRect(254 + i * 3.5, 149, 2.5, 5, [PAL.pink, PAL.cyan, PAL.sun, PAL.red][i % 4] ?? PAL.pink, 0.9);
  t.fillRect(276, 144, 5, 10, 0x6ad0ff, 0.6);
  t.blit(buildGlowDisc(36, 0xffcf6b, 4, 0.3), 249, 104);
  lightShaft(t, 267, 138, 22, 70, 52, 0xffcf6b, 0.12);

  c.blit(t, 0, BED_DY);

  // --- Cómoda bajo la ventana, con fotos y flores
  c.fillRect(322, 152, 126, 38, 0x24174a);
  c.fillRect(322, 152, 126, 3, 0x4b2d9a);
  for (const x of [326, 366, 406]) {
    c.strokeRect(x, 160, 34, 24, 0x140a2e);
    c.fillRect(x + 15, 170, 5, 2, PAL.sun);
  }
  for (const [x, col] of [[330, 0xffb3d1], [350, 0x6ab0ff], [372, 0xffd36b]] as const) {
    c.fillRect(x, 134, 14, 16, 0x1c1040);
    c.strokeRect(x, 134, 14, 16, 0x9a7a3a, 0.9);
    c.fillRect(x + 2, 136, 10, 12, col, 0.5);
    c.fillCircle(x + 7, 141, 2, SKIN);
  }
  c.fillRect(420, 138, 8, 12, 0x4a8aff, 0.8);
  for (const [dx, dy, col] of [[-1, -5, 0xff7aa8], [3, -9, 0xffd36b], [5, -4, 0xf4f0ff]] as const) c.fillCircle(424 + dx, 138 + dy, 2.6, col, 0.95);

  // --- Adrián, a su altura, sentado junto a la cama y cogiéndole la mano a su madre
  chair(c, 180, 204, -1, 0x8a8fc0, 13);
  contactShadow(c, 180, 205, 40, 0.5);
  const kid = personActor({ x: 178, footY: 204, height: SCALE.kid, facing: -1, pose: 'sit', seat: 0.26, hairStyle: 'messy', top: 0x3b6fd0, topLight: 0x6ab0ff, bottom: 0x1f3068, rim: PAL.magenta, reachTo: { x: 167, y: 170 }, noShadow: true }, 1, 2000, 500);

  // --- El pecho de la madre sube y baja; el implante brilla encima
  const chest = new PixelCanvas(40, 16);
  chest.fillEllipse(20, 11, 19, 6.5, 0x3a2a8a);
  chest.fillEllipse(20, 10, 18, 4.4, 0x4a3aa0, 0.8);
  chest.fillRect(8, 5, 14, 7, 0x0a0612);
  chest.fillRect(9, 6, 12, 5, 0x0b8fa8);
  chest.fillRect(11, 7, 8, 3, PAL.cyan);
  chest.fillRect(13, 6, 4, 5, PAL.white, 0.9);
  chest.strokeRect(7, 4, 16, 9, PAL.aqua, 0.5);
  const breathing: ArtActor = { canvas: chest, x: 138, y: 154, bobPx: 1, bobMs: 2600, phaseMs: 0 };

  // --- Cortinas y planta que se mecen con el aire de la ventana
  const curtain = (flip: boolean, phase: number): ArtActor => {
    const k = new PixelCanvas(20, 112);
    for (let y = 0; y < 112; y++) k.fillRect(0, y, 20, 1, 0x3a1a5a);
    for (let x = 1; x < 20; x += 4) k.fillRect(x, 0, 2, 112, 0x5a2a7a, 0.7);
    for (let x = 3; x < 20; x += 4) k.fillRect(x, 0, 1, 112, 0x24103a, 0.8);
    k.fillRect(0, 106, 20, 6, 0x24103a);
    return swayActor(k, flip ? wx + ww - 6 : wx - 14, 28, 2, 3600, phase);
  };
  const plantLeaves = new PixelCanvas(44, 50);
  for (let i = 0; i < 7; i++) plantLeaves.thickLine(22, 50, 22 + (i - 3) * 6.5, 4 + (i % 3) * 5, 1.7, i % 2 ? PAL.leafMid : PAL.leafDark);
  const plant = swayActor(plantLeaves, 446, 136, 1, 2800, 400);
  plantPot(c, 468, WALL + 6, 0);
  haze(c, WALL - 20, WALL, 0x6a5ab0, 0.0, 0.08);

  // --- Holograma de impago (aparece cuando se habla de la empresa)
  const holo = new PixelCanvas(ART_W, 280);
  const hx = 286, hy = 20, hw = 116, hh = 60;
  holoPanel(holo, hx, hy, hw, hh, PAL.red, 0x2a0a1a);
  drawPixelText(holo, 'PAGO PENDIENTE', hx + 14, hy + 7, { color: 0xffc8d2 });
  drawPixelText(holo, '48 H', hx + 25, hy + 20, { color: PAL.red, scale: 3, shadow: 0x5a0a20 });
  drawPixelText(holo, 'IMPLANTE SE APAGARA', hx + 4, hy + 47, { color: PAL.orange });
  holo.blit(buildGlowDisc(70, PAL.red, 4, 0.12), hx - 12, hy - 20);

  // --- Primer plano: oscuridad en los bordes y una planta desenfocada
  const front = new PixelCanvas(ART_W, 280);
  front.fillRect(-2, 240, 520, 46, 0x05020d, 0.5);
  front.fillEllipse(8, 262, 18, 34, 0x05140f);
  front.fillEllipse(24, 256, 12, 26, 0x07201a);
  front.fillRect(0, 0, 14, 280, 0x05020d, 0.5);
  front.blit(buildGlowEllipse(60, 10, 0xffcf6b, 3, 0.1), 250, 262);

  return [
    layer(back, 0.3),
    layer(c, 1, { actors: [breathing, kid.actor, plant, curtain(false, 0), curtain(true, 1200)] }),
    layer(holo, 1, { revealAtLine: 1 }),
    layer(front, 1.25)
  ];
}
