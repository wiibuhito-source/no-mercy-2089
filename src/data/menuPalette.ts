// Paleta del menú (datos, no código). Cambiar un color aquí cambia el arte provisional entero.
export const PAL = {
  // Noche
  ink: 0x05020d,
  night: 0x0b0618,
  dusk: 0x140a2e,
  plum: 0x1f1045,
  indigo: 0x2b1a63,
  violet: 0x4b2d9a,
  lilac: 0x8e7bff,
  // Neón
  magenta: 0xff2bd6,
  pink: 0xff7ae0,
  blush: 0xffc8f2,
  cyan: 0x19f3ff,
  aqua: 0x9afcff,
  teal: 0x0b8fa8,
  deepTeal: 0x0a4a66,
  // Cálidos (sol, ventanas, farolas)
  sun: 0xffe66d,
  amber: 0xffb347,
  orange: 0xff7b54,
  red: 0xff3b5c,
  window: 0xffe08a,
  // Neutros
  white: 0xffffff,
  steel: 0x8a8fb5,
  slate: 0x4a4f7a,
  // Piel y pelo
  skin: 0xc98b5e,
  skinShade: 0x9a6340,
  skinLight: 0xe3a875,
  hair: 0x1a0f14,
  hairShine: 0x4a3340,
  // Verdes (palmeras)
  leafDark: 0x08483f,
  leafMid: 0x0f8a72,
  leafLight: 0x4ff0c0
} as const;

/** Letras de los sprites hechos con `drawRows`. */
export const SPRITE_KEY: Readonly<Record<string, number>> = {
  k: PAL.ink,
  n: PAL.night,
  d: PAL.dusk,
  p: PAL.plum,
  i: PAL.indigo,
  v: PAL.violet,
  l: PAL.lilac,
  m: PAL.magenta,
  P: PAL.pink,
  b: PAL.blush,
  c: PAL.cyan,
  a: PAL.aqua,
  t: PAL.teal,
  T: PAL.deepTeal,
  y: PAL.sun,
  A: PAL.amber,
  o: PAL.orange,
  r: PAL.red,
  w: PAL.white,
  s: PAL.skin,
  S: PAL.skinShade,
  L: PAL.skinLight,
  h: PAL.hair,
  H: PAL.hairShine,
  e: PAL.steel,
  g: PAL.slate
};
