import { describe, expect, it } from 'vitest';
import { PixelCanvas } from '../src/core/pixelCanvas';
import { ADRIAN_H, ADRIAN_W, buildAdrian, composeAdrian } from '../src/game/menu/art/adrian';
import { CAR_H, CAR_W, buildCar } from '../src/game/menu/art/car';
import { CAT_FRAME_NAMES, CAT_H, CAT_W, buildCatFrame } from '../src/game/menu/art/cat';
import { buildFlyingCar, buildBlimp } from '../src/game/menu/art/flyers';
import { GANGSTER_H, GANGSTER_W, buildGangster } from '../src/game/menu/art/gangster';
import { buildGlowDisc, buildGlowFromMask } from '../src/game/menu/art/glow';
import { HOLO_ADS, buildHoloAd, buildTicker } from '../src/game/menu/art/holo';
import { buildNearScene } from '../src/game/menu/art/near';
import { buildNeonSign, buildVerticalNeon } from '../src/game/menu/art/neon';
import { buildFrond, buildTrunk } from '../src/game/menu/art/palm';
import { buildShineFrames } from '../src/game/menu/art/shine';
import { SUN_SIZE, buildCloud, buildSky, buildSun, twinkleStars } from '../src/game/menu/art/sky';
import { buildFarSkyline, buildMidSkyline } from '../src/game/menu/art/skyline';
import { buildTitle } from '../src/game/menu/art/title';
import { buildButton, buildButtonShape, buildKeycap, buildPanel } from '../src/game/menu/art/ui';
import { buildVignette } from '../src/game/menu/art/vignette';
import { PANEL } from '../src/data/menuLayout';

function expectDrawn(c: PixelCanvas): void {
  expect(c.countOpaque()).toBeGreaterThan(20);
}

describe('arte provisional del menú (dibujado por código)', () => {
  it('Adrián tiene cuatro capas del mismo tamaño y todas dibujan algo', () => {
    const layers = buildAdrian();
    for (const layer of [layers.torso, layers.lower, layers.arm, layers.head]) {
      expect(layer.width).toBe(ADRIAN_W);
      expect(layer.height).toBe(ADRIAN_H);
      expectDrawn(layer);
    }
    expectDrawn(composeAdrian(layers));
  });
  it('el coche mide lo que dice y tiene ruedas y carrocería', () => {
    const car = buildCar();
    expect([car.width, car.height]).toEqual([CAR_W, CAR_H]);
    expect(car.countOpaque()).toBeGreaterThan(4000);
  });
  it('el gato tiene sus cinco poses', () => {
    expect(CAT_FRAME_NAMES).toHaveLength(5);
    for (const name of CAT_FRAME_NAMES) {
      const f = buildCatFrame(name);
      expect([f.width, f.height]).toEqual([CAT_W, CAT_H]);
      expectDrawn(f);
    }
  });
  it('el pandillero, la palmera y los vehículos se dibujan', () => {
    const g = buildGangster();
    expect([g.body.width, g.body.height]).toEqual([GANGSTER_W, GANGSTER_H]);
    expectDrawn(g.body);
    expect(g.eye.countOpaque()).toBeGreaterThan(0);
    expectDrawn(buildTrunk(70));
    expectDrawn(buildFrond(-40, 0));
    expectDrawn(buildFlyingCar(0x3a2a9a, 0xff2bd6));
    expectDrawn(buildBlimp());
  });
  it('el cielo, el sol, las nubes y la ciudad se dibujan', () => {
    expect(buildSky(100, 100).countOpaque()).toBe(100 * 100);
    expect(buildSun().width).toBe(SUN_SIZE);
    expectDrawn(buildSun());
    expectDrawn(buildCloud(80, 10, 1));
    expect(twinkleStars(10, 480, 80)).toHaveLength(10);
    expectDrawn(buildFarSkyline(500, 200));
    const mid = buildMidSkyline(500, 200, 200);
    expectDrawn(mid.canvas);
    expect(mid.billboard.w).toBeGreaterThan(30);
    expect(mid.windows.length).toBeGreaterThan(20);
  });
  it('el primer plano cubre toda la pantalla de abajo y marca sus puntos de anclaje', () => {
    const near = buildNearScene();
    expect([near.canvas.width, near.canvas.height]).toEqual([480, 270]);
    expect(near.canvas.alphaAt(240, 265)).toBe(255);
    expect(near.anchors.puddles.length).toBeGreaterThan(1);
  });
  it('los carteles de neón tienen versión encendida, apagada y resplandor', () => {
    for (const sign of [buildNeonSign('CAFÉ', 0x19f3ff, 2), buildVerticalNeon('HOTEL', 0xff2bd6)]) {
      expectDrawn(sign.on);
      expectDrawn(sign.off);
      expect(sign.glow.width).toBeGreaterThan(sign.on.width);
    }
  });
  it('el resplandor y el destello se calculan', () => {
    expectDrawn(buildGlowDisc(10, 0xff00ff));
    const mask = new PixelCanvas(10, 10);
    mask.fillRect(2, 2, 6, 6, 0xffffff);
    expect(buildGlowFromMask(mask, 0xff00ff, [{ radius: 2, alpha: 0.3 }], 3).width).toBe(16);
    const frames = buildShineFrames(mask, 6, 4);
    expect(frames).toHaveLength(6);
    expect(frames.some((f) => f.countOpaque() > 0)).toBe(true);
    for (const f of frames) expect(f.countOpaque()).toBeLessThanOrEqual(36);
  });
  it('el título y la interfaz se dibujan', () => {
    const title = buildTitle();
    expect(title.canvas.width).toBeLessThan(480);
    expect(title.canvas.height).toBeLessThan(130);
    expectDrawn(title.canvas);
    const panel = buildPanel();
    expect([panel.width, panel.height]).toEqual([PANEL.w, PANEL.h]);
    for (const selected of [true, false]) {
      expectDrawn(buildButton('AJUSTES', 'gear', selected));
      expectDrawn(buildButton('JUGAR', 'play', selected));
      expectDrawn(buildButton('SALIR', 'power', selected));
    }
    expectDrawn(buildButtonShape());
    expect(buildKeycap('ENTER').width).toBeGreaterThan(buildKeycap('↑').width);
  });
  it('los anuncios holográficos caben en la valla y los textos se pueden escribir', () => {
    for (const ad of HOLO_ADS) expectDrawn(buildHoloAd(ad, 62, 32));
    expect(buildTicker('HOLA', 0xffffff).width).toBeGreaterThan(20);
  });
  it('la viñeta oscurece más las esquinas que el centro', () => {
    const v = buildVignette(480, 270);
    expect(v.alphaAt(240, 135)).toBe(0);
    expect(v.alphaAt(0, 0)).toBeGreaterThan(40);
  });
});
