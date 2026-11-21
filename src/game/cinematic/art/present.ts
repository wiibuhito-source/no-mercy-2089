// Escena 11: 2089. Adrián en su taller, con su cafecito. Suena el teléfono: número desconocido.
import { PixelCanvas } from '../../../core/pixelCanvas';
import { drawPixelText } from '../../../core/pixelText';
import { PAL } from '../../../data/menuPalette';
import { buildGlowDisc, buildGlowEllipse } from '../../menu/art/glow';
import { buildNeonSign } from '../../menu/art/neon';
import { ADRIAN_H, composeAdrian } from '../../menu/art/adrian';
import { ART_W, eraseRect, holoPanel, layer, newArt, powerLine, skyline, stars, type ArtActor, type SceneArt } from './kit';

export const PRESENT_CUP = { x: 151 + 31, y: 146 - 42 + 6 + 19 } as const;

export function buildPresentArt(): SceneArt {
  // La ciudad al otro lado del portón
  const back = newArt();
  back.fillGradientV(0, 0, ART_W, 190, [{ at: 0, color: PAL.ink }, { at: 0.7, color: 0x4a1f6a }, { at: 1, color: 0xa03a8a }], 14);
  stars(back, 5, 40, 90);
  skyline(back, 13, 160, 24, 100, 0x1a0f3d, 0.3);
  skyline(back, 14, 176, 12, 44, 0x0d0722, 0.2);
  back.fillRect(0, 176, ART_W, 104, 0x0d0722);

  const c = newArt();
  c.fillGradientV(0, 0, ART_W, 190, [{ at: 0, color: 0x0b0618 }, { at: 1, color: 0x1a1040 }], 12);
  const gx = 360, gy = 34, gw = 118, gh = 120;
  eraseRect(c, gx, gy, gw, gh);
  for (let y = gy + 8; y < gy + gh; y += 12) c.fillRect(gx, y, gw, 2, 0x1c1040, 0.95);
  c.strokeRect(gx - 2, gy - 2, gw + 4, gh + 4, 0x3a2a70);
  // Panel de herramientas y estantes
  for (let y = 20; y < 130; y += 6) for (let x = 14; x < 214; x += 6) c.putPixel(x, y, 0x24174a, 1);
  c.fillRect(24, 44, 3, 36, 0x4a5a7a);
  c.fillRect(20, 40, 11, 6, 0x4a5a7a);
  c.fillRect(54, 40, 2, 42, 0x5a6a8a);
  c.fillRect(50, 36, 10, 4, 0x8a4a4a);
  c.fillRect(86, 46, 20, 3, 0x4a5a7a);
  c.fillRect(86, 46, 3, 24, 0x4a5a7a);
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
  // Una pieza de coche en el banco de atrás (un motor desmontado)
  c.fillRect(214, 112, 38, 20, 0x2a2a52);
  c.fillRect(218, 108, 8, 6, 0x4a4f7a);
  c.fillRect(236, 106, 10, 8, 0x4a4f7a);
  c.fillCircle(232, 122, 5, 0x1a1a36);
  c.fillCircle(232, 122, 2, 0x6a6a8a);
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
  c.fillRect(390, benchY - 6, 20, 6, 0x6a6a7a);
  c.fillRect(420, benchY - 4, 30, 4, 0x4a5a7a);
  // Lámpara colgante
  c.fillRect(160, 0, 1, 70, 0x2c2556);
  c.fillRect(150, 70, 22, 6, 0x2c2556);
  c.fillRect(153, 76, 16, 3, PAL.window);
  c.blit(buildGlowDisc(60, 0xffcf6b, 5, 0.24), 131, 52);
  c.blit(buildGlowEllipse(70, 8, 0xffcf6b, 4, 0.3), 126, benchY - 4);

  // Adrián, sentado en el banco con su cafecito (el mismo del menú)
  const adrian: ArtActor = { canvas: composeAdrian(), x: 120, y: benchY - ADRIAN_H + 6, bobPx: 1, bobMs: 2800, phaseMs: 0 };

  // El teléfono vibra y la llamada aparece en holograma (cuando suena)
  const call = new PixelCanvas(ART_W, 280);
  const px = 258, py = 60, pw = 136, ph = 70;
  holoPanel(call, px, py, pw, ph, PAL.magenta, 0x1a0a2e);
  drawPixelText(call, 'LLAMADA ENTRANTE', px + 16, py + 8, { color: PAL.pink });
  drawPixelText(call, '???', px + 42, py + 22, { color: PAL.white, scale: 4, shadow: 0x5a0a60 });
  drawPixelText(call, 'NÚMERO DESCONOCIDO', px + 11, py + 54, { color: PAL.blush });
  call.line(300, py + ph, 308, benchY - 8, PAL.magenta, 0.5);
  call.blit(buildGlowDisc(34, PAL.magenta, 4, 0.34), 291, benchY - 32);
  const phoneSprite = new PixelCanvas(16, 8);
  phoneSprite.fillRect(0, 4, 16, 4, 0x0a0612);
  phoneSprite.fillRect(2, 2, 12, 3, PAL.magenta);
  const phone: ArtActor = { canvas: phoneSprite, x: 300, y: benchY - 8, bobPx: 1, bobMs: 90, phaseMs: 0 };

  // Primer plano: neumáticos y cable colgando, desenfocados
  const front = new PixelCanvas(ART_W, 280);
  front.fillEllipse(24, 262, 44, 24, 0x05020d);
  front.fillEllipse(34, 246, 26, 14, 0x0a0a14);
  front.fillEllipse(480, 268, 40, 20, 0x05020d);
  powerLine(front, 330, 0, 430, 6, 18);
  return [layer(back, 0.3), layer(c, 1, { actors: [adrian] }), layer(call, 1, { revealAtLine: 2, actors: [phone] }), layer(front, 1.25)];
}
void ART_W;
