import Phaser from 'phaser';

// Coche con Adrián Vega al volante, dibujado por código (arte PROVISIONAL).
// Es una ilustración de pantalla de título: el juego en sí sigue siendo cenital.

export const CAR_TEXTURE_KEY = 'car-art';
const CAR_W = 200;
const CAR_H = 72;

type Gfx = Phaser.GameObjects.Graphics;

function poly(g: Gfx, color: number, points: ReadonlyArray<readonly [number, number]>): void {
  g.fillStyle(color, 1);
  g.fillPoints(
    points.map(([x, y]) => ({ x, y })),
    true
  );
}

function drawCarArt(g: Gfx): void {
  // Carrocería (dos piezas convexas: bajos y cabina)
  poly(g, 0x241a55, [[3, 58], [3, 42], [20, 34], [160, 34], [194, 40], [198, 50], [194, 58]]);
  poly(g, 0x241a55, [[62, 34], [86, 12], [132, 12], [160, 34]]);
  g.fillStyle(0x6a5cff, 1);
  g.fillRect(86, 12, 46, 1); // brillo del techo
  g.fillStyle(0x3a2d80, 1);
  g.fillRect(20, 34, 140, 1); // línea de cintura
  g.fillStyle(0x0d0a1a, 1);
  g.fillRect(1, 32, 24, 3); // alerón
  g.fillRect(8, 35, 2, 6);
  g.fillStyle(0xff2bd6, 1);
  g.fillRect(6, 46, 186, 2); // franja de neón

  // Cristal de la cabina
  poly(g, 0x0b1d44, [[76, 33], [90, 16], [128, 16], [150, 33]]);
  g.fillStyle(0x3b6cff, 0.25);
  g.fillTriangle(96, 17, 108, 17, 88, 33); // reflejo

  // Adrián: reposacabezas, chaqueta con ribete neón, cabeza, pelo y gafas de neón
  g.fillStyle(0x15102e, 1);
  g.fillRect(93, 20, 8, 13);
  poly(g, 0x222a66, [[96, 33], [100, 28], [124, 28], [128, 33]]);
  g.fillStyle(0x19f3ff, 1);
  g.fillRect(100, 28, 24, 1);
  g.fillStyle(0xb57a55, 1);
  g.fillRect(110, 27, 5, 3); // cuello
  g.fillStyle(0xc68b62, 1);
  g.fillCircle(112, 23, 5); // cabeza
  g.fillStyle(0x120a14, 1);
  g.fillRect(106, 17, 12, 4); // pelo
  g.fillRect(106, 21, 2, 4);
  g.fillStyle(0x19f3ff, 1);
  g.fillRect(113, 22, 6, 2); // gafas de neón
  g.fillStyle(0x222a66, 1);
  g.fillRect(118, 29, 8, 3); // brazo
  g.fillStyle(0xc68b62, 1);
  g.fillRect(125, 29, 3, 2); // mano
  g.fillStyle(0x07050f, 1);
  g.fillRect(127, 25, 2, 8); // volante

  // Puerta y luces
  g.fillStyle(0x0f0a26, 1);
  g.fillRect(88, 36, 1, 18);
  g.fillRect(124, 36, 1, 18);
  g.fillStyle(0x8a8fb5, 1);
  g.fillRect(100, 39, 8, 2); // tirador
  g.fillStyle(0xfff3b0, 1);
  g.fillRect(190, 42, 7, 4); // faro
  g.fillStyle(0xff3b3b, 1);
  g.fillRect(3, 42, 4, 5); // piloto trasero

  // Ruedas
  for (const cx of [44, 150]) {
    g.fillStyle(0x05030c, 1);
    g.fillCircle(cx, 58, 14);
    g.fillStyle(0x0d0a1a, 1);
    g.fillCircle(cx, 58, 12);
    g.fillStyle(0x8a8fb5, 1);
    g.fillCircle(cx, 58, 7);
    g.fillStyle(0x0b0618, 1);
    g.fillCircle(cx, 58, 3);
    g.fillStyle(0x19f3ff, 1);
    g.fillRect(cx - 1, 57, 2, 2);
  }
}

/** Pone el coche con el protagonista; (x, y) es su esquina superior izquierda. */
export function createCar(scene: Phaser.Scene, x: number, y: number): void {
  // Resplandor rosa bajo el coche
  const underglow = scene.add.graphics();
  underglow.fillStyle(0xff2bd6, 0.3);
  underglow.fillEllipse(x + 100, y + 69, 190, 9);
  underglow.fillStyle(0xff2bd6, 0.18);
  underglow.fillEllipse(x + 100, y + 69, 214, 15);

  // Haz de luz del faro
  const beam = scene.add.graphics();
  beam.fillStyle(0xe9fbff, 0.16);
  beam.fillTriangle(x + 196, y + 44, x + 280, y + 28, x + 280, y + 68);

  if (!scene.textures.exists(CAR_TEXTURE_KEY)) {
    const g = scene.add.graphics();
    drawCarArt(g);
    g.generateTexture(CAR_TEXTURE_KEY, CAR_W, CAR_H);
    g.destroy();
  }
  scene.add.image(x, y, CAR_TEXTURE_KEY).setOrigin(0, 0);

  scene.tweens.add({ targets: underglow, alpha: 0.55, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  scene.tweens.add({ targets: beam, alpha: 0.6, duration: 2100, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
}
