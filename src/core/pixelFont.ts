// Fuente de píxeles 5x7 (lógica pura, sin Phaser). Se usa en el título, el menú y los carteles.
// Cada glifo son 7 filas de 5 columnas: "X" = píxel encendido.
export const GLYPH_WIDTH = 5;
export const GLYPH_HEIGHT = 7;
const SPACE_WIDTH = 3;
/** Filas extra por encima cuando el texto lleva alguna vocal con tilde. */
export const ACCENT_ROWS = 1;

export const PIXEL_FONT: Readonly<Record<string, readonly string[]>> = {
  A: ['.XXX.', 'X...X', 'X...X', 'XXXXX', 'X...X', 'X...X', 'X...X'],
  B: ['XXXX.', 'X...X', 'X...X', 'XXXX.', 'X...X', 'X...X', 'XXXX.'],
  C: ['.XXX.', 'X...X', 'X....', 'X....', 'X....', 'X...X', '.XXX.'],
  D: ['XXXX.', 'X...X', 'X...X', 'X...X', 'X...X', 'X...X', 'XXXX.'],
  E: ['XXXXX', 'X....', 'X....', 'XXXX.', 'X....', 'X....', 'XXXXX'],
  F: ['XXXXX', 'X....', 'X....', 'XXXX.', 'X....', 'X....', 'X....'],
  G: ['.XXX.', 'X...X', 'X....', 'X.XXX', 'X...X', 'X...X', '.XXXX'],
  H: ['X...X', 'X...X', 'X...X', 'XXXXX', 'X...X', 'X...X', 'X...X'],
  I: ['.XXX.', '..X..', '..X..', '..X..', '..X..', '..X..', '.XXX.'],
  J: ['..XXX', '...X.', '...X.', '...X.', '...X.', 'X..X.', '.XX..'],
  K: ['X...X', 'X..X.', 'X.X..', 'XX...', 'X.X..', 'X..X.', 'X...X'],
  L: ['X....', 'X....', 'X....', 'X....', 'X....', 'X....', 'XXXXX'],
  M: ['X...X', 'XX.XX', 'X.X.X', 'X.X.X', 'X...X', 'X...X', 'X...X'],
  N: ['X...X', 'XX..X', 'X.X.X', 'X..XX', 'X...X', 'X...X', 'X...X'],
  O: ['.XXX.', 'X...X', 'X...X', 'X...X', 'X...X', 'X...X', '.XXX.'],
  P: ['XXXX.', 'X...X', 'X...X', 'XXXX.', 'X....', 'X....', 'X....'],
  Q: ['.XXX.', 'X...X', 'X...X', 'X...X', 'X.X.X', 'X..X.', '.XX.X'],
  R: ['XXXX.', 'X...X', 'X...X', 'XXXX.', 'X.X..', 'X..X.', 'X...X'],
  S: ['.XXXX', 'X....', 'X....', '.XXX.', '....X', '....X', 'XXXX.'],
  T: ['XXXXX', '..X..', '..X..', '..X..', '..X..', '..X..', '..X..'],
  U: ['X...X', 'X...X', 'X...X', 'X...X', 'X...X', 'X...X', '.XXX.'],
  V: ['X...X', 'X...X', 'X...X', 'X...X', 'X...X', '.X.X.', '..X..'],
  W: ['X...X', 'X...X', 'X...X', 'X.X.X', 'X.X.X', 'XX.XX', 'X...X'],
  X: ['X...X', 'X...X', '.X.X.', '..X..', '.X.X.', 'X...X', 'X...X'],
  Y: ['X...X', 'X...X', '.X.X.', '..X..', '..X..', '..X..', '..X..'],
  Z: ['XXXXX', '....X', '...X.', '..X..', '.X...', 'X....', 'XXXXX'],
  '0': ['.XXX.', 'X...X', 'X..XX', 'X.X.X', 'XX..X', 'X...X', '.XXX.'],
  '1': ['..X..', '.XX..', '..X..', '..X..', '..X..', '..X..', '.XXX.'],
  '2': ['.XXX.', 'X...X', '....X', '...X.', '..X..', '.X...', 'XXXXX'],
  '3': ['XXXX.', '....X', '....X', '.XXX.', '....X', '....X', 'XXXX.'],
  '4': ['...X.', '..XX.', '.X.X.', 'X..X.', 'XXXXX', '...X.', '...X.'],
  '5': ['XXXXX', 'X....', 'XXXX.', '....X', '....X', 'X...X', '.XXX.'],
  '6': ['.XXX.', 'X....', 'X....', 'XXXX.', 'X...X', 'X...X', '.XXX.'],
  '7': ['XXXXX', '....X', '...X.', '..X..', '.X...', '.X...', '.X...'],
  '8': ['.XXX.', 'X...X', 'X...X', '.XXX.', 'X...X', 'X...X', '.XXX.'],
  '9': ['.XXX.', 'X...X', 'X...X', '.XXXX', '....X', 'X...X', '.XXX.'],
  '.': ['.....', '.....', '.....', '.....', '.....', '.XX..', '.XX..'],
  ',': ['.....', '.....', '.....', '.....', '..X..', '..X..', '.X...'],
  ':': ['.....', '.XX..', '.XX..', '.....', '.XX..', '.XX..', '.....'],
  '-': ['.....', '.....', '.....', 'XXXXX', '.....', '.....', '.....'],
  '_': ['.....', '.....', '.....', '.....', '.....', '.....', 'XXXXX'],
  '+': ['.....', '..X..', '..X..', 'XXXXX', '..X..', '..X..', '.....'],
  '/': ['....X', '....X', '...X.', '..X..', '.X...', 'X....', 'X....'],
  '!': ['..X..', '..X..', '..X..', '..X..', '..X..', '.....', '..X..'],
  '?': ['.XXX.', 'X...X', '....X', '...X.', '..X..', '.....', '..X..'],
  "'": ['..X..', '..X..', '.X...', '.....', '.....', '.....', '.....'],
  '<': ['...X.', '..X..', '.X...', 'X....', '.X...', '..X..', '...X.'],
  '>': ['.X...', '..X..', '...X.', '....X', '...X.', '..X..', '.X...'],
  '↑': ['..X..', '.XXX.', 'X.X.X', '..X..', '..X..', '..X..', '..X..'],
  '↓': ['..X..', '..X..', '..X..', '..X..', 'X.X.X', '.XXX.', '..X..'],
  '←': ['.....', '..X..', '.X...', 'XXXXX', '.X...', '..X..', '.....'],
  '→': ['.....', '..X..', '...X.', 'XXXXX', '...X.', '..X..', '.....']
};

/** Vocales con tilde: se componen con la letra base + una marca en la fila de arriba. */
const ACCENTED: Readonly<Record<string, string>> = { Á: 'A', É: 'E', Í: 'I', Ó: 'O', Ú: 'U' };
const ACUTE_ROW = '...X.';

export interface FontPixel {
  x: number;
  y: number;
}

function hasAccent(text: string): boolean {
  for (const ch of text) if (ACCENTED[ch]) return true;
  return false;
}

function advanceOf(ch: string): number {
  return ch === ' ' ? SPACE_WIDTH : GLYPH_WIDTH;
}

/** Tamaño del texto en "píxeles de fuente" (1 espacio entre letras). */
export function measureText(text: string): { width: number; height: number } {
  let width = 0;
  let first = true;
  for (const ch of text) {
    if (!first) width += 1;
    first = false;
    width += advanceOf(ch);
  }
  return { width, height: GLYPH_HEIGHT + (hasAccent(text) ? ACCENT_ROWS : 0) };
}

/** Lista de píxeles encendidos para dibujar el texto. */
export function textPixels(text: string): FontPixel[] {
  const pixels: FontPixel[] = [];
  const top = hasAccent(text) ? ACCENT_ROWS : 0;
  let cursor = 0;
  let first = true;
  for (const ch of text) {
    if (!first) cursor += 1;
    first = false;
    if (ch === ' ') {
      cursor += SPACE_WIDTH;
      continue;
    }
    const baseChar = ACCENTED[ch] ?? ch;
    const glyph = PIXEL_FONT[baseChar];
    if (!glyph) throw new Error(`Carácter sin glifo en la fuente de píxeles: "${ch}"`);
    if (ACCENTED[ch]) {
      for (let x = 0; x < ACUTE_ROW.length; x++) if (ACUTE_ROW[x] === 'X') pixels.push({ x: cursor + x, y: 0 });
    }
    glyph.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        if (row[x] === 'X') pixels.push({ x: cursor + x, y: top + y });
      }
    });
    cursor += GLYPH_WIDTH;
  }
  return pixels;
}

/** Ancho en píxeles de fuente que ocupan los primeros `count` caracteres (para el efecto de escritura). */
export function measurePrefix(text: string, count: number): number {
  return measureText(Array.from(text).slice(0, Math.max(0, count)).join('')).width;
}
