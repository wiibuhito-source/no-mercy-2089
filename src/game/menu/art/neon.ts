// Carteles de neón hechos con la fuente de píxeles (arte PROVISIONAL; sin Phaser).
import { PixelCanvas, type Rgb } from '../../../core/pixelCanvas';
import { drawPixelText, textSize } from '../../../core/pixelText';
import { buildGlowFromMask } from './glow';

export interface NeonSign {
  /** Cartel encendido. */
  readonly on: PixelCanvas;
  /** Cartel apagado (para el parpadeo). */
  readonly off: PixelCanvas;
  /** Resplandor (mezcla aditiva por encima). */
  readonly glow: PixelCanvas;
  /** Margen que hay que restar a la posición del cartel para colocar el resplandor. */
  readonly glowPad: number;
}

const BACK = 0x0a0518;

function mix(color: Rgb, toward: Rgb, k: number): Rgb {
  const ch = (s: number): number => Math.round(((color >> s) & 255) * (1 - k) + ((toward >> s) & 255) * k);
  return (ch(16) << 16) | (ch(8) << 8) | ch(0);
}

/** Cartel horizontal con tubos de neón y placa oscura detrás. */
export function buildNeonSign(text: string, color: Rgb, scale = 1, board = true): NeonSign {
  const size = textSize(text, scale);
  const pad = board ? 3 : 1;
  const w = size.width + pad * 2;
  const h = size.height + pad * 2;
  const make = (lit: boolean): PixelCanvas => {
    const c = new PixelCanvas(w, h);
    if (board) {
      c.fillRect(0, 0, w, h, BACK, 0.82);
      c.strokeRect(0, 0, w, h, lit ? mix(color, 0x000000, 0.35) : 0x2a2050);
    }
    if (lit) {
      drawPixelText(c, text, pad, pad, { color: mix(color, 0xffffff, 0.3), scale });
    } else {
      drawPixelText(c, text, pad, pad, { color: mix(color, 0x1a1030, 0.78), scale });
    }
    return c;
  };
  const on = make(true);
  const mask = new PixelCanvas(w, h);
  drawPixelText(mask, text, pad, pad, { color: 0xffffff, scale });
  const glowPad = 4;
  const glow = buildGlowFromMask(mask, color, [{ radius: 3, alpha: 0.12 }, { radius: 2, alpha: 0.2 }, { radius: 1, alpha: 0.32 }], glowPad);
  return { on, off: make(false), glow, glowPad };
}

/** Cartel vertical: las letras una encima de otra (HOTEL, BAR...). */
export function buildVerticalNeon(text: string, color: Rgb): NeonSign {
  const letters = Array.from(text);
  const lh = 8;
  const w = 5 + 6;
  const h = letters.length * lh + 4;
  const make = (lit: boolean): PixelCanvas => {
    const c = new PixelCanvas(w, h);
    c.fillRect(0, 0, w, h, BACK, 0.85);
    c.strokeRect(0, 0, w, h, lit ? mix(color, 0x000000, 0.35) : 0x2a2050);
    letters.forEach((ch, i) =>
      drawPixelText(c, ch, 3, 3 + i * lh, { color: lit ? mix(color, 0xffffff, 0.15) : mix(color, 0x1a1030, 0.78) })
    );
    return c;
  };
  const mask = new PixelCanvas(w, h);
  mask.fillRect(0, 0, w, h, 0xffffff);
  const glowPad = 5;
  const glow = buildGlowFromMask(mask, color, [{ radius: 4, alpha: 0.08 }, { radius: 2, alpha: 0.15 }, { radius: 1, alpha: 0.25 }], glowPad);
  return { on: make(true), off: make(false), glow, glowPad };
}
