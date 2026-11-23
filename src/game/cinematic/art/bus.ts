// Escena 10: esa misma noche. Adrián deja el barrio en un autobús nocturno; la ciudad pasa por la ventanilla.
import { PixelCanvas } from '../../../core/pixelCanvas';
import { drawPixelText } from '../../../core/pixelText';
import { PAL } from '../../../data/menuPalette';
import { buildGlowDisc } from '../../menu/art/glow';
import { ART_W, eraseRect, layer, newArt, personActor, sky, skylineWrap, stars, swayActor, type SceneArt } from './kit';
import { poster } from './details';

const WX = 92, WY = 36, WW = 316, WH = 132;

export function buildBusArt(): SceneArt {
  const back = newArt();
  sky(back, 220, [{ at: 0, color: PAL.ink }, { at: 0.55, color: 0x2a1450 }, { at: 1, color: 0x7a2a7a }]);
  stars(back, 91, 90, 100);

  const far = newArt();
  skylineWrap(far, 92, 180, 40, 110, 0x241450, 0.2, [PAL.cyan, PAL.magenta]);
  // Edificios cercanos y farolas que pasan (se repiten cada 125 px)
  const near = newArt();
  skylineWrap(near, 93, 250, 80, 170, 0x120a2a, 0.26, [PAL.pink, PAL.cyan]);
  near.fillRect(0, 196, ART_W, 90, 0x0a0714);
  near.fillRect(0, 196, ART_W, 2, 0x3a3060);
  for (let x = 0; x < ART_W; x += 20) near.fillRect(x, 214, 10, 2, 0x8a8fb5, 0.5);
  for (let x = 40; x < ART_W; x += 125) {
    near.fillRect(x, 92, 3, 104, 0x1c1844);
    near.fillRect(x - 8, 90, 16, 3, 0x1c1844);
    near.fillRect(x - 8, 93, 16, 2, 0xffe9a8);
    near.blit(buildGlowDisc(26, 0xffcf6b, 4, 0.34), x - 24, 70);
  }

  // El interior del autobús, con el ventanal abierto a la ciudad
  const c = newArt();
  c.fillGradientV(0, 0, ART_W, 280, [{ at: 0, color: 0x0b0618 }, { at: 1, color: 0x120a2a }], 8);
  eraseRect(c, WX, WY, WW, WH);
  c.strokeRect(WX - 3, WY - 3, WW + 6, WH + 6, 0x3a2a70);
  for (const x of [WX + 104, WX + 210]) {
    c.fillRect(x, WY, 4, WH, 0x120a2a);
    c.fillRect(x + 3, WY, 1, WH, 0x3a2a70, 0.6);
  }
  c.fillRect(0, 0, ART_W, 26, 0x05020d);
  c.fillRect(0, 24, ART_W, 2, 0x2b1a63);
  for (let x = 30; x < ART_W; x += 110) {
    c.fillRect(x, 10, 54, 3, 0xdfe6ff, 0.85);
    c.fillRect(x - 2, 8, 58, 7, 0xdfe6ff, 0.1);
  }
  // Letrero de ruta
  c.fillRect(204, 28, 90, 12, 0x05020d);
  c.strokeRect(204, 28, 90, 12, 0x6a5a1a);
  drawPixelText(c, 'RUTA 12 NORTE', 211, 31, { color: PAL.sun });
  // Asiento corrido bajo la ventanilla y pared
  c.fillRect(0, 170, ART_W, 110, 0x161030);
  c.fillRect(0, 170, ART_W, 2, 0x2b1a63);
  c.fillRect(70, 176, 360, 12, 0x3a2a70);
  c.fillRect(70, 176, 360, 2, 0x6a5ab0);
  c.fillRect(70, 188, 360, 22, 0x24174a);
  c.fillRect(0, 214, ART_W, 66, 0x0a0618);
  c.fillRect(70, 160, 360, 3, 0x6a6a8a);
  // Anuncios del interior y una segunda pasajera
  poster(c, 112, 188, 14, 20, 11);
  poster(c, 150, 190, 10, 16, 12);
  c.fillRect(300, 24, 60, 8, 0x05020d);
  c.fillRect(302, 26, 56, 4, PAL.pink, 0.55);
  const standing = personActor({ x: 300, footY: 196, height: 50, facing: -1, pose: 'sit', top: 0x2a8a8a, topLight: 0x4acaca, bottom: 0x1a2a4a, hair: 0x120a10, rim: PAL.cyan }, 1, 2900, 200);
  // Un pasajero dormido al fondo
  const sleeper = personActor({ x: 376, footY: 194, height: 46, facing: -1, pose: 'sit', top: 0x5a2a7a, topLight: 0x8a4aaa, bottom: 0x1a1a36, hood: true, rim: PAL.pink }, 1, 3200, 800);
  // Adrián, de 18 años, mirando por la ventanilla
  const kid = personActor({ x: 196, footY: 196, height: 50, facing: 1, pose: 'sit', top: 0x3b6fd0, topLight: 0x6ab0ff, bottom: 0x1f3068, rim: PAL.pink }, 1, 2400);

  // Primer plano: respaldo del asiento delantero, barra, correas y gotas en el cristal
  const front = new PixelCanvas(ART_W, 280);
  front.fillRect(0, 226, 130, 54, 0x05020d);
  front.fillEllipse(54, 226, 56, 18, 0x05020d);
  front.fillRect(54, 40, 7, 240, 0x1a1a30);
  front.fillRect(56, 40, 2, 240, 0x6a6a8a, 0.8);
  const straps = [150, 250, 340].map((x, i) => {
    const s = new PixelCanvas(14, 36);
    s.fillRect(6, 0, 1, 20, 0x05020d);
    s.strokeRect(1, 20, 11, 13, 0x05020d);
    s.strokeRect(2, 21, 9, 11, 0x1a1a30, 0.8);
    return swayActor(s, x - 6, 26, 2, 2300, i * 500);
  });
  for (let i = 0; i < 26; i++) {
    const x = WX + 8 + ((i * 97) % (WW - 16));
    const y = WY + 6 + ((i * 53) % (WH - 14));
    front.fillCircle(x, y, 1.4, 0xdfe6ff, 0.35);
    front.setPixel(x - 1, y - 1, 0xffffff, 0.8);
    if (i % 3 === 0) front.line(x, y + 2, x, y + 7 + (i % 5), 0xdfe6ff, 0.22);
  }
  return [layer(back, 0.05), layer(far, 0.1, { tile: true, autoScrollX: -16 }), layer(near, 0.2, { tile: true, autoScrollX: -90 }), layer(c, 1, { actors: [sleeper.actor, standing.actor, kid.actor] }), layer(front, 1.15, { actors: straps })];
}
