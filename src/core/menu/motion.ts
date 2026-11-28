// Curvas de movimiento del menú (lógica pura, sin Phaser): respiración, saltos, parallax, máquina de escribir.

export interface Vec {
  readonly x: number;
  readonly y: number;
}

function smoothstep(t: number): number {
  const k = Math.min(1, Math.max(0, t));
  return k * k * (3 - 2 * k);
}

/**
 * Respiración: devuelve 0..1. Inhalar ocupa el 40 % del ciclo y exhalar el 60 %, suave en los dos sentidos.
 */
export function breath(timeMs: number, periodMs: number): number {
  const phase = (((timeMs % periodMs) + periodMs) % periodMs) / periodMs;
  return phase < 0.4 ? smoothstep(phase / 0.4) : 1 - smoothstep((phase - 0.4) / 0.6);
}

/** Posición en un salto en parábola de `from` a `to` (s va de 0 a 1; `height` es lo que sube sobre la línea recta). */
export function arcPosition(from: Vec, to: Vec, s: number, height: number): Vec {
  const k = Math.min(1, Math.max(0, s));
  return { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k - 4 * height * k * (1 - k) };
}

/** Desplazamiento de una capa con parallax. `pointer` va de -1 (izquierda) a 1 (derecha). */
export function parallaxOffset(pointer: number, factor: number, maxPx: number): number {
  return Math.min(1, Math.max(-1, pointer)) * factor * maxPx;
}

/** Acerca `current` a `target` un porcentaje `k` (0..1) de la distancia: movimiento suave. */
export function approach(current: number, target: number, k: number): number {
  return current + (target - current) * Math.min(1, Math.max(0, k));
}

/** Cuántos caracteres se han escrito tras `elapsedMs` (efecto máquina de escribir). */
export function typedChars(elapsedMs: number, msPerChar: number, total: number): number {
  if (msPerChar <= 0) return total;
  return Math.min(total, Math.max(0, Math.floor(elapsedMs / msPerChar)));
}

/** Número al azar entre los dos valores de `range`, usando el generador con semilla `rnd`. */
export function randomBetween(rnd: () => number, range: readonly [number, number]): number {
  return range[0] + (range[1] - range[0]) * rnd();
}
