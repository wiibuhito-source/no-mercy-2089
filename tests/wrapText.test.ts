import { describe, expect, it } from 'vitest';
import { baselineOffset, revealWrapped, wrapText } from '../src/core/cinematic/wrapText';
import { measureText } from '../src/core/pixelFont';

describe('reparto de texto en líneas', () => {
  it('ninguna línea pasa del ancho y no se pierde ninguna palabra', () => {
    const text = 'MI MADRE LIMPIABA TORRES EN DOWNTOWN, DE NOCHE. DE MI PADRE, MEJOR NO HABLAMOS.';
    const lines = wrapText(text, 200);
    expect(lines.length).toBeGreaterThan(1);
    for (const l of lines) expect(measureText(l).width).toBeLessThanOrEqual(200);
    expect(lines.join(' ')).toBe(text);
  });
  it('un texto corto cabe en una sola línea', () => {
    expect(wrapText('HOLA MUNDO', 400)).toEqual(['HOLA MUNDO']);
  });
  it('tiene en cuenta la escala', () => {
    expect(wrapText('AAAA BBBB', 60, 1)).toEqual(['AAAA BBBB']);
    expect(wrapText('AAAA BBBB', 60, 2)).toEqual(['AAAA', 'BBBB']);
  });
  it('una palabra más larga que la línea se queda sola en vez de perderse', () => {
    expect(wrapText('ANTICONSTITUCIONALMENTE YA', 50)).toEqual(['ANTICONSTITUCIONALMENTE', 'YA']);
  });
  it('revela solo las primeras letras, contando el espacio de cada salto de línea', () => {
    const lines = ['AB CD', 'EF'];
    expect(revealWrapped(lines, 0)).toEqual(['', '']);
    expect(revealWrapped(lines, 3)).toEqual(['AB ', '']);
    expect(revealWrapped(lines, 5)).toEqual(['AB CD', '']);
    expect(revealWrapped(lines, 6)).toEqual(['AB CD', '']); // el salto se come una letra
    expect(revealWrapped(lines, 7)).toEqual(['AB CD', 'E']);
    expect(revealWrapped(lines, 99)).toEqual(['AB CD', 'EF']);
  });
  it('una línea a medio escribir no salta de altura cuando aparece la primera tilde', () => {
    expect(baselineOffset('AÑOS', 'A')).toBe(1);
    expect(baselineOffset('AÑOS', 'AÑ')).toBe(0);
    expect(baselineOffset('ASI', 'AS')).toBe(0);
  });
});
