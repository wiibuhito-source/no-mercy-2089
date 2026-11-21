// Efectos de sonido y ambientes de la cinemática, sintetizados por código (no hay archivos de audio).
// Son PROVISIONALES: sirven para dar vida a la escena hasta que haya sonido real. Cada uno es una receta editable.
import type { AmbienceRecipe, SfxRecipe } from '../core/audio/sfxRecipe';

export const SFX: Readonly<Record<string, SfxRecipe>> = {
  // Trueno lejano
  thunder: {
    voices: [
      { wave: 'noise', freq: 1, startMs: 0, durationMs: 1700, volume: 0.5, attackMs: 80, lowpass: 380 },
      { wave: 'sine', freq: 62, freqEnd: 34, startMs: 0, durationMs: 1500, volume: 0.35, attackMs: 60 }
    ]
  },
  // Pitido del monitor del implante
  monitorBeep: {
    voices: [{ wave: 'sine', freq: 880, startMs: 0, durationMs: 110, volume: 0.1, attackMs: 4 }]
  },
  // Alarma de impago: dos tonos que se alternan
  warning: {
    voices: [
      { wave: 'square', freq: 520, startMs: 0, durationMs: 150, volume: 0.1, lowpass: 2400 },
      { wave: 'square', freq: 390, startMs: 190, durationMs: 150, volume: 0.1, lowpass: 2400 },
      { wave: 'square', freq: 520, startMs: 380, durationMs: 150, volume: 0.1, lowpass: 2400 },
      { wave: 'square', freq: 390, startMs: 570, durationMs: 220, volume: 0.1, lowpass: 2400 }
    ]
  },
  // Billetes
  rustle: {
    voices: [
      { wave: 'noise', freq: 1, startMs: 0, durationMs: 70, volume: 0.22, highpass: 3200, attackMs: 3 },
      { wave: 'noise', freq: 1, startMs: 110, durationMs: 90, volume: 0.2, highpass: 2800, attackMs: 3 },
      { wave: 'noise', freq: 1, startMs: 250, durationMs: 60, volume: 0.18, highpass: 3600, attackMs: 3 }
    ]
  },
  // Aceptar el trato: dos golpes secos
  deal: {
    voices: [
      { wave: 'sine', freq: 110, freqEnd: 55, startMs: 0, durationMs: 260, volume: 0.4, attackMs: 3 },
      { wave: 'noise', freq: 1, startMs: 0, durationMs: 90, volume: 0.18, lowpass: 900, attackMs: 3 }
    ]
  },
  // Chispas de soldador
  sparks: {
    voices: [
      { wave: 'noise', freq: 1, startMs: 0, durationMs: 55, volume: 0.2, highpass: 4500, attackMs: 2 },
      { wave: 'noise', freq: 1, startMs: 90, durationMs: 45, volume: 0.16, highpass: 5000, attackMs: 2 },
      { wave: 'noise', freq: 1, startMs: 190, durationMs: 70, volume: 0.2, highpass: 4200, attackMs: 2 },
      { wave: 'noise', freq: 1, startMs: 310, durationMs: 40, volume: 0.14, highpass: 5200, attackMs: 2 }
    ]
  },
  // Escáner arreglado: subida alegre
  scanOk: {
    voices: [
      { wave: 'triangle', freq: 660, startMs: 0, durationMs: 130, volume: 0.16 },
      { wave: 'triangle', freq: 880, startMs: 130, durationMs: 130, volume: 0.16 },
      { wave: 'triangle', freq: 1320, startMs: 260, durationMs: 300, volume: 0.16 }
    ]
  },
  // Sirena lejana
  siren: {
    voices: [
      { wave: 'sawtooth', freq: 620, freqEnd: 940, startMs: 0, durationMs: 900, volume: 0.07, lowpass: 1500, attackMs: 200 },
      { wave: 'sawtooth', freq: 940, freqEnd: 620, startMs: 900, durationMs: 900, volume: 0.07, lowpass: 1500, attackMs: 40 }
    ]
  },
  // Puerta de furgoneta
  doorThud: {
    voices: [
      { wave: 'sine', freq: 95, freqEnd: 50, startMs: 0, durationMs: 220, volume: 0.45, attackMs: 2 },
      { wave: 'noise', freq: 1, startMs: 0, durationMs: 110, volume: 0.25, lowpass: 1100, attackMs: 2 }
    ]
  },
  // Pasos que se alejan
  footsteps: {
    voices: [
      { wave: 'noise', freq: 1, startMs: 0, durationMs: 90, volume: 0.26, lowpass: 700, attackMs: 3 },
      { wave: 'noise', freq: 1, startMs: 420, durationMs: 90, volume: 0.2, lowpass: 650, attackMs: 3 },
      { wave: 'noise', freq: 1, startMs: 840, durationMs: 90, volume: 0.15, lowpass: 600, attackMs: 3 },
      { wave: 'noise', freq: 1, startMs: 1260, durationMs: 90, volume: 0.1, lowpass: 550, attackMs: 3 }
    ]
  },
  // Vibración del teléfono
  phoneBuzz: {
    voices: [
      { wave: 'square', freq: 78, startMs: 0, durationMs: 230, volume: 0.22, lowpass: 420, attackMs: 8 },
      { wave: 'square', freq: 78, startMs: 330, durationMs: 230, volume: 0.22, lowpass: 420, attackMs: 8 },
      { wave: 'square', freq: 78, startMs: 660, durationMs: 230, volume: 0.22, lowpass: 420, attackMs: 8 }
    ]
  },
  // Golpe final del título
  stinger: {
    voices: [
      { wave: 'sine', freq: 55, freqEnd: 40, startMs: 0, durationMs: 2200, volume: 0.5, attackMs: 40 },
      { wave: 'sawtooth', freq: 110, freqEnd: 82, startMs: 0, durationMs: 1800, volume: 0.12, lowpass: 700, attackMs: 40 },
      { wave: 'noise', freq: 1, startMs: 0, durationMs: 500, volume: 0.25, lowpass: 600, attackMs: 4 }
    ]
  }
};

const RAIN = { wave: 'noise', volume: 0.05, highpass: 1400, lowpass: 7000 } as const;
const HUM = { wave: 'sine', freq: 52, volume: 0.05 } as const;
const CITY = { wave: 'noise', volume: 0.03, lowpass: 420 } as const;

export const AMBIENCES: Readonly<Record<string, AmbienceRecipe>> = {
  street: { layers: [RAIN, CITY] },
  bedroom: {
    layers: [{ ...RAIN, volume: 0.022, lowpass: 3000 }, HUM],
    pulses: [{ sfx: 'monitorBeep', everyMs: 1150 }]
  },
  alley: { layers: [{ ...RAIN, volume: 0.04 }, HUM, CITY] },
  bench: { layers: [HUM, { ...CITY, volume: 0.04 }] },
  road: { layers: [{ ...RAIN, volume: 0.04 }, CITY] },
  workshop: { layers: [{ ...HUM, volume: 0.035 }, { ...CITY, volume: 0.025 }] }
};
