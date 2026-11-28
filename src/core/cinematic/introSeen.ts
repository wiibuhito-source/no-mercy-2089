// ¿Ha visto ya el jugador la cinemática inicial? (lógica pura, sin navegador.)
// Se apoya en un almacén mínimo de pares clave-valor: en el navegador es localStorage y en los tests es un Map.
// OJO: es un adelanto mínimo del futuro "Sistema de guardado" (Prototipo 0.6). Cuando exista, esto se mueve ahí.

export interface KeyValueStore {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

export const INTRO_SEEN_KEY = 'nomercy.intro.seen';

export function hasSeenIntro(store: KeyValueStore): boolean {
  return store.get(INTRO_SEEN_KEY) === '1';
}

export function markIntroSeen(store: KeyValueStore): void {
  store.set(INTRO_SEEN_KEY, '1');
}

export function resetIntroSeen(store: KeyValueStore): void {
  store.remove(INTRO_SEEN_KEY);
}

/** La cinemática se ve la primera vez, o siempre que se fuerce (por ejemplo, con ?intro al final de la dirección). */
export function shouldPlayIntro(store: KeyValueStore, forceReplay: boolean): boolean {
  return forceReplay || !hasSeenIntro(store);
}

/** Escena por la que empezar al probar ("?escena=5" -> índice 4). Valores raros se ignoran y se empieza por la primera. */
export function introStartScene(search: string, sceneCount: number): number {
  const raw = new URLSearchParams(search).get('escena');
  const n = raw === null ? NaN : Number.parseInt(raw, 10);
  return Number.isInteger(n) && n >= 1 && n <= sceneCount ? n - 1 : 0;
}

/** ¿La dirección lleva "?intro"? (para poder repetir la cinemática al probar). "?intro=0" no cuenta. */
export function wantsIntroReplay(search: string): boolean {
  const params = new URLSearchParams(search);
  return params.has('intro') && params.get('intro') !== '0';
}
