// Efecto de máquina de escribir (lógica pura, sin Phaser): cuándo aparece cada letra.
export interface TypewriterConfig {
  /** Letras por segundo. */
  readonly charsPerSecond: number;
  /** Pausa extra (en milisegundos) después de ciertos signos, para que el texto "respire". */
  readonly pauseAfterMs: Readonly<Record<string, number>>;
}

/**
 * Para cada letra del texto, el momento (ms desde que empieza la frase) en que se vuelve visible.
 * Nada se ve en el instante 0: la primera letra aparece tras una pulsación.
 */
export function typewriterTimeline(text: string, cfg: TypewriterConfig): number[] {
  const step = 1000 / Math.max(1, cfg.charsPerSecond);
  const times: number[] = [];
  let t = step;
  for (const ch of Array.from(text)) {
    times.push(t);
    t += step + (cfg.pauseAfterMs[ch] ?? 0);
  }
  return times;
}

/** Cuántas letras se ven cuando han pasado `elapsedMs` (búsqueda binaria sobre la línea de tiempo). */
export function visibleChars(timeline: readonly number[], elapsedMs: number): number {
  let lo = 0;
  let hi = timeline.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if ((timeline[mid] ?? Infinity) <= elapsedMs) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
