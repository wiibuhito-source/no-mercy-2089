// Ajustes de la cinemática (datos, no código): velocidad del texto, tamaños, tiempos y volúmenes.
// Si algo "se siente" lento, grande o fuerte, se cambia aquí.
import type { RunnerConfig } from '../core/cinematic/cinematicRunner';
import type { TextBlipConfig } from '../core/cinematic/textBlip';

export const CINEMATIC = {
  runner: {
    charsPerSecond: 34,
    // Pausa extra tras cada signo (ms): hace que el texto "respire" como una voz.
    pauseAfterMs: { '.': 260, ',': 130, ':': 160, '?': 280, '!': 280 },
    // Tras terminar una frase, una pulsación se ignora este tiempo (evita saltarse la frase sin querer).
    advanceLockMs: 220
  } satisfies RunnerConfig,

  /** Caja de texto (píxeles del juego, que mide 480x270). */
  text: {
    x: 24,
    y: 213,
    width: 432,
    lineHeight: 12,
    maxLines: 3,
    scale: 1,
    color: 0xf4f0ff,
    shadow: 0x05020d
  },

  /** Bandas negras tipo cine. */
  bars: { top: 14, bottomPanelHeight: 72, panelAlpha: 0.88 },

  /** Rótulo de arriba a la izquierda (lugar y año). */
  caption: { x: 14, y: 22, color: 0x19f3ff, shadow: 0x05020d, delayMs: 500, fadeMs: 700 },

  fadeBetweenScenesMs: 380,
  fadeInMs: 500,
  /** Mantener ESC este tiempo para saltar la cinemática entera. */
  skipHoldMs: 900,
  /** La pantalla final con "MIAMI NO PERDONA." */
  endCard: { text: 'MIAMI NO PERDONA.', holdMs: 2600, fadeInMs: 700, scale: 3 },

  blip: {
    everyNthChar: 2,
    baseHz: 150,
    stepHz: 13,
    steps: 7,
    durationMs: 36,
    volume: 0.05,
    wave: 'square'
  } satisfies TextBlipConfig,

  audio: {
    masterVolume: 0.8,
    musicVolume: 0.7,
    musicFadeMs: 1400,
    ambienceFadeMs: 1200
  }
} as const;
