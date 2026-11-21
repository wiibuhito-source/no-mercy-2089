import Phaser from 'phaser';

/** Funde a negro y cambia de escena. */
export function fadeToScene(scene: Phaser.Scene, key: string, duration = 250, data?: object): void {
  const cam = scene.cameras.main;
  cam.fadeOut(duration, 0, 0, 0);
  cam.once('camerafadeoutcomplete', () => scene.scene.start(key, data));
}
