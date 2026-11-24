import Phaser from 'phaser';

/** Funde a negro y cambia de escena (con datos opcionales para la escena de destino). */
export function fadeToScene(scene: Phaser.Scene, key: string, duration = 250, data?: object): void {
  const cam = scene.cameras.main;
  cam.fadeOut(duration, 0, 0, 0);
  cam.once('camerafadeoutcomplete', () => scene.scene.start(key, data));
}
