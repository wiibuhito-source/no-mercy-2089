import { describe, expect, it } from 'vitest';
import { PixelCanvas, bayer, colorAtStops } from '../src/core/pixelCanvas';

describe('lienzo de píxeles', () => {
  it('empieza transparente y pinta un píxel', () => {
    const c = new PixelCanvas(4, 4);
    expect(c.countOpaque()).toBe(0);
    c.setPixel(1, 2, 0xff0000);
    expect(c.alphaAt(1, 2)).toBe(255);
    expect(c.colorAt(1, 2)).toBe(0xff0000);
  });
  it('ignora lo que cae fuera del lienzo', () => {
    const c = new PixelCanvas(3, 3);
    c.setPixel(-1, 0, 0xffffff);
    c.setPixel(3, 3, 0xffffff);
    c.fillRect(-5, -5, 20, 20, 0x00ff00);
    expect(c.countOpaque()).toBe(9);
  });
  it('mezcla colores con transparencia', () => {
    const c = new PixelCanvas(1, 1);
    c.setPixel(0, 0, 0x000000);
    c.setPixel(0, 0, 0xffffff, 0.5);
    expect(c.colorAt(0, 0)).toBeGreaterThan(0x7e7e7e);
    expect(c.colorAt(0, 0)).toBeLessThan(0x818181);
  });
  it('rellena un rectángulo del tamaño pedido', () => {
    const c = new PixelCanvas(10, 10);
    c.fillRect(2, 3, 4, 2, 0xffffff);
    expect(c.countOpaque()).toBe(8);
  });
  it('un polígono triangular tiene aproximadamente la mitad de su caja', () => {
    const c = new PixelCanvas(20, 20);
    c.fillPolygon([{ x: 0, y: 0 }, { x: 20, y: 0 }, { x: 0, y: 20 }], 0xffffff);
    expect(c.countOpaque()).toBeGreaterThan(180);
    expect(c.countOpaque()).toBeLessThan(220);
  });
  it('un círculo cabe en su caja', () => {
    const c = new PixelCanvas(21, 21);
    c.fillCircle(10.5, 10.5, 8, 0xffffff);
    expect(c.alphaAt(10, 10)).toBe(255);
    expect(c.alphaAt(0, 0)).toBe(0);
    expect(c.countOpaque()).toBeGreaterThan(190);
  });
  it('dibuja una línea recta y conecta los extremos', () => {
    const c = new PixelCanvas(10, 10);
    c.line(0, 0, 9, 9, 0xffffff);
    expect(c.alphaAt(0, 0)).toBe(255);
    expect(c.alphaAt(9, 9)).toBe(255);
    expect(c.countOpaque()).toBe(10);
  });
  it('dibuja sprites hechos de texto y avisa si falta un color', () => {
    const c = new PixelCanvas(3, 2);
    c.drawRows(['X.X', '.X.'], { X: 0xff00ff }, 0, 0);
    expect(c.countOpaque()).toBe(3);
    expect(() => c.drawRows(['Z'], {}, 0, 0)).toThrow();
  });
  it('copia un lienzo sobre otro, también volteado', () => {
    const src = new PixelCanvas(3, 1);
    src.setPixel(0, 0, 0xff0000);
    const dst = new PixelCanvas(3, 1);
    dst.blit(src, 0, 0, { flipX: true });
    expect(dst.alphaAt(2, 0)).toBe(255);
    expect(dst.alphaAt(0, 0)).toBe(0);
  });
  it('el contorno rodea la figura sin tocar su interior', () => {
    const c = new PixelCanvas(5, 5);
    c.setPixel(2, 2, 0xffffff);
    c.outline(0x000000);
    expect(c.countOpaque()).toBe(5);
    expect(c.colorAt(2, 2)).toBe(0xffffff);
    expect(c.colorAt(2, 1)).toBe(0x000000);
  });
  it('el degradado vertical va del primer al último color', () => {
    const c = new PixelCanvas(8, 40);
    c.fillGradientV(0, 0, 8, 40, [{ at: 0, color: 0x000000 }, { at: 1, color: 0xffffff }], 10);
    expect(c.colorAt(0, 0)).toBeLessThan(0x202020);
    expect(c.colorAt(0, 39)).toBeGreaterThan(0xdfdfdf);
  });
  it('colorAtStops interpola entre paradas', () => {
    const stops = [{ at: 0, color: 0x000000 }, { at: 1, color: 0x0000ff }];
    expect(colorAtStops(stops, 0)).toBe(0);
    expect(colorAtStops(stops, 1)).toBe(0x0000ff);
    expect(colorAtStops(stops, 0.5) & 0xff).toBeGreaterThan(120);
  });
  it('el umbral de tramado está siempre entre 0 y 1', () => {
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) expect(bayer(x, y)).toBeGreaterThan(0);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) expect(bayer(x, y)).toBeLessThan(1);
  });
});
