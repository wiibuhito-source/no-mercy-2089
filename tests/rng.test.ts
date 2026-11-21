import { describe, expect, it } from 'vitest';
import { createRng } from '../src/core/rng';

describe('generador con semilla', () => {
  it('con la misma semilla da la misma secuencia', () => {
    const a = createRng(2089);
    const b = createRng(2089);
    for (let i = 0; i < 20; i++) expect(a()).toBe(b());
  });
  it('con otra semilla da otra secuencia', () => {
    expect(createRng(1)()).not.toBe(createRng(2)());
  });
  it('siempre devuelve valores entre 0 y 1 (sin incluir el 1)', () => {
    const r = createRng(7);
    for (let i = 0; i < 500; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});
