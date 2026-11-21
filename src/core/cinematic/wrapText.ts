// Reparto de un texto en líneas con la fuente de píxeles (lógica pura, sin Phaser).
import { measureText } from '../pixelFont';

/** Parte `text` en líneas que no pasen de `maxWidth` píxeles (a la escala dada). Una palabra más larga que la línea se queda sola. */
export function wrapText(text: string, maxWidth: number, scale = 1): string[] {
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current === '' ? word : `${current} ${word}`;
    if (current !== '' && measureText(candidate).width * scale > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current !== '') lines.push(current);
  return lines;
}

/**
 * Las líneas con solo las primeras `count` letras visibles. Cada salto de línea se come una letra
 * (el espacio que había entre palabras), así el recuento coincide con el del texto original.
 */
export function revealWrapped(lines: readonly string[], count: number): string[] {
  let left = Math.max(0, count);
  return lines.map((line) => {
    const chars = Array.from(line);
    const shown = chars.slice(0, left).join('');
    left = Math.max(0, left - chars.length - 1);
    return shown;
  });
}

/**
 * Cuántos píxeles hay que bajar una línea a medio escribir para que no "salte" cuando aparece la primera
 * vocal con tilde (la fuente reserva una fila extra arriba solo si el texto lleva alguna).
 */
export function baselineOffset(fullLine: string, partialLine: string): number {
  return measureText(fullLine).height - measureText(partialLine).height;
}
