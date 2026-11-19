import Phaser from 'phaser';
import { measureText, textPixels } from '../../core/pixelFont';

export const TITLE_TEXTURE_KEY = 'title-art';

const PAD = 8;
const MAIN_TEXT = 'NO MERCY';
const MAIN_SCALE = 7;
const SUB_TEXT = '2089';
const SUB_SCALE = 5;
const GAP = 8;

type Gfx = Phaser.GameObjects.Graphics;
type Pixel = { x: number; y: number };

function paint(
  g: Gfx,
  pixels: Pixel[],
  scale: number,
  ox: number,
  oy: number,
  colorOf: (row: number) => number,
  alpha: number,
  grow: number
): void {
  for (const p of pixels) {
    g.fillStyle(colorOf(p.y), alpha);
    g.fillRect(ox + p.x * scale - grow, oy + p.y * scale - grow, scale + grow * 2, scale + grow * 2);
  }
}

/** Una línea de título con resplandor neón, sombra rosa, borde cian y degradado. */
function drawLine(g: Gfx, text: string, scale: number, ox: number, oy: number): void {
  const pixels = textPixels(text);
  paint(g, pixels, scale, ox, oy, () => 0xff2bd6, 0.1, 5); // resplandor ancho
  paint(g, pixels, scale, ox, oy, () => 0xff2bd6, 0.18, 2); // resplandor cercano
  paint(g, pixels, scale, ox + 2, oy + 2, () => 0xff2bd6, 1, 0); // sombra rosa
  paint(g, pixels, scale, ox - 1, oy - 1, () => 0x19f3ff, 1, 0); // borde cian
  paint(g, pixels, scale, ox, oy, (row) => (row < 3 ? 0xffffff : row < 5 ? 0xffd0f5 : 0xff8fe8), 1, 0); // cara
}

/** Crea (una sola vez) la imagen del título y devuelve su tamaño. */
export function ensureTitleTexture(scene: Phaser.Scene): { width: number; height: number } {
  const main = measureText(MAIN_TEXT);
  const sub = measureText(SUB_TEXT);
  const width = Math.max(main.width * MAIN_SCALE, sub.width * SUB_SCALE) + PAD * 2;
  const height = PAD + main.height * MAIN_SCALE + GAP + sub.height * SUB_SCALE + PAD;

  if (!scene.textures.exists(TITLE_TEXTURE_KEY)) {
    const g = scene.add.graphics();
    const mainX = Math.floor((width - main.width * MAIN_SCALE) / 2);
    const subW = sub.width * SUB_SCALE;
    const subX = Math.floor((width - subW) / 2);
    const subY = PAD + main.height * MAIN_SCALE + GAP;

    drawLine(g, MAIN_TEXT, MAIN_SCALE, mainX, PAD);
    drawLine(g, SUB_TEXT, SUB_SCALE, subX, subY);

    // Barras de neón a los lados del "2089"
    const barY = subY + Math.floor((sub.height * SUB_SCALE) / 2) - 1;
    const barLen = subX - PAD - 10;
    g.fillStyle(0x19f3ff, 1);
    g.fillRect(PAD, barY, barLen, 3);
    g.fillStyle(0xff2bd6, 1);
    g.fillRect(width - PAD - barLen, barY, barLen, 3);

    g.generateTexture(TITLE_TEXTURE_KEY, width, height);
    g.destroy();
  }
  return { width, height };
}
