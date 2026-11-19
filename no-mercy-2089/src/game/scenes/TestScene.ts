import Phaser from 'phaser';
import { BASE_HEIGHT, BASE_WIDTH, GAME_TAGLINE, buildBanner } from '../../core/version';

/** Escena de prueba del Prototipo 0.0: solo comprueba que todo arranca. */
export class TestScene extends Phaser.Scene {
  constructor() {
    super('TestScene');
  }

  create(): void {
    const cx = BASE_WIDTH / 2;
    const cy = BASE_HEIGHT / 2;

    // Marco de neón (formas de color: el arte real llega más adelante)
    const g = this.add.graphics();
    g.lineStyle(2, 0xff2bd6, 1).strokeRect(8, 8, BASE_WIDTH - 16, BASE_HEIGHT - 16);
    g.lineStyle(1, 0x19f3ff, 1).strokeRect(12, 12, BASE_WIDTH - 24, BASE_HEIGHT - 24);

    this.add
      .text(cx, cy - 20, buildBanner(), {
        fontFamily: 'monospace', fontSize: '16px', color: '#19f3ff', align: 'center'
      })
      .setOrigin(0.5);

    const tag = this.add
      .text(cx, cy + 30, GAME_TAGLINE, { fontFamily: 'monospace', fontSize: '12px', color: '#ff2bd6' })
      .setOrigin(0.5);

    // Parpadeo suave para ver que el bucle del juego está vivo
    this.tweens.add({ targets: tag, alpha: 0.25, duration: 700, yoyo: true, repeat: -1 });
  }
}
