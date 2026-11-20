import Phaser from 'phaser';

/**
 * Contador de fotogramas por segundo, oculto por defecto: F3 lo muestra u oculta.
 * Sirve para que quien juega pueda decir "en mi equipo va a X fps" sin herramientas.
 */
export function createFpsMeter(scene: Phaser.Scene): void {
  const text = scene.add
    .text(4, 3, '', { fontFamily: 'monospace', fontSize: '8px', color: '#7dfcff', backgroundColor: '#05020dcc', padding: { x: 2, y: 1 } })
    .setDepth(1000)
    .setVisible(false);
  const kb = scene.input.keyboard;
  kb?.addCapture('F3'); // evita que el navegador abra su buscador
  kb?.on('keydown-F3', () => text.setVisible(!text.visible));
  scene.time.addEvent({
    delay: 500,
    loop: true,
    callback: () => {
      if (text.visible) text.setText(`${Math.round(scene.game.loop.actualFps)} FPS`);
    }
  });
}
