import Phaser from 'phaser';
import { approach, parallaxOffset } from '../../core/menu/motion';
import { PARALLAX, PARALLAX_MARGIN, SCENE } from '../../data/menuScene';
import { SUN_SIZE } from './art/sky';
import type { Animated } from './animated';
import type { Backdrop } from './backdrop';

/** Profundidad con el ratón: las capas lejanas se mueven menos que las cercanas. */
export function createParallax(scene: Phaser.Scene, backdrop: Backdrop, enabled: boolean): Animated {
  let pointer = 0;
  let smooth = 0;
  if (enabled) {
    scene.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      const cam = scene.cameras.main;
      const x = (p.x - cam.x) / Math.max(1, cam.width * cam.zoom);
      pointer = Math.min(1, Math.max(-1, (x - 0.5) * 2));
    });
  }
  return {
    update() {
      smooth = approach(smooth, pointer, PARALLAX.smoothing);
      const off = (factor: number): number => Math.round(parallaxOffset(smooth, factor, PARALLAX.maxPx));
      backdrop.sun.x = SCENE.sun.x - SUN_SIZE / 2 - off(PARALLAX.factors.sun);
      backdrop.far.x = -PARALLAX_MARGIN - off(PARALLAX.factors.far);
      backdrop.mid.x = -PARALLAX_MARGIN - off(PARALLAX.factors.mid);
    }
  };
}

