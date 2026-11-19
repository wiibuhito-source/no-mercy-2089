import Phaser from 'phaser';
import { lerpColor } from '../../core/color';
import { createRng } from '../../core/rng';
import { BASE_HEIGHT, BASE_WIDTH } from '../../core/version';

// Ciudad de fondo del menú, dibujada por código (arte PROVISIONAL: el arte real
// se hará en Aseprite). La semilla fija hace que salga igual en cada arranque.

export const CITY_TEXTURE_KEY = 'city-backdrop';

const HORIZON_Y = 198; // donde acaban los edificios
const ROAD_TOP = 206; // donde empieza el asfalto
const WINDOW_COLORS: readonly number[] = [0xffe08a, 0x19f3ff, 0xff2bd6];
const NEON_COLORS: readonly number[] = [0xff2bd6, 0x19f3ff, 0xffe08a];
const LAMP_X: readonly number[] = [70, 214, 358, 452];

type Gfx = Phaser.GameObjects.Graphics;

interface Building {
  x: number;
  w: number;
  top: number;
}

interface NeonSpec {
  x: number;
  y: number;
  w: number;
  h: number;
  color: number;
  holo: boolean;
}

function paintSky(g: Gfx): void {
  const top = 0x05020d;
  const mid = 0x2a0a4a;
  const low = 0xc0245f;
  for (let y = 0; y < HORIZON_Y; y += 3) {
    const t = y / HORIZON_Y;
    const color = t < 0.62 ? lerpColor(top, mid, t / 0.62) : lerpColor(mid, low, (t - 0.62) / 0.38);
    g.fillStyle(color, 1);
    g.fillRect(0, y, BASE_WIDTH, 3);
  }
}

function paintStars(g: Gfx, rnd: () => number): void {
  for (let i = 0; i < 45; i++) {
    const x = Math.floor(rnd() * BASE_WIDTH);
    const y = Math.floor(rnd() * 100);
    g.fillStyle(0xffffff, 0.35 + rnd() * 0.5);
    g.fillRect(x, y, 1, 1);
  }
}

/** Sol retro con franjas (estilo synthwave). */
function paintSun(g: Gfx): void {
  const cx = 140;
  const cy = 130;
  const r = 42;
  g.fillStyle(0xff2bd6, 0.06);
  g.fillCircle(cx, cy, r + 26);
  g.fillStyle(0xff2bd6, 0.08);
  g.fillCircle(cx, cy, r + 14);
  for (let dy = -r; dy <= r; dy++) {
    // Franjas que se hacen más gruesas hacia abajo
    if (dy > 6 && (dy - 6) % 8 < Math.round(1 + ((dy - 6) / (r - 6)) * 4)) continue;
    const half = Math.floor(Math.sqrt(r * r - dy * dy));
    const t = (dy + r) / (2 * r);
    const color = t < 0.5 ? lerpColor(0xffe66d, 0xff7b54, t / 0.5) : lerpColor(0xff7b54, 0xff2bd6, (t - 0.5) / 0.5);
    g.fillStyle(color, 1);
    g.fillRect(cx - half, cy + dy, half * 2, 1);
  }
}

function paintFarSkyline(g: Gfx, rnd: () => number): void {
  let x = -6;
  while (x < BASE_WIDTH) {
    const w = 12 + Math.floor(rnd() * 20);
    const h = 34 + Math.floor(rnd() * 60);
    g.fillStyle(0x2a0f4d, 1);
    g.fillRect(x, HORIZON_Y - h, w, h);
    if (rnd() < 0.2) g.fillRect(x + Math.floor(w / 2), HORIZON_Y - h - 8, 1, 8); // antena
    x += w + Math.floor(rnd() * 3);
  }
}

function paintMidSkyline(g: Gfx, rnd: () => number): Building[] {
  const buildings: Building[] = [];
  let x = -10;
  while (x < BASE_WIDTH) {
    const w = 22 + Math.floor(rnd() * 24);
    const h = 46 + Math.floor(rnd() * 46);
    const top = HORIZON_Y - h;
    g.fillStyle(0x120826, 1);
    g.fillRect(x, top, w, h);
    g.fillStyle(0x2b1456, 1);
    g.fillRect(x + w - 1, top, 1, h); // borde con volumen
    if (rnd() < 0.4) {
      g.fillStyle(rnd() < 0.5 ? 0x19f3ff : 0xff2bd6, 0.8);
      g.fillRect(x, top, w, 1); // luz de azotea
    }
    for (let wy = top + 6; wy < HORIZON_Y - 6; wy += 7) {
      for (let wx = x + 3; wx < x + w - 4; wx += 5) {
        if (rnd() < 0.3) {
          g.fillStyle(WINDOW_COLORS[Math.floor(rnd() * WINDOW_COLORS.length)] ?? 0xffe08a, 0.9);
          g.fillRect(wx, wy, 2, 3);
        }
      }
    }
    buildings.push({ x, w, top });
    x += w + 1 + Math.floor(rnd() * 3);
  }
  return buildings;
}

/** Elige en qué edificios van los carteles de neón y el holograma. */
function pickNeons(buildings: Building[]): NeonSpec[] {
  const neons: NeonSpec[] = [];
  let holoCount = 0;
  buildings.forEach((b, i) => {
    if (i % 4 === 1 && neons.length < 6) {
      neons.push({
        x: b.x + 3,
        y: b.top + 8,
        w: 3,
        h: 18 + (i % 3) * 6,
        color: NEON_COLORS[i % NEON_COLORS.length] ?? 0xff2bd6,
        holo: false
      });
    } else if (b.x > 330 && holoCount < 1) {
      neons.push({ x: b.x + 2, y: b.top - 26, w: b.w - 4, h: 22, color: 0x19f3ff, holo: true });
      holoCount++;
    }
  });
  return neons;
}

function paintGround(g: Gfx, neons: NeonSpec[]): void {
  g.fillStyle(0x1b1033, 1);
  g.fillRect(0, HORIZON_Y, BASE_WIDTH, ROAD_TOP - HORIZON_Y); // acera
  g.fillStyle(0x0b0618, 1);
  g.fillRect(0, ROAD_TOP, BASE_WIDTH, BASE_HEIGHT - ROAD_TOP); // asfalto
  g.fillStyle(0x19f3ff, 0.5);
  g.fillRect(0, ROAD_TOP, BASE_WIDTH, 1); // borde de la acera

  // Reflejos de los neones en el asfalto mojado
  for (const n of neons) {
    if (n.holo) continue;
    g.fillStyle(n.color, 0.08);
    g.fillRect(n.x - 1, ROAD_TOP + 1, n.w + 2, BASE_HEIGHT - ROAD_TOP);
  }

  // Líneas de la carretera
  g.fillStyle(0x3a2a66, 1);
  for (let x = 0; x < BASE_WIDTH; x += 48) g.fillRect(x, 244, 26, 2);

  // Farolas
  for (const lx of LAMP_X) {
    g.fillStyle(0x2c1e50, 1);
    g.fillRect(lx, 140, 2, 60);
    g.fillStyle(0xffe08a, 1);
    g.fillRect(lx - 4, 138, 10, 2);
    g.fillStyle(0xffb86b, 0.05);
    g.fillCircle(lx + 1, 141, 11);
    g.fillStyle(0xffb86b, 0.03);
    g.fillCircle(lx + 1, 141, 20);
  }
}

/** Carteles de neón y holograma: objetos aparte para poder animarlos (parpadeo). */
function animateNeons(scene: Phaser.Scene, neons: NeonSpec[]): void {
  neons.forEach((n, i) => {
    const g = scene.add.graphics();
    if (n.holo) {
      g.fillStyle(n.color, 0.14);
      g.fillRect(n.x, n.y, n.w, n.h);
      g.lineStyle(1, n.color, 0.9);
      g.strokeRect(n.x + 0.5, n.y + 0.5, n.w - 1, n.h - 1);
      g.fillStyle(n.color, 0.25);
      for (let yy = n.y + 3; yy < n.y + n.h; yy += 3) g.fillRect(n.x + 1, yy, n.w - 2, 1);
    } else {
      g.fillStyle(n.color, 0.16);
      g.fillRect(n.x - 3, n.y - 3, n.w + 6, n.h + 6);
      g.fillStyle(n.color, 1);
      g.fillRect(n.x, n.y, n.w, n.h);
    }
    scene.tweens.add({
      targets: g,
      alpha: n.holo ? 0.55 : 0.4,
      duration: 700 + i * 230,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: i * 120
    });
  });
}

/** Dibuja la ciudad nocturna de fondo (480x270). */
export function createCityBackdrop(scene: Phaser.Scene): void {
  const g = scene.add.graphics();
  const rnd = createRng(2089);
  paintSky(g);
  paintStars(g, rnd);
  paintSun(g);
  paintFarSkyline(g, rnd);
  const buildings = paintMidSkyline(g, rnd);
  const neons = pickNeons(buildings);
  paintGround(g, neons);
  if (!scene.textures.exists(CITY_TEXTURE_KEY)) {
    g.generateTexture(CITY_TEXTURE_KEY, BASE_WIDTH, BASE_HEIGHT);
  }
  g.destroy();
  scene.add.image(0, 0, CITY_TEXTURE_KEY).setOrigin(0, 0);
  animateNeons(scene, neons);
}
