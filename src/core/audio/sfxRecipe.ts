// Descripción de efectos de sonido sintetizados (lógica pura): cada efecto es una receta de "voces".
// Quien reproduce (src/game/audio) las convierte en sonido con Web Audio. Todo es dato editable.
export type SfxWave = 'square' | 'sine' | 'sawtooth' | 'triangle' | 'noise';

export interface SfxVoice {
  readonly wave: SfxWave;
  /** Tono inicial en Hz (se ignora en el ruido). */
  readonly freq: number;
  /** Si existe, el tono se desliza hasta este valor. */
  readonly freqEnd?: number;
  readonly startMs: number;
  readonly durationMs: number;
  /** 0 a 1. */
  readonly volume: number;
  readonly attackMs?: number;
  /** Filtros opcionales (Hz): dejan pasar solo graves o solo agudos. */
  readonly lowpass?: number;
  readonly highpass?: number;
}

export interface SfxRecipe {
  readonly voices: readonly SfxVoice[];
}

/** Capa de un sonido ambiente continuo (lluvia, zumbido...). */
export interface AmbienceLayer {
  readonly wave: SfxWave;
  readonly freq?: number;
  readonly volume: number;
  readonly lowpass?: number;
  readonly highpass?: number;
}

export interface AmbiencePulse {
  /** Efecto que se repite (por ejemplo, el pitido del monitor). */
  readonly sfx: string;
  readonly everyMs: number;
}

export interface AmbienceRecipe {
  readonly layers: readonly AmbienceLayer[];
  readonly pulses?: readonly AmbiencePulse[];
}

export function recipeLengthMs(recipe: SfxRecipe): number {
  return recipe.voices.reduce((max, v) => Math.max(max, v.startMs + v.durationMs), 0);
}

/** Lista de problemas de una receta (vacía si está bien). */
export function validateRecipe(recipe: SfxRecipe): string[] {
  const problems: string[] = [];
  if (recipe.voices.length === 0) problems.push('no tiene voces');
  recipe.voices.forEach((v, i) => {
    const at = `voz ${i}`;
    if (!(v.durationMs > 0)) problems.push(`${at}: duración no válida`);
    if (v.startMs < 0) problems.push(`${at}: empieza antes de 0`);
    if (!(v.volume > 0 && v.volume <= 1)) problems.push(`${at}: volumen fuera de (0, 1]`);
    if (v.wave !== 'noise' && !(v.freq > 0)) problems.push(`${at}: tono no válido`);
    if (v.freqEnd !== undefined && !(v.freqEnd > 0)) problems.push(`${at}: tono final no válido`);
    if (v.lowpass !== undefined && !(v.lowpass > 0)) problems.push(`${at}: filtro de graves no válido`);
    if (v.highpass !== undefined && !(v.highpass > 0)) problems.push(`${at}: filtro de agudos no válido`);
  });
  return problems;
}

export function validateAmbience(a: AmbienceRecipe): string[] {
  const problems: string[] = [];
  if (a.layers.length === 0) problems.push('no tiene capas');
  a.layers.forEach((l, i) => {
    if (!(l.volume > 0 && l.volume <= 1)) problems.push(`capa ${i}: volumen fuera de (0, 1]`);
    if (l.wave !== 'noise' && !(l.freq && l.freq > 0)) problems.push(`capa ${i}: falta el tono`);
  });
  for (const p of a.pulses ?? []) if (!(p.everyMs >= 200)) problems.push(`pulso ${p.sfx}: se repite demasiado rápido`);
  return problems;
}
