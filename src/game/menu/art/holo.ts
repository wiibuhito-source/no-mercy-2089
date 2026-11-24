// Anuncios holográficos y letrero del dirigible (arte PROVISIONAL; sin Phaser).
import { PAL } from '../../../data/menuPalette';
import { PixelCanvas, type Rgb } from '../../../core/pixelCanvas';
import { drawPixelText, textSize } from '../../../core/pixelText';

export interface HoloAdSpec {
  readonly lines: readonly string[];
  readonly color: Rgb;
}

/** Anuncios que se alternan en la valla de la ciudad (humor de barrio con implantes). */
export const HOLO_ADS: readonly HoloAdSpec[] = [
  { lines: ['CAFECITO', '24 HORAS'], color: PAL.amber },
  { lines: ['IMPLANTES', 'BARATOS'], color: PAL.cyan },
  { lines: ['DRONE', 'TACOS'], color: PAL.pink },
  { lines: ['MIAMI', 'NO PERDONA'], color: PAL.magenta }
];

/** Anuncio de la valla: texto centrado con marco, esquinas y rayas de proyección. */
export function buildHoloAd(spec: HoloAdSpec, w: number, h: number): PixelCanvas {
  const c = new PixelCanvas(w, h);
  c.fillRect(0, 0, w, h, spec.color, 0.12);
  const lineH = 9;
  const top = Math.floor((h - spec.lines.length * lineH + 2) / 2);
  spec.lines.forEach((text, i) => {
    const tw = textSize(text).width;
    drawPixelText(c, text, Math.floor((w - tw) / 2), top + i * lineH, { color: PAL.white, shadow: spec.color });
  });
  // Esquinas del marco holográfico
  for (const [x, y, dx, dy] of [[1, 1, 1, 1], [w - 2, 1, -1, 1], [1, h - 2, 1, -1], [w - 2, h - 2, -1, -1]] as const) {
    c.fillRect(x, y, 1, 1, spec.color, 1);
    c.fillRect(dx > 0 ? x + 1 : x - 3, y, 3, 1, spec.color, 0.9);
    c.fillRect(x, dy > 0 ? y + 1 : y - 3, 1, 3, spec.color, 0.9);
  }
  for (let y = 0; y < h; y += 3) c.fillRect(0, y, w, 1, 0x000000, 0.28); // rayas de proyección
  return c;
}

/** Tira de texto para desplazar por la pantalla del dirigible. */
export function buildTicker(text: string, color: Rgb, gap = 42): PixelCanvas {
  const tw = textSize(text).width;
  const c = new PixelCanvas(tw + gap, 7);
  drawPixelText(c, text, 0, 0, { color });
  return c;
}
