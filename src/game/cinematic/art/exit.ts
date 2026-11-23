// Escena 9: la noche en que salió mal. Luces rojas y azules, una furgoneta abierta, la bolsa en el suelo y Adrián alejándose.
import { PixelCanvas } from '../../../core/pixelCanvas';
import { PAL } from '../../../data/menuPalette';
import { buildGlowDisc } from '../../menu/art/glow';
import { ART_W, crimeTape, drawPerson, layer, newArt, personActor, reflection, sky, skyline, stars, swayActor, type SceneArt } from './kit';

export function buildExitArt(): SceneArt {
  const horizon = 118;
  const back = newArt();
  sky(back, horizon, [{ at: 0, color: PAL.ink }, { at: 0.6, color: 0x2a1450 }, { at: 1, color: 0x6a2a7a }]);
  stars(back, 23, 70, 80);
  skyline(back, 41, horizon, 18, 62, 0x150c33, 0.12);
  skyline(back, 44, horizon + 2, 8, 26, 0x0d0722, 0.1);

  const c = newArt();
  c.fillRect(0, horizon, ART_W, ART_W, 0x0a0714);
  for (let y = horizon; y < 224; y++) {
    const t = (y - horizon) / (224 - horizon);
    const left = 250 - 20 - t * 330;
    const right = 250 + 20 + t * 330;
    c.fillRect(left, y, right - left, 1, 0x1a1530);
    c.setPixel(left, y, 0x3a3060);
    c.setPixel(right, y, 0x3a3060);
  }
  for (let i = 0; i < 6; i++) {
    const t = (i + 0.6) / 6;
    const y = horizon + 4 + t * t * 100;
    c.fillRect(250 - 1 - t * 3, y, 2 + t * 6, 2 + t * 4, 0x8a8fb5, 0.6);
  }
  // Furgoneta con las puertas traseras abiertas
  c.fillRect(70, 118, 120, 52, 0x151030);
  c.fillRect(70, 118, 120, 2, 0x4b3a9a);
  c.fillRect(150, 124, 34, 20, 0x0a0618);
  c.fillRect(150, 124, 34, 2, PAL.cyan, 0.4);
  c.fillRect(70, 170, 120, 3, 0x05020d);
  for (const wx of [92, 164]) {
    c.fillCircle(wx, 172, 9, 0x05020d);
    c.fillCircle(wx, 172, 4, 0x2a2550);
  }
  c.fillRect(66, 124, 8, 44, 0xffcf6b, 0.85);
  c.fillPolygon([{ x: 66, y: 124 }, { x: 40, y: 134 }, { x: 40, y: 178 }, { x: 66, y: 168 }], 0x1c1844);
  c.line(66, 124, 40, 134, 0x4b3a9a);
  for (let y = 168; y < 224; y++) {
    const k = (y - 168) / 56;
    c.fillRect(30 - k * 10, y, 44 + k * 20, 1, 0xffcf6b, 0.28 * (1 - k));
  }
  c.blit(buildGlowDisc(36, PAL.amber, 4, 0.3), 36, 112);
  // Coche patrulla lejano con la barra de luces
  c.fillRect(398, 132, 70, 22, 0x1c1840);
  c.fillRect(410, 124, 38, 10, 0x1c1840);
  c.fillRect(398, 132, 70, 1, 0x4b3a9a);
  c.fillRect(414, 127, 30, 5, 0x0a0618);
  c.fillRect(398, 154, 70, 3, 0x05020d);
  c.fillCircle(414, 156, 6, 0x05020d);
  c.fillCircle(452, 156, 6, 0x05020d);
  c.fillRect(424, 121, 8, 3, PAL.red);
  c.fillRect(434, 121, 8, 3, 0x2f6bff);
  c.blit(buildGlowDisc(34, PAL.red, 4, 0.34), 412, 108);
  c.blit(buildGlowDisc(34, 0x2f6bff, 4, 0.34), 432, 108);
  reflection(c, 424, 160, 12, 56, PAL.red, 0.45);
  reflection(c, 440, 160, 12, 56, 0x2f6bff, 0.45);
  reflection(c, 66, 176, 20, 40, PAL.amber, 0.35);
  // Curiosos mirando tras la cinta, a contraluz de las luces rojas y azules
  for (const [x, h] of [[372, 26], [384, 30], [394, 25], [470, 28]] as const) drawPerson(c, { x, footY: 150, height: h, facing: -1, pose: 'stand', top: 0x0b0a18, bottom: 0x0b0a18, skin: 0x1a1020, hair: 0x05030a, shoe: 0x1a1a28, rim: x < 400 ? PAL.red : 0x2f6bff });
  // Papeles y cristales rotos en la carretera
  for (const [x, y] of [[200, 190], [230, 198], [286, 186], [330, 196], [150, 200]] as const) {
    c.fillRect(x, y, 5, 2, 0xf4f0ff, 0.6);
    c.setPixel(x + 8, y + 1, 0xdfe6ff, 0.9);
  }
  // La bolsa abandonada
  c.fillRect(246, 188, 17, 10, 0x0a0a1a);
  c.strokeRect(246, 188, 17, 10, 0x4a4f7a, 0.9);
  c.fillRect(249, 191, 11, 1, PAL.cyan);
  c.fillEllipse(254, 200, 14, 2, 0x05020d, 0.6);
  // Adrián, alejándose
  const kid = personActor({ x: 316, footY: 178, height: 44, facing: 1, pose: 'walk', top: 0x16163a, topLight: 0x2a2a6a, bottom: 0x0d0d28, skin: 0x2a1a20, hair: 0x05030a, shoe: 0x3a3a5a, rim: PAL.red }, 1, 700);
  c.fillEllipse(316, 180, 12, 2, 0x05020d, 0.5);

  // Primer plano: cinta de precinto entre dos postes y conos
  const front = new PixelCanvas(ART_W, 280);
  front.fillRect(10, 96, 5, 130, 0x05020d);
  front.fillRect(486, 90, 5, 136, 0x05020d);
  const tapeC = new PixelCanvas(474, 24);
  crimeTape(tapeC, 0, 8, 471, 2, 9);
  const tape = swayActor(tapeC, 15, 86, 1, 1900);
  for (const x of [34, 456]) {
    front.fillPolygon([{ x: x - 7, y: 232 }, { x: x + 7, y: 232 }, { x: x + 3, y: 206 }, { x: x - 3, y: 206 }], 0xff7a2a);
    front.fillRect(x - 5, 218, 10, 3, 0xf4f0ff);
    front.fillRect(x - 9, 232, 18, 3, 0x14101e);
  }
  return [layer(back, 0.3), layer(c, 1, { actors: [kid.actor] }), layer(front, 1.25, { actors: [tape] })];
}
void ART_W;
