// Ajustes de la cinemática (datos, no código): velocidad del texto, tamaños, tiempos y volúmenes.
// Si algo "se siente" lento, grande o fuerte, se cambia aquí.
import type { RunnerConfig } from '../core/cinematic/cinematicRunner';

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

  /** Texto del botón temporal de prueba del menú (solo letras que existan en la fuente de píxeles). */
  testButtonLabel: '> VER INTRO - PRUEBA',

  fadeBetweenScenesMs: 380,
  /** Entrada con destello blanco (la noche en que salió mal). */
  flash: { outMs: 140, inMs: 800 },
  /** Título grande sobre negro ("2078 / ONCE AÑOS ANTES"). Pulsar lo acorta. */
  card: { fadeInMs: 450, holdMs: 1900, fadeOutMs: 650, titleScale: 5, titleColor: 0xf4f0ff, titleShadow: 0xff2bd6, subColor: 0x19f3ff },
  fadeInMs: 500,
  /** Mantener ESC este tiempo para saltar la cinemática entera. */
  skipHoldMs: 900,
  /** La pantalla final con "MIAMI NO PERDONA." */
  endCard: { text: 'MIAMI NO PERDONA.', holdMs: 2600, fadeInMs: 700, scale: 3 },

  /** Quién habla: nombre en pantalla y color. */
  speakers: {
    madre: { name: 'MAMÁ', color: 0xffb3d1 },
    tipo: { name: 'EL TIPO', color: 0xff6a5a },
    adrian: { name: 'ADRIÁN', color: 0x6ab0ff },
    voz: { name: 'VOZ', color: 0xc9a0ff }
  } as Readonly<Record<string, { readonly name: string; readonly color: number }>>,

  audio: {
    musicVolume: 0.7,
    musicFadeMs: 1400
  }
} as const;
