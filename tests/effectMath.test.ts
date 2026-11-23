import { describe, expect, it } from 'vitest';
import { flickerLevel, lightningLevel, nextGapMs, particleAlpha, stepParticle, type Particle } from '../src/core/cinematic/effectMath';
import { createRng } from '../src/core/rng';

const mk = (over: Partial<Particle> = {}): Particle => ({ x: 0, y: 0, vx: 10, vy: -20, gravity: 0, life: 1000, maxLife: 1000, size: 1, ...over });

describe('partículas', () => {
  it('se mueven según su velocidad', () => {
    const p = mk();
    expect(stepParticle(p, 500)).toBe(true);
    expect(p.x).toBeCloseTo(5);
    expect(p.y).toBeCloseTo(-10);
  });
  it('la gravedad las acelera hacia abajo (chispas) o hacia arriba (humo)', () => {
    const fall = mk({ vy: 0, gravity: 100, life: 5000, maxLife: 5000 });
    stepParticle(fall, 1000);
    expect(fall.vy).toBeGreaterThan(0);
    const rise = mk({ vy: 0, gravity: -100, life: 5000, maxLife: 5000 });
    stepParticle(rise, 1000);
    expect(rise.vy).toBeLessThan(0);
  });
  it('mueren cuando se acaba su vida', () => {
    const p = mk({ life: 300 });
    expect(stepParticle(p, 200)).toBe(true);
    expect(stepParticle(p, 200)).toBe(false);
  });
  it('aparecen rápido, se apagan despacio y nunca se salen de 0 a 1', () => {
    const born = particleAlpha(mk({ life: 1000 }), 0.6);
    const mid = particleAlpha(mk({ life: 600 }), 0.6);
    const dying = particleAlpha(mk({ life: 50 }), 0.6);
    expect(born).toBe(0);
    expect(mid).toBeCloseTo(0.6);
    expect(dying).toBeGreaterThan(0);
    expect(dying).toBeLessThan(mid);
    for (const life of [0, 10, 300, 999, 1000]) {
      const a = particleAlpha(mk({ life }), 0.9);
      expect(a).toBeGreaterThanOrEqual(0);
      expect(a).toBeLessThanOrEqual(1);
    }
  });
});

describe('rayos y parpadeos', () => {
  it('el rayo hace un doble destello y se apaga', () => {
    expect(lightningLevel(0)).toBe(1);
    expect(lightningLevel(100)).toBeLessThan(0.3);
    expect(lightningLevel(160)).toBeGreaterThan(0.5);
    expect(lightningLevel(500)).toBe(0);
  });
  it('el tiempo entre rayos cae dentro del rango', () => {
    const rnd = createRng(5);
    for (let i = 0; i < 50; i++) {
      const g = nextGapMs(rnd, 9000, 15000);
      expect(g).toBeGreaterThanOrEqual(9000);
      expect(g).toBeLessThanOrEqual(15000);
    }
  });
  it('el neón estropeado está casi siempre encendido pero a veces se cae', () => {
    const rnd = createRng(1);
    const levels = Array.from({ length: 400 }, () => flickerLevel(rnd));
    for (const l of levels) {
      expect(l).toBeGreaterThanOrEqual(0.1);
      expect(l).toBeLessThanOrEqual(1);
    }
    expect(levels.filter((l) => l === 1).length).toBeGreaterThan(160);
    expect(levels.filter((l) => l < 0.3).length).toBeGreaterThan(10);
  });
});
