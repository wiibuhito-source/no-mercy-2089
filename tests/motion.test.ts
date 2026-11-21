import { describe, expect, it } from 'vitest';
import { approach, arcPosition, breath, parallaxOffset, randomBetween, typedChars } from '../src/core/menu/motion';

describe('movimientos del menú', () => {
  it('la respiración va de 0 a 1 y vuelve a empezar', () => {
    expect(breath(0, 1000)).toBe(0);
    expect(breath(400, 1000)).toBeCloseTo(1, 5);
    expect(breath(1000, 1000)).toBeCloseTo(0, 5);
    for (let t = 0; t < 3000; t += 37) {
      expect(breath(t, 1000)).toBeGreaterThanOrEqual(0);
      expect(breath(t, 1000)).toBeLessThanOrEqual(1);
    }
  });
  it('inhalar es más rápido que exhalar', () => {
    expect(breath(200, 1000)).toBeCloseTo(0.5, 5);
    expect(breath(700, 1000)).toBeCloseTo(0.5, 5);
    expect(breath(300, 1000)).toBeGreaterThan(breath(500, 1000) - 0.2);
  });
  it('el salto empieza y acaba en los puntos pedidos y sube en medio', () => {
    const a = { x: 0, y: 10 };
    const b = { x: 20, y: 10 };
    expect(arcPosition(a, b, 0, 8)).toEqual(a);
    expect(arcPosition(a, b, 1, 8)).toEqual(b);
    const mid = arcPosition(a, b, 0.5, 8);
    expect(mid.x).toBe(10);
    expect(mid.y).toBeCloseTo(2, 5);
  });
  it('el parallax es proporcional y no se pasa del máximo', () => {
    expect(parallaxOffset(0, 0.5, 8)).toBe(0);
    expect(parallaxOffset(1, 0.5, 8)).toBe(4);
    expect(parallaxOffset(-1, 1, 8)).toBe(-8);
    expect(parallaxOffset(5, 1, 8)).toBe(8);
  });
  it('approach se acerca sin pasarse', () => {
    expect(approach(0, 10, 0.5)).toBe(5);
    expect(approach(0, 10, 2)).toBe(10);
    expect(approach(10, 0, 0)).toBe(10);
  });
  it('la máquina de escribir no pasa del total', () => {
    expect(typedChars(0, 30, 10)).toBe(0);
    expect(typedChars(95, 30, 10)).toBe(3);
    expect(typedChars(5000, 30, 10)).toBe(10);
    expect(typedChars(100, 0, 10)).toBe(10);
  });
  it('randomBetween queda dentro del rango', () => {
    expect(randomBetween(() => 0, [5, 9])).toBe(5);
    expect(randomBetween(() => 0.5, [5, 9])).toBe(7);
  });
});
