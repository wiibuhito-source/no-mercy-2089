import { describe, expect, it } from 'vitest';
import { lerpColor } from '../src/core/color';

describe('mezcla de colores', () => {
  it('t=0 y t=1 devuelven los extremos', () => {
    expect(lerpColor(0xff0000, 0x0000ff, 0)).toBe(0xff0000);
    expect(lerpColor(0xff0000, 0x0000ff, 1)).toBe(0x0000ff);
  });
  it('a la mitad mezcla cada canal', () => {
    expect(lerpColor(0x000000, 0xffffff, 0.5)).toBe(0x808080);
  });
  it('limita t entre 0 y 1', () => {
    expect(lerpColor(0x102030, 0x405060, -3)).toBe(0x102030);
    expect(lerpColor(0x102030, 0x405060, 9)).toBe(0x405060);
  });
});
