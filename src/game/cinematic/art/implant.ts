// Escena 4: el implante de la madre y la suscripción impagada.
import { PixelCanvas } from '../../../core/pixelCanvas';
import { drawPixelText } from '../../../core/pixelText';
import { PAL } from '../../../data/menuPalette';
import { buildGlowDisc } from '../../menu/art/glow';
import { ART_W, eraseRect, holoPanel, layer, newArt, personActor, skyline, stars, type ArtActor, type SceneArt } from './kit';

export function buildImplantArt(): SceneArt {
  // La ciudad que se ve por la ventana
  const back = newArt();
  const wx = 372, wy = 28, ww = 108, wh = 104;
  back.fillGradientV(0, 0, ART_W, 180, [{ at: 0, color: PAL.ink }, { at: 0.7, color: 0x4a1f6a }, { at: 1, color: 0xa03a8a }], 14);
  stars(back, 3, 70, 90);
  skyline(back, 12, 150, 30, 90, 0x1a0f3d, 0.3);
  skyline(back, 17, 170, 14, 44, 0x0d0722, 0.2);
  back.fillRect(0, 170, ART_W, 110, 0x0d0722);

  // El dormitorio, con la ventana abierta a la ciudad
  const c = newArt();
  c.fillGradientV(0, 0, ART_W, 176, [{ at: 0, color: 0x0b0618 }, { at: 1, color: 0x1c1040 }], 12);
  c.fillRect(0, 176, ART_W, 104, 0x0a0618);
  c.fillRect(0, 176, ART_W, 2, 0x2b1a63);
  for (let x = 0; x < ART_W; x += 26) c.fillRect(x, 178, 1, 102, 0x120a2a, 0.9);
  c.fillRect(0, 172, ART_W, 4, 0x24174a);
  eraseRect(c, wx, wy, ww, wh);
  c.strokeRect(wx - 2, wy - 2, ww + 4, wh + 4, 0x3a2a70);
  c.fillRect(wx + ww / 2 - 1, wy, 2, wh, 0x1c1040);
  c.fillRect(wx, wy + wh / 2 - 1, ww, 2, 0x1c1040);
  c.fillRect(wx - 6, wy + wh + 2, ww + 12, 3, 0x2b1a63);
  // Cortina
  c.fillRect(wx - 12, wy - 6, 10, wh + 14, 0x3a1a5a);
  for (let y = wy - 6; y < wy + wh + 8; y += 4) c.fillRect(wx - 12, y, 10, 1, 0x5a2a7a, 0.6);
  // Cuadros y estante
  c.fillRect(40, 60, 34, 26, 0x1c1040);
  c.strokeRect(40, 60, 34, 26, 0x6a5ab0, 0.9);
  c.fillRect(44, 64, 12, 14, 0xff7aa8, 0.6);
  c.fillRect(58, 70, 12, 12, 0x6ad0ff, 0.5);
  c.fillRect(20, 112, 52, 3, 0x4a3a62);
  c.fillRect(24, 100, 8, 12, 0x2a2a52);
  c.fillRect(36, 104, 6, 8, 0xffd36b, 0.8);
  c.fillRect(46, 98, 10, 14, 0x24304a);
  // Monitor de constantes en la pared
  c.fillRect(100, 56, 92, 52, 0x05020d);
  c.strokeRect(100, 56, 92, 52, 0x4a4f7a);
  c.strokeRect(102, 58, 88, 48, 0x1f1045);
  const ys = [92, 92, 92, 92, 86, 98, 76, 100, 92, 92, 92, 92, 92, 92, 92, 92, 86, 98, 76, 100, 92, 92, 92, 92];
  for (let i = 0; i < ys.length - 1; i++) c.line(106 + i * 3.4, ys[i] ?? 92, 106 + (i + 1) * 3.4, ys[i + 1] ?? 92, PAL.cyan);
  drawPixelText(c, 'IMPLANTE', 106, 64, { color: PAL.teal });
  c.fillRect(176, 62, 3, 3, PAL.red);
  // Cama
  c.fillRect(70, 160, 270, 12, 0x24174a);
  c.fillRect(66, 140, 8, 40, 0x1c1040);
  c.fillRect(336, 150, 6, 30, 0x1c1040);
  c.fillRect(74, 146, 262, 18, 0x2f2270);
  c.fillRect(74, 146, 262, 2, 0x5a4bd0, 0.8);
  c.fillRect(120, 146, 216, 18, 0x3a2a8a);
  c.fillRect(120, 146, 216, 2, 0x7a6af0, 0.7);
  c.fillRect(74, 164, 262, 2, 0x140a2e);
  c.fillEllipse(96, 144, 20, 8, 0xd8d2f0);
  c.fillEllipse(94, 142, 18, 6, 0xece6fa, 0.7);
  c.fillCircle(98, 138, 8, 0xc98b5e);
  c.fillEllipse(95, 133, 9, 6, 0x1a0f14);
  c.fillEllipse(88, 138, 6, 9, 0x1a0f14);
  c.putPixel(101, 138, 0x0a0612, 1);
  c.fillRect(103, 141, 3, 1, 0x7a3a3a, 0.8);
  // Mesilla con la lámpara y un vaso de agua
  c.fillRect(352, 148, 26, 32, 0x24174a);
  c.fillRect(352, 148, 26, 3, 0x4b2d9a);
  c.fillRect(358, 134, 14, 14, 0x3a2a70);
  c.fillRect(363, 130, 4, 5, PAL.window, 0.9);
  c.fillRect(355, 142, 4, 6, 0x6ad0ff, 0.6);
  // Taburete y Adrián junto a la cama
  c.fillRect(310, 183, 18, 3, 0x4a3a62);
  c.fillRect(312, 186, 2, 6, 0x251b44);
  c.fillRect(324, 186, 2, 6, 0x251b44);
  const kid = personActor({ x: 318, footY: 192, height: 42, facing: -1, pose: 'sit', top: 0x3b6fd0, topLight: 0x6ab0ff, bottom: 0x1f3068, rim: PAL.magenta }, 1, 2000, 500);

  // El pecho de la madre sube y baja; el implante brilla encima
  const chest = new PixelCanvas(36, 14);
  chest.fillEllipse(18, 10, 17, 6, 0x3a2a8a);
  chest.fillEllipse(18, 9, 16, 4, 0x4a3aa0, 0.8);
  chest.fillRect(10, 4, 14, 7, 0x0a0612);
  chest.fillRect(11, 5, 12, 5, 0x0b8fa8);
  chest.fillRect(13, 6, 8, 3, PAL.cyan);
  chest.fillRect(15, 5, 4, 5, PAL.white, 0.9);
  chest.strokeRect(9, 3, 16, 9, PAL.aqua, 0.5);
  const breathing: ArtActor = { canvas: chest, x: 112, y: 138, bobPx: 1, bobMs: 2600, phaseMs: 0 };

  // Holograma de impago (aparece cuando se habla de la empresa)
  const holo = new PixelCanvas(ART_W, 280);
  const hx = 232, hy = 40, hw = 116, hh = 62;
  holoPanel(holo, hx, hy, hw, hh, PAL.red, 0x2a0a1a);
  drawPixelText(holo, 'PAGO PENDIENTE', hx + 16, hy + 8, { color: 0xffc8d2 });
  drawPixelText(holo, '48 H', hx + 26, hy + 21, { color: PAL.red, scale: 3, shadow: 0x5a0a20 });
  drawPixelText(holo, 'IMPLANTE SE APAGARA', hx + 5, hy + 48, { color: PAL.orange });
  holo.blit(buildGlowDisc(70, PAL.red, 4, 0.12), hx - 10, hy - 20);

  // Primer plano: pie de la cama y planta desenfocada
  const front = new PixelCanvas(ART_W, 280);
  front.fillRect(-2, 214, 520, 70, 0x05020d, 0.55);
  front.fillEllipse(8, 250, 18, 34, 0x05140f);
  front.fillEllipse(24, 244, 12, 26, 0x07201a);
  return [layer(back, 0.3), layer(c, 1, { actors: [kid.actor, breathing] }), layer(holo, 1, { revealAtLine: 1 }), layer(front, 1.25)];
}
