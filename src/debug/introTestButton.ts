import Phaser from 'phaser';
import { introStartScene } from '../core/cinematic/introSeen';
import { PixelCanvas } from '../core/pixelCanvas';
import { drawPixelText, textSize } from '../core/pixelText';
import { CINEMATIC } from '../data/cinematic';
import { STORY_SCENES } from '../data/story';
import { ensureTexture } from '../game/menu/canvasTexture';
import { fadeToScene } from '../game/sceneTransition';

// BOTÓN DE PRUEBA (temporal). Para quitarlo: borrar este archivo y las 2 líneas que lo nombran en MenuScene.ts
// (el "import" y la línea "createIntroTestButton(this);").
//
// Dónde está: abajo a la izquierda. Para ponerlo abajo a la derecha, cambiar X por 330 (y ORIGIN_X por 0).
const X = 6;
const Y = 244;
const LABEL = CINEMATIC.testButtonLabel;

function buildButton(hover: boolean): PixelCanvas {
  const w = textSize(LABEL).width + 12;
  const c = new PixelCanvas(w, 14);
  c.fillRect(0, 0, w, 14, 0x05020d, hover ? 0.95 : 0.8);
  c.strokeRect(0, 0, w, 14, hover ? 0xff2bd6 : 0x19f3ff, 1);
  drawPixelText(c, LABEL, 6, 4, { color: hover ? 0xffffff : 0x9be9ff, shadow: 0x05020d });
  return c;
}

/**
 * Reproduce la cinemática desde el menú aunque ya la hayas visto, y al acabar (o al saltarla con ESC) vuelve al menú.
 * No cuenta como "ya vista". Si la dirección lleva ?escena=5, empieza por esa escena (para probar una sola).
 */
export function createIntroTestButton(scene: Phaser.Scene): void {
  ensureTexture(scene, 'nm-test-btn', () => buildButton(false));
  ensureTexture(scene, 'nm-test-btn-hover', () => buildButton(true));
  const button = scene.add.image(X, Y, 'nm-test-btn').setOrigin(0, 0).setDepth(1002).setInteractive({ useHandCursor: true });
  let started = false;
  button.on('pointerover', () => button.setTexture('nm-test-btn-hover'));
  button.on('pointerout', () => button.setTexture('nm-test-btn'));
  button.on('pointerdown', () => {
    if (started) return;
    started = true;
    const startScene = introStartScene(window.location.search, STORY_SCENES.length);
    fadeToScene(scene, 'CinematicScene', 250, { next: 'MenuScene', markSeen: false, startScene });
  });
}
