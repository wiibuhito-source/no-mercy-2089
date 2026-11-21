// Escena 6: 2089. Adrián en su taller, con su cafecito. Suena el teléfono: número desconocido.
import { PixelCanvas } from '../../../core/pixelCanvas';
import { drawPixelText } from '../../../core/pixelText';
import { PAL } from '../../../data/menuPalette';
import { buildGlowDisc, buildGlowEllipse } from '../../menu/art/glow';
import { buildNeonSign } from '../../menu/art/neon';
import { ADRIAN_H, composeAdrian } from '../../menu/art/adrian';
import { ART_W, newArt, skyline, stars } from './kit';

export function buildPresent(): PixelCanvas {
  const c = newArt();
  c.fillGradientV(0, 0, ART_W, 190, [{ at: 0, color: 0x0b0618 }, { at: 1, color: 0x1a1040 }], 12);
  // Portón con la ciudad al fondo (derecha)
  const gx = 360, gy = 34, gw = 118, gh = 110;
  const city = new PixelCanvas(gw, gh);
  city.fillGradientV(0, 0, gw, gh, [{ at: 0, color: PAL.ink }, { at: 0.7, color: 0x4a1f6a }, { at: 1, color: 0xa03a8a }], 14);
  stars(city, 5, 20, 40);
  skyline(city, 13, gh - 2, 22, 70, 0x1a0f3d, 0.3);
  c.blit(city, gx, gy);
  for (let y = gy; y < gy + gh; y += 12) c.fillRect(gx, y, gw, 2, 0x1c1040, 0.9);
  c.strokeRect(gx - 2, gy - 2, gw + 4, gh + 4, 0x3a2a70);
  c.blit(buildGlowDisc(80, PAL.magenta, 4, 0.15), gx - 10, gy + 10);

  // Panel de herramientas y estantes
  for (let y = 20; y < 130; y += 6) for (let x = 14; x < 214; x += 6) c.putPixel(x, y, 0x24174a, 1);
  c.fillRect(24, 44, 3, 36, 0x4a5a7a);
  c.fillRect(20, 40, 11, 6, 0x4a5a7a);
  c.fillRect(54, 40, 2, 42, 0x5a6a8a);
  c.fillRect(50, 36, 10, 4, 0x8a4a4a);
  c.fillRect(150, 28, 56, 2, 0x4a4f7a);
  c.fillRect(154, 16, 12, 12, 0x24304a);
  c.fillRect(170, 12, 14, 16, 0x2a2a52);
  c.fillRect(188, 18, 12, 10, 0x24304a);
  c.fillRect(158, 21, 3, 3, PAL.cyan);
  c.fillRect(176, 18, 3, 3, PAL.red);
  c.fillRect(150, 66, 56, 2, 0x4a4f7a);
  c.fillRect(156, 52, 14, 14, 0x2a2a52);
  c.fillRect(174, 56, 10, 10, 0x24304a);
  c.fillRect(190, 50, 12, 16, 0x2a2a52);
  c.fillRect(160, 57, 3, 3, PAL.sun);

  // Cartel del taller
  const sign = buildNeonSign('TALLER', PAL.cyan, 2);
  c.blit(sign.glow, 232 - sign.glowPad, 36 - sign.glowPad);
  c.blit(sign.on, 232, 36);

  // Suelo y banco
  c.fillRect(0, 180, ART_W, 100, 0x0a0618);
  c.fillRect(0, 180, ART_W, 2, 0x2b1a63);
  c.fillEllipse(280, 214, 70, 6, 0x14102a, 0.9);
  const benchY = 152;
  c.fillRect(70, benchY, 400, 8, 0x4a3a62);
  c.fillRect(70, benchY, 400, 1, 0x9a8ab2);
  c.fillRect(70, benchY + 8, 400, 46, 0x251b44);
  c.fillRect(80, benchY + 10, 6, 44, 0x1a1230);
  c.fillRect(448, benchY + 10, 6, 44, 0x1a1230);
  c.fillRect(150, benchY + 22, 80, 18, 0x1a1230);
  c.strokeRect(150, benchY + 22, 80, 18, 0x3a2f5a, 0.9);

  // Lámpara colgante: luz cálida sobre el banco
  c.fillRect(160, 0, 1, 70, 0x2c2556);
  c.fillRect(150, 70, 22, 6, 0x2c2556);
  c.fillRect(153, 76, 16, 3, PAL.window);
  c.blit(buildGlowDisc(60, 0xffcf6b, 5, 0.24), 131, 52);
  c.blit(buildGlowEllipse(70, 8, 0xffcf6b, 4, 0.3), 126, benchY - 4);

  // Adrián, sentado en el banco con su cafecito (el mismo del menú)
  c.blit(composeAdrian(), 120, benchY - ADRIAN_H + 6);

  // Teléfono con la llamada entrante
  c.fillRect(300, benchY - 4, 16, 4, 0x0a0612);
  c.fillRect(302, benchY - 6, 12, 3, PAL.magenta);
  c.blit(buildGlowDisc(34, PAL.magenta, 4, 0.34), 300 - 9, benchY - 32);
  const px = 258, py = 60, pw = 136, ph = 70;
  c.fillRect(px, py, pw, ph, 0x1a0a2e, 0.82);
  c.strokeRect(px, py, pw, ph, PAL.magenta, 0.95);
  c.strokeRect(px + 2, py + 2, pw - 4, ph - 4, PAL.magenta, 0.3);
  for (let y = py + 4; y < py + ph - 2; y += 3) c.fillRect(px + 3, y, pw - 6, 1, PAL.magenta, 0.07);
  drawPixelText(c, 'LLAMADA ENTRANTE', px + 16, py + 8, { color: PAL.pink });
  drawPixelText(c, '???', px + 42, py + 22, { color: PAL.white, scale: 4, shadow: 0x5a0a60 });
  drawPixelText(c, 'NÚMERO DESCONOCIDO', px + 11, py + 54, { color: PAL.blush });
  c.line(300, py + ph, 308, benchY - 8, PAL.magenta, 0.5);
  return c;
}
