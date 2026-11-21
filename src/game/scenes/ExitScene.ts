import Phaser from 'phaser';
import { BASE_WIDTH } from '../../core/version';
import { fadeToScene } from '../sceneTransition';

/** "Salir" en el navegador: una web no puede cerrarse sola, así que se despide. En el .exe sí cierra. */
export class ExitScene extends Phaser.Scene {
  private busy = false;

  constructor() {
    super('ExitScene');
  }

  create(): void {
    this.busy = false;
    this.cameras.main.setBackgroundColor(0x000000);
    this.cameras.main.fadeIn(300, 0, 0, 0);

    const cx = BASE_WIDTH / 2;
    this.add
      .text(cx, 108, 'GRACIAS POR JUGAR', { fontFamily: 'monospace', fontSize: '20px', color: '#19f3ff' })
      .setOrigin(0.5);
    this.add
      .text(cx, 138, 'Miami no perdona.', { fontFamily: 'monospace', fontSize: '12px', color: '#ff2bd6' })
      .setOrigin(0.5);
    this.add
      .text(cx, 176, 'Ya puedes cerrar esta pestaña.', { fontFamily: 'monospace', fontSize: '10px', color: '#8a8fb5' })
      .setOrigin(0.5);
    this.add
      .text(cx, 192, 'Pulsa una tecla o haz clic para volver al menú.', {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#6b6f9c'
      })
      .setOrigin(0.5);

    this.time.delayedCall(400, () => {
      this.input.keyboard?.once('keydown', () => this.back());
      this.input.once('pointerdown', () => this.back());
    });
  }

  private back(): void {
    if (this.busy) return;
    this.busy = true;
    fadeToScene(this, 'MenuScene');
  }
}
