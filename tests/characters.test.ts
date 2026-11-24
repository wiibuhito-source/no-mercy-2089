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
