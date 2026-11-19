import { describe, expect, it } from 'vitest';
import { GLYPH_HEIGHT, GLYPH_WIDTH, PIXEL_FONT, measureText, textPixels } from '../src/core/pixelFont';

describe('fuente de píxeles del título', () => {
  it('todos los glifos miden 5x7', () => {
    for (const [char, rows] of Object.entries(PIXEL_FONT)) {
      expect(`${char}:${rows.length}`).toBe(`${char}:${GLYPH_HEIGHT}`);
      for (const row of rows) expect(`${char}:${row.length}`).toBe(`${char}:${GLYPH_WIDTH}`);
    }
  });
  it('mide bien los textos del título', () => {
    expect(measureText('NO MERCY')).toEqual({ width: 45, height: 7 });
    expect(measureText('2089')).toEqual({ width: 23, height: 7 });
  });
  it('dibuja dentro de su caja y no está vacío', () => {
    const { width, height } = measureText('NO MERCY');
    const pixels = textPixels('NO MERCY');
    expect(pixels.length).toBeGreaterThan(0);
    for (const p of pixels) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThan(width);
      expect(p.y).toBeLessThan(height);
    }
  });
  it('tiene todas las letras de NO MERCY 2089', () => {
    expect(() => textPixels('NO MERCY 2089')).not.toThrow();
  });
  it('un carácter sin glifo da error claro', () => {
    expect(() => textPixels('ñ')).toThrow();
  });
});
