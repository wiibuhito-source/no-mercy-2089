// Matemáticas de los efectos de la cinemática (lógica pura, sin Phaser): partículas, rayos y parpadeos.

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Aceleración vertical (px/s²): positiva = cae, negativa = sube. */
  gravity: number;
  life: number;
  readonly maxLife: number;
  readonly size: number;
}

/** Avanza la partícula `dtMs`. Devuelve false cuando ya ha muerto. */
export function stepParticle(p: Particle, dtMs: number): boolean {
  const dt = dtMs / 1000;
  p.life -= dtMs;
  if (p.life <= 0) return false;
  p.vy += p.gravity * dt;
  p.x += p.vx * dt;
  p.y += p.vy * dt;
  return true;
}

/** Transparencia de una partícula según su edad: aparece rápido y se apaga despacio. */
export function particleAlpha(p: Particle, peak: number): number {
  const age = 1 - p.life / p.maxLife;
  const fadeIn = Math.min(1, age / 0.15);
  const fadeOut = Math.min(1, (1 - age) / 0.6);
  return Math.max(0, Math.min(1, peak * Math.min(fadeIn, fadeOut)));
}

/** Tiempo hasta el siguiente rayo, entre `min` y `max` ms. */
export function nextGapMs(rnd: () => number, min: number, max: number): number {
  return min + rnd() * Math.max(0, max - min);
}

/** Forma de un rayo: destellos (nivel 0 a 1) cada pocos ms, como un doble parpadeo. */
export const LIGHTNING_FLASHES: readonly { readonly atMs: number; readonly level: number }[] = [
  { atMs: 0, level: 1 },
  { atMs: 90, level: 0.1 },
  { atMs: 150, level: 0.65 },
  { atMs: 260, level: 0 }
];

/** Nivel de destello del rayo `elapsedMs` después de empezar (0 si ya terminó). */
export function lightningLevel(elapsedMs: number): number {
  let level = 0;
  for (const f of LIGHTNING_FLASHES) if (elapsedMs >= f.atMs) level = f.level;
  return level;
}

/** Parpadeo irregular de un neón estropeado: casi siempre encendido, con caídas bruscas. Devuelve el brillo (0.1 a 1). */
export function flickerLevel(rnd: () => number): number {
  const r = rnd();
  if (r < 0.62) return 1;
  if (r < 0.82) return 0.55 + rnd() * 0.3;
  return 0.1 + rnd() * 0.15;
}
