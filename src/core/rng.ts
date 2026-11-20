/**
 * Generador de números "aleatorios" con semilla (mulberry32).
 * Con la misma semilla siempre da la misma secuencia, así la ciudad del menú
 * se dibuja igual en cada arranque.
 */
export function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
