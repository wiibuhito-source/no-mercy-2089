import { describe, expect, it } from 'vitest';
import { GLYPH_HEIGHT, GLYPH_WIDTH, PIXEL_FONT, measurePrefix, measureText, textPixels } from '../src/core/pixelFont';
import { drawPixelText, renderText, textSize } from '../src/core/pixelText';

describe('fuente de píxeles', () => {
  it('todos los glifos miden 5x7', () => {
    for (const [char, rows] of Object.entries(PIXEL_FONT)) {
      expect(`${char}:${rows.length}`).toBe(`${char}:${GLYPH_HEIGHT}`);
      for (const row of rows) expect(`${char}:${row.length}`).toBe(`${char}:${GLYPH_WIDTH}`);
    }
  });
  it('tiene el abecedario completo y los números', () => {
    for (const ch of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') expect(PIXEL_FONT[ch]).toBeDefined();
  });
  it('mide bien los textos del título', () => {
    expect(measureText('NO MERCY')).toEqual({ width: 45, height: 7 });
    expect(measureText('2089')).toEqual({ width: 23, height: 7 });
  });
  it('las vocales con tilde añaden una fila por encima', () => {
    expect(measureText('CAFÉ')).toEqual({ width: 23, height: 8 });
    const ys = textPixels('É').map((p) => p.y);
    expect(Math.min(...ys)).toBe(0);
    expect(Math.max(...ys)).toBe(7);
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
  it('escribe todos los textos del menú sin error', () => {
    for (const t of ['JUGAR', 'AJUSTES', 'SALIR', 'MENU PRINCIPAL', 'MIAMI NO PERDONA.', 'PROTOTIPO 0.0', '↑', '↓', 'ENTER', 'CAFÉ']) {
      expect(() => textPixels(t)).not.toThrow();
    }
  });
  it('un carácter sin glifo da error claro', () => {
    expect(() => textPixels('ñ')).toThrow();
  });
  it('mide cuánto ocupan los primeros caracteres (para la máquina de escribir)', () => {
    expect(measurePrefix('AB', 0)).toBe(0);
    expect(measurePrefix('AB', 1)).toBe(5);
    expect(measurePrefix('AB', 2)).toBe(11);
    expect(measurePrefix('AB', 99)).toBe(11);
  });
});

describe('texto sobre el lienzo', () => {
  it('el tamaño crece con la escala y la sombra', () => {
    expect(textSize('AB', 1)).toEqual({ width: 11, height: 7 });
    expect(textSize('AB', 2)).toEqual({ width: 22, height: 14 });
    expect(textSize('AB', 2, true)).toEqual({ width: 23, height: 15 });
  });
  it('renderText dibuja algo dentro del lienzo', () => {
    const c = renderText('OK', { color: 0xffffff });
    expect(c.width).toBe(11);
    expect(c.countOpaque()).toBeGreaterThan(10);
  });
  it('drawPixelText respeta la escala', () => {
    const c = renderText('I', { color: 0xffffff, scale: 2 });
    expect(c.width).toBe(10);
    expect(c.height).toBe(14);
    const small = renderText('I', { color: 0xffffff });
    expect(c.countOpaque()).toBe(small.countOpaque() * 4);
    void drawPixelText;
  });
});
