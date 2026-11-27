// Escena 10: esa misma noche. Adrián deja el barrio en un autobús nocturno; la ciudad pasa por la ventanilla.
import { PixelCanvas } from '../../../core/pixelCanvas';
import { drawPixelText } from '../../../core/pixelText';
import { PAL } from '../../../data/menuPalette';
import { buildGlowDisc } from '../../menu/art/glow';
import { ART_W, contactShadow, eraseRect, haze, layer, lightShaft, newArt, personActor, sky, skylineWrap, stars, swayActor, type SceneArt } from './kit';
import { poster } from './details';

const WX = 56, WY = 34, WW = 388, WH = 130;
const FLOOR = 206;

/** Asiento de autobús de perfil: respaldo alto con reposacabezas, cojín y pedestal. */
function busSeat(c: PixelCanvas, x: number, color: number): void {
  const dark = mulDark(color);
  c.fillRect(x - 18, FLOOR - 56, 11, 52, color);
  c.fillRect(x - 18, FLOOR - 56, 11, 2, 0xffffff, 0.25);
  c.fillRect(x - 20, FLOOR - 70, 15, 16, color);
  c.fillRect(x - 20, FLOOR - 70, 15, 2, 0xffffff, 0.3);
  c.fillRect(x - 19, FLOOR - 55, 1, 50, dark);
  c.fillRect(x - 10, FLOOR - 16, 34, 6, color);
  c.fillRect(x - 10, FLOOR - 16, 34, 1, 0xffffff, 0.3);
  c.fillRect(x - 10, FLOOR - 11, 34, 2, dark);
  c.fillRect(x + 2, FLOOR - 9, 4, 9, 0x2a2e48);
  c.fillRect(x - 6, FLOOR - 1, 20, 1, 0x2a2e48);
}
function mulDark(col: number): number {
  const m = (v: number): number => Math.round(v * 0.55);
  return (m((col >> 16) & 255) << 16) | (m((col >> 8) & 255) << 8) | m(col & 255);
}

export function buildBusArt(): SceneArt {
  const back = newArt();
  sky(back, 220, [{ at: 0, color: PAL.ink }, { at: 0.55, color: 0x2a1450 }, { at: 1, color: 0x8a2a7a }]);
  stars(back, 91, 90, 100);
  back.fillCircle(150, 62, 12, 0xf6d4e6);
  back.blit(buildGlowDisc(34, PAL.blush, 4, 0.2), 116, 28);

  const far = newArt();
  skylineWrap(far, 92, 190, 40, 120, 0x3a2a78, 0.22, [PAL.cyan, PAL.magenta]);
  haze(far, 120, 190, 0xb0407a, 0.0, 0.3);
  // edificios cercanos y farolas que pasan (se repiten cada 125 px)
  const near = newArt();
  skylineWrap(near, 93, 250, 80, 170, 0x140a30, 0.3, [PAL.pink, PAL.cyan]);
  near.fillRect(0, 196, ART_W, 90, 0x0a0714);
  near.fillRect(0, 196, ART_W, 2, 0x4a4090);
  for (let x = 0; x < ART_W; x += 20) near.fillRect(x, 214, 10, 2, 0x8a8fb5, 0.5);
  for (let x = 40; x < ART_W; x += 125) {
    near.fillRect(x, 88, 3, 108, 0x241c58);
    near.fillRect(x - 9, 86, 18, 3, 0x241c58);
    near.fillRect(x - 9, 89, 18, 2, 0xffe9a8);
    near.blit(buildGlowDisc(28, 0xffcf6b, 4, 0.36), x - 26, 66);
  }

  // --- Interior: pared, ventanal, ventilación y anuncios
  const c = newArt();
  c.fillGradientV(0, 0, ART_W, 280, [{ at: 0, color: 0x0e0822 }, { at: 1, color: 0x1a1240 }], 8);
  eraseRect(c, WX, WY, WW, WH);
  c.strokeRect(WX - 3, WY - 3, WW + 6, WH + 6, 0x4a3a90);
  for (const x of [WX + 128, WX + 258]) {
    c.fillRect(x, WY, 5, WH, 0x120a2a);
    c.fillRect(x + 4, WY, 1, WH, 0x5a4ab0, 0.7);
  }
  for (let y = WY + 4; y < WY + WH - 4; y += 3) c.fillRect(WX + 20, y, 70, 1, 0xdfe6ff, 0.035); // reflejo en el cristal
  c.fillRect(0, 0, ART_W, 26, 0x05020d);
  c.fillRect(0, 24, ART_W, 2, 0x3a2a80);
  for (let x = 30; x < ART_W; x += 110) {
    c.fillRect(x, 10, 56, 4, 0xeef2ff);
    c.fillRect(x - 2, 8, 60, 8, 0xdfe6ff, 0.12);
    lightShaft(c, x + 28, 16, 40, 110, 120, 0xdfe6ff, 0.05);
  }
  c.fillRect(0, 30, ART_W, 2, 0x8a8fb5); // barra para agarrarse
  c.fillRect(0, 30, ART_W, 1, 0xffffff, 0.35);
  c.fillRect(194, 38, 112, 14, 0x05020d);
  c.strokeRect(194, 38, 112, 14, 0x8a6a1a);
  drawPixelText(c, 'RUTA 12 NORTE', 202, 42, { color: PAL.sun });
  c.fillRect(0, WY + WH + 4, ART_W, 90, 0x1a1240);
  c.fillRect(0, WY + WH + 4, ART_W, 2, 0x4a3a90);
  poster(c, 96, 188, 16, 22, 11);
  poster(c, 140, 190, 12, 18, 12);
  for (let i = 0; i < 5; i++) c.fillRect(420 + i * 3, 184, 2, 12, 0x05020d);
  c.fillRect(0, FLOOR, ART_W, 80, 0x0a0714);
  c.fillRect(0, FLOOR, ART_W, 2, 0xffd23a, 0.55);
  c.fillRect(0, FLOOR + 2, ART_W, 1, 0x05020d);

  // --- Tres asientos con pasajeros: Adrián, una mujer con bolsa y un viajero dormido
  const seats: ReadonlyArray<readonly [number, number]> = [[104, 0x5a3aa0], [236, 0x3a7a9a], [372, 0x9a3a7a]];
  for (const [x, col] of seats) {
    busSeat(c, x, col);
    contactShadow(c, x + 6, FLOOR, 36, 0.6);
  }
  const kid = personActor({ x: 112, footY: FLOOR - 3, height: 68, facing: 1, pose: 'sit', seat: 0.26, hairStyle: 'messy', top: 0x3b6fd0, topLight: 0x6ab0ff, bottom: 0x1f3068, rim: PAL.pink, noShadow: true }, 1, 2400);
  const woman = personActor({ x: 244, footY: FLOOR - 3, height: 64, facing: 1, pose: 'sit', seat: 0.26, hairStyle: 'long', outfit: 'jacket', top: 0x2a8a8a, topLight: 0x5aeaea, bottom: 0x1a2a4a, skin: 0xc98b5e, hair: 0x120a10, rim: PAL.cyan, noShadow: true }, 1, 2900, 300);
  const sleeper = personActor({ x: 380, footY: FLOOR - 3, height: 64, facing: 1, pose: 'sit', seat: 0.26, hood: true, top: 0x5a2a7a, topLight: 0x8a4aaa, bottom: 0x1a1a36, rim: PAL.pink, noShadow: true }, 1, 3300, 800);
  const bag = new PixelCanvas(14, 12);
  bag.fillRect(0, 0, 14, 12, 0x6a3a1a);
  bag.strokeRect(0, 0, 14, 12, 0x3a1a0a);
  bag.fillRect(5, 3, 4, 2, 0xffd36b);
  c.blit(bag, 258, FLOOR - 13);

  // --- Primer plano: respaldo oscuro delante, barra vertical, correas que oscilan y gotas en el cristal
  const front = new PixelCanvas(ART_W, 280);
  front.fillRect(0, 232, 120, 48, 0x05020d);
  front.fillEllipse(56, 232, 62, 20, 0x05020d);
  front.fillRect(36, 38, 7, 242, 0x1a1a30);
  front.fillRect(38, 38, 2, 242, 0x8a8fb5, 0.85);
  for (let i = 0; i < 30; i++) {
    const x = WX + 8 + ((i * 97) % (WW - 16));
    const y = WY + 6 + ((i * 53) % (WH - 14));
    front.fillCircle(x, y, 1.5, 0xdfe6ff, 0.34);
    front.setPixel(x - 1, y - 1, 0xffffff, 0.85);
    if (i % 3 === 0) front.line(x, y + 2, x, y + 8 + (i % 5), 0xdfe6ff, 0.22);
  }
  const straps = [150, 290, 400].map((x, i) => {
    const s = new PixelCanvas(16, 40);
    s.fillRect(7, 0, 1, 22, 0x05020d);
    s.strokeRect(1, 22, 13, 14, 0x05020d);
    s.strokeRect(2, 23, 11, 12, 0x2a2a48, 0.9);
    return swayActor(s, x - 7, 30, 2, 2300, i * 500);
  });
  haze(c, FLOOR - 24, FLOOR, 0x6a5ab0, 0.0, 0.1);
  return [
    layer(back, 0.05),
    layer(far, 0.1, { tile: true, autoScrollX: -16 }),
    layer(near, 0.2, { tile: true, autoScrollX: -90 }),
    layer(c, 1, { actors: [sleeper.actor, woman.actor, kid.actor] }),
    layer(front, 1.15, { actors: straps })
  ];
}
