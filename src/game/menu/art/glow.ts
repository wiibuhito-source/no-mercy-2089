// Resplandor escalonado (arte PROVISIONAL; sin Phaser): círculos o siluetas con halos en pasos,
// al estilo del pixel art. Se dibuja con mezcla "ADD" encima de la escena para que parezca luz.
import { PixelCanvas, type Rgb } from '../../../core/pixelCanvas';

export interface GlowRing {
  readonly radius: number;
  readonly alpha: number;
}

/** Halo circular de varios anillos concéntricos (del más grande al más pequeño). */
export function buildGlowDisc(radius: number, color: Rgb, rings = 4, peakAlpha = 0.5): PixelCanvas {
  const size = Math.ceil(radius * 2) + 2;
  const c = new PixelCanvas(size, size);
  for (let i = 0; i < rings; i++) {
    const r = radius * (1 - i / rings);
    c.fillCircle(size / 2, size / 2, r, color, peakAlpha / rings);
  }
  return c;
}

/** Halo con la forma de otro dibujo (por ejemplo, las letras de un cartel de neón). */
export function buildGlowFromMask(mask: PixelCanvas, color: Rgb, rings: readonly GlowRing[], pad: number): PixelCanvas {
  const out = new PixelCanvas(mask.width + pad * 2, mask.height + pad * 2);
  const strength = new Float32Array(out.width * out.height);
  for (let y = 0; y < mask.height; y++) {
    for (let x = 0; x < mask.width; x++) {
      if (mask.alphaAt(x, y) < 60) continue;
      for (const ring of rings) {
        const r = ring.radius;
        for (let dy = -r; dy <= r; dy++) {
          for (let dx = -r; dx <= r; dx++) {
            if (Math.abs(dx) + Math.abs(dy) > r + (r > 1 ? 1 : 0)) continue;
            const idx = (y + pad + dy) * out.width + (x + pad + dx);
            if (idx >= 0 && idx < strength.length) strength[idx] = Math.max(strength[idx] ?? 0, ring.alpha);
          }
        }
      }
    }
  }
  for (let y = 0; y < out.height; y++) {
    for (let x = 0; x < out.width; x++) {
      const a = strength[y * out.width + x] ?? 0;
      if (a > 0) out.putPixel(x, y, color, a);
    }
  }
  return out;
}

/** Cono de luz (farola o faro) con borde escalonado. Mira hacia abajo; (anchoSup, anchoInf) en píxeles. */
export function buildLightCone(topW: number, bottomW: number, height: number, color: Rgb, alpha: number): PixelCanvas {
  const c = new PixelCanvas(bottomW + 2, height);
  const bands = 5;
  for (let y = 0; y < height; y++) {
    const t = y / height;
    const w = topW + (bottomW - topW) * t;
    const fade = (1 - t) * 0.85 + 0.15;
    const level = Math.ceil(fade * bands) / bands; // escalones
    const x0 = Math.round((c.width - w) / 2);
    c.fillRect(x0, y, Math.round(w), 1, color, alpha * level);
  }
  return c;
}

/** Resplandor plano y ancho (por ejemplo, la luz de neón bajo el coche): elipses concéntricas en escalones. */
export function buildGlowEllipse(rx: number, ry: number, color: Rgb, rings = 4, peakAlpha = 0.6): PixelCanvas {
  const c = new PixelCanvas(Math.ceil(rx * 2) + 2, Math.ceil(ry * 2) + 2);
  for (let i = 0; i < rings; i++) {
    const k = 1 - i / rings;
    c.fillEllipse(c.width / 2, c.height / 2, rx * k, Math.max(1, ry * k), color, peakAlpha / rings);
  }
  return c;
}

/** Haz de luz horizontal que se abre hacia la derecha (faro del coche), con escalones. */
export function buildBeam(length: number, startH: number, endH: number, color: Rgb, alpha: number): PixelCanvas {
  const c = new PixelCanvas(length, Math.ceil(endH) + 2);
  const bands = 5;
  for (let x = 0; x < length; x++) {
    const t = x / length;
    const h = startH + (endH - startH) * t;
    const level = Math.ceil((1 - t * 0.85) * bands) / bands;
    c.fillRect(x, Math.round(c.height / 2 - h / 2), 1, Math.max(1, Math.round(h)), color, alpha * level);
  }
  return c;
}
