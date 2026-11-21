// Escena 4: el taller trasero. Adrián arregla un escáner "muerto"; detrás, dos tipos lo miran desde la puerta.
import { PixelCanvas } from '../../../core/pixelCanvas';
import { drawPixelText } from '../../../core/pixelText';
import { PAL } from '../../../data/menuPalette';
import { buildGlowDisc } from '../../menu/art/glow';
import { ART_W, OUTLINE, drawPerson, newArt } from './kit';

export function buildTalent(): PixelCanvas {
  const c = newArt();
  c.fillGradientV(0, 0, ART_W, 197, [{ at: 0, color: 0x07101c }, { at: 1, color: 0x10243a }], 12);
  // Panel de herramientas (agujeros + siluetas)
  for (let y = 16; y < 120; y += 6) for (let x = 14; x < 330; x += 6) c.putPixel(x, y, 0x1c3550, 1);
  c.fillRect(30, 30, 3, 36, 0x4a5a7a);
  c.fillRect(26, 26, 11, 6, 0x4a5a7a); // llave
  c.fillRect(64, 28, 2, 40, 0x5a6a8a);
  c.fillRect(60, 24, 10, 4, 0x8a4a4a); // destornillador
  c.fillRect(96, 30, 18, 3, 0x4a5a7a);
  c.fillRect(96, 30, 3, 26, 0x4a5a7a); // escuadra
  c.fillRect(140, 28, 26, 14, 0x24304a);
  c.strokeRect(140, 28, 26, 14, 0x4a5a7a, 0.8);
  c.fillRect(144, 33, 3, 3, PAL.red);
  c.fillRect(150, 33, 3, 3, PAL.sun);
  c.fillRect(156, 33, 3, 3, PAL.cyan);
  // Puerta entreabierta con luz cálida del exterior
  c.fillRect(404, 50, 66, 148, 0x05020d);
  c.fillRect(410, 56, 54, 142, 0x3a2410);
  for (let y = 56; y < 198; y++) {
    const k = 1 - (y - 56) / 142;
    c.fillRect(410, y, 54, 1, 0xffb347, 0.2 + k * 0.45);
  }
  c.fillRect(410, 56, 54, 3, 0xffe9a8, 0.8);
  c.blit(buildGlowDisc(80, PAL.amber, 5, 0.22), 358, 70);
  // Suelo
  c.fillRect(0, 196, ART_W, 84, 0x070d18);
  c.fillRect(0, 196, ART_W, 2, 0x1c3550);
  c.fillGradientV(380, 198, 110, 50, [{ at: 0, color: 0x6a4a1a }, { at: 1, color: 0x070d18 }], 8);

  // Los dos tipos en la puerta (siluetas a contraluz)
  drawPerson(c, { x: 432, footY: 200, height: 58, facing: -1, pose: 'stand', top: 0x0b0a18, bottom: 0x0b0a18, skin: 0x1a1020, hair: 0x05030a, shoe: 0x1a1a28, hood: true, rim: PAL.amber });
  drawPerson(c, { x: 458, footY: 202, height: 54, facing: -1, pose: 'stand', top: 0x0b0a18, bottom: 0x0b0a18, skin: 0x1a1020, hair: 0x05030a, shoe: 0x1a1a28, rim: PAL.amber });
  c.fillRect(421, 150, 2, 2, PAL.orange); // brasa del cigarro
  c.setPixel(421, 147, PAL.white, 0.35);
  c.setPixel(422, 144, PAL.white, 0.2);

  // Adrián (15) al fondo de la mesa
  const kid = drawPerson(c, { x: 178, footY: 178, height: 54, facing: 1, pose: 'offer', top: 0x3b6fd0, topLight: 0x6ab0ff, bottom: 0x1f3068, rim: PAL.cyan });

  // Banco de trabajo (tapa la parte baja del chaval)
  c.fillRect(40, 150, 350, 8, 0x4a3a52);
  c.fillRect(40, 150, 350, 1, 0x8a7a92);
  c.fillRect(40, 158, 350, 50, 0x251b34);
  c.fillRect(40, 158, 350, 2, 0x140e20);
  c.fillRect(52, 160, 6, 48, 0x1a1228);
  c.fillRect(372, 160, 6, 48, 0x1a1228);
  c.fillRect(100, 176, 90, 16, 0x1a1228);
  c.strokeRect(100, 176, 90, 16, 0x3a2f4a, 0.9);
  c.fillRect(140, 182, 12, 3, 0x6a5a7a);

  // El escáner abierto, con cables
  c.fillRect(208, 112, 78, 38, 0x1c2438);
  c.strokeRect(208, 112, 78, 38, 0x4a5a7a);
  c.fillRect(214, 118, 52, 26, 0x05140f);
  c.strokeRect(214, 118, 52, 26, 0x0b8fa8);
  for (let y = 121; y < 142; y += 3) c.fillRect(217, y, 46, 1, 0x1ff3a0, 0.28);
  drawPixelText(c, 'OK', 232, 126, { color: 0x4fffc0 });
  c.fillRect(270, 118, 10, 6, PAL.red);
  c.fillRect(270, 128, 10, 6, PAL.cyan);
  c.fillRect(270, 138, 10, 4, PAL.sun);
  c.line(286, 125, 300, 140, PAL.red);
  c.line(286, 131, 304, 146, PAL.cyan);
  c.line(286, 137, 298, 148, PAL.sun);
  c.blit(buildGlowDisc(52, PAL.cyan, 5, 0.22), 233 - 26 + 10, 118 - 26);
  // Pila de billetes y soldador
  c.fillRect(324, 138, 30, 12, 0x2a5a3a);
  c.strokeRect(324, 138, 30, 12, 0x4a8a5a, 0.8);
  c.fillRect(324, 142, 30, 1, 0x4a8a5a, 0.7);
  c.fillRect(306, 146, 14, 3, 0x6a6a7a);
  c.line(kid.hand.x, kid.hand.y, kid.hand.x + 12, kid.hand.y + 2, 0x8a8a9a);
  // Chispas
  for (const [dx, dy] of [[14, -3], [17, 0], [12, 3], [19, -5], [15, 4]] as const) c.setPixel(kid.hand.x + dx, kid.hand.y + dy, PAL.sun, 0.95);
  c.fillCircle(kid.hand.x + 13, kid.hand.y + 2, 3, PAL.sun, 0.2);
  void OUTLINE;
  return c;
}
