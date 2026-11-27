import Phaser from 'phaser';
import { CAR_VARIANTS, TrafficField, type Flyer } from '../../core/menu/traffic';
import { createRng } from '../../core/rng';
import { BASE_WIDTH } from '../../core/version';
import { PAL } from '../../data/menuPalette';
import { TRAFFIC } from '../../data/menuScene';
import { PixelCanvas } from '../../core/pixelCanvas';
import { BLIMP_H, BLIMP_SCREEN, BLIMP_W, buildBlimp, buildFlyingCar } from './art/flyers';
import { buildTicker } from './art/holo';
import { DEPTH, type Animated } from './animated';
import { ensureTexture } from './canvasTexture';

const CAR_COLORS: readonly (readonly [number, number])[] = [
  [0x3a2a9a, PAL.magenta],
  [0x1f6a9a, PAL.cyan],
  [0x7a2a6a, PAL.amber]
];
const TICKER_TEXT = 'SUNSET DRONE TACOS - ENTREGA EN 3 MIN - ';

interface BlimpView {
  readonly body: Phaser.GameObjects.Image;
  readonly ticker: Phaser.GameObjects.Image;
  readonly left: boolean;
}

/** Coches voladores que cruzan el cielo y un dirigible con anuncio que pasa de vez en cuando. */
export function createFlyerLayer(scene: Phaser.Scene, reduceMotion: boolean): Animated {
  const field = new TrafficField(TRAFFIC, createRng(1234), BASE_WIDTH);
  field.prewarm(9500);

  for (let v = 0; v < CAR_VARIANTS; v++) {
    const [body, glow] = CAR_COLORS[v] ?? [0x3a2a9a, PAL.magenta];
    ensureTexture(scene, `nm-fly-${v}`, () => buildFlyingCar(body, glow));
  }
  ensureTexture(scene, 'nm-blimp-R', buildBlimp);
  ensureTexture(scene, 'nm-blimp-L', () => {
    const mirrored = new PixelCanvas(BLIMP_W, BLIMP_H);
    mirrored.blit(buildBlimp(), 0, 0, { flipX: true });
    return mirrored;
  });
  ensureTexture(scene, 'nm-ticker', () => buildTicker(TICKER_TEXT, PAL.amber));

  const cars = new Map<number, Phaser.GameObjects.Image>();
  const blimps = new Map<number, BlimpView>();

  const syncCar = (f: Flyer): void => {
    let img = cars.get(f.id);
    if (!img) {
      img = scene.add.image(0, 0, `nm-fly-${f.variant}`).setOrigin(0.5, 0.5).setDepth(DEPTH.flyers).setFlipX(f.vx < 0);
      img.setAlpha(0.5 + 0.5 * f.depth);
      cars.set(f.id, img);
    }
    img.setPosition(Math.round(f.x), f.y + Math.round(Math.sin(f.x / 23 + f.id) * 1.2));
  };

  const syncBlimp = (f: Flyer, timeMs: number): void => {
    let view = blimps.get(f.id);
    if (!view) {
      const left = f.vx < 0;
      const body = scene.add.image(0, 0, left ? 'nm-blimp-L' : 'nm-blimp-R').setOrigin(0.5, 0.5).setDepth(DEPTH.blimp);
      const ticker = scene.add.image(0, 0, 'nm-ticker').setOrigin(0, 0).setDepth(DEPTH.blimp + 0.1).setBlendMode(Phaser.BlendModes.ADD);
      view = { body, ticker, left };
      blimps.set(f.id, view);
    }
    const x = Math.round(f.x);
    const y = f.y + Math.round(Math.sin(timeMs / 1700) * 1.5);
    view.body.setPosition(x, y);
    const screenX = view.left ? BLIMP_W - (BLIMP_SCREEN.x + BLIMP_SCREEN.w) : BLIMP_SCREEN.x;
    const scroll = Math.floor(timeMs / 70) % view.ticker.width;
    view.ticker.setCrop(scroll, 0, BLIMP_SCREEN.w, 7);
    view.ticker.setPosition(x - BLIMP_W / 2 + screenX - scroll, y - BLIMP_H / 2 + BLIMP_SCREEN.y + 2);
  };

  return {
    update(timeMs, deltaMs) {
      if (!reduceMotion) field.update(deltaMs);
      const alive = new Set<number>();
      for (const f of field.flyers) {
        alive.add(f.id);
        if (f.kind === 'car') syncCar(f);
        else syncBlimp(f, timeMs);
      }
      for (const [id, img] of cars) {
        if (!alive.has(id)) {
          img.destroy();
          cars.delete(id);
        }
      }
      for (const [id, view] of blimps) {
        if (!alive.has(id)) {
          view.body.destroy();
          view.ticker.destroy();
          blimps.delete(id);
        }
      }
    }
  };
}

