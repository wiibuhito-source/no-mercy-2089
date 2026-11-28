// Escena 11: 2089. Adrián en su taller, con su cafecito. Suena el móvil: número desconocido.
import { PixelCanvas } from '../../../core/pixelCanvas';
import { drawPixelText } from '../../../core/pixelText';
import { PAL } from '../../../data/menuPalette';
import { buildGlowDisc, buildGlowEllipse } from '../../menu/art/glow';
import { buildNeonSign } from '../../menu/art/neon';
import { ART_W, contactShadow, eraseRect, haze, layer, lightShaft, newArt, personActor, powerLine, sipActor, skyline, stars, swayActor, type ArtActor, type SceneArt } from './kit';
import { buildCatFrames, CAT_H } from './cat';
import { SCALE } from './characters';
import { poster, wallTexture } from './details';

const FLOOR = 206;
const BENCH = 176;
const STOOL_X = 224;
const PHONE_X = 250;

/** Móvil apoyado en su soporte. `ring` = suena (pantalla brillante con la llamada); `n` = fotograma de la animación. */
function phoneSprite(ring: boolean, n: number): PixelCanvas {
  const c = new PixelCanvas(14, 24);
  c.fillPolygon([{ x: 3, y: 23 }, { x: 10, y: 23 }, { x: 8, y: 19 }, { x: 5, y: 19 }], 0x2a2a42); // soporte
  c.fillRect(2, 2, 10, 19, 0x14121e);
  c.strokeRect(2, 2, 10, 19, 0x6a6a9a, 0.9);
  c.fillRect(3, 4, 8, 15, ring ? 0x2a0a3a : 0x0a1220);
  if (!ring) {
    c.fillRect(4, 8, 6, 1, 0x4a6a8a, 0.8); // hora en reposo
    c.fillRect(4, 11, 3, 1, 0x4a6a8a, 0.5);
  } else {
    c.fillRect(3, 4, 8, 15, PAL.magenta, 0.16 + 0.1 * (n % 2));
    c.fillCircle(7, 9, 2.6 + (n % 2) * 0.5, 0xffc8f0, 0.9);
    c.fillCircle(7, 8, 1.1, 0x2a0a3a);
    c.fillRect(5, 11, 4, 1, 0x2a0a3a);
    c.fillRect(4, 15, 2, 2, 0xff3b5c);
    c.fillRect(8, 15, 2, 2, 0x4fffc0);
    c.fillRect(6, 3, 2, 1, 0x05020d);
  }
  return c;
}

/** Ondas de la vibración alrededor del móvil. */
function ringWaves(n: number): PixelCanvas {
  const c = new PixelCanvas(64, 64);
  for (let k = 0; k < 3; k++) {
    const r = 12 + ((n + k * 1.3) % 4) * 6;
    const a = 0.55 - ((n + k * 1.3) % 4) * 0.12;
    for (let t = 0; t < 40; t++) {
      const ang = -2.4 + t * 0.075;
      c.setPixel(32 + Math.cos(ang) * r, 34 + Math.sin(ang) * r * 0.9, PAL.pink, Math.max(0, a));
    }
  }
  return c;
}

/** La llamada entrante proyectada en grande, con la interfaz de un móvil real. 4 fotogramas: anillos que laten, botón verde y flecha que se desliza. */
function callFrames(): PixelCanvas[] {
  return [0, 1, 2, 3].map((n) => {
    const W = 92;
    const H = 134;
    const c = new PixelCanvas(W, H);
    // marco del móvil con esquinas redondeadas
    const body = (x: number, y: number, w: number, h: number, col: number, a = 1): void => {
      c.fillRect(x + 2, y, w - 4, h, col, a);
      c.fillRect(x, y + 2, w, h - 4, col, a);
      c.fillRect(x + 1, y + 1, w - 2, h - 2, col, a);
    };
    body(0, 0, W, H, 0x05020d, 0.9);
    body(1, 1, W - 2, H - 2, PAL.magenta, 0.95);
    body(2, 2, W - 4, H - 4, 0x14091f, 1);
    // pantalla con degradado
    c.fillGradientV(5, 6, W - 10, H - 12, [{ at: 0, color: 0x2a0a3a }, { at: 1, color: 0x0a0414 }], 14);
    for (let y = 8; y < H - 8; y += 3) c.fillRect(6, y, W - 12, 1, PAL.magenta, 0.05);
    c.fillRect(W / 2 - 8, 3, 16, 3, 0x05020d); // cámara frontal
    c.fillCircle(W / 2 + 4, 4.5, 1, 0x2a5a8a);
    // barra de estado: hora, cobertura, batería
    drawPixelText(c, '03:12', 9, 10, { color: 0xffffff });
    for (let i = 0; i < 4; i++) c.fillRect(W - 36 + i * 3, 16 - i * 2, 2, 2 + i * 2, 0xffffff, i < 3 ? 0.95 : 0.4);
    c.strokeRect(W - 20, 10, 11, 6, 0xffffff, 0.9);
    c.fillRect(W - 19, 11, 7, 4, 0x4fffc0);
    c.fillRect(W - 9, 12, 1, 2, 0xffffff);
    drawPixelText(c, 'LLAMANDO...', 12, 22, { color: PAL.pink });
    // avatar desconocido con anillos que laten
    const cx = W / 2;
    const cy = 52;
    for (let k = 0; k < 3; k++) {
      const r = 21 + ((n + k) % 4) * 4;
      const a = 0.5 - ((n + k) % 4) * 0.11;
      for (let t = 0; t < 120; t++) c.setPixel(cx + Math.cos(t * 0.0524) * r, cy + Math.sin(t * 0.0524) * r, PAL.magenta, Math.max(0, a));
    }
    c.fillCircle(cx, cy, 19, 0x4a1a5a);
    c.fillCircle(cx, cy, 17, 0x2a0a3a);
    c.fillCircle(cx, cy - 5, 6, 0x8a5a9a);
    c.fillEllipse(cx, cy + 14, 12, 8, 0x8a5a9a);
    drawPixelText(c, '?', cx - 2, cy - 7, { color: 0xffffff });
    // nombre y prefijo
    drawPixelText(c, 'NÚMERO', 28, 80, { color: 0xffffff });
    drawPixelText(c, 'DESCONOCIDO', 14, 90, { color: PAL.blush });
    drawPixelText(c, '+1 305 ...', 16, 101, { color: PAL.sun });
    c.fillRect(13, 109, 66, 1, PAL.magenta, 0.4);
    // botones: colgar (rojo) y coger (verde, con halo que late) y flecha de deslizar
    c.fillCircle(21, 121, 8, 0xc02a4a);
    c.line(17, 117, 25, 125, 0xffffff);
    c.line(25, 117, 17, 125, 0xffffff);
    const g = 8 + (n % 2);
    c.fillCircle(71, 121, g + 3, 0x1ff3a0, 0.18);
    c.fillCircle(71, 121, 8, 0x1fc070);
    c.thickLine(67, 124, 75, 118, 1.3, 0xffffff);
    c.fillCircle(67, 124, 1.8, 0xffffff);
    c.fillCircle(75, 118, 1.8, 0xffffff);
    for (let i = 0; i < 3; i++) {
      const x = 36 + ((i + n) % 3) * 5;
      c.line(x, 118, x + 3, 121, 0xffffff, 0.35 + 0.2 * ((i + n) % 3));
      c.line(x + 3, 121, x, 124, 0xffffff, 0.35 + 0.2 * ((i + n) % 3));
    }
    c.blit(buildGlowDisc(60, PAL.magenta, 4, 0.1), W / 2 - 60, H / 2 - 60);
    return c;
  });
}

export function buildPresentArt(): SceneArt {
  // --- La ciudad al otro lado del portón
  const back = newArt();
  back.fillGradientV(0, 0, ART_W, 200, [{ at: 0, color: PAL.ink }, { at: 0.7, color: 0x4a1f6a }, { at: 1, color: 0xa03a8a }], 14);
  stars(back, 5, 50, 100);
  back.fillCircle(440, 54, 9, 0xf6d4e6);
  skyline(back, 13, 170, 24, 110, 0x241450, 0.34);
  skyline(back, 14, 186, 12, 50, 0x0d0722, 0.24);
  back.fillRect(0, 186, ART_W, 94, 0x0d0722);

  const c = newArt();
  c.fillGradientV(0, 0, ART_W, FLOOR, [{ at: 0, color: 0x0b0618 }, { at: 1, color: 0x1c1244 }], 12);
  wallTexture(c, 0, 0, 360, FLOOR, 51, 0.08, 0x05020d);
  // portón enrollable abierto: se ve la ciudad
  const gx = 346, gy = 28, gw = 140, gh = 142;
  eraseRect(c, gx, gy, gw, gh);
  for (let y = gy; y < gy + 14; y += 4) c.fillRect(gx, y, gw, 3, 0x241a5a);
  c.strokeRect(gx - 2, gy - 2, gw + 4, gh + 4, 0x4a3a90);
  // pared de herramientas con contornos luminosos
  for (let y = 20; y < 150; y += 6) for (let x = 12; x < 210; x += 6) c.putPixel(x, y, 0x2a1c5a, 1);
  for (const [x, y, w, h, col] of [[22, 40, 4, 40, 0x9ab0c8], [38, 34, 3, 46, 0xff7a6a], [52, 42, 12, 4, 0x9ab0c8], [52, 42, 3, 30, 0x9ab0c8], [76, 36, 4, 44, 0xffd36b], [92, 40, 3, 36, 0x9ab0c8]] as const) {
    c.fillRect(x, y, w, h, col, 0.85);
    c.fillRect(x, y, 1, h, 0xffffff, 0.3);
  }
  // radio con el dial encendido, reloj, cuadro y estante
  c.fillRect(100, 58, 32, 18, 0x4a3a62);
  c.strokeRect(100, 58, 32, 18, 0x9a8ac2);
  c.fillRect(104, 62, 15, 8, 0x1a0f2a);
  c.fillRect(106, 65, 11, 1, PAL.sun, 0.95);
  c.fillCircle(125, 66, 3, 0x2a1a4a);
  c.line(130, 58, 142, 40, 0x9a8ac2);
  c.blit(buildGlowDisc(16, PAL.sun, 3, 0.28), 102, 52);
  c.fillCircle(176, 56, 11, 0x0a0a1e);
  c.fillCircle(176, 56, 9, 0xcfc8e8);
  c.fillCircle(176, 56, 8, 0x1a1030);
  for (let i = 0; i < 12; i++) c.setPixel(176 + Math.cos(i * 0.5236) * 7, 56 + Math.sin(i * 0.5236) * 7, 0xcfc8e8, 0.9);
  c.line(176, 56, 176, 50, PAL.sun);
  c.line(176, 56, 180, 58, PAL.sun);
  poster(c, 56, 96, 16, 22, 3);
  c.fillRect(196, 84, 70, 3, 0x6a5a9a);
  for (const [x, w, h, col] of [[200, 14, 12, 0x2a2a52], [218, 10, 18, 0x24304a], [232, 16, 10, 0x3a2a5a], [252, 10, 14, 0x2a2a52]] as const) c.fillRect(x, 84 - h, w, h, col);
  c.fillRect(204, 76, 3, 3, PAL.cyan);
  const sign = buildNeonSign('TALLER', PAL.cyan, 2);
  c.blit(sign.glow, 262 - sign.glowPad, 36 - sign.glowPad);
  c.blit(sign.on, 262, 36);
  // el coche, medio desmontado, subido en el elevador
  c.fillRect(254, 112, 4, 84, 0x3a3a5a);
  c.fillRect(392, 112, 4, 84, 0x3a3a5a);
  c.fillRect(250, 108, 150, 4, 0x6a6a9a);
  c.fillPolygon([{ x: 266, y: 140 }, { x: 286, y: 120 }, { x: 370, y: 120 }, { x: 392, y: 140 }, { x: 402, y: 140 }, { x: 402, y: 168 }, { x: 262, y: 168 }, { x: 262, y: 142 }], 0x1a2a6a);
  c.fillPolygon([{ x: 290, y: 124 }, { x: 306, y: 124 }, { x: 306, y: 138 }, { x: 280, y: 138 }], 0x0a0a1e);
  c.fillPolygon([{ x: 314, y: 124 }, { x: 366, y: 124 }, { x: 382, y: 138 }, { x: 314, y: 138 }], 0x0a0a1e);
  c.fillRect(262, 140, 140, 2, 0x4a6aff, 0.8);
  c.fillRect(266, 156, 136, 1, PAL.cyan, 0.6);
  c.fillRect(262, 164, 140, 4, 0x0a0a1e);
  c.fillRect(288, 112, 62, 8, 0x4a3a62);
  for (const wxx of [286, 372]) {
    c.fillCircle(wxx, 170, 12, 0x05020d);
    c.fillCircle(wxx, 170, 6, 0x2a2a52);
  }
  c.blit(buildGlowEllipse(76, 10, PAL.cyan, 4, 0.25), 254, 164);
  // suelo, aceite, neumáticos y barril
  c.fillRect(0, FLOOR, ART_W, 74, 0x0a0618);
  c.fillRect(0, FLOOR, ART_W, 2, 0x3a2a80);
  c.fillEllipse(280, 232, 56, 6, 0x14102a, 0.9);
  for (let i = 0; i < 3; i++) {
    c.fillEllipse(34, 200 - i * 9, 22, 5, 0x0a0a14);
    c.fillEllipse(34, 200 - i * 9, 9, 2, 0x2a2a42);
  }
  c.fillRect(470, 164, 22, 40, 0x2a5a8a);
  c.fillRect(470, 164, 22, 3, 0x4a8aca);
  for (const y of [172, 188]) c.fillRect(470, y, 22, 2, 0x1a3a5a);
  // lámpara colgante con su cono de luz
  c.fillRect(160, 0, 1, 74, 0x3a3a5a);
  c.fillRect(150, 74, 22, 6, 0x4a4a6a);
  c.fillRect(153, 80, 16, 3, PAL.window);
  c.blit(buildGlowDisc(64, 0xffcf6b, 5, 0.26), 129, 54);
  lightShaft(c, 161, 84, 16, 130, 92, 0xffcf6b, 0.14);

  // --- El banco de trabajo (detrás de Adrián) con sus cosas
  c.fillRect(100, BENCH, 370, 8, 0x5a4a72);
  c.fillRect(100, BENCH, 370, 1, 0xc8b8e8);
  c.fillRect(100, BENCH + 8, 370, 34, 0x2a1f44);
  c.fillRect(110, BENCH + 10, 6, 32, 0x1a1230);
  c.fillRect(452, BENCH + 10, 6, 32, 0x1a1230);
  c.fillRect(300, BENCH + 14, 90, 14, 0x1a1230);
  c.strokeRect(300, BENCH + 14, 90, 14, 0x4a3f6a, 0.9);
  c.fillRect(340, BENCH + 19, 14, 3, 0x8a7a9a);
  c.fillRect(436, BENCH - 8, 24, 8, 0x6a6a7a);
  c.fillRect(410, BENCH - 6, 20, 6, 0x4a5a7a);
  c.fillRect(120, BENCH - 14, 24, 14, 0x24304a);
  c.strokeRect(120, BENCH - 14, 24, 14, 0x6a8ab0);
  c.fillRect(123, BENCH - 11, 18, 8, 0x05140f);
  c.fillRect(123, BENCH - 11, 10, 1, 0x4fffc0);
  c.fillRect(123, BENCH - 8, 14, 1, 0x4fffc0, 0.6);
  c.fillRect(160, BENCH - 8, 12, 8, 0x3a3a5a);
  c.fillRect(164, BENCH - 14, 2, 6, 0xffd36b);
  c.fillRect(168, BENCH - 16, 2, 8, 0xff7a6a);
  haze(c, FLOOR - 28, FLOOR, 0x6a5ab0, 0.0, 0.1);

  // --- Gato y móvil sobre el banco
  // El gato es pequeño: su sprite tiene CAT_H filas y el gato apoya a 1 fila del borde de abajo (contorno incluido)
  const catFrames = buildCatFrames();
  const cat: ArtActor = { canvas: catFrames[0] ?? new PixelCanvas(1, 1), x: 398, y: BENCH + 1 - CAT_H, bobPx: 0, bobMs: 1000, phaseMs: 0, frames: catFrames, frameMs: 230 };
  const phoneIdle: ArtActor = { canvas: phoneSprite(false, 0), x: PHONE_X, y: BENCH - 22, bobPx: 0, bobMs: 1000, phaseMs: 0 };

  // --- Adrián, adulto, en el taburete: da sorbos a su cafecito
  const stool = new PixelCanvas(ART_W, 280);
  stool.fillRect(STOOL_X - 10, FLOOR - 26, 20, 3, 0x6a6a9a);
  stool.fillRect(STOOL_X - 10, FLOOR - 26, 20, 1, 0xffffff, 0.3);
  stool.fillRect(STOOL_X - 8, FLOOR - 23, 2, 23, 0x3a3a5a);
  stool.fillRect(STOOL_X + 6, FLOOR - 23, 2, 23, 0x3a3a5a);
  stool.fillRect(STOOL_X - 8, FLOOR - 12, 16, 1, 0x3a3a5a);
  contactShadow(stool, STOOL_X, FLOOR, 32, 0.6);
  const style = { x: STOOL_X, footY: FLOOR, height: SCALE.adult, facing: 1 as const, pose: 'sit' as const, seat: 28 / SCALE.adult, top: 0x3a4cc0, topLight: 0x7a8cff, bottom: 0x24407e, outfit: 'jacket' as const, glasses: PAL.cyan, hairStyle: 'messy' as const, rim: PAL.magenta, shoe: 0xece6fa, noShadow: true };
  const idle = sipActor(style);
  // …y cuando suena, deja la taza en el banco y se inclina a por el móvil
  const alert = personActor({ ...style, lean: 0.1, reachTo: { x: PHONE_X - 2, y: BENCH - 8 } }, 1, 1800);
  const cupDown = new PixelCanvas(ART_W, 280);
  cupDown.fillRect(204, BENCH - 5, 5, 5, 0xfff0d2);
  cupDown.fillRect(209, BENCH - 4, 2, 3, 0xfff0d2, 0.75);
  cupDown.fillRect(204, BENCH - 5, 3, 1, 0x7a4a2a);

  // --- El móvil suena: vibra, ondas y su pantalla proyectada en grande como una llamada real
  const phoneRing: ArtActor = {
    canvas: phoneSprite(true, 0),
    x: PHONE_X,
    y: BENCH - 22,
    bobPx: 0,
    bobMs: 1000,
    phaseMs: 0,
    swayPx: 1,
    swayMs: 90,
    frames: [0, 1, 2, 3].map((n) => phoneSprite(true, n)),
    frameMs: 160
  };
  const waves: ArtActor = { canvas: ringWaves(0), x: PHONE_X + 7 - 32, y: BENCH - 14 - 34, bobPx: 0, bobMs: 1000, phaseMs: 0, frames: [0, 1, 2, 3].map(ringWaves), frameMs: 170 };
  const frames = callFrames();
  const holoPhone: ArtActor = { canvas: frames[0] ?? new PixelCanvas(1, 1), x: 362, y: 20, bobPx: 1, bobMs: 1900, phaseMs: 0, frames, frameMs: 210 };
  const beam = new PixelCanvas(ART_W, 280);
  beam.fillPolygon([{ x: PHONE_X + 5, y: BENCH - 20 }, { x: 362, y: 24 }, { x: 362, y: 150 }], PAL.magenta, 0.0);
  for (let i = 0; i < 60; i++) {
    const k = i / 60;
    beam.fillRect(PHONE_X + 5 + k * 110, BENCH - 20 - k * 70 - k * 18, 2, 6 + k * 50, PAL.magenta, 0.05 * (1 - k * 0.4));
  }
  beam.blit(buildGlowDisc(34, PAL.magenta, 4, 0.34), PHONE_X - 24, BENCH - 40);

  // --- Primer plano: neumáticos y cable desenfocados
  const front = new PixelCanvas(ART_W, 280);
  front.fillEllipse(24, 266, 44, 26, 0x05020d);
  front.fillEllipse(34, 248, 26, 14, 0x0a0a14);
  front.fillEllipse(484, 272, 40, 20, 0x05020d);
  const cable = new PixelCanvas(120, 30);
  powerLine(cable, 0, 2, 118, 8, 18, 0x05020d, 0.95);

  return [
    layer(back, 0.3),
    layer(c, 1, { actors: [cat, phoneIdle] }),
    layer(stool, 1),
    layer(new PixelCanvas(ART_W, 280), 1, { actors: [idle.actor], hideAtLine: 2, fadeMs: 160 }),
    layer(cupDown, 1, { actors: [alert.actor], revealAtLine: 2, fadeMs: 160 }),
    layer(beam, 1, { revealAtLine: 2, actors: [phoneRing, waves, holoPhone] }),
    layer(front, 1.25, { actors: [swayActor(cable, 330, 0, 1, 3200)] })
  ];
}
void ART_W;
