import { describe, expect, it } from 'vitest';
import { TrafficField } from '../src/core/menu/traffic';
import { createRng } from '../src/core/rng';
import { TRAFFIC } from '../src/data/menuScene';

describe('tráfico aéreo del menú', () => {
  it('crea coches con el tiempo, dentro de sus carriles y velocidades', () => {
    const field = new TrafficField(TRAFFIC, createRng(7), 480);
    field.update(16);
    expect(field.flyers.length).toBe(1);
    const car = field.flyers[0];
    expect(car?.kind).toBe('car');
    const lane = TRAFFIC.lanes.find((l) => l.y === car?.y);
    expect(lane).toBeDefined();
    const speed = Math.abs(car?.vx ?? 0);
    expect(speed).toBeGreaterThanOrEqual(lane?.speedPxPerSec[0] ?? 0);
    expect(speed).toBeLessThanOrEqual(lane?.speedPxPerSec[1] ?? 0);
  });
  it('los coches entran por un lado y avanzan hacia el otro', () => {
    for (let seed = 1; seed < 20; seed++) {
      const field = new TrafficField(TRAFFIC, createRng(seed), 480);
      field.update(16);
      const car = field.flyers[0];
      if (!car) throw new Error('debería haber un coche');
      if (car.vx > 0) expect(car.x).toBeLessThan(0);
      else expect(car.x).toBeGreaterThan(480);
    }
  });
  it('elimina los que salen de la pantalla', () => {
    const field = new TrafficField({ ...TRAFFIC, spawnEveryMs: [1e9, 1e9], blimpEveryMs: [1e9, 1e9] }, createRng(2), 480, 1e9);
    field.update(1); // crea el primer coche (el temporizador empieza en 0)
    expect(field.flyers.length).toBe(1);
    field.update(60000);
    expect(field.flyers.length).toBe(0);
  });
  it('precalentar llena el cielo y no se acumulan coches sin límite', () => {
    const field = new TrafficField(TRAFFIC, createRng(5), 480);
    field.prewarm(8000);
    expect(field.flyers.length).toBeGreaterThan(0);
    for (let i = 0; i < 2000; i++) field.update(100);
    expect(field.flyers.length).toBeLessThan(15);
  });
  it('sale como mucho un dirigible a la vez', () => {
    const field = new TrafficField({ ...TRAFFIC, blimpEveryMs: [100, 200] }, createRng(3), 480, 100);
    let maxBlimps = 0;
    for (let i = 0; i < 4000; i++) {
      field.update(50);
      maxBlimps = Math.max(maxBlimps, field.flyers.filter((f) => f.kind === 'blimp').length);
    }
    expect(maxBlimps).toBe(1);
  });
  it('es determinista con la misma semilla', () => {
    const a = new TrafficField(TRAFFIC, createRng(8), 480);
    const b = new TrafficField(TRAFFIC, createRng(8), 480);
    a.prewarm(10000);
    b.prewarm(10000);
    expect(a.flyers).toEqual(b.flyers);
  });
});
