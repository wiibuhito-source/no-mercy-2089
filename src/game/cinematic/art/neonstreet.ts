// Escena 5: la calle de madrugada, llena de anuncios y sin ninguna ayuda. Adrián camina solo bajo la lluvia y el viento.
import { PixelCanvas } from '../../../core/pixelCanvas';
import { drawPixelText } from '../../../core/pixelText';
import { PAL } from '../../../data/menuPalette';
import { buildNeonSign } from '../../menu/art/neon';
import { buildGlowDisc, buildGlowEllipse } from '../../menu/art/glow';
import { acUnit, bladeSign, haze, holoPanel, layer, lightShaft, newArt, parkedCar, personActor, powerLine, reflectActor, reflectDown, reflection, sky, skyline, stars, swayActor, trashBag, wetGround, type SceneArt } from './kit';
import { atm, antenna, balcony, busStop, dish, graffiti, hydrant, poster, scooter, trashCan, umbrellaPerson, vending, vent, wallTexture, waterTank, windowLit, type WindowKind } from './details';

const G = 198;

export function buildNeonStreetArt(): SceneArt {
  const back = newArt();
  sky(back, 200, [{ at: 0, color: PAL.ink }, { at: 0.5, color: 0x2a1450 }, { at: 1, color: 0x7a2a7a }]);
  stars(back, 5, 60, 70);
  skyline(back, 61, 170, 50, 120, 0x1a0f3d, 0.18);
  for (let x = 20; x < 500; x += 70) back.fillRect(x, 60 + (x % 50), 1, 24, x % 140 === 20 ? PAL.cyan : PAL.magenta, 0.5);

  // Edificios del otro lado de la calle (se mueven distinto que el primer plano)
  const far = newArt();
  skyline(far, 62, 184, 24, 80, 0x241450, 0.3, );
  far.fillRect(0, 184, 500, 30, 0x120a2a);

  const c = newArt();
  // --- Banco cerrado (izquierda)
  c.fillRect(0, 62, 150, G - 62, 0x1c1440);
  c.fillRect(0, 62, 150, 3, 0x4b2d9a);
  wallTexture(c, 0, 66, 150, G - 66, 8, 0.07, 0x0a0618);
  for (const x of [8, 56]) c.fillRect(x, 70, 6, 128, 0x24174f); // columnas
  for (let row = 0; row < 2; row++) for (let col = 0; col < 3; col++) windowLit(c, 22 + col * 34, 76 + row * 30, 18, 20, ((row + col) % 3 === 0 ? 'blinds' : 'dark') as WindowKind, row * 3 + col);
  c.fillRect(14, 140, 102, G - 140, 0x0b0820);
  for (let x = 14; x < 116; x += 4) c.fillRect(x, 142, 2, G - 142, 0x2a2550, 0.9);
  c.fillRect(14, 140, 102, 3, 0x4a4f7a);
  const bank = buildNeonSign('BANCO', 0x4a4f7a, 1);
  c.blit(bank.on, 52, 124, { alpha: 0.6 });
  atm(c, 124, 152);
  c.blit(buildGlowDisc(30, 0x1ff3a0, 4, 0.2), 105, 140);
  acUnit(c, 108, 82);
  vent(c, 4, 160);
  poster(c, 6, 176, 10, 16, 2);
  graffiti(c, 20, 186, PAL.pink, 6);

  // --- Casa de empeños (centro)
  c.fillRect(150, 96, 130, G - 96, 0x241450);
  c.fillRect(150, 96, 130, 3, 0x6a3ab0);
  wallTexture(c, 150, 100, 130, G - 100, 4, 0.06, 0x0a0618);
  c.fillRect(162, 146, 58, G - 146, 0x120a2a);
  c.fillRect(164, 148, 54, 46, 0xff9a4a, 0.3);
  // objetos en el escaparate: guitarra, reloj, tele, zapatillas
  c.fillEllipse(176, 184, 7, 6, 0x9a5a2a);
  c.fillRect(176, 164, 2, 20, 0x6a3a1a);
  c.fillCircle(176, 184, 2, 0x1a0f0a);
  c.fillCircle(192, 178, 6, 0xcfc8e8);
  c.fillCircle(192, 178, 4, 0x1a1030);
  c.line(192, 178, 192, 175, 0xffd36b);
  c.fillRect(202, 166, 12, 9, 0x05140f);
  c.strokeRect(202, 166, 12, 9, 0x4a4f7a);
  c.fillRect(204, 168, 8, 4, 0x3a8aff, 0.8);
  c.fillRect(200, 190, 14, 4, 0xff7aa8);
  // puerta y rótulos
  c.fillRect(226, 146, 40, G - 146, 0x0b0820);
  c.fillRect(231, 152, 30, 42, 0x1a1236);
  c.fillRect(252, 172, 3, 3, PAL.sun);
  holoPanel(c, 222, 104, 48, 20, PAL.sun, 0x2a1a0a);
  drawPixelText(c, 'ORO', 232, 108, { color: PAL.sun, scale: 2 });
  const pawn = buildNeonSign('EMPEÑOS', PAL.orange, 1);
  c.blit(pawn.glow, 164 - pawn.glowPad, 124 - pawn.glowPad);
  c.blit(pawn.on, 164, 124);
  acUnit(c, 156, 102);

  // --- Edificio del anuncio gigante (derecha)
  c.fillRect(290, 30, 210, G - 30, 0x2a1c52);
  c.fillRect(290, 30, 210, 3, 0x4b2d9a);
  wallTexture(c, 290, 34, 210, G - 34, 6, 0.06, 0x120a2a);
  const kinds: WindowKind[] = ['warm', 'tv', 'dark', 'curtain', 'person', 'plant', 'blinds', 'dark'];
  for (let col = 0; col < 6; col++) {
    windowLit(c, 298 + col * 34, 134, 18, 22, kinds[(col * 3) % kinds.length] ?? 'dark', col + 20);
    balcony(c, 295 + col * 34, 156, 24, col % 2 === 0, col);
  }
  holoPanel(c, 312, 44, 150, 66, PAL.pink, 0x2a0a3a);
  drawPixelText(c, 'PRÉSTAMOS', 336, 52, { color: PAL.pink, scale: 2, shadow: 0x4a0a5a });
  drawPixelText(c, 'RÁPIDOS', 348, 70, { color: PAL.cyan, scale: 2, shadow: 0x0a3a4a });
  drawPixelText(c, '¡SIN PREGUNTAS!', 340, 92, { color: PAL.white });
  c.blit(buildGlowDisc(90, PAL.pink, 5, 0.16), 292, 8);
  waterTank(c, 440, 14);
  antenna(c, 330, 30, 20);
  dish(c, 472, 36);
  c.fillRect(290, 158, 210, G - 158, 0x1c1440);
  // portal oscuro donde espera el vigilante
  c.fillRect(456, 164, 36, G - 164, 0x05020d);
  c.fillRect(456, 164, 36, 2, 0x4a4f7a);
  c.fillRect(456, 160, 36, 4, 0xff2bd6, 0.5);

  // --- Calle mojada y mobiliario urbano
  wetGround(c, G, 0x1a1236, 0x05020d);
  c.fillRect(0, G - 3, 500, 5, 0x2c2556);
  c.fillRect(0, G - 3, 500, 1, 0x5a4bd0, 0.7);
  for (let x = 6; x < 500; x += 38) c.fillRect(x, G + 20, 16, 1, 0xffd23a, 0.35);
  reflection(c, 164, G + 6, 90, 18, PAL.orange, 0.34);
  reflection(c, 320, G + 6, 130, 18, PAL.pink, 0.3);
  reflection(c, 336, G + 6, 100, 14, PAL.cyan, 0.2);
  reflection(c, 118, G + 6, 40, 14, 0x1ff3a0, 0.22);
  c.blit(buildGlowEllipse(40, 6, PAL.orange, 4, 0.4), 160, G + 6);
  trashBag(c, 138, G);
  trashBag(c, 128, G);
  trashCan(c, 150, G);
  c.fillRect(256, G + 4, 22, 3, 0x2a2550);
  for (let x = 258; x < 276; x += 3) c.fillRect(x, G + 4, 1, 3, 0x05020d);
  busStop(c, 296, G, 44, PAL.pink);
  vending(c, 352, G, PAL.cyan);
  c.blit(buildGlowDisc(26, PAL.cyan, 3, 0.2), 348, G - 46);
  hydrant(c, 380, G);
  parkedCar(c, 396, 206, 80, 0x1a2a5a, 0x0a0a1e, 0xffe9a8, -1);
  scooter(c, 112, G + 3);
  umbrellaPerson(c, 70, G + 4, 34, 0x3a6aa0, 1);
  umbrellaPerson(c, 262, G + 6, 30, 0xb0405a, -1);

  // --- Adrián camina; alguien lo mira desde el portal
  bladeSign(c, 284, 100, 'BAR', PAL.magenta);
  bladeSign(c, 140, 70, '24H', PAL.cyan);
  lightShaft(c, 387, 112, 140, 220, 90, PAL.pink, 0.09);
  lightShaft(c, 192, 160, 40, 70, 40, PAL.orange, 0.12);
  haze(c, G - 30, G, 0xb08aff, 0.0, 0.16);
  const kid = personActor({ x: 214, footY: G + 4, height: 48, facing: 1, pose: 'walk', hairStyle: 'messy', top: 0x3b6fd0, topLight: 0x6ab0ff, bottom: 0x1f3068, rim: PAL.pink }, 1, 520);
  const watcher = personActor({ x: 474, footY: G, height: 66, facing: -1, pose: 'stand', top: 0x16163a, topLight: 0x2a2a6a, bottom: 0x0d0d28, hood: true, visor: PAL.cyan, shoe: 0x2a2a4a, rim: PAL.pink }, 1, 2600, 900);
  // asfalto mojado: espejo de los neones y de los personajes
  const comp = new PixelCanvas(500, 280);
  comp.blit(back, 0, 0);
  comp.blit(far, 0, 0);
  comp.blit(c, 0, 0);
  reflectDown(c, comp, G + 2, 56, 0.46, 1.3);
  reflectActor(c, kid.actor, G + 4, 34, 0.42);
  reflectActor(c, watcher.actor, G, 40, 0.4);

  // --- Cables con pájaros que se mecen
  const cables = new PixelCanvas(500, 40);
  powerLine(cables, -4, 6, 250, 20, 10, 0x05020d, 0.95);
  powerLine(cables, 250, 20, 504, 4, 12, 0x05020d, 0.95);
  powerLine(cables, -4, 16, 250, 30, 9, 0x05020d, 0.75);
  const wires = swayActor(cables, 0, 4, 1, 3400);

  // --- Primer plano: farola desenfocada y un cartel que cuelga
  const front = new PixelCanvas(500, 280);
  front.fillRect(20, 0, 7, 280, 0x05020d);
  front.fillRect(20, 20, 30, 6, 0x05020d);
  front.blit(buildGlowDisc(22, 0xffcf6b, 3, 0.35), 34, 6);
  front.fillRect(40, 24, 10, 3, 0xffe9a8);
  const open = buildNeonSign('ABIERTO', PAL.cyan, 1);
  front.blit(open.glow, 400 - open.glowPad, 8 - open.glowPad, { alpha: 0.7 });
  const sign = swayActor(open.on, 400, 8, 2, 2700, 600);
  front.fillRect(398, 0, 1, 8, 0x05020d);
  front.fillRect(436, 0, 1, 8, 0x05020d);
  return [layer(back, 0.3), layer(far, 0.65), layer(c, 1, { actors: [kid.actor, watcher.actor, wires] }), layer(front, 1.25, { actors: [sign] })];
}
