import Phaser from 'phaser';
import { BASE_HEIGHT, BASE_WIDTH } from '../../core/version';
import { fadeToScene } from '../sceneTransition';

/** "Jugar" todavía no tiene juego: aquí empezará el Prototipo 0.1 (Movimiento). */
export class PlayPlaceholderScene extends Phaser.Scene {
  private busy = false;

  constructor() {
    super('PlayPlaceholderScene');
  }

  create(): void {
    this.busy = false;
    this.cameras.main.setBackgroundColor(0x05020d);
    this.cameras.main.fadeIn(250, 0, 0, 0);

    const g = this.add.graphics();
    g.lineStyle(2, 0xff2bd6, 1);
    g.strokeRect(8, 8, BASE_WIDTH - 16, BASE_HEIGHT - 16);
    g.lineStyle(1, 0x19f3ff, 1);
    g.strokeRect(12, 12, BASE_WIDTH - 24, BASE_HEIGHT - 24);

    const cx = BASE_WIDTH / 2;
    this.add
      .text(cx, 100, 'PRÓXIMAMENTE', { fontFamily: 'monospace', fontSize: '20px', color: '#19f3ff' })
      .setOrigin(0.5);
    this.add
      .text(cx, 134, 'Aquí empezará el juego\n(Prototipo 0.1 - Movimiento)', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#ff2bd6',
        align: 'center'
      })
      .setOrigin(0.5);
    this.add
      .text(cx, 214, 'ESC / ENTER: volver al menú', { fontFamily: 'monospace', fontSize: '10px', color: '#8a8fb5' })
      .setOrigin(0.5);

    this.input.on('pointerdown', () => this.back());
    this.time.delayedCall(250, () => {
      const kb = this.input.keyboard;
      if (!kb) return;
      kb.on('keydown-ESC', () => this.back());
      kb.on('keydown-ENTER', () => this.back());
      kb.on('keydown-BACKSPACE', () => this.back());
    });
  }

  private back(): void {
    if (this.busy) return;
    this.busy = true;
    fadeToScene(this, 'MenuScene');
  }
}
