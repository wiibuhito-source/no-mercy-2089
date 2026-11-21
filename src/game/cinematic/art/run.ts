// Escena 8: los años siguientes. Adrián corre con una bolsa por una pasarela elevada; la ciudad pasa a toda velocidad.
import { PixelCanvas } from '../../../core/pixelCanvas';
import { PAL } from '../../../data/menuPalette';
import { buildGlowDisc } from '../../menu/art/glow';
import { ART_W, layer, newArt, personActor, reflection, sky, skylineWrap, stars, type SceneArt } from './kit';

const DECK = 206;

export function buildRunArt(): SceneArt {
  const back = newArt();
  sky(back, 212, [{ at: 0, color: PAL.ink }, { at: 0.5, color: 0x2a1450 }, { at: 0.85, color: 0x8a3a8a }, { at: 1, color: 0xff7a8a }]);
  stars(back, 71, 100, 100);
  back.fillCircle(396, 56, 14, 0xf6d4e6);
  back.fillCircle(391, 52, 4, 0xd9a8c8, 0.7);
  back.blit(buildGlowDisc(36, PAL.blush, 5, 0.2), 360, 20);

  // Dos capas de ciudad que se repiten sin cortes y pasan a distinta velocidad
  const far = newArt();
  skylineWrap(far, 81, 176, 30, 100, 0x241450, 0.16, [PAL.cyan, PAL.magenta]);
  const near = newArt();
  skylineWrap(near, 82, DECK + 4, 60, 140, 0x140a30, 0.3, [PAL.pink, PAL.cyan, PAL.sun]);

  // La pasarela
  const c = newArt();
  c.fillRect(0, DECK, ART_W, 20, 0x2a2550);
  c.fillRect(0, DECK, ART_W, 2, 0x6a5ab0);
  c.fillGradientV(0, DECK + 2, ART_W, ART_H_REST, [{ at: 0, color: 0x1a1236 }, { at: 1, color: 0x05020d }], 8);
  for (let x = 0; x < ART_W; x += 38) c.fillRect(x, DECK + 8, 18, 2, 0xdfe6ff, 0.35);
  reflection(c, 200, DECK + 22, 110, 26, PAL.pink, 0.25);
  reflection(c, 330, DECK + 22, 90, 20, PAL.cyan, 0.2);
  for (let x = 20; x < ART_W; x += 90) c.fillRect(x, DECK + 20, 8, 70, 0x120a2a);

  // El corredor, con su bolsa en la mano
  const run = personActor({ x: 250, footY: DECK + 2, height: 52, facing: 1, pose: 'walk', top: 0x3b6fd0, topLight: 0x6ab0ff, bottom: 0x1f3068, rim: PAL.pink }, 2, 300);
  const rx = run.at.hand.x - run.actor.x;
  const ry = run.at.hand.y - run.actor.y;
  run.actor.canvas.fillRect(rx - 3, ry, 10, 8, 0x0a0a1a);
  run.actor.canvas.strokeRect(rx - 3, ry, 10, 8, 0x4a4f7a, 0.9);
  run.actor.canvas.fillRect(rx - 1, ry + 3, 6, 1, PAL.cyan);

  // Barandilla y farolas que pasan muy rápido (primer plano que se repite)
  const rail = new PixelCanvas(ART_W, 280);
  rail.fillRect(0, 168, ART_W, 3, 0x05020d);
  rail.fillRect(0, 168, ART_W, 1, 0x4a4f7a, 0.8);
  rail.fillRect(0, 190, ART_W, 2, 0x05020d);
  for (let x = 0; x < ART_W; x += 50) rail.fillRect(x, 168, 3, 40, 0x05020d);
  for (const x of [60, 310]) {
    rail.fillRect(x, 96, 4, 112, 0x05020d);
    rail.fillRect(x - 10, 94, 24, 4, 0x05020d);
    rail.fillRect(x - 10, 98, 24, 3, 0xffe9a8);
    rail.blit(buildGlowDisc(30, 0xffcf6b, 4, 0.32), x - 26, 74);
  }
  return [layer(back, 0.15), layer(far, 0.2, { tile: true, autoScrollX: -9 }), layer(near, 0.4, { tile: true, autoScrollX: -30 }), layer(c, 1, { actors: [run.actor] }), layer(rail, 1.1, { tile: true, autoScrollX: -210 })];
}
const ART_H_REST = 74;
