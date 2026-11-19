// Fuente de píxeles 5x7 para el título del juego (lógica pura, sin Phaser).
// Cada glifo son 7 filas de 5 columnas: "X" = píxel encendido.
export const GLYPH_WIDTH = 5;
export const GLYPH_HEIGHT = 7;
const SPACE_WIDTH = 3;

export const PIXEL_FONT: Readonly<Record<string, readonly string[]>> = {
  N: ['X...X', 'XX..X', 'X.X.X', 'X..XX', 'X...X', 'X...X', 'X...X'],
  O: ['.XXX.', 'X...X', 'X...X', 'X...X', 'X...X', 'X...X', '.XXX.'],
  M: ['X...X', 'XX.XX', 'X.X.X', 'X.X.X', 'X...X', 'X...X', 'X...X'],
  E: ['XXXXX', 'X....', 'X....', 'XXXX.', 'X....', 'X....', 'XXXXX'],
  R: ['XXXX.', 'X...X', 'X...X', 'XXXX.', 'X.X..', 'X..X.', 'X...X'],
  C: ['.XXX.', 'X...X', 'X....', 'X....', 'X....', 'X...X', '.XXX.'],
  Y: ['X...X', 'X...X', '.X.X.', '..X..', '..X..', '..X..', '..X..'],
  '2': ['.XXX.', 'X...X', '....X', '...X.', '..X..', '.X...', 'XXXXX'],
  '0': ['.XXX.', 'X...X', 'X..XX', 'X.X.X', 'XX..X', 'X...X', '.XXX.'],
  '8': ['.XXX.', 'X...X', 'X...X', '.XXX.', 'X...X', 'X...X', '.XXX.'],
  '9': ['.XXX.', 'X...X', 'X...X', '.XXXX', '....X', 'X...X', '.XXX.']
};

export interface FontPixel {
  x: number;
  y: number;
}

/** Tamaño del texto en "píxeles de fuente" (1 espacio entre letras). */
export function measureText(text: string): { width: number; height: number } {
  let width = 0;
  let first = true;
  for (const ch of text) {
    if (!first) width += 1;
    first = false;
    width += ch === ' ' ? SPACE_WIDTH : GLYPH_WIDTH;
  }
  return { width, height: GLYPH_HEIGHT };
}

/** Lista de píxeles encendidos para dibujar el texto. */
export function textPixels(text: string): FontPixel[] {
  const pixels: FontPixel[] = [];
  let cursor = 0;
  let first = true;
  for (const ch of text) {
    if (!first) cursor += 1;
    first = false;
    if (ch === ' ') {
      cursor += SPACE_WIDTH;
      continue;
    }
    const glyph = PIXEL_FONT[ch];
    if (!glyph) throw new Error(`Carácter sin glifo en la fuente de píxeles: "${ch}"`);
    glyph.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        if (row[x] === 'X') pixels.push({ x: cursor + x, y });
      }
    });
    cursor += GLYPH_WIDTH;
  }
  return pixels;
}
