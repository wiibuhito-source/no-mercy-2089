// Escena 1 (apertura): Miami, 2089, vista desde la bahía al caer la noche.
import { PixelCanvas } from '../../../core/pixelCanvas';
import { createRng } from '../../../core/rng';
import { PAL } from '../../../data/menuPalette';
import { buildGlowDisc } from '../../menu/art/glow';
import { ART_H, ART_W, frond, layer, newArt, sky, skyline, stars, windows, type SceneArt } from './kit';

const HORIZON = 156;

export function buildSkylineArt(): SceneArt {
  // Cielo, luna y nubes (casi no se mueve)
  const back = newArt();
  sky(back, HORIZON + 6, [
    { at: 0, color: PAL.ink },
    { at: 0.38, color: 0x1a0f3d },
    { at: 0.68, color: 0x4a1f6a },
    { at: 0.9, color: 0xb0407a },
    { at: 1, color: 0xff8a6a }
  ]);
  stars(back, 7, 130, 100);
  back.blit(buildGlowDisc(44, PAL.blush, 5, 0.22), 346, 8);
  back.fillCircle(390, 52, 20, 0xf6d4e6);
  back.fillCircle(384, 47, 5, 0xd9a8c8, 0.7);
  back.fillCircle(397, 58, 4, 0xd9a8c8, 0.6);
  const rnd = createRng(3);
  for (let i = 0; i < 9; i++) back.fillEllipse(30 + rnd() * 440, 92 + rnd() * 50, 30 + rnd() * 50, 2 + rnd() * 2, 0x7a3a8a, 0.28);

  // Skyline lejano con tiras de neón
  const far = newArt();
  skyline(far, 21, HORIZON, 24, 78, 0x241450, 0.14);
  skyline(far, 22, HORIZON + 2, 14, 46, 0x180d38, 0.2);
  for (let x = 14; x < ART_W; x += 38) far.fillRect(x, HORIZON - 30 - (x % 40), 1, 20 + (x % 20), x % 76 === 14 ? PAL.cyan : PAL.magenta, 0.55);

  // Torres protagonistas, puente y bahía
  const mid = newArt();
  const towers: ReadonlyArray<readonly [number, number, number, number]> = [
    [44, 34, 112, PAL.cyan],
    [236, 46, 148, PAL.magenta],
    [412, 36, 98, PAL.cyan]
  ];
  for (const [x, w, h, neon] of towers) {
    mid.fillRect(x, HORIZON - h, w, h, 0x120a2a);
    mid.fillRect(x, HORIZON - h, w, 2, 0x4b2d9a);
    mid.fillRect(x, HORIZON - h, 2, h, 0x2b1a63);
    windows(mid, x, HORIZON - h, w, h, x, 0.34);
    for (let y = HORIZON - h + 18; y < HORIZON - 6; y += 26) mid.fillRect(x, y, w, 1, neon, 0.85);
    mid.fillRect(x + Math.floor(w / 2), HORIZON - h - 16, 1, 16, 0x4a4f7a);
    mid.fillRect(x + Math.floor(w / 2) - 1, HORIZON - h - 18, 3, 2, PAL.red);
  }
  mid.strokeRect(210, HORIZON - 172, 98, 22, PAL.magenta, 0.0);
  mid.fillEllipse(259, HORIZON - 168, 38, 5, PAL.magenta, 0.0);
  for (let i = 0; i < 3; i++) mid.line(222 + i * 2, HORIZON - 168 + i, 296 - i * 2, HORIZON - 168 + i, PAL.magenta, 0.55 - i * 0.15);
  // Puente iluminado
  mid.fillRect(0, HORIZON + 4, ART_W, 3, 0x0a0618);
  for (let x = 6; x < ART_W; x += 22) {
    mid.fillRect(x, HORIZON - 4, 1, 8, 0x2a2550);
    mid.fillRect(x - 1, HORIZON - 5, 3, 1, 0xffcf6b);
  }
  for (let x = 4; x < ART_W; x += 9) mid.setPixel(x, HORIZON + 3, x % 18 === 4 ? 0xffe9a8 : PAL.red, 0.9);
  // Bahía con reflejos
  mid.fillGradientV(0, HORIZON + 7, ART_W, ART_H - HORIZON - 7, [{ at: 0, color: 0x2a1450 }, { at: 0.4, color: 0x120a2a }, { at: 1, color: 0x05020d }], 14);
  const rr = createRng(9);
  for (const [x, w, , neon] of towers) {
    for (let i = 0; i < 70; i++) {
      const y = HORIZON + 9 + i * 1.4;
      const wob = Math.sin(i * 0.9) * 2;
      mid.fillRect(x + wob, y, w, 1, i % 4 === 0 ? neon : 0x241450, 0.32 * (1 - i / 80));
    }
  }
  for (let i = 0; i < 40; i++) mid.fillRect(rr() * ART_W, HORIZON + 10 + rr() * 110, 6 + rr() * 22, 1, PAL.blush, 0.1 + rr() * 0.12);
  for (let i = 0; i < 24; i++) mid.fillRect(rr() * ART_W, HORIZON + 8 + rr() * 8, 2 + rr() * 6, 1, 0xffe9a8, 0.5);
  // Dos barcos con farolillo
  for (const [bx, by] of [[150, 196], [330, 214]] as const) {
    mid.fillPolygon([{ x: bx, y: by }, { x: bx + 22, y: by }, { x: bx + 18, y: by + 4 }, { x: bx + 4, y: by + 4 }], 0x05020d);
    mid.fillRect(bx + 10, by - 9, 1, 9, 0x05020d);
    mid.fillRect(bx + 9, by - 10, 3, 2, 0xffcf6b);
    mid.blit(buildGlowDisc(9, 0xffcf6b, 3, 0.4), bx + 1, by - 18);
  }

  // Hojas de palmera en primer plano (marcan la profundidad)
  const front = new PixelCanvas(ART_W, ART_H);
  const dark = 0x07120f;
  for (const [a, b, dx, dy, len] of [[-6, 6, 1, 0.1, 118], [-4, 16, 0.9, 0.35, 104], [-6, 30, 0.7, 0.55, 84], [-2, 2, 1, -0.2, 70]] as const) frond(front, a, b, dx, dy, len, dark, 0x0f3a34);
  for (const [a, b, dx, dy, len] of [[506, 8, -1, 0.1, 124], [504, 20, -0.9, 0.35, 108], [506, 36, -0.7, 0.55, 86], [502, 2, -1, -0.2, 72]] as const) frond(front, a, b, dx, dy, len, dark, 0x0f3a34);

  return [layer(back, 0.25), layer(far, 0.5), layer(mid, 1), layer(front, 1.25)];
}
