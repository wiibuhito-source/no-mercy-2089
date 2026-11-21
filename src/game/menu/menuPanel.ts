import Phaser from 'phaser';
import { approach, typedChars } from '../../core/menu/motion';
import type { MenuItem } from '../../core/menu/menuModel';
import { measurePrefix } from '../../core/pixelFont';
import { PixelCanvas } from '../../core/pixelCanvas';
import { drawPixelText, textSize } from '../../core/pixelText';
import { BUTTON, DESC, PANEL } from '../../data/menuLayout';
import { MAIN_MENU_ICONS } from '../../data/mainMenu';
import { PAL } from '../../data/menuPalette';
import { buildGlowFromMask } from './art/glow';
import { buildShineFrames } from './art/shine';
import { PANEL_LEDS, buildButton, buildButtonShape, buildPanel } from './art/ui';
import { DEPTH, type Animated } from './animated';
import { cached, ensureTexture } from './canvasTexture';

const SHINE_FRAMES = 14;
const GLOW_PAD = 6;
const MS_PER_CHAR = 26;

export interface PanelHandlers {
  onHover(index: number): void;
  onClick(index: number): void;
}

interface ButtonView {
  readonly base: Phaser.GameObjects.Image;
  readonly glow: Phaser.GameObjects.Image;
  readonly shine: Phaser.GameObjects.Image;
  readonly flash: Phaser.GameObjects.Image;
  readonly y: number;
  shift: number;
}

function buildDesc(text: string): PixelCanvas {
  const c = new PixelCanvas(textSize(text).width + 2, 9);
  drawPixelText(c, text, 0, 1, { color: 0xb9b2ff, shadow: 0x05020d });
  return c;
}

/** Panel de cristal con los botones del menú: selección con degradado y destello, indicadores, texto que se escribe solo. */
export class MenuPanel implements Animated {
  private readonly container: Phaser.GameObjects.Container;
  private readonly buttons: ButtonView[] = [];
  private readonly leds: Phaser.GameObjects.Rectangle[] = [];
  private readonly descs: Phaser.GameObjects.Image[] = [];
  private readonly cursor: Phaser.GameObjects.Rectangle;
  private readonly intro = { value: 0 };
  private selected = 0;
  private descStart = 0;
  private shineStart = 0;
  private shakeStart = -1;
  private now = 0;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly items: readonly MenuItem[],
    handlers: PanelHandlers,
    private readonly reduceMotion: boolean
  ) {
    const add = Phaser.BlendModes.ADD;
    ensureTexture(scene, 'nm-panel', buildPanel);
    const shape = cached('btn-shape', buildButtonShape);
    ensureTexture(scene, 'nm-btn-flash', () => shape);
    ensureTexture(scene, 'nm-btn-glow', () => buildGlowFromMask(shape, PAL.magenta, [{ radius: 5, alpha: 0.1 }, { radius: 3, alpha: 0.18 }, { radius: 1, alpha: 0.3 }], GLOW_PAD));
    const frames = cached('btn-shine', () => buildShineFrames(shape, SHINE_FRAMES, 16, 0.5, 0.55));
    frames.forEach((f, i) => ensureTexture(scene, `nm-btn-shine-${i}`, () => f));

    this.container = scene.add.container(PANEL.x, PANEL.y).setDepth(DEPTH.panel);
    this.container.add(scene.add.image(0, 0, 'nm-panel').setOrigin(0, 0));

    PANEL_LEDS.forEach((led, i) => {
      const color = [0x3dff8a, PAL.amber, PAL.magenta][i] ?? PAL.cyan;
      const r = scene.add.rectangle(led.x + 1, led.y + 1, 3, 3, color, 1).setOrigin(0, 0);
      this.leds.push(r);
      this.container.add(r);
    });

    items.forEach((item, i) => {
      const y = BUTTON.firstY + i * (BUTTON.h + BUTTON.gap);
      const idle = `nm-btn-${item.id}-idle`;
      const sel = `nm-btn-${item.id}-sel`;
      const icon = MAIN_MENU_ICONS[item.id] ?? 'play';
      ensureTexture(scene, idle, () => buildButton(item.label, icon, false));
      ensureTexture(scene, sel, () => buildButton(item.label, icon, true));
      const glow = scene.add.image(BUTTON.x - GLOW_PAD, y - GLOW_PAD, 'nm-btn-glow').setOrigin(0, 0).setBlendMode(add).setAlpha(0);
      const base = scene.add.image(BUTTON.x, y, idle).setOrigin(0, 0);
      const shine = scene.add.image(BUTTON.x, y, 'nm-btn-shine-0').setOrigin(0, 0).setBlendMode(add).setVisible(false);
      const flash = scene.add.image(BUTTON.x, y, 'nm-btn-flash').setOrigin(0, 0).setBlendMode(add).setAlpha(0);
      base
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => handlers.onHover(i))
        .on('pointerdown', () => handlers.onClick(i));
      this.container.add([glow, base, shine, flash]);
      this.buttons.push({ base, glow, shine, flash, y, shift: 0 });

      const descKey = `nm-desc-${item.id}`;
      ensureTexture(scene, descKey, () => buildDesc(item.hint));
      const desc = scene.add.image(8, DESC.textY - 1, descKey).setOrigin(0, 0).setVisible(false);
      this.descs.push(desc);
      this.container.add(desc);
    });

    this.cursor = scene.add.rectangle(8, DESC.textY, 4, 7, PAL.cyan, 1).setOrigin(0, 0);
    this.container.add(this.cursor);

    if (reduceMotion) this.intro.value = 1;
    else {
      this.container.setAlpha(0);
      scene.tweens.add({ targets: this.intro, value: 1, duration: 480, delay: 350, ease: 'Cubic.easeOut' });
    }
    this.setSelected(0);
  }

  get selectedIndex(): number {
    return this.selected;
  }

  setSelected(index: number): void {
    this.selected = index;
    this.descStart = this.scene.time.now;
    this.shineStart = this.scene.time.now;
    this.buttons.forEach((b, i) => {
      const item = this.items[i];
      if (!item) return;
      b.base.setTexture(`nm-btn-${item.id}-${i === index ? 'sel' : 'idle'}`);
      b.glow.setAlpha(i === index ? 0.8 : 0);
      b.shine.setVisible(false);
    });
    this.descs.forEach((d, i) => d.setVisible(i === index));
  }

  /** Destello y sacudida de confirmación; llama a `then` justo después. */
  press(index: number, then: () => void): void {
    const b = this.buttons[index];
    if (!b || this.reduceMotion) {
      then();
      return;
    }
    b.flash.setAlpha(0.9);
    this.scene.tweens.add({ targets: b.flash, alpha: 0, duration: 170 });
    this.shakeStart = this.now;
    this.scene.time.delayedCall(190, then);
  }

  update(timeMs: number): void {
    this.now = timeMs;
    this.container.setAlpha(Math.min(1, this.intro.value * 1.6));
    let shake = 0;
    if (this.shakeStart >= 0) {
      const p = (timeMs - this.shakeStart) / 170;
      if (p >= 1) this.shakeStart = -1;
      else shake = Math.round(Math.sin(p * Math.PI * 6) * 2 * (1 - p));
    }
    this.container.setPosition(PANEL.x + Math.round((1 - this.intro.value) * 70) + shake, PANEL.y);

    this.buttons.forEach((b, i) => {
      const on = i === this.selected;
      b.shift = approach(b.shift, on ? BUTTON.selectedShiftPx : 0, 0.4);
      const x = BUTTON.x + Math.round(b.shift);
      b.base.setX(x);
      b.shine.setX(x);
      b.flash.setX(x);
      b.glow.setX(x - GLOW_PAD);
      if (on) {
        b.glow.setAlpha(0.65 + 0.2 * Math.sin(timeMs / 380));
        if (!this.reduceMotion) {
          const p = ((timeMs - this.shineStart) % 2600) / 2600;
          if (p < 0.2) b.shine.setVisible(true).setTexture(`nm-btn-shine-${Math.min(SHINE_FRAMES - 1, Math.floor((p / 0.2) * SHINE_FRAMES))}`);
          else b.shine.setVisible(false);
        }
      }
    });

    // Indicadores del encabezado
    this.leds[0]?.setAlpha(1);
    this.leds[1]?.setAlpha(this.reduceMotion || Math.floor(timeMs / 700) % 2 === 0 ? 1 : 0.2);
    this.leds[2]?.setAlpha(this.reduceMotion || Math.floor(timeMs / 1100) % 3 === 0 ? 0.25 : 1);

    // Texto descriptivo que se escribe solo
    const item = this.items[this.selected];
    const desc = this.descs[this.selected];
    if (item && desc) {
      const chars = typedChars(timeMs - this.descStart, MS_PER_CHAR, Array.from(item.hint).length);
      const w = measurePrefix(item.hint, chars);
      desc.setCrop(0, 0, w + (chars > 0 ? 1 : 0), desc.height);
      const done = chars >= Array.from(item.hint).length;
      this.cursor.setX(8 + w + 2);
      this.cursor.setVisible(!done || Math.floor(timeMs / 450) % 2 === 0);
    }
  }
}
