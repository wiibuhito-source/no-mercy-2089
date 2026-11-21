// Sonidito de cada letra al escribir (lógica pura): cuándo suena y a qué tono.
export interface TextBlipConfig {
  /** Suena una de cada N letras (si suena en todas, agobia). */
  readonly everyNthChar: number;
  readonly baseHz: number;
  /** Cuánto sube el tono por cada "escalón" (las letras se reparten entre los escalones). */
  readonly stepHz: number;
  readonly steps: number;
  readonly durationMs: number;
  readonly volume: number;
  readonly wave: 'square' | 'sine' | 'sawtooth' | 'triangle';
}

const SOUNDING = /[\p{L}\p{N}]/u;

/** Solo suenan letras y números (ni espacios ni signos), una de cada `everyNthChar`. */
export function shouldBlip(ch: string, charIndex: number, cfg: TextBlipConfig): boolean {
  return SOUNDING.test(ch) && charIndex % Math.max(1, cfg.everyNthChar) === 0;
}

/** Tono según la letra: la misma letra siempre suena igual, y letras distintas varían un poco ("habla" sin palabras). */
export function blipFrequency(ch: string, cfg: TextBlipConfig): number {
  const code = ch.toUpperCase().codePointAt(0) ?? 0;
  return cfg.baseHz + (code % Math.max(1, cfg.steps)) * cfg.stepHz;
}
