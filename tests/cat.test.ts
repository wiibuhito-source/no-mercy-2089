import { describe, expect, it } from 'vitest';
import { buildCatFrames, CAT_H, CAT_W } from '../src/game/cinematic/art/cat';

describe('el gato del taller', () => {
  const frames = buildCatFrames();
  it('tiene ocho fotogramas del mismo tamaño y con dibujo', () => {
    expect(frames).toHaveLength(8);
    for (const f of frames) {
      expect(f.width).toBe(CAT_W);
      expect(f.height).toBe(CAT_H);
      expect(f.countOpaque()).toBeGreaterThan(600);
    }
  });
  it('está vivo: respira, mueve la cola y la oreja y abre un ojo (los fotogramas no son iguales)', () => {
    const sig = (i: number): string => Array.from(frames[i]?.data ?? []).join(',');
    expect(sig(0)).not.toBe(sig(1)); // respiración
    expect(sig(2)).not.toBe(sig(3)); // cola
    expect(sig(4)).not.toBe(sig(5)); // oreja
    expect(sig(6)).not.toBe(sig(7)); // ojo
    expect(new Set(frames.map((_, i) => sig(i))).size).toBeGreaterThanOrEqual(7);
  });
  it('se dibuja igual cada vez', () => {
    const again = buildCatFrames();
    frames.forEach((f, i) => expect(Array.from(f.data)).toEqual(Array.from(again[i]?.data ?? [])));
  });
  it('tiene el naranja del pelaje y el rosa de la nariz', () => {
    const f = frames[0];
    if (!f) throw new Error('sin fotograma');
    let orange = 0, pink = 0;
    for (let y = 0; y < f.height; y++) for (let x = 0; x < f.width; x++) {
      if (f.alphaAt(x, y) < 0.5) continue;
      const c = f.colorAt(x, y);
      const r = (c >> 16) & 255, g = (c >> 8) & 255, b = c & 255;
      if (r > 200 && g > 100 && g < 170 && b < 90) orange++;
      if (r > 230 && g > 120 && g < 170 && b > 140) pink++;
    }
    expect(orange).toBeGreaterThan(150);
    expect(pink).toBeGreaterThan(2);
  });
});
