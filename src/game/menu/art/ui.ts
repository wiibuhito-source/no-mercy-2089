// Piezas gráficas de la interfaz del menú: panel de cristal, botones con icono, teclas (arte PROVISIONAL; sin Phaser).
import { BUTTON, DESC, HEADER_H, PANEL } from '../../../data/menuLayout';
import { PAL } from '../../../data/menuPalette';
import { colorAtStops, PixelCanvas, type Point, type Rgb } from '../../../core/pixelCanvas';
import { drawPixelText, textSize } from '../../../core/pixelText';

export type IconName = 'play' | 'gear' | 'power';

/** Hueco de cada indicador luminoso del encabezado (esquina superior izquierda, 5x5). */
export const PANEL_LEDS: readonly Point[] = [
  { x: PANEL.w - 30, y: 4 },
  { x: PANEL.w - 22, y: 4 },
  { x: PANEL.w - 14, y: 4 }
];

const GLASS = 0x07031a;

function chamfered(w: number, h: number, cut: number): Point[] {
  return [
    { x: cut, y: 0 },
    { x: w, y: 0 },
    { x: w, y: h - cut },
    { x: w - cut, y: h },
    { x: 0, y: h },
    { x: 0, y: cut }
  ];
}

/** Panel de cristal oscuro con esquinas cortadas, encabezado y bordes de neón. */
export function buildPanel(): PixelCanvas {
  const { w, h } = PANEL;
  const c = new PixelCanvas(w, h);
  c.fillPolygon(chamfered(w, h, 9), GLASS, 0.9);
  c.fillPolygon(
    [
      { x: 9, y: 0 },
      { x: w, y: 0 },
      { x: w, y: HEADER_H },
      { x: 0, y: HEADER_H },
      { x: 0, y: 9 }
    ],
    0x180c3a,
    0.95
  );
  // Rejilla muy tenue de fondo
  for (let y = HEADER_H + 2; y < h - 2; y += 4) c.fillRect(2, y, w - 4, 1, PAL.violet, 0.05);
  // Bordes
  c.line(9, 0, w - 1, 0, PAL.cyan, 0.9);
  c.line(w - 1, 0, w - 1, h - 10, PAL.cyan, 0.9);
  c.line(w - 1, h - 10, w - 10, h - 1, PAL.cyan, 0.9);
  c.line(w - 10, h - 1, 0, h - 1, PAL.cyan, 0.9);
  c.line(0, h - 1, 0, 9, PAL.cyan, 0.9);
  c.line(0, 9, 9, 0, PAL.cyan, 0.9);
  // Esquinas de neón rosa (el "marco" de la interfaz)
  c.fillRect(9, 0, 22, 2, PAL.magenta);
  c.line(0, 9, 0, 22, PAL.magenta);
  c.line(1, 9, 1, 22, PAL.magenta);
  c.fillRect(w - 31, h - 2, 22, 2, PAL.magenta);
  c.fillRect(w - 2, h - 23, 2, 13, PAL.magenta);
  // Encabezado
  drawPixelText(c, 'MENU PRINCIPAL', 8, 4, { color: PAL.lilac });
  for (const led of PANEL_LEDS) {
    c.fillRect(led.x, led.y, 5, 5, 0x0a0518);
    c.strokeRect(led.x, led.y, 5, 5, 0x3a2a78);
  }
  c.fillRect(1, HEADER_H, w - 2, 1, 0x3a2a78);
  // Zona del texto descriptivo
  c.fillRect(6, DESC.dividerY, w - 12, 1, 0x2b1a63);
  for (let x = 6; x < w - 6; x += 4) c.putPixel(x, DESC.dividerY, PAL.cyan, 0.35);
  return c;
}

function buttonShape(w: number, h: number, slant: number): PixelCanvas {
  const s = new PixelCanvas(w, h);
  s.fillPolygon(
    [
      { x: 0, y: 0 },
      { x: w, y: 0 },
      { x: w - slant, y: h },
      { x: 0, y: h }
    ],
    0xffffff
  );
  return s;
}

/** Silueta del botón (se usa para recortar el destello). */
export function buildButtonShape(): PixelCanvas {
  return buttonShape(BUTTON.w, BUTTON.h, BUTTON.slant);
}

export function buildIcon(name: IconName, color: Rgb): PixelCanvas {
  const c = new PixelCanvas(11, 11);
  if (name === 'play') {
    c.fillPolygon(
      [
        { x: 2, y: 0.5 },
        { x: 2, y: 10.5 },
        { x: 10.5, y: 5.5 }
      ],
      color
    );
  } else if (name === 'gear') {
    c.fillCircle(5.5, 5.5, 3.6, color);
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      c.fillRect(Math.round(5.5 + Math.cos(a) * 4.4) - 1, Math.round(5.5 + Math.sin(a) * 4.4) - 1, 2, 2, color);
    }
    for (let y = 0; y < 11; y++) for (let x = 0; x < 11; x++) if ((x + 0.5 - 5.5) ** 2 + (y + 0.5 - 5.5) ** 2 < 2.2) c.putPixel(x, y, 0, 0);
  } else {
    for (let y = 0; y < 11; y++) {
      for (let x = 0; x < 11; x++) {
        const dx = x + 0.5 - 5.5;
        const dy = y + 0.5 - 6.2;
        const d = Math.hypot(dx, dy);
        if (d > 3.3 && d < 5 && !(Math.abs(dx) < 2 && dy < 0)) c.setPixel(x, y, color, 1);
      }
    }
    c.fillRect(5, 0, 2, 6, color);
  }
  return c;
}

/** Botón completo con icono y texto. `selected` lo ilumina con degradado de neón. */
export function buildButton(label: string, icon: IconName, selected: boolean): PixelCanvas {
  const { w, h, slant } = BUTTON;
  const shape = buttonShape(w, h, slant);
  const c = new PixelCanvas(w, h);
  if (selected) {
    const grad = new PixelCanvas(w, h);
    const stops = [
      { at: 0, color: 0xff2bd6 },
      { at: 0.55, color: 0xa21fd0 },
      { at: 1, color: 0x3a1a8a }
    ];
    for (let x = 0; x < w; x++) grad.fillRect(x, 0, 1, h, colorAtStops(stops, x / w));
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (shape.alphaAt(x, y) > 0) c.setPixel(x, y, grad.colorAt(x, y), 1);
    c.fillRect(0, 0, w, 1, 0xffffff, 0.45);
    c.fillRect(0, h - 1, w - slant, 1, 0x1a0a3a, 0.6);
    c.fillRect(0, 0, 3, h, PAL.cyan);
    drawPixelText(c, label, BUTTON.labelX, 4, { color: PAL.white, scale: 2, shadow: 0x2a0a4a });
    c.blit(buildIcon(icon, PAL.white), 9, 5);
  } else {
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (shape.alphaAt(x, y) > 0) c.setPixel(x, y, 0x120a2c, 0.9);
    c.fillRect(0, 0, 2, h, PAL.violet);
    c.fillRect(0, 0, w, 1, 0x2b1a63, 0.9);
    c.fillRect(0, h - 1, w - slant, 1, 0x05020d, 0.8);
    drawPixelText(c, label, BUTTON.labelX, 4, { color: 0x8a83d6, scale: 2 });
    c.blit(buildIcon(icon, 0x5a50a8), 9, 5);
  }
  return c;
}

/** Tecla dibujada (para la ayuda de controles). */
export function buildKeycap(label: string): PixelCanvas {
  const tw = textSize(label).width;
  const w = Math.max(11, tw + 7);
  const c = new PixelCanvas(w, 12);
  c.fillRect(1, 0, w - 2, 11, 0x1c1040);
  c.fillRect(0, 1, w, 9, 0x1c1040);
  c.fillRect(1, 0, w - 2, 1, 0x5a4aa8);
  c.fillRect(0, 1, 1, 9, 0x3a2a78);
  c.fillRect(w - 1, 1, 1, 9, 0x3a2a78);
  c.fillRect(1, 10, w - 2, 2, 0x0a0518);
  drawPixelText(c, label, Math.floor((w - tw) / 2), 2, { color: 0xcfc6ff });
  return c;
}
