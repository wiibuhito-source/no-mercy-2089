import Phaser from 'phaser';
import { PixelCanvas } from '../../core/pixelCanvas';
import type { NearAnchors } from './art/near';
import { FROND_H, FROND_ORIGIN, FROND_W, buildFrond, buildTrunk } from './art/palm';
import { DEPTH, type Animated } from './animated';
import { ensureTexture } from './canvasTexture';

const TRUNK_H = 76;
const ANGLES: readonly number[] = [-78, -48, -16, 18];
/** Hojas de la copa: (ángulo de salida, lado, desfase del balanceo). Las de atrás van primero. */
const FRONDS: readonly { angle: number; side: 'R' | 'L'; phase: number }[] = [
  { angle: -78, side: 'R', phase: 0.4 },
  { angle: -78, side: 'L', phase: 1.9 },
  { angle: -48, side: 'R', phase: 1.1 },
  { angle: -48, side: 'L', phase: 2.7 },
  { angle: -16, side: 'R', phase: 2.2 },
  { angle: -16, side: 'L', phase: 0.9 },
  { angle: 18, side: 'R', phase: 3.1 },
  { angle: 18, side: 'L', phase: 1.5 }
];

const frondKey = (angle: number, sway: number, side: 'R' | 'L'): string => `nm-frond-${angle}-${sway}-${side}`;

/** Palmera con las hojas moviéndose con el viento (cambia entre tres fotogramas de balanceo). */
export function createPalmTree(scene: Phaser.Scene, anchors: NearAnchors, reduceMotion: boolean): Animated {
  ensureTexture(scene, 'nm-palm-trunk', () => buildTrunk(TRUNK_H));
  for (const angle of ANGLES) {
    for (let s = 0; s < 3; s++) {
      ensureTexture(scene, frondKey(angle, s, 'R'), () => buildFrond(angle, s - 1));
      ensureTexture(scene, frondKey(angle, s, 'L'), () => {
        const mirrored = new PixelCanvas(FROND_W, FROND_H);
        mirrored.blit(buildFrond(angle, s - 1), 0, 0, { flipX: true });
        return mirrored;
      });
    }
  }
  const left = anchors.palmBase.x - 8;
  const top = anchors.palmBase.y - TRUNK_H;
  scene.add.image(left, top, 'nm-palm-trunk').setOrigin(0, 0).setDepth(DEPTH.palmTrunk);
  const crown = { x: left + 9, y: top + 2 };

  const fronds = FRONDS.map((f) => {
    const originX = f.side === 'R' ? FROND_ORIGIN.x / FROND_W : (FROND_W - FROND_ORIGIN.x) / FROND_W;
    const image = scene.add
      .image(crown.x, crown.y, frondKey(f.angle, 1, f.side))
      .setOrigin(originX, FROND_ORIGIN.y / FROND_H)
      .setDepth(DEPTH.palmTrunk + 0.1);
    return { spec: f, image, shown: 1 };
  });

  return {
    update(timeMs) {
      if (reduceMotion) return;
      for (const f of fronds) {
        const idx = Math.round(1 + Math.sin(timeMs * 0.0012 + f.spec.phase));
        if (idx !== f.shown) {
          f.shown = idx;
          f.image.setTexture(frondKey(f.spec.angle, idx, f.spec.side));
        }
      }
    }
  };
}
