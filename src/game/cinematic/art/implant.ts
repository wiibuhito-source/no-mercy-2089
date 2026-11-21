// Escena 2: el implante de la madre y la suscripción impagada.
import { PixelCanvas } from '../../../core/pixelCanvas';
import { drawPixelText } from '../../../core/pixelText';
import { PAL } from '../../../data/menuPalette';
import { buildGlowDisc } from '../../menu/art/glow';
import { ART_W, drawPerson, newArt, skyline, stars } from './kit';

export function buildImplant(): PixelCanvas {
  const c = newArt();
  // Pared y suelo del dormitorio
  c.fillGradientV(0, 0, ART_W, 176, [{ at: 0, color: 0x0b0618 }, { at: 1, color: 0x1c1040 }], 12);
  c.fillRect(0, 176, ART_W, 104, 0x0a0618);
  c.fillRect(0, 176, ART_W, 2, 0x2b1a63);
  for (let x = 0; x < ART_W; x += 26) c.fillRect(x, 178, 1, 102, 0x120a2a, 0.9);
  c.fillRect(0, 172, ART_W, 4, 0x24174a);

  // Ventana a la ciudad (derecha)
  const wx = 372, wy = 28, ww = 108, wh = 104;
  const city = new PixelCanvas(ww, wh);
  city.fillGradientV(0, 0, ww, wh, [{ at: 0, color: PAL.ink }, { at: 0.7, color: 0x4a1f6a }, { at: 1, color: 0xa03a8a }], 14);
  stars(city, 3, 24, 40);
  skyline(city, 12, wh - 4, 24, 70, 0x1a0f3d, 0.3);
  skyline(city, 17, wh, 12, 34, 0x0d0722, 0.2);
  c.blit(city, wx, wy);
  c.strokeRect(wx - 2, wy - 2, ww + 4, wh + 4, 0x3a2a70);
  c.fillRect(wx + ww / 2 - 1, wy, 2, wh, 0x1c1040);
  c.fillRect(wx, wy + wh / 2 - 1, ww, 2, 0x1c1040);
  c.fillRect(wx - 6, wy + wh + 2, ww + 12, 3, 0x2b1a63);
  c.blit(buildGlowDisc(70, PAL.magenta, 4, 0.18), wx - 12, wy + 10);

  // Monitor de constantes en la pared
  c.fillRect(100, 56, 92, 52, 0x05020d);
  c.strokeRect(100, 56, 92, 52, 0x4a4f7a);
  c.strokeRect(102, 58, 88, 48, 0x1f1045);
  const ys = [92, 92, 92, 92, 86, 98, 76, 100, 92, 92, 92, 92, 92, 92, 92, 92, 86, 98, 76, 100, 92, 92, 92, 92];
  for (let i = 0; i < ys.length - 1; i++) c.line(106 + i * 3.4, ys[i] ?? 92, 106 + (i + 1) * 3.4, ys[i + 1] ?? 92, PAL.cyan);
  c.fillRect(106, 62, 24, 1, PAL.teal);
  drawPixelText(c, 'IMPLANTE', 106, 64, { color: PAL.teal });
  c.fillRect(176, 62, 3, 3, PAL.red);

  // Holograma de impago
  const hx = 232, hy = 40, hw = 116, hh = 62;
  c.fillRect(hx, hy, hw, hh, 0x2a0a1a, 0.78);
  c.strokeRect(hx, hy, hw, hh, PAL.red, 0.95);
  c.strokeRect(hx + 2, hy + 2, hw - 4, hh - 4, PAL.red, 0.35);
  for (let y = hy + 4; y < hy + hh - 2; y += 3) c.fillRect(hx + 3, y, hw - 6, 1, PAL.red, 0.07);
  drawPixelText(c, 'PAGO PENDIENTE', hx + 16, hy + 8, { color: 0xffc8d2 });
  drawPixelText(c, '48 H', hx + 26, hy + 21, { color: PAL.red, scale: 3, shadow: 0x5a0a20 });
  drawPixelText(c, 'IMPLANTE SE APAGARA', hx + 5, hy + 48, { color: PAL.orange });

  // Cama
  c.fillRect(70, 160, 270, 12, 0x24174a); // somier
  c.fillRect(66, 140, 8, 40, 0x1c1040); // cabecero
  c.fillRect(336, 150, 6, 30, 0x1c1040);
  c.fillRect(74, 146, 262, 18, 0x2f2270); // colchón / manta
  c.fillRect(74, 146, 262, 2, 0x5a4bd0, 0.8);
  c.fillRect(120, 146, 216, 18, 0x3a2a8a);
  c.fillRect(120, 146, 216, 2, 0x7a6af0, 0.7);
  c.fillRect(74, 164, 262, 2, 0x140a2e);
  // Almohada y la madre
  c.fillEllipse(96, 144, 20, 8, 0xd8d2f0);
  c.fillEllipse(94, 142, 18, 6, 0xece6fa, 0.7);
  c.fillCircle(98, 138, 8, 0xc98b5e);
  c.fillEllipse(95, 133, 9, 6, 0x1a0f14);
  c.fillEllipse(88, 138, 6, 9, 0x1a0f14);
  c.putPixel(101, 138, 0x0a0612, 1);
  c.fillRect(103, 141, 3, 1, 0x7a3a3a, 0.8);
  c.fillEllipse(130, 148, 24, 8, 0x3a2a8a);
  c.fillRect(120, 142, 14, 6, 0xc98b5e, 0.0);
  // Implante en el pecho
  c.fillRect(129, 142, 14, 7, 0x0a0612);
  c.fillRect(130, 143, 12, 5, 0x0b8fa8);
  c.fillRect(132, 144, 8, 3, PAL.cyan);
  c.fillRect(134, 143, 4, 5, PAL.white, 0.9);
  c.strokeRect(128, 141, 16, 9, PAL.aqua, 0.5);

  // Mesilla con la lámpara
  c.fillRect(352, 148, 26, 32, 0x24174a);
  c.fillRect(352, 148, 26, 3, 0x4b2d9a);
  c.fillRect(358, 134, 14, 14, 0x3a2a70);
  c.fillRect(363, 130, 4, 5, PAL.window, 0.9);

  // Adrián sentado junto a la cama, de espaldas a nosotros mirando a su madre
  c.fillRect(310, 183, 18, 3, 0x4a3a62); // taburete
  c.fillRect(312, 186, 2, 6, 0x251b44);
  c.fillRect(324, 186, 2, 6, 0x251b44);
  drawPerson(c, { x: 318, footY: 192, height: 42, facing: -1, pose: 'sit', top: 0x3b6fd0, topLight: 0x6ab0ff, bottom: 0x1f3068, rim: PAL.magenta });
  c.fillRect(240, 188, 90, 3, 0x05020d, 0.5);
  return c;
}
