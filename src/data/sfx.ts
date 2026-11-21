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
  // Timbre de ascensor
  ding: {
    voices: [
      { wave: 'sine', freq: 1320, startMs: 0, durationMs: 700, volume: 0.12, attackMs: 6 },
      { wave: 'sine', freq: 1760, startMs: 180, durationMs: 800, volume: 0.09, attackMs: 6 }
    ]
  },
  // Neón estropeado: zumbido y chisporroteo
  buzz: {
    voices: [
      { wave: 'sawtooth', freq: 110, startMs: 0, durationMs: 600, volume: 0.05, lowpass: 800, attackMs: 20 },
      { wave: 'noise', freq: 1, startMs: 0, durationMs: 50, volume: 0.12, highpass: 3000, attackMs: 2 },
      { wave: 'noise', freq: 1, startMs: 140, durationMs: 40, volume: 0.1, highpass: 3200, attackMs: 2 },
      { wave: 'noise', freq: 1, startMs: 300, durationMs: 70, volume: 0.12, highpass: 2800, attackMs: 2 }
    ]
  },
  // Carrera: pasos rápidos
  run: {
    voices: Array.from({ length: 9 }, (_, i) => ({ wave: 'noise' as const, freq: 1, startMs: i * 175, durationMs: 70, volume: 0.15 - i * 0.008, lowpass: 900, attackMs: 3 }))
  },
  // Impacto sordo (el transporte sale mal)
  impact: {
    voices: [
      { wave: 'sine', freq: 70, freqEnd: 32, startMs: 0, durationMs: 800, volume: 0.55, attackMs: 3 },
      { wave: 'noise', freq: 1, startMs: 0, durationMs: 170, volume: 0.3, lowpass: 1400, attackMs: 2 }
    ]
  },
  // Tensión que sube (en lugar de la sirena)
  swell: {
    voices: [
      { wave: 'sine', freq: 80, freqEnd: 240, startMs: 0, durationMs: 3000, volume: 0.12, attackMs: 2200 },
      { wave: 'sawtooth', freq: 55, freqEnd: 72, startMs: 0, durationMs: 3200, volume: 0.1, lowpass: 320, attackMs: 2000 }
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
  city: { layers: [{ ...CITY, volume: 0.035 }, { wave: 'sine', freq: 48, volume: 0.04 }, { wave: 'noise', volume: 0.015, highpass: 900, lowpass: 2400 }] },
  office: { layers: [HUM, { wave: 'noise', volume: 0.02, lowpass: 300 }, { wave: 'sine', freq: 118, volume: 0.012 }] },
  wind: { layers: [{ wave: 'noise', volume: 0.06, highpass: 300, lowpass: 2600 }, CITY] },
  bus: { layers: [{ wave: 'sine', freq: 64, volume: 0.055 }, { wave: 'noise', volume: 0.05, lowpass: 260 }, { wave: 'noise', volume: 0.015, highpass: 3000 }] },
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
