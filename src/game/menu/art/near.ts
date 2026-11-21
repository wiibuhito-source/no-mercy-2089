// Primer plano estático: café cubano, edificio de apartamentos con azotea, acera y calle mojada
// (arte PROVISIONAL dibujado por código; sin Phaser).
import { PAL } from '../../../data/menuPalette';
import { SCENE } from '../../../data/menuScene';
import { createRng } from '../../../core/rng';
import { PixelCanvas, type Point } from '../../../core/pixelCanvas';
import { paintAntenna, paintCrates, paintHydrant, paintLampPost, paintManhole, paintRoofAc, paintTrashCan, paintWaterTank } from './props';

const OUT = 0x0a0612;
const LAMP_X = 278;

export interface NearAnchors {
  readonly cafeSign: Point;
  readonly hotelSign: Point;
  readonly lampLight: Point;
  readonly antennaLight: Point;
  readonly steamVent: Point;
  readonly cafeWindow: Point;
  readonly puddles: readonly { x: number; y: number; w: number }[];
  readonly clothesline: { from: Point; to: Point };
  /** Dónde se apoya el pandillero (pies). */
  readonly gangsterFeet: Point;
  readonly palmBase: Point;
}

export interface NearScene {
  readonly canvas: PixelCanvas;
  readonly anchors: NearAnchors;
}

const ROOF = SCENE.roofY;
const BASE = SCENE.horizonY;
const CURB = SCENE.curbY;

function paintCafe(c: PixelCanvas): void {
  const top = 120;
  c.fillRect(0, top, 66, BASE - top, 0x13394a);
  c.fillRect(0, top, 66, 1, 0x2f7f96);
  c.fillRect(12, top - 8, 2, 4, 0x0a2230); // patas del cartel del tejado
  c.fillRect(46, top - 8, 2, 4, 0x0a2230);
  c.fillRect(0, top - 5, 68, 5, 0x1d5266); // cornisa
  c.fillRect(0, top - 5, 68, 1, 0x3b9ab4);
  c.fillRect(0, top, 68, 2, 0x0a2230);
  c.fillRect(62, top, 4, BASE - top, 0x0e2a38); // lado en sombra
  // Piso superior: ventana con cortina y una maceta
  c.fillRect(44, 130, 14, 16, 0x0a1a24);
  c.fillRect(45, 131, 12, 14, 0xffc86a);
  c.fillRect(45, 131, 12, 5, 0xff9a52);
  c.fillRect(49, 131, 4, 14, 0xd9703a, 0.7);
  c.strokeRect(43, 129, 16, 18, 0x2f7f96);
  c.fillRect(43, 147, 16, 2, 0x2f7f96);
  c.fillRect(46, 145, 3, 2, 0x1d8a4a);
  c.fillRect(52, 144, 4, 3, 0x1d8a4a);
  c.putPixel(53, 143, 0xff5a8a, 1);
  // Ventanita del café (despacho de cafecito): luz cálida
  c.fillRect(7, 160, 34, 26, 0x0a1a24);
  c.fillGradientV(9, 162, 30, 20, [{ at: 0, color: 0xffe08a }, { at: 1, color: 0xff9a52 }], 8);
  c.fillRect(9, 162, 30, 1, 0xfff3c0);
  // Interior: cafetera, tazas y estante
  c.fillRect(13, 168, 6, 11, 0x3a1c14);
  c.fillRect(14, 166, 4, 3, 0x5a2c1e);
  c.fillRect(15, 171, 2, 2, 0xffe08a);
  c.fillRect(24, 172, 12, 1, 0x3a1c14);
  for (const bx of [25, 29, 33]) c.fillRect(bx, 170, 2, 2, 0xfff0d2);
  c.fillRect(9, 179, 30, 3, 0x2a140e); // mostrador
  c.fillRect(9, 179, 30, 1, 0x6a3a22);
  c.strokeRect(7, 160, 34, 26, 0x2f7f96);
  // Toldo a rayas con festón
  for (let x = 4; x < 46; x += 4) {
    c.fillRect(x, 150, 4, 9, ((x - 4) / 4) % 2 === 0 ? 0xd62a8a : 0xece6fa);
    c.fillRect(x, 159, 4, 2, ((x - 4) / 4) % 2 === 0 ? 0xa01c68 : 0xb4abd8);
  }
  c.fillRect(4, 148, 42, 3, 0xff4aa8);
  c.fillRect(4, 148, 42, 1, 0xff9ad8);
  c.fillRect(4, 150, 42, 1, 0x7a1a54);
  // Puerta
  c.fillRect(48, 158, 14, 38, 0x0c2634);
  c.fillRect(50, 161, 10, 22, 0x0a3a52);
  c.fillRect(50, 161, 10, 22, PAL.cyan, 0.12);
  c.line(51, 162, 56, 181, PAL.cyan, 0.35);
  c.fillRect(58, 184, 2, 3, PAL.amber);
  c.strokeRect(48, 158, 14, 38, 0x2f7f96);
  c.outline(OUT);
}

function paintApartments(c: PixelCanvas): void {
  const x0 = 322;
  const w = 480 - x0;
  c.fillRect(x0, ROOF, w, BASE - ROOF, 0x150b2e);
  c.fillRect(x0, ROOF, 1, BASE - ROOF, 0x2d1b5c);
  c.fillRect(x0 - 2, ROOF - 5, w + 2, 5, 0x24124a); // parapeto
  c.fillRect(x0 - 2, ROOF - 5, w + 2, 1, 0x5a38a8);
  c.fillRect(x0, ROOF, w, 2, 0x0b0518);
  // Ventanas con luz
  const rnd = createRng(808);
  for (let y = ROOF + 12; y < BASE - 12; y += 19) {
    for (let x = x0 + 14; x < 480 - 6; x += 20) {
      const lit = rnd() < 0.62;
      c.fillRect(x - 1, y - 1, 12, 14, 0x2d1b5c);
      c.fillRect(x, y, 10, 12, lit ? 0x0a0518 : 0x0a0518);
      if (lit) {
        const col = rnd() < 0.7 ? 0xffc86a : rnd() < 0.5 ? 0x7af0ff : 0xff6ad5;
        c.fillRect(x + 1, y + 1, 8, 10, col, 0.85);
        c.fillRect(x + 1, y + 1, 8, 2, 0xffffff, 0.2);
        if (rnd() < 0.5) c.fillRect(x + 3 + Math.floor(rnd() * 3), y + 5, 3, 7, 0x1a0d38); // silueta
      } else {
        c.fillRect(x + 1, y + 1, 8, 10, 0x140a2e);
      }
      if (rnd() < 0.45) {
        c.fillRect(x + 1, y + 13, 9, 5, METAL_AC);
        c.fillRect(x + 1, y + 13, 9, 1, 0x6a64c0);
        c.fillRect(x + 3, y + 15, 5, 1, 0x15102e);
      }
    }
  }
  // Escalera de incendios en el lateral izquierdo
  for (let y = ROOF + 14; y < BASE - 6; y += 19) {
    c.fillRect(x0 + 1, y, 12, 1, 0x4a4290);
    c.line(x0 + 1, y, x0 + 12, y + 18, 0x3a3270);
    c.fillRect(x0 + 1, y - 5, 1, 5, 0x3a3270);
    c.fillRect(x0 + 12, y - 5, 1, 5, 0x3a3270);
  }
}
const METAL_AC = 0x3a3470;

function paintRoof(c: PixelCanvas): { clothesline: { from: Point; to: Point }; antennaLight: Point } {
  paintRoofAc(c, 336, ROOF - 8);
  paintCrates(c, 362, ROOF - 10);
  paintAntenna(c, 380, ROOF - 34);
  paintWaterTank(c, 398, ROOF - 24);
    // Cuerda de tender con ropa
  const from = { x: 383, y: ROOF - 22 };
  const to = { x: 398, y: ROOF - 20 };
  c.line(from.x, from.y, to.x, to.y, 0x6a64c0, 0.9);
  c.fillRect(386, from.y + 1, 3, 5, 0xff2bd6);
  c.fillRect(386, from.y + 1, 3, 1, 0xff9ae6);
  c.fillRect(391, from.y + 1, 3, 4, 0x19f3ff);
  return { clothesline: { from, to }, antennaLight: { x: 383, y: ROOF - 35 } };
}

function paintStreet(c: PixelCanvas): { puddles: { x: number; y: number; w: number }[] } {
  // Acera con juntas
  c.fillRect(0, BASE, 480, CURB - BASE, 0x1b1033);
  c.fillGradientV(0, BASE, 480, CURB - BASE, [{ at: 0, color: 0x120a28 }, { at: 1, color: 0x24164a }], 6);
  for (let x = 6; x < 480; x += 26) c.fillRect(x, BASE + 2, 1, CURB - BASE - 2, 0x0d0720);
  c.fillRect(0, BASE, 480, 1, 0x0d0720);
  // Bordillo con luz de neón
  c.fillRect(0, CURB, 480, 2, 0x3a2a78);
  c.fillRect(0, CURB, 480, 1, 0x7a62d0);
  c.fillRect(0, CURB + 2, 480, 1, PAL.cyan, 0.5);
  // Asfalto mojado
  c.fillGradientV(0, CURB + 3, 480, 270 - CURB - 3, [{ at: 0, color: 0x0d0822 }, { at: 0.5, color: 0x0a061a }, { at: 1, color: 0x060310 }], 8);
  const rnd = createRng(555);
  for (let i = 0; i < 260; i++) c.setPixel(Math.floor(rnd() * 480), CURB + 4 + Math.floor(rnd() * 56), 0x2a1d58, 0.55); // gravilla
  // Rayas de la carretera
  for (let x = 4; x < 480; x += 50) {
    c.fillRect(x, 262, 28, 2, 0x4a3a88);
    c.fillRect(x, 262, 28, 1, 0x6a58b8);
  }
  // Charcos que reflejan los neones
  const puddles = [
    { x: 262, y: 236, w: 44 },
    { x: 322, y: 246, w: 34 },
    { x: 30, y: 258, w: 38 },
    { x: 210, y: 262, w: 30 }
  ];
  for (const p of puddles) {
    c.fillEllipse(p.x, p.y, p.w / 2, 3.6, 0x1c1244);
    c.fillEllipse(p.x, p.y, p.w / 2 - 2, 2.4, 0x2c1c66);
    c.fillRect(p.x - p.w / 2 + 6, p.y - 1, p.w / 3, 1, PAL.magenta, 0.55);
    c.fillRect(p.x + 2, p.y, p.w / 3, 1, PAL.cyan, 0.5);
    c.line(p.x - p.w / 2 + 2, p.y - 2, p.x - 3, p.y - 2, 0x6a58b8, 0.5);
  }
  paintManhole(c, 292, 226);
  return { puddles };
}

export function buildNearScene(): NearScene {
  const c = new PixelCanvas(480, 270);
  paintCafe(c);
  paintApartments(c);
  const roof = paintRoof(c);
  const street = paintStreet(c);
  // Acera: objetos
  paintHydrant(c, 246, BASE + 1);
  paintTrashCan(c, 308, BASE + 1);
  paintLampPost(c, LAMP_X, 128, BASE + 12 - 128);
  c.fillEllipse(30, BASE + 8, 24, 3, 0xffb347, 0.1); // charco de luz cálida de la ventanita
  c.fillEllipse(30, BASE + 8, 15, 2, 0xffb347, 0.1);
  return {
    canvas: c,
    anchors: {
      cafeSign: { x: 6, y: 94 },
      hotelSign: { x: 466, y: 146 },
      lampLight: { x: LAMP_X + 15, y: 128 + 7 },
      antennaLight: roof.antennaLight,
      steamVent: { x: 292, y: 224 },
      cafeWindow: { x: 24, y: 160 },
      puddles: street.puddles,
      clothesline: roof.clothesline,
      gangsterFeet: { x: 462, y: ROOF },
      palmBase: { x: 76, y: BASE + 10 }
    }
  };
}
