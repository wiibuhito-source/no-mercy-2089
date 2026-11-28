// Escena 9: la noche en que salió mal. Luces rojas y azules, una furgoneta abierta, la bolsa en el suelo y Adrián alejándose.
import { PixelCanvas } from '../../../core/pixelCanvas';
import { PAL } from '../../../data/menuPalette';
import { buildGlowDisc } from '../../menu/art/glow';
import { ART_W, contactShadow, crimeTape, drawPerson, haze, layer, lightShaft, newArt, personActor, reflectActor, reflectDown, sky, skyline, stars, swayActor, type SceneArt } from './kit';

const HORIZON = 112;
const BLUE = 0x2f6bff;

export function buildExitArt(): SceneArt {
  const back = newArt();
  sky(back, HORIZON + 4, [{ at: 0, color: PAL.ink }, { at: 0.55, color: 0x3a1a60 }, { at: 1, color: 0x9a3a8a }]);
  stars(back, 23, 80, 70);
  skyline(back, 41, HORIZON, 20, 70, 0x1c1244, 0.14);
  skyline(back, 44, HORIZON + 2, 8, 30, 0x120a2e, 0.1);
  haze(back, HORIZON - 30, HORIZON + 2, 0xff6a9a, 0.0, 0.3);

  const c = newArt();
  // --- Carretera en perspectiva, mojada
  c.fillRect(0, HORIZON, ART_W, 170, 0x0e0a22);
  for (let y = HORIZON; y < 230; y++) {
    const t = (y - HORIZON) / (230 - HORIZON);
    const left = 250 - 22 - t * 340;
    const right = 250 + 22 + t * 340;
    c.fillRect(left, y, right - left, 1, 0x241c46);
    c.setPixel(left, y, 0x6a5aa0);
    c.setPixel(right, y, 0x6a5aa0);
  }
  for (let i = 0; i < 6; i++) {
    const t = (i + 0.6) / 6;
    c.fillRect(250 - 1 - t * 3, HORIZON + 4 + t * t * 104, 2 + t * 6, 2 + t * 4, 0xb0b6d8, 0.7);
  }

  // --- Furgoneta con las puertas traseras abiertas y luz saliendo de la carga
  c.fillRect(76, 116, 122, 56, 0x1c1850);
  c.fillRect(76, 116, 122, 3, 0x6a5aff, 0.8);
  c.fillRect(76, 116, 3, 56, 0x2a2470);
  c.fillRect(80, 142, 118, 2, 0x4a3aa0, 0.7);
  c.fillRect(154, 122, 38, 22, 0x0a0618);
  c.fillRect(154, 122, 38, 2, PAL.cyan, 0.5);
  c.fillRect(76, 172, 122, 3, 0x05020d);
  for (const wx of [98, 170]) {
    c.fillCircle(wx, 174, 10, 0x05020d);
    c.fillCircle(wx, 174, 5, 0x3a3478);
    c.fillCircle(wx, 174, 2, 0x8a8fb5);
  }
  c.fillRect(66, 122, 10, 48, 0xffcf6b, 0.9);
  c.fillPolygon([{ x: 66, y: 122 }, { x: 36, y: 132 }, { x: 36, y: 180 }, { x: 66, y: 170 }], 0x241c5a);
  c.line(66, 122, 36, 132, 0x6a5aff);
  lightShaft(c, 50, 170, 24, 120, 60, 0xffcf6b, 0.35);
  c.blit(buildGlowDisc(40, PAL.amber, 4, 0.34), 30, 112);
  contactShadow(c, 138, 176, 130, 0.6);

  // --- Coche patrulla con la barra de luces (las luces parpadean encima)
  c.fillRect(392, 132, 78, 24, 0x2a2470);
  c.fillRect(404, 122, 44, 12, 0x2a2470);
  c.fillRect(392, 132, 78, 2, 0x6a5aff);
  c.fillRect(410, 126, 32, 6, 0x0a0618);
  c.fillRect(392, 156, 78, 3, 0x05020d);
  c.fillCircle(410, 158, 7, 0x05020d);
  c.fillCircle(452, 158, 7, 0x05020d);
  c.fillRect(420, 118, 10, 4, PAL.red);
  c.fillRect(430, 118, 10, 4, BLUE);
  c.blit(buildGlowDisc(40, PAL.red, 4, 0.34), 402, 100);
  c.blit(buildGlowDisc(40, BLUE, 4, 0.34), 428, 100);
  contactShadow(c, 431, 160, 80, 0.6);

  // --- Curiosos al otro lado de la cinta, recortados contra las luces
  for (const [x, h] of [[364, 30], [376, 34], [388, 28], [474, 32], [486, 30]] as const) drawPerson(c, { x, footY: 150, height: h, facing: -1, pose: 'stand', top: 0x14122a, bottom: 0x0b0a18, skin: 0x2a1a20, hair: 0x05030a, shoe: 0x1a1a28, rim: x < 400 ? PAL.red : BLUE, noShadow: true });
  // basura y cristales rotos
  for (const [x, y] of [[196, 192], [232, 202], [290, 188], [334, 200], [150, 204]] as const) {
    c.fillRect(x, y, 5, 2, 0xf4f0ff, 0.65);
    c.setPixel(x + 8, y + 1, 0xdfe6ff, 0.95);
    c.setPixel(x + 11, y, 0xdfe6ff, 0.7);
  }
  // la bolsa abandonada en la carretera
  c.fillRect(246, 188, 18, 11, 0x0a0a1a);
  c.strokeRect(246, 188, 18, 11, 0x6a6a9a, 0.95);
  c.fillRect(249, 191, 12, 1, PAL.cyan);
  c.fillRect(250, 186, 10, 2, 0x6a6a9a);
  contactShadow(c, 255, 200, 22, 0.6);

  const kid = personActor({ x: 322, footY: 184, height: 56, facing: 1, pose: 'walk', back: true, hairStyle: 'messy', top: 0x2a2a6a, topLight: 0x4a4aa0, bottom: 0x14143a, shoe: 0x6a6a9a, rim: PAL.red }, 1, 700);

  // --- El asfalto mojado devuelve las luces rojas y azules
  const comp = new PixelCanvas(ART_W, 280);
  comp.blit(back, 0, 0);
  comp.blit(c, 0, 0);
  reflectDown(c, comp, 178, 34, 0.26, 1.2);
  reflectActor(c, kid.actor, 184, 30, 0.34);

  // --- Primer plano: cinta de precinto entre dos postes (se mece) y conos
  const front = new PixelCanvas(ART_W, 280);
  front.fillRect(10, 94, 5, 140, 0x05020d);
  front.fillRect(486, 88, 5, 146, 0x05020d);
  for (const x of [34, 456]) {
    front.fillPolygon([{ x: x - 7, y: 236 }, { x: x + 7, y: 236 }, { x: x + 3, y: 208 }, { x: x - 3, y: 208 }], 0xff7a2a);
    front.fillRect(x - 5, 221, 10, 3, 0xf4f0ff);
    front.fillRect(x - 9, 236, 18, 3, 0x14101e);
  }
  const tapeC = new PixelCanvas(474, 24);
  crimeTape(tapeC, 0, 8, 471, 2, 9);
  return [layer(back, 0.3), layer(c, 1, { actors: [kid.actor] }), layer(front, 1.25, { actors: [swayActor(tapeC, 15, 84, 1, 1900)] })];
}
