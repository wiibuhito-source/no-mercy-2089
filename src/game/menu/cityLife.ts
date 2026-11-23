import Phaser from 'phaser';
import { createRng } from '../../core/rng';
import { randomBetween } from '../../core/menu/motion';
import { AMBIENCE } from '../../data/menuScene';
import { PAL } from '../../data/menuPalette';
import { buildGlowDisc } from './art/glow';
import { HOLO_ADS, buildHoloAd } from './art/holo';
import { type Animated } from './animated';
import type { Backdrop } from './backdrop';
import { ensureTexture } from './canvasTexture';

/** Ventanas que se apagan, luces rojas de las antenas y la valla holográfica de la ciudad. */
export function createCityLife(scene: Phaser.Scene, backdrop: Backdrop, reduceMotion: boolean): Animated {
  const rnd = createRng(909);
  const { midData, mid } = backdrop;

  // Luces de las antenas
  ensureTexture(scene, 'nm-beacon-glow', () => buildGlowDisc(5, PAL.red, 3, 0.7));
  const beacons = midData.beacons.map((b, i) => {
    const glow = scene.add.image(b.x, b.y, 'nm-beacon-glow').setBlendMode(Phaser.BlendModes.ADD);
    const dot = scene.add.rectangle(b.x, b.y, 2, 2, PAL.red, 1);
    mid.add([glow, dot]);
    return { glow, dot, phase: i * 0.9 };
  });

  // Ventanas que parpadean: un cuadradito oscuro tapa la luz de vez en cuando
  const covers = midData.windows.slice(0, AMBIENCE.windowFlickers).map((w) => {
    const cover = scene.add.rectangle(w.x, w.y, 2, 3, 0x120826, 1).setOrigin(0, 0).setVisible(false);
    mid.add(cover);
    return { cover, next: randomBetween(rnd, [1000, 9000]) };
  });

  // Valla holográfica
  const board = midData.billboard;
  const adImages = HOLO_ADS.map((ad, i) => {
    const key = `nm-holo-${i}`;
    ensureTexture(scene, key, () => buildHoloAd(ad, board.w, board.h));
    const image = scene.add.image(board.x, board.y, key).setOrigin(0, 0).setBlendMode(Phaser.BlendModes.ADD).setVisible(i === 0);
    mid.add(image);
    return image;
  });
  let current = 0;
  let nextSwitch = AMBIENCE.holoSwitchMs;
  let glitchUntil = 0;

  return {
    update(timeMs) {
      for (const b of beacons) {
        const on = Math.sin(timeMs / 420 + b.phase) > 0.35;
        b.dot.setAlpha(on ? 1 : 0.25);
        b.glow.setAlpha(on ? 0.85 : 0);
      }
      const ad = adImages[current];
      if (!ad) return;
      if (!reduceMotion) {
        for (const w of covers) {
          if (timeMs < w.next) continue;
          w.cover.setVisible(!w.cover.visible);
          w.next = timeMs + randomBetween(rnd, w.cover.visible ? [2500, 7000] : [3000, 12000]);
        }
        if (timeMs < glitchUntil) {
          ad.setX(board.x + (Math.floor(timeMs / 40) % 2 === 0 ? -2 : 2));
          ad.setAlpha(0.5 + 0.5 * (Math.floor(timeMs / 30) % 2));
        } else {
          ad.setX(board.x);
          ad.setAlpha(0.8 + 0.2 * Math.sin(timeMs / 260));
        }
      } else {
        ad.setAlpha(0.9);
      }
      if (timeMs >= nextSwitch) {
        if (!reduceMotion && glitchUntil < nextSwitch) {
          glitchUntil = timeMs + 220; // primero un tembleque...
          nextSwitch = timeMs + 220;
          return;
        }
        ad.setVisible(false).setX(board.x);
        current = (current + 1) % adImages.length;
        adImages[current]?.setVisible(true);
        nextSwitch = timeMs + AMBIENCE.holoSwitchMs;
      }
    }
  };
}

