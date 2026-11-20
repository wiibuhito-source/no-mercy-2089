// Lógica pura (sin Phaser): se puede probar con tests sin abrir el juego.
export const GAME_TITLE = 'NO MERCY 2089';
export const GAME_TAGLINE = 'Miami no perdona.';
export const PROTOTYPE = '0.0 - Infraestructura';
export const PROTOTYPE_SHORT = 'PROTOTIPO 0.0';

/** Resolución interna (GDD 16.1). Se escala en múltiplos enteros. */
export const BASE_WIDTH = 480;
export const BASE_HEIGHT = 270;

/** Texto que muestra la escena de prueba. */
export function buildBanner(): string {
  return `${GAME_TITLE}\nPrototipo ${PROTOTYPE}`;
}
