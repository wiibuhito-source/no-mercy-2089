/** Cualquier elemento del menú que se mueve: la escena le avisa en cada fotograma. */
export interface Animated {
  update(timeMs: number, deltaMs: number): void;
}

/** Profundidades (qué se dibuja encima de qué), de atrás hacia delante. */
export const DEPTH = {
  sky: 0,
  stars: 1,
  clouds: 2,
  sun: 3,
  far: 4,
  blimp: 5,
  mid: 6,
  flyers: 7,
  near: 10,
  signs: 11,
  palmTrunk: 12,
  props: 13,
  roofCharacters: 14,
  steam: 15,
  carFx: 19,
  car: 20,
  adrianTorso: 21,
  adrianLower: 22,
  adrianArm: 23,
  adrianHead: 24,
  glows: 40,
  rain: 45,
  vignette: 50,
  title: 60,
  panel: 70,
  hints: 80
} as const;
