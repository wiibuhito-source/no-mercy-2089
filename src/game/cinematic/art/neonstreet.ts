// Escena 5: la calle de madrugada, llena de anuncios y sin ninguna ayuda. Adrián camina solo bajo la lluvia.
import { PixelCanvas } from '../../../core/pixelCanvas';
import { drawPixelText } from '../../../core/pixelText';
import { PAL } from '../../../data/menuPalette';
import { buildNeonSign } from '../../menu/art/neon';
import { buildGlowDisc, buildGlowEllipse } from '../../menu/art/glow';
import { acUnit, holoPanel, layer, newArt, parkedCar, personActor, powerLine, reflection, sky, skyline, stars, trashBag, wetGround, windows, type SceneArt } from './kit';

const GROUND = 198;

export function buildNeonStreetArt(): SceneArt {
  const back = newArt();
  sky(back, 200, [{ at: 0, color: PAL.ink }, { at: 0.5, color: 0x2a1450 }, { at: 1, color: 0x7a2a7a }]);
  stars(back, 5, 60, 70);
  skyline(back, 61, 170, 50, 120, 0x1a0f3d, 0.14);
  skyline(back, 62, 184, 24, 70, 0x120a2a, 0.2);

  const c = newArt();
  // Banco cerrado (izquierda)
  c.fillRect(0, 70, 150, GROUND - 70, 0x1c1440);
  c.fillRect(0, 70, 150, 3, 0x4b2d9a);
  windows(c, 0, 76, 150, 60, 17, 0.1);
  c.fillRect(14, 140, 110, GROUND - 140, 0x0b0820);
  for (let x = 14; x < 124; x += 4) c.fillRect(x, 142, 2, GROUND - 142, 0x2a2550, 0.9); // persiana bajada
  const bank = buildNeonSign('BANCO', 0x4a4f7a, 1);
  c.blit(bank.on, 52, 120, { alpha: 0.6 });
  acUnit(c, 20, 90);
  acUnit(c, 108, 96);
  // Casa de empeños (centro)
  c.fillRect(150, 100, 130, GROUND - 100, 0x241450);
  c.fillRect(150, 100, 130, 3, 0x6a3ab0);
  c.fillRect(162, 150, 56, GROUND - 150, 0x120a2a);
  c.fillRect(164, 152, 52, 44, 0xff9a4a, 0.28);
  for (const [dx, dy] of [[168, 164], [184, 160], [198, 168]] as const) c.fillRect(dx, dy, 10, 6, 0x6a5a4a);
  c.fillRect(226, 150, 40, GROUND - 150, 0x0b0820);
  c.fillRect(231, 156, 30, 40, 0x1a1236);
  c.fillRect(250, 172, 3, 3, PAL.sun);
  const pawn = buildNeonSign('EMPEÑOS', PAL.orange, 1);
  c.blit(pawn.glow, 164 - pawn.glowPad, 120 - pawn.glowPad);
  c.blit(pawn.on, 164, 120);
  // Edificio del anuncio gigante (derecha)
  c.fillRect(290, 36, 210, GROUND - 36, 0x2a1c52);
  c.fillRect(290, 36, 210, 3, 0x4b2d9a);
  windows(c, 290, 40, 210, 100, 23, 0.2);
  holoPanel(c, 312, 54, 150, 66, PAL.pink, 0x2a0a3a);
  drawPixelText(c, 'PRÉSTAMOS', 336, 62, { color: PAL.pink, scale: 2, shadow: 0x4a0a5a });
  drawPixelText(c, 'RÁPIDOS', 348, 80, { color: PAL.cyan, scale: 2, shadow: 0x0a3a4a });
  drawPixelText(c, '¡SIN PREGUNTAS!', 340, 102, { color: PAL.white });
  c.blit(buildGlowDisc(90, PAL.pink, 5, 0.16), 292, 18);
  c.fillRect(290, 140, 210, GROUND - 140, 0x1c1440);
  c.fillRect(300, 150, 30, GROUND - 150, 0x0b0820);
  c.fillRect(300, 146, 30, 3, 0x4a4f7a);
  parkedCar(c, 372, 206, 82, 0x1a2a5a, 0x0a0a1e, 0xffe9a8, -1);

  // Calle mojada con charcos que reflejan los neones
  wetGround(c, GROUND, 0x1a1236, 0x05020d);
  c.fillRect(0, GROUND - 3, 500, 5, 0x2c2556);
  c.fillRect(0, GROUND - 3, 500, 1, 0x5a4bd0, 0.7);
  reflection(c, 164, GROUND + 6, 90, 18, PAL.orange, 0.34);
  reflection(c, 320, GROUND + 6, 130, 18, PAL.pink, 0.3);
  reflection(c, 336, GROUND + 6, 100, 14, PAL.cyan, 0.2);
  c.blit(buildGlowEllipse(40, 6, PAL.orange, 4, 0.4), 160, GROUND + 6);
  trashBag(c, 138, GROUND);
  trashBag(c, 128, GROUND);
  // Respiradero de vapor
  c.fillRect(278, GROUND + 4, 22, 3, 0x2a2550);
  for (let x = 280; x < 298; x += 3) c.fillRect(x, GROUND + 4, 1, 3, 0x05020d);

  // Adrián, con la capucha puesta, camina; alguien lo mira desde el portal
  const kid = personActor({ x: 214, footY: GROUND + 4, height: 42, facing: 1, pose: 'walk', top: 0x3b6fd0, topLight: 0x6ab0ff, bottom: 0x1f3068, rim: PAL.pink }, 1, 520);
  const watcher = personActor({ x: 316, footY: GROUND, height: 60, facing: -1, pose: 'stand', top: 0x16163a, topLight: 0x2a2a6a, bottom: 0x0d0d28, hood: true, visor: PAL.cyan, shoe: 0x2a2a4a, rim: PAL.pink }, 1, 2600, 900);

  // Primer plano: farola desenfocada, cables y un cartel que cuelga
  const front = new PixelCanvas(500, 280);
  front.fillRect(446, 0, 7, 280, 0x05020d);
  front.fillRect(430, 22, 28, 6, 0x05020d);
  front.blit(buildGlowDisc(22, 0xffcf6b, 3, 0.35), 424, 8);
  powerLine(front, -4, 20, 440, 36, 14);
  powerLine(front, -4, 30, 440, 44, 12, 0x0a0612, 0.8);
  front.fillRect(8, 0, 2, 40, 0x05020d);
  front.fillRect(0, 40, 34, 12, 0x05020d);
  front.fillRect(3, 43, 28, 6, PAL.cyan, 0.65);
  return [layer(back, 0.3), layer(c, 1, { actors: [kid.actor, watcher.actor] }), layer(front, 1.25)];
}
