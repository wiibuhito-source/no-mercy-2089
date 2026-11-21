import Phaser from 'phaser';
import { PixelCanvas } from '../core/pixelCanvas';
import { drawPixelText, textSize } from '../core/pixelText';
import { DEPTH } from '../game/menu/animated';
import { ensureTexture } from '../game/menu/canvasTexture';
import { fadeToScene } from '../game/sceneTransition';

const LABEL = '> VER INTRO';
const POS = { x: 6, y: 240 } as const;

function buildButton(hot: boolean): PixelCanvas {
  const tw = textSize(LABEL).width;
  const w = tw + 12;
  const h = 15;
  const c = new PixelCanvas(w, h);
  c.fillRect(0, 0, w, h, hot ? 0x3a2a78 : 0x1c1040);
  c.fillRect(0, 0, w, 1, hot ? 0xffe66d : 0x5a4aa8);
  c.fillRect(0, h - 1, w, 1, 0x0a0518);
  c.fillRect(0, 0, 1, h, hot ? 0xffe66d : 0x5a4aa8);
  c.fillRect(w - 1, 0, 1, h, 0x0a0518);
  drawPixelText(c, LABEL, 6, 4, { color: hot ? 0xffffff : 0xcfc6ff, shadow: 0x05020d });
  return c;
}

/**
 * Truco para probar: botón abajo a la izquierda del menú que reproduce la cinemática cuantas veces se quiera.
 * Al terminar (o al saltarla con ESC) vuelve al menú, listo para verla otra vez tras cambiar cosas.
 * No cuenta como "primera vez": no toca lo que recuerda introStore.
 */
export function createIntroButton(scene: Phaser.Scene, onPress?: () => void): void {
  ensureTexture(scene, 'nm-intro-btn', () => buildButton(false));
  ensureTexture(scene, 'nm-intro-btn-hot', () => buildButton(true));
  const btn = scene.add.image(POS.x, POS.y, 'nm-intro-btn').setOrigin(0, 0).setDepth(DEPTH.hints + 1);
  btn.setInteractive({ useHandCursor: true });
  btn.on('pointerover', () => btn.setTexture('nm-intro-btn-hot'));
  btn.on('pointerout', () => btn.setTexture('nm-intro-btn'));
  let pressed = false;
  btn.on('pointerdown', () => {
    if (pressed) return;
    pressed = true;
    onPress?.();
    fadeToScene(scene, 'CinematicScene', 250, { next: 'MenuScene' });
  });
}
