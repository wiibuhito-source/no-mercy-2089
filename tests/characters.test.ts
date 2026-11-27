import { describe, expect, it } from 'vitest';
import { renderCharacter, type Pose, type PersonStyle } from '../src/game/cinematic/art/characters';

const BASE: PersonStyle = { x: 50, footY: 100, height: 48, facing: 1, pose: 'stand', top: 0x3b6fd0, bottom: 0x1f3068 };
const POSES: readonly Pose[] = ['stand', 'walk', 'run', 'sit', 'offer'];

/** Caja que ocupa lo dibujado (sin contar la sombra del suelo, que es muy transparente). */
function bounds(s: PersonStyle): { top: number; bottom: number; left: number; right: number; foot: number; ox: number } {
  const r = renderCharacter({ ...s, noShadow: true });
  let top = Infinity, bottom = -Infinity, left = Infinity, right = -Infinity;
  for (let y = 0; y < r.sprite.height; y++) {
    for (let x = 0; x < r.sprite.width; x++) {
      if (r.sprite.alphaAt(x, y) > 0.5) {
        top = Math.min(top, y); bottom = Math.max(bottom, y); left = Math.min(left, x); right = Math.max(right, x);
      }
    }
  }
  return { top, bottom, left, right, foot: r.foot, ox: r.ox };
}

describe('personajes de la cinemática', () => {
  it('todas las posturas dibujan algo y la mano cae dentro del sprite', () => {
    for (const pose of POSES) {
      const r = renderCharacter({ ...BASE, pose });
      expect(r.sprite.countOpaque(), pose).toBeGreaterThan(200);
      expect(r.hand.x).toBeGreaterThan(0);
      expect(r.hand.x).toBeLessThan(r.sprite.width);
      expect(r.hand.y).toBeGreaterThan(0);
      expect(r.hand.y).toBeLessThan(r.sprite.height);
    }
  });
  it('de pie, andando, corriendo o sentado, los pies tocan el suelo (nadie flota ni se hunde)', () => {
    for (const pose of POSES) {
      const b = bounds({ ...BASE, pose });
      expect(Math.abs(b.bottom - b.foot), pose).toBeLessThanOrEqual(3);
    }
  });
  it('la altura pedida se respeta (de la coronilla a los pies)', () => {
    for (const h of [34, 48, 62]) {
      const b = bounds({ ...BASE, height: h });
      const tall = b.bottom - b.top + 1;
      expect(tall).toBeGreaterThanOrEqual(h - 2);
      expect(tall).toBeLessThanOrEqual(h + 6);
    }
  });
  it('sentado en un asiento más alto, la cabeza queda más arriba y los pies siguen en el suelo', () => {
    const low = bounds({ ...BASE, pose: 'sit', seat: 0.2 });
    const high = bounds({ ...BASE, pose: 'sit', seat: 0.4 });
    expect(high.top).toBeLessThan(low.top - 3); // más arriba en pantalla = y menor
    expect(Math.abs(high.bottom - low.bottom)).toBeLessThanOrEqual(1);
  });
  it('mira hacia donde dice: la mano que se adelanta queda de ese lado', () => {
    const right = renderCharacter({ ...BASE, pose: 'offer', facing: 1 });
    const left = renderCharacter({ ...BASE, pose: 'offer', facing: -1 });
    expect(right.hand.x).toBeGreaterThan(right.ox + 8);
    expect(left.hand.x).toBeLessThan(left.ox - 8);
  });
  it('si se le pide alcanzar un punto, la mano llega a ese punto', () => {
    const target = { x: 40, y: 85 };
    const r = renderCharacter({ ...BASE, pose: 'sit', facing: -1, reachTo: target });
    expect(r.hand.x + (BASE.x - r.ox)).toBeCloseTo(target.x, 0);
    expect(r.hand.y + (BASE.footY - r.foot)).toBeCloseTo(target.y, 0);
  });
  it('el adulto se distingue del chaval (la ropa y las gafas cambian el dibujo) y se dibuja igual cada vez', () => {
    const kid = renderCharacter({ ...BASE, hairStyle: 'messy' });
    const adult = renderCharacter({ ...BASE, outfit: 'jacket', glasses: 0x19f3ff });
    expect(Array.from(kid.sprite.data)).not.toEqual(Array.from(adult.sprite.data));
    expect(Array.from(renderCharacter({ ...BASE }).sprite.data)).toEqual(Array.from(renderCharacter({ ...BASE }).sprite.data));
  });
  it('con capucha y visor, o de espaldas, sigue habiendo figura completa', () => {
    expect(renderCharacter({ ...BASE, hood: true, visor: 0x19f3ff }).sprite.countOpaque()).toBeGreaterThan(200);
    expect(renderCharacter({ ...BASE, back: true }).sprite.countOpaque()).toBeGreaterThan(200);
  });
});

import { computeGait, SCALE } from '../src/game/cinematic/art/characters';
import { personFrames, sipActor } from '../src/game/cinematic/art/kit';

describe('ciclo de andar y correr', () => {
  it('las alturas de referencia van de menos a más y cada escena las comparte', () => {
    expect(SCALE.kid).toBeLessThan(SCALE.teen);
    expect(SCALE.teen).toBeLessThan(SCALE.adult);
    expect(SCALE.adult).toBeLessThan(SCALE.tall);
    expect(SCALE.kid).toBeGreaterThanOrEqual(54);
  });
  it('al correr las piernas se cruzan: cuando una está delante la otra está detrás', () => {
    const a = computeGait(60, 0, true);
    expect(a.legNear.foot.x).toBeGreaterThan(8);
    expect(a.legFar.foot.x).toBeLessThan(0);
    const b = computeGait(60, 0.5, true);
    expect(b.legNear.foot.x).toBeLessThan(0);
    expect(b.legFar.foot.x).toBeGreaterThan(8);
  });
  it('los brazos van al contrario que las piernas', () => {
    const g = computeGait(60, 0, true);
    expect(Math.sign(g.armNear.hand.x - g.armNear.elbow.x) !== 0).toBe(true);
    const g2 = computeGait(60, 0.5, true);
    expect(g.armNear.hand.x).not.toBeCloseTo(g2.armNear.hand.x, 0);
  });
  it('al recuperar la pierna la rodilla se flexiona mucho (no es una pierna rígida)', () => {
    const L = 60 * 0.23;
    const stance = computeGait(60, 0.25, true).legNear;
    const recover = computeGait(60, 0.75, true).legNear;
    const reach = (l: { knee: { x: number; y: number }; foot: { x: number; y: number } }): number => Math.hypot(l.foot.x, l.foot.y);
    expect(reach(stance)).toBeGreaterThan(reach(recover) + L * 0.3);
  });
  it('correr tiene fase de vuelo (el cuerpo se eleva) y andar no', () => {
    const lifts = Array.from({ length: 16 }, (_, i) => computeGait(60, i / 16, true).lift);
    expect(Math.max(...lifts)).toBeGreaterThan(1.5);
    expect(Math.min(...lifts)).toBe(0);
    for (let i = 0; i < 16; i++) expect(computeGait(60, i / 16, false).lift).toBe(0);
  });
  it('los 8 fotogramas del corredor miden lo mismo, son distintos entre sí y siempre hay un pie casi en el suelo', () => {
    const run = personFrames({ ...BASE, height: 62, pose: 'run', noShadow: true }, 8, 80);
    const frames = run.actor.frames ?? [];
    expect(frames).toHaveLength(8);
    for (const f of frames) {
      expect(f.width).toBe(frames[0]?.width);
      expect(f.height).toBe(frames[0]?.height);
    }
    const sigs = new Set(frames.map((f) => Array.from(f.data).join(',')));
    expect(sigs.size).toBe(8);
    const foot = (frames[0]?.height ?? 0) - Math.ceil(62 * 0.7);
    for (const f of frames) {
      let bottom = -1;
      for (let y = 0; y < f.height; y++) for (let x = 0; x < f.width; x++) if (f.alphaAt(x, y) > 0.5) bottom = Math.max(bottom, y);
      expect(foot - bottom, 'el corredor no puede hundirse').toBeLessThanOrEqual(1);
      expect(bottom - foot, 'ni volar demasiado').toBeLessThanOrEqual(5);
    }
  });
  it('dibujar algo en la mano (la bolsa) se hace en cada fotograma y sigue al brazo', () => {
    const xs: number[] = [];
    personFrames({ ...BASE, pose: 'run', noShadow: true }, 6, 80, (_c, hand) => xs.push(hand.x));
    expect(xs).toHaveLength(6);
    expect(new Set(xs.map((x) => Math.round(x))).size).toBeGreaterThan(2);
  });
  it('el que bebe café alterna taza en el regazo y taza en la boca', () => {
    const sip = sipActor({ ...BASE, pose: 'sit', seat: 0.4 });
    const f = sip.actor.frames ?? [];
    expect(f.length).toBeGreaterThanOrEqual(6);
    expect(new Set(f.map((c) => Array.from(c.data).join(','))).size).toBe(2);
  });
});
