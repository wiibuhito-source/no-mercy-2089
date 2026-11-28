// Escena 8: los años siguientes. Adrián corre con una bolsa por una pasarela elevada; la ciudad pasa a toda velocidad.
import { PixelCanvas } from '../../../core/pixelCanvas';
import { PAL } from '../../../data/menuPalette';
import { buildGlowDisc } from '../../menu/art/glow';
import { ART_W, contactShadow, ghostOf, haze, layer, newArt, personFrames, reflectActor, reflectDown, sky, skylineWrap, stars, type ArtActor, type SceneArt } from './kit';
import { SCALE } from './characters';

const DECK = 190;

export function buildRunArt(): SceneArt {
  const back = newArt();
  sky(back, 214, [{ at: 0, color: PAL.ink }, { at: 0.42, color: 0x2a1450 }, { at: 0.78, color: 0xa03a8a }, { at: 1, color: 0xff7a8a }]);
  stars(back, 71, 110, 100);
  back.blit(buildGlowDisc(44, PAL.blush, 5, 0.22), 358, 8);
  back.fillCircle(398, 54, 15, 0xf6d4e6);
  back.fillCircle(393, 50, 4, 0xd9a8c8, 0.7);
  for (let i = 0; i < 8; i++) back.fillEllipse(30 + i * 62, 120 + (i % 3) * 14, 36, 2, 0xff9ac8, 0.22);

  // Dos capas de ciudad que se repiten sin cortes y pasan a distinta velocidad
  const far = newArt();
  skylineWrap(far, 81, 190, 36, 120, 0x3a2a78, 0.22, [PAL.cyan, PAL.magenta]);
  haze(far, 110, 190, 0xb0407a, 0.0, 0.3);
  const near = newArt();
  skylineWrap(near, 82, DECK + 6, 70, 150, 0x160c34, 0.34, [PAL.pink, PAL.cyan, PAL.sun]);
  for (let x = 40; x < ART_W; x += 125) {
    near.fillRect(x, 70, 36, 22, 0x0a0618, 0.8);
    near.strokeRect(x, 70, 36, 22, x % 250 === 40 ? PAL.cyan : PAL.pink, 0.9);
    near.fillRect(x + 4, 76, 28, 2, x % 250 === 40 ? PAL.cyan : PAL.pink, 0.8);
    near.fillRect(x + 4, 82, 16, 2, 0xffffff, 0.6);
  }

  // --- La pasarela: suelo brillante con tiras LED, barandilla y estructura
  const c = newArt();
  c.fillRect(0, 150, ART_W, 3, 0x05020d);
  c.fillRect(0, 150, ART_W, 1, 0x6a6a9a, 0.8);
  c.fillRect(0, 172, ART_W, 2, 0x05020d);
  for (let x = 0; x < ART_W; x += 50) c.fillRect(x, 150, 3, 44, 0x05020d);
  c.fillGradientV(0, DECK, ART_W, 14, [{ at: 0, color: 0x3a3478 }, { at: 1, color: 0x1a1440 }], 6);
  c.fillRect(0, DECK, ART_W, 1, 0xb8a8ff, 0.9);
  c.fillRect(0, DECK + 3, ART_W, 1, PAL.cyan, 0.9);
  for (let x = 0; x < ART_W; x += 40) c.fillRect(x, DECK + 6, 22, 1, PAL.magenta, 0.7);
  c.fillRect(0, DECK + 14, ART_W, 90, 0x07040f);
  for (let x = 20; x < ART_W; x += 90) c.fillRect(x, DECK + 14, 8, 70, 0x120a2a);
  // el suelo refleja la ciudad y las luces
  const comp = new PixelCanvas(ART_W, 280);
  comp.blit(back, 0, 0);
  comp.blit(far, 0, 0);
  comp.blit(near, 0, 0);
  comp.blit(c, 0, 0);
  reflectDown(c, comp, DECK + 14, 26, 0.3, 1.5);

  // --- El corredor: ciclo de carrera de 8 fotogramas con la bolsa en la mano, y su estela
  const bagAt = (cv: PixelCanvas, hand: { x: number; y: number }): void => {
    cv.fillRect(hand.x - 2, hand.y - 1, 12, 9, 0x0a0a1a);
    cv.strokeRect(hand.x - 2, hand.y - 1, 12, 9, 0x6a6a9a, 0.9);
    cv.fillRect(hand.x, hand.y + 3, 8, 1, PAL.cyan);
    cv.fillRect(hand.x + 2, hand.y - 3, 5, 2, 0x6a6a9a);
  };
  const run = personFrames({ x: 250, footY: DECK + 3, height: SCALE.teen, facing: 1, pose: 'run', hairStyle: 'messy', top: 0x3b6fd0, topLight: 0x6ab0ff, bottom: 0x1f3068, rim: PAL.pink, noShadow: true }, 8, 78, bagAt);
  const ghosts: ArtActor[] = [ghostOf(run.actor, 2, 0.26, -15), ghostOf(run.actor, 4, 0.14, -30)];
  contactShadow(c, 250, DECK + 4, 40, 0.5);
  reflectActor(c, run.actor, DECK + 4, 30, 0.4);

  // --- Primer plano: postes de farola que pasan a toda velocidad
  const rail = new PixelCanvas(ART_W, 280);
  for (const x of [60, 310]) {
    rail.fillRect(x, 84, 5, 126, 0x05020d);
    rail.fillRect(x - 12, 82, 28, 4, 0x05020d);
    rail.fillRect(x - 12, 86, 28, 3, 0xffe9a8);
    rail.blit(buildGlowDisc(34, 0xffcf6b, 4, 0.34), x - 29, 62);
  }
  for (let x = 30; x < ART_W; x += 100) rail.fillRect(x, 150, 3, 60, 0x05020d, 0.85);
  return [
    layer(back, 0.15),
    layer(far, 0.2, { tile: true, autoScrollX: -9 }),
    layer(near, 0.4, { tile: true, autoScrollX: -34 }),
    layer(c, 1, { actors: [...ghosts, run.actor] }),
    layer(rail, 1.1, { tile: true, autoScrollX: -240 })
  ];
}
