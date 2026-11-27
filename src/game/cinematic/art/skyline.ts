// Escena 1 (apertura): Miami, 2089, desde una azotea al caer la noche. Adrián, ya adulto, mira la ciudad con su cafecito.
import { PixelCanvas } from '../../../core/pixelCanvas';
import { createRng } from '../../../core/rng';
import { PAL } from '../../../data/menuPalette';
import { buildGlowDisc } from '../../menu/art/glow';
import { ART_H, ART_W, acUnit, contactShadow, haze, layer, leaf, newArt, reflectDown, sipActor, skyline, stars, swayActor, windows, type SceneArt } from './kit';
import { SCALE } from './characters';
import { antenna, waterTank } from './details';

const HORIZON = 134;
const PARAPET = 182;

/** Rascacielos con retranqueos, corona luminosa, tiras de neón y ventanas. */
function tower(c: PixelCanvas, x: number, w: number, h: number, neon: number, seed: number, crown = true): void {
  const base = HORIZON + 2;
  const rnd = createRng(seed);
  const tiers = [{ dx: 0, w, h: h * 0.62 }, { dx: w * 0.14, w: w * 0.72, h: h * 0.28 }, { dx: w * 0.3, w: w * 0.4, h: h * 0.1 }];
  let y = base;
  for (const t of tiers) {
    y -= t.h;
    c.fillRect(x + t.dx, y, t.w, t.h + 1, 0x140c30);
    c.fillRect(x + t.dx, y, t.w, 1, 0x5a3ab0, 0.9);
    c.fillRect(x + t.dx, y, 2, t.h + 1, 0x2a1a60);
    c.fillRect(x + t.dx + t.w - 2, y, 2, t.h + 1, 0x0a0620);
    windows(c, x + t.dx, y, t.w, t.h, Math.floor(rnd() * 99999), 0.36);
    for (let by = y + 10; by < y + t.h - 4; by += 16 + Math.floor(rnd() * 8)) c.fillRect(x + t.dx, by, t.w, 1, neon, 0.8);
  }
  const topX = x + w / 2;
  if (crown) {
    c.fillRect(topX - 1, y - 18, 2, 18, 0x4a4f7a);
    c.fillRect(topX - 2, y - 20, 4, 2, PAL.red);
    c.blit(buildGlowDisc(8, PAL.red, 3, 0.45), topX - 8, y - 28);
    c.fillRect(x + w * 0.3, y - 3, w * 0.4, 3, neon, 0.9);
  }
}

export function buildSkylineArt(): SceneArt {
  // --- Cielo con resplandor, nubes y luna
  const back = newArt();
  back.fillGradientV(0, 0, ART_W, HORIZON + 8, [
    { at: 0, color: PAL.ink },
    { at: 0.3, color: 0x1a0f3d },
    { at: 0.58, color: 0x4a1f6a },
    { at: 0.82, color: 0xb0407a },
    { at: 1, color: 0xff8a6a }
  ], 28);
  back.fillRect(0, HORIZON + 8, ART_W, ART_H, 0x0a0618);
  stars(back, 7, 140, 90);
  back.blit(buildGlowDisc(50, PAL.blush, 5, 0.22), 340, 4);
  back.fillCircle(390, 54, 21, 0xf6d4e6);
  for (const [dx, dy, r] of [[-7, -5, 5], [6, 5, 4], [-2, 8, 3], [8, -8, 2]] as const) back.fillCircle(390 + dx, 54 + dy, r, 0xd9a8c8, 0.65);
  const rnd = createRng(3);
  for (let i = 0; i < 12; i++) {
    const cx = 20 + rnd() * 470;
    const cy = 70 + rnd() * 52;
    back.fillEllipse(cx, cy, 30 + rnd() * 50, 2 + rnd() * 2.5, 0x8a3a8a, 0.35);
    back.fillEllipse(cx, cy + 1, 22 + rnd() * 30, 1.2, 0xff9a8a, 0.2);
  }
  // nubes que pasan despacio (capa que se repite sin cortes)
  const clouds = new PixelCanvas(ART_W, ART_H);
  const cr = createRng(15);
  for (let i = 0; i < 9; i++) {
    const cx = (i * 61 + cr() * 30) % ART_W;
    const cy = 52 + cr() * 70;
    const w = 26 + cr() * 44;
    for (const dx of [0, -ART_W, ART_W]) {
      clouds.fillEllipse(cx + dx, cy, w, 3.2 + cr() * 2, 0x9a4a9a, 0.34);
      clouds.fillEllipse(cx + dx - 3, cy - 1.5, w * 0.6, 2.2, 0xff9a8a, 0.26);
      clouds.fillEllipse(cx + dx + 4, cy + 1.5, w * 0.7, 1.6, 0x4a2a7a, 0.3);
    }
  }

  // --- Ciudad lejana entre la bruma (más clara = más lejos)
  const far = newArt();
  skyline(far, 21, HORIZON, 24, 78, 0x3a2a78, 0.18);
  skyline(far, 22, HORIZON + 1, 14, 52, 0x2a1a60, 0.22);
  for (let x = 14; x < ART_W; x += 34) far.fillRect(x, HORIZON - 28 - (x % 44), 1, 18 + (x % 22), x % 68 === 14 ? PAL.cyan : PAL.magenta, 0.5);
  haze(far, HORIZON - 40, HORIZON + 1, 0xb0407a, 0.0, 0.34);
  // pantalla holográfica gigante entre dos torres
  far.fillRect(300, 50, 62, 40, 0x2a0a3a, 0.5);
  far.strokeRect(300, 50, 62, 40, PAL.magenta, 0.7);
  far.fillEllipse(331, 70, 16, 7, PAL.cyan, 0.7);
  far.fillPolygon([{ x: 346, y: 70 }, { x: 356, y: 62 }, { x: 356, y: 78 }], PAL.cyan, 0.7);
  far.fillRect(304, 54, 54, 1, PAL.pink, 0.6);

  // --- Torres protagonistas, puente y bahía con reflejo de espejo
  const mid = newArt();
  const heroes: ReadonlyArray<readonly [number, number, number, number, number]> = [
    [34, 34, 108, PAL.cyan, 1],
    [118, 26, 78, PAL.magenta, 2],
    [232, 46, 132, PAL.magenta, 3],
    [330, 30, 90, PAL.cyan, 4],
    [414, 38, 112, PAL.cyan, 5]
  ];
  for (const [x, w, h, neon, seed] of heroes) tower(mid, x, w, h, neon, seed * 17);
  // puente iluminado con estelas de coches
  mid.fillRect(0, HORIZON + 6, ART_W, 3, 0x0a0618);
  mid.fillRect(0, HORIZON + 5, ART_W, 1, 0x5a4a9a, 0.7);
  for (let x = 6; x < ART_W; x += 20) {
    mid.fillRect(x, HORIZON - 3, 1, 9, 0x2a2550);
    mid.fillRect(x - 1, HORIZON - 4, 3, 1, 0xffcf6b);
    mid.blit(buildGlowDisc(5, 0xffcf6b, 2, 0.25), x - 5, HORIZON - 9);
  }
  // bahía
  mid.fillGradientV(0, HORIZON + 9, ART_W, PARAPET - HORIZON, [{ at: 0, color: 0x3a1a60 }, { at: 0.35, color: 0x1a0f3a }, { at: 1, color: 0x07040f }], 14);
  const comp = new PixelCanvas(ART_W, ART_H);
  comp.blit(back, 0, 0);
  comp.blit(far, 0, 0);
  comp.blit(mid, 0, 0);
  reflectDown(mid, comp, HORIZON + 9, PARAPET - HORIZON - 12, 0.62, 2.4);
  const rr = createRng(9);
  for (let i = 0; i < 60; i++) mid.fillRect(rr() * ART_W, HORIZON + 12 + rr() * 34, 4 + rr() * 22, 1, rr() < 0.5 ? PAL.blush : 0xffe9a8, 0.1 + rr() * 0.18);
  for (const [bx, by] of [[150, 160], [350, 168]] as const) {
    mid.fillPolygon([{ x: bx, y: by }, { x: bx + 24, y: by }, { x: bx + 19, y: by + 4 }, { x: bx + 4, y: by + 4 }], 0x05020d);
    mid.fillRect(bx + 11, by - 10, 1, 10, 0x05020d);
    mid.fillRect(bx + 10, by - 11, 3, 2, 0xffcf6b);
    mid.blit(buildGlowDisc(10, 0xffcf6b, 3, 0.4), bx + 1, by - 20);
    mid.fillRect(bx - 4, by + 5, 30, 1, 0xffcf6b, 0.25);
  }

  // dos carriles de coches en el puente que avanzan en sentidos contrarios
  const laneA = new PixelCanvas(ART_W, ART_H);
  const laneB = new PixelCanvas(ART_W, ART_H);
  const lr = createRng(33);
  for (let x = 0; x < ART_W; x += 10) {
    if (lr() < 0.62) {
      laneA.setPixel(x, HORIZON + 4, 0xffe9a8, 0.95);
      laneA.setPixel(x + 1, HORIZON + 4, 0xffe9a8, 0.6);
    }
    if (lr() < 0.58) {
      laneB.setPixel(x, HORIZON + 8, PAL.red, 0.95);
      laneB.setPixel(x + 1, HORIZON + 8, PAL.red, 0.6);
    }
  }

  // --- Azotea en primer plano: pretil, instalaciones y Adrián con su cafecito
  const roof = newArt();
  roof.fillRect(0, PARAPET, ART_W, ART_H - PARAPET, 0x120a2a);
  roof.fillGradientV(0, PARAPET, ART_W, 6, [{ at: 0, color: 0x6a5ab0 }, { at: 1, color: 0x2a1a60 }], 6);
  roof.fillRect(0, PARAPET + 6, ART_W, 1, 0x05020d);
  for (let x = 0; x < ART_W; x += 60) roof.fillRect(x, PARAPET + 7, 1, ART_H, 0x05020d, 0.5);
  roof.fillGradientV(0, PARAPET + 7, ART_W, 30, [{ at: 0, color: 0x241450 }, { at: 1, color: 0x0a0618 }], 8);
  haze(roof, PARAPET - 3, PARAPET, 0xff8ac8, 0.0, 0.18);
  waterTank(roof, 420, PARAPET - 26);
  antenna(roof, 468, PARAPET, 40);
  acUnit(roof, 380, PARAPET - 9);
  acUnit(roof, 396, PARAPET - 9);
  roof.fillRect(360, PARAPET - 16, 2, 16, 0x2a2550);
  roof.fillRect(350, PARAPET - 17, 18, 2, 0xffcf6b);
  roof.blit(buildGlowDisc(22, 0xffcf6b, 4, 0.3), 343, PARAPET - 40);
  contactShadow(roof, 96, PARAPET + 1, 40, 0.5);
  const adrian = sipActor({ x: 96, footY: PARAPET + 15, height: SCALE.adult, facing: 1, pose: 'sit', seat: 15 / SCALE.adult, top: 0x2d2478, topLight: 0x5a4bd0, bottom: 0x1f3068, outfit: 'jacket', glasses: PAL.cyan, hairStyle: 'messy', rim: PAL.magenta, shoe: 0xece6fa, noShadow: true });

  // --- Hojas de palmera, gruesas y bonitas, enmarcando la escena (se mecen)
  const sway: ReturnType<typeof swayActor>[] = [];
  const leaves: ReadonlyArray<readonly [number, number, number, number, number, number]> = [
    [4, 6, 1, 0.12, 120, 0], [4, 14, 0.9, 0.36, 100, 700], [2, 4, 0.7, 0.62, 78, 1400],
    [118, 4, -1, 0.1, 112, 400], [114, 12, -0.9, 0.34, 98, 1100], [116, 6, -0.7, 0.6, 76, 1800]
  ];
  for (const [ox, oy, dx, dy, len, ph] of leaves) {
    const canvas = new PixelCanvas(130, 90);
    leaf(canvas, ox, oy, dx, dy, len, 0x07120f, 0x1a5a4a, 0.5);
    sway.push(swayActor(canvas, ox === 4 || ox === 2 ? 0 : ART_W - 120, 0, 2, 2800, ph));
  }
  return [
    layer(back, 0.25),
    layer(clouds, 0.3, { tile: true, autoScrollX: -3 }),
    layer(far, 0.5),
    layer(mid, 1),
    layer(laneA, 1, { tile: true, autoScrollX: 46 }),
    layer(laneB, 1, { tile: true, autoScrollX: -40 }),
    layer(roof, 1.1, { actors: [adrian.actor] }),
    layer(new PixelCanvas(ART_W, ART_H), 1.25, { actors: sway })
  ];
}
