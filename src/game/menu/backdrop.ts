import Phaser from 'phaser';
import { PARALLAX_MARGIN, SCENE } from '../../data/menuScene';
import { BASE_WIDTH } from '../../core/version';
import { buildNearScene, type NearScene } from './art/near';
import { SUN_SIZE, buildSky, buildSun } from './art/sky';
import { buildFarSkyline, buildMidSkyline, type MidSkyline } from './art/skyline';
import { DEPTH } from './animated';
import { addPixelImage, cached } from './canvasTexture';

const LAYER_W = BASE_WIDTH + PARALLAX_MARGIN * 2;
const LAYER_H = 200;
/** Dónde queda (en la pantalla) la valla holográfica de la ciudad. */
const BILLBOARD_SCREEN_X = 196;

export interface Backdrop {
  readonly sun: Phaser.GameObjects.Image;
  readonly far: Phaser.GameObjects.Image;
  /** Edificios cercanos: contenedor para poder colgarle ventanas y carteles que se mueven con ellos. */
  readonly mid: Phaser.GameObjects.Container;
  readonly midData: MidSkyline;
  readonly near: NearScene;
}

/** Ciudad nocturna estática: cielo, sol, dos niveles de rascacielos y la calle con sus edificios. */
export function createBackdrop(scene: Phaser.Scene): Backdrop {
  addPixelImage(scene, 'nm-sky', () => buildSky(LAYER_W, LAYER_H), -PARALLAX_MARGIN, 0, DEPTH.sky);
  const sun = addPixelImage(scene, 'nm-sun', buildSun, SCENE.sun.x - SUN_SIZE / 2, SCENE.sun.y - SUN_SIZE / 2, DEPTH.sun);
  const far = addPixelImage(scene, 'nm-far', () => buildFarSkyline(LAYER_W, LAYER_H), -PARALLAX_MARGIN, 0, DEPTH.far);
  const midData = cached('mid-skyline', () => buildMidSkyline(LAYER_W, LAYER_H, BILLBOARD_SCREEN_X + PARALLAX_MARGIN));
  const midImage = addPixelImage(scene, 'nm-mid', () => midData.canvas, 0, 0, 0);
  const mid = scene.add.container(-PARALLAX_MARGIN, 0, [midImage]).setDepth(DEPTH.mid);
  const near = cached('near-scene', buildNearScene);
  addPixelImage(scene, 'nm-near', () => near.canvas, 0, 0, DEPTH.near);
  return { sun, far, mid, midData, near };
}
