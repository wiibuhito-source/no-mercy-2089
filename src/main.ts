import Phaser from 'phaser';
import { BASE_HEIGHT, BASE_WIDTH } from './core/version';
import { ExitScene } from './game/scenes/ExitScene';
import { MenuScene } from './game/scenes/MenuScene';
import { PlayPlaceholderScene } from './game/scenes/PlayPlaceholderScene';
import { SettingsScene } from './game/scenes/SettingsScene';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: BASE_WIDTH,
  height: BASE_HEIGHT,
  backgroundColor: '#05020d',
  pixelArt: true, // filtrado "nearest": sin suavizado
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    zoom: Phaser.Scale.MAX_ZOOM
  },
  fps: { target: 60 },
  scene: [MenuScene, SettingsScene, PlayPlaceholderScene, ExitScene]
});
