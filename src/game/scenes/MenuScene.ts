import Phaser from 'phaser';
import { moveSelection } from '../../core/menu/menuModel';
import { BASE_HEIGHT, BASE_WIDTH, PROTOTYPE_SHORT } from '../../core/version';
import { MAIN_MENU_ITEMS } from '../../data/mainMenu';
import { createCar } from '../menu/car';
import { createCityBackdrop } from '../menu/cityBackdrop';
import { TITLE_TEXTURE_KEY, ensureTitleTexture } from '../menu/titleArt';
import { canQuitNatively, quitNatively } from '../platform';
import { fadeToScene } from '../sceneTransition';

const PANEL = { x: 300, y: 122, w: 168, h: 112 };
const ROW_H = 34;
const ROW_PAD_Y = 12;

/** Menú principal: ciudad de fondo, coche con Adrián, título y botones Jugar / Ajustes / Salir. */
export class MenuScene extends Phaser.Scene {
  private selected = 0;
  private busy = false;
  private labels: Phaser.GameObjects.Text[] = [];
  private highlight!: Phaser.GameObjects.Rectangle;
  private bar!: Phaser.GameObjects.Rectangle;

  constructor() {
    super('MenuScene');
  }

  create(): void {
    this.selected = 0;
    this.busy = false;
    this.labels = [];
    this.cameras.main.fadeIn(300, 0, 0, 0);

    createCityBackdrop(this);
    createCar(this, 22, 194);
    this.createTitle();
    this.createMenu();
    this.createFooter();
    this.bindKeyboard();
  }

  private createTitle(): void {
    ensureTitleTexture(this);
    const title = this.add.image(BASE_WIDTH / 2, 6, TITLE_TEXTURE_KEY).setOrigin(0.5, 0);

    // Flotación suave
    this.tweens.add({ targets: title, y: title.y + 2, duration: 2400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    // Parpadeo "glitch" de neón cada pocos segundos
    this.time.addEvent({
      delay: 3200,
      loop: true,
      callback: () => {
        this.tweens.add({ targets: title, alpha: 0.5, duration: 45, yoyo: true, repeat: 3 });
        this.tweens.add({ targets: title, x: title.x + 3, duration: 45, yoyo: true, repeat: 3 });
      }
    });
  }

  private createMenu(): void {
    const g = this.add.graphics();
    g.fillStyle(0x07030f, 0.78);
    g.fillRect(PANEL.x, PANEL.y, PANEL.w, PANEL.h);
    g.lineStyle(1, 0x19f3ff, 0.9);
    g.strokeRect(PANEL.x + 0.5, PANEL.y + 0.5, PANEL.w - 1, PANEL.h - 1);
    g.fillStyle(0xff2bd6, 1); // esquinas rosas
    g.fillRect(PANEL.x - 1, PANEL.y - 1, 10, 2);
    g.fillRect(PANEL.x - 1, PANEL.y - 1, 2, 10);
    g.fillRect(PANEL.x + PANEL.w - 9, PANEL.y + PANEL.h - 1, 10, 2);
    g.fillRect(PANEL.x + PANEL.w - 1, PANEL.y + PANEL.h - 9, 2, 10);

    const rowX = PANEL.x + 8;
    const rowW = PANEL.w - 16;
    this.highlight = this.add.rectangle(rowX, 0, rowW, 28, 0xff2bd6, 0.28).setOrigin(0, 0);
    this.bar = this.add.rectangle(rowX, 0, 3, 28, 0x19f3ff, 1).setOrigin(0, 0);

    MAIN_MENU_ITEMS.forEach((_item, i) => {
      const y = PANEL.y + ROW_PAD_Y + i * ROW_H;
      const label = this.add
        .text(PANEL.x + 22, y + 14, '', { fontFamily: 'monospace', fontSize: '14px', color: '#9aa0d8' })
        .setOrigin(0, 0.5);
      this.labels.push(label);

      // Zona clicable casi invisible (con alfa 0 Phaser no la detectaría)
      this.add
        .rectangle(rowX, y, rowW, 28, 0x000000, 0.01)
        .setOrigin(0, 0)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => this.setSelected(i))
        .on('pointerdown', () => {
          this.setSelected(i);
          this.activate();
        });
    });
    this.refresh();
  }

  private createFooter(): void {
    this.add
      .text(6, BASE_HEIGHT - 4, PROTOTYPE_SHORT, { fontFamily: 'monospace', fontSize: '8px', color: '#8a8fb5' })
      .setOrigin(0, 1);
    this.add
      .text(BASE_WIDTH - 6, BASE_HEIGHT - 4, 'FLECHAS + ENTER  /  RATÓN', {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#8a8fb5'
      })
      .setOrigin(1, 1);
  }

  private bindKeyboard(): void {
    const kb = this.input.keyboard;
    if (!kb) return;
    kb.on('keydown-UP', () => this.move(-1));
    kb.on('keydown-W', () => this.move(-1));
    kb.on('keydown-DOWN', () => this.move(1));
    kb.on('keydown-S', () => this.move(1));
    kb.on('keydown-ENTER', () => this.activate());
    kb.on('keydown-SPACE', () => this.activate());
  }

  private move(delta: number): void {
    if (this.busy) return;
    this.selected = moveSelection(this.selected, delta, MAIN_MENU_ITEMS.length);
    this.refresh();
  }

  private setSelected(index: number): void {
    if (this.busy || index === this.selected) return;
    this.selected = index;
    this.refresh();
  }

  private refresh(): void {
    const y = PANEL.y + ROW_PAD_Y + this.selected * ROW_H;
    this.highlight.setY(y);
    this.bar.setY(y);
    this.labels.forEach((label, i) => {
      const item = MAIN_MENU_ITEMS[i];
      if (!item) return;
      const on = i === this.selected;
      label.setText(`${on ? '> ' : '  '}${item.label}`);
      label.setColor(on ? '#ffffff' : '#9aa0d8');
    });
  }

  private activate(): void {
    const item = MAIN_MENU_ITEMS[this.selected];
    if (!item || this.busy) return;
    switch (item.id) {
      case 'play':
        this.go('PlayPlaceholderScene');
        break;
      case 'settings':
        this.go('SettingsScene');
        break;
      case 'quit':
        // En el .exe se cierra el juego; en el navegador no se puede cerrar la pestaña desde el código.
        if (canQuitNatively()) quitNatively();
        else this.go('ExitScene');
        break;
    }
  }

  private go(key: string): void {
    this.busy = true;
    fadeToScene(this, key);
  }
}
