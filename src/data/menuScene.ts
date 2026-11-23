// Medidas y tiempos de la escena del menú (datos, no código): se ajustan aquí sin tocar la lógica.
import { PAL } from './menuPalette';

/** Márgenes extra a cada lado de las capas con parallax (para que no se vean bordes al moverlas). */
export const PARALLAX_MARGIN = 10;

export const SCENE = {
  /** Donde acaban los edificios del fondo y empieza la acera. */
  horizonY: 196,
  /** Borde de la acera (bordillo). */
  curbY: 210,
  /** Línea del suelo sobre la que se apoyan las ruedas del coche. */
  wheelBottomY: 252,
  /** Esquina superior izquierda de la imagen del coche. */
  car: { x: 72, y: 202 },
  /** Azotea del edificio de la derecha (donde viven el gato y el pandillero). */
  roofY: 128,
  sun: { x: 150, y: 128 }
} as const;

export const TITLE = { y: 5, taglineGap: 5 } as const;

/** Colores de los carteles de neón. */
export const NEON = [PAL.magenta, PAL.cyan, PAL.amber, PAL.pink] as const;

/** Parallax con el ratón: cuánto se mueve cada capa (0 = quieta) y el máximo en píxeles. */
export const PARALLAX = {
  maxPx: 8,
  smoothing: 0.06,
  factors: { sun: 0.15, far: 0.3, mid: 0.65 }
} as const;

/** Respiración de Adrián: periodo y recorrido en píxeles (la cabeza sigue al torso con un pequeño retraso). */
export const BREATH = { periodMs: 3600, torsoPx: 1, headPx: 1, headLagMs: 380 } as const;

/** Gato: sus posiciones y tiempos. Las posiciones son los pies (centro, suelo). */
export const CAT = {
  perches: [
    { id: 'ac', x: 347, y: 120 },
    { id: 'crate', x: 368, y: 118 },
    { id: 'edge', x: 392, y: 128 },
    { id: 'tank', x: 403, y: 104 },
    { id: 'ledge', x: 430, y: 128 }
  ],


  sitMs: [2200, 5200],
  crouchMs: 380,
  landMs: 260,
  jumpSpeedPxPerSec: 70,
  jumpMinMs: 360,
  jumpMaxMs: 620,
  arcHeightBase: 8,
  arcHeightPerPx: 0.22,
  maxJumpPx: 70,
  tailFlickMs: [500, 1400]
} as const;

/** Tráfico aéreo: coches voladores y dirigible. */
export const TRAFFIC = {
  lanes: [
    { y: 112, depth: 0.55, speedPxPerSec: [26, 36] },
    { y: 128, depth: 0.75, speedPxPerSec: [38, 52] },
    { y: 150, depth: 1.0, speedPxPerSec: [56, 78] }
  ],
  spawnEveryMs: [3200, 7800],
  blimpEveryMs: [38000, 52000],
  blimp: { y: 78, speedPxPerSec: 7 },
  margin: 40
} as const;

export const AMBIENCE = {
  rain: { enabled: true, alpha: 0.22, speedFar: 90, speedNear: 150 },
  windowFlickers: 16,
  starTwinkles: 18,
  holoSwitchMs: 3400
} as const;
