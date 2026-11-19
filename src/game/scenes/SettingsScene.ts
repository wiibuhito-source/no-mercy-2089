import Phaser from 'phaser';
import { BASE_HEIGHT, BASE_WIDTH } from '../../core/version';
import { createCityBackdrop } from '../menu/cityBackdrop';
import { fadeToScene } from '../sceneTransition';

const PANEL = { x: 100, y: 46, w: 280, h: 178 };

/** Ajustes: vacío por ahora (el contenido llegará en otros prototipos). */
export class SettingsScene extends Phaser.Scene {
  private busy = false;

  constructor() {
    super('SettingsScene');
  }

  create(): void {
    this.busy = false;
    this.cameras.main.fadeIn(250, 0, 0, 0);
    createCityBackdrop(this);
    this.add.rectangle(0, 0, BASE_WIDTH, BASE_HEIGHT, 0x000000, 0.6).setOrigin(0, 0);

    const g = this.add.graphics();
    g.fillStyle(0x07030f, 0.85);
    g.fillRect(PANEL.x, PANEL.y, PANEL.w, PANEL.h);
    g.lineStyle(1, 0x19f3ff, 0.9);
    g.strokeRect(PANEL.x + 0.5, PANEL.y + 0.5, PANEL.w - 1, PANEL.h - 1);

    this.add
      .text(BASE_WIDTH / 2, PANEL.y + 22, 'AJUSTES', { fontFamily: 'monospace', fontSize: '20px', color: '#19f3ff' })
      .setOrigin(0.5);
    this.add
      .text(BASE_WIDTH / 2, PANEL.y + 84, '(vacío por ahora)', { fontFamily: 'monospace', fontSize: '12px', color: '#8a8fb5' })
      .setOrigin(0.5);

    const bx = BASE_WIDTH / 2 - 70;
    const by = PANEL.y + PANEL.h - 42;
    this.add.rectangle(bx, by, 140, 28, 0xff2bd6, 0.28).setOrigin(0, 0);
    this.add.rectangle(bx, by, 3, 28, 0x19f3ff, 1).setOrigin(0, 0);
    this.add
      .text(bx + 16, by + 14, '> VOLVER', { fontFamily: 'monospace', fontSize: '14px', color: '#ffffff' })
      .setOrigin(0, 0.5);
    this.add
      .rectangle(bx, by, 140, 28, 0x000000, 0.01)
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.back());

    // Pequeña espera para que la pulsación de ENTER del menú no cierre esta pantalla al instante
    this.time.delayedCall(250, () => {
      const kb = this.input.keyboard;
      if (!kb) return;
      kb.on('keydown-ESC', () => this.back());
      kb.on('keydown-ENTER', () => this.back());
      kb.on('keydown-SPACE', () => this.back());
      kb.on('keydown-BACKSPACE', () => this.back());
    });
  }

  private back(): void {
    if (this.busy) return;
    this.busy = true;
    fadeToScene(this, 'MenuScene');
  }
}
