// Forma de los datos de la historia (solo tipos). El guion en sí vive en src/data/story.ts.
/** Luz que late sobre la ilustración (el pecho que brilla, el teléfono que suena...). */
export interface SceneLight {
  readonly x: number;
  readonly y: number;
  readonly radius: number;
  readonly color: number;
  readonly peakAlpha: number;
  /** Duración de un latido completo, en ms. */
  readonly pulseMs: number;
  /** Retraso inicial: sirve para alternar luces (rojo/azul). */
  readonly delayMs?: number;
  /** 'flicker' = parpadeo irregular de neón estropeado, en vez de latido suave. */
  readonly mode?: 'pulse' | 'flicker';
  /** La luz se enciende (con fundido) cuando empieza esta frase de la escena. */
  readonly fromLine?: number;
}

/** Una frase del guion: narración (texto suelto) o alguien hablando. */
export type StoryLine = string | { readonly say: string; readonly who: string };

export function lineText(line: StoryLine): string {
  return typeof line === 'string' ? line : line.say;
}

/** Quién habla (null = narra Adrián). */
export function lineSpeaker(line: StoryLine): string | null {
  return typeof line === 'string' ? null : line.who;
}

/** Efectos con vida que se añaden a la ilustración (todo en src/game/cinematic/effects.ts). */
export type SceneEffect =
  /** Humo o vapor que sube (taza, cigarro, alcantarilla). */
  | { readonly type: 'smoke'; readonly x: number; readonly y: number; readonly everyMs: number; readonly color: number; readonly alpha: number; readonly rise: number; readonly drift: number }
  /** Chispas que saltan en ráfagas. */
  | { readonly type: 'sparks'; readonly x: number; readonly y: number; readonly everyMs: number; readonly count: number; readonly color: number }
  /** Coches voladores lejanos que cruzan la pantalla. */
  | { readonly type: 'traffic'; readonly y: number; readonly count: number; readonly speed: number; readonly dir: 1 | -1; readonly color: number; readonly lightColor: number; readonly layer?: number }
  /** Motas de polvo o ceniza flotando por toda la pantalla. */
  | { readonly type: 'dust'; readonly count: number; readonly color: number; readonly alpha: number }
  /** Rayos: destello blanco, sacudida y trueno. */
  | { readonly type: 'lightning'; readonly minGapMs: number; readonly maxGapMs: number; readonly shake: boolean}
  /** Viento: hojas, papeles o ceniza que cruzan volando (la velocidad negativa los lleva a la izquierda). */
  | { readonly type: 'wind'; readonly count: number; readonly colors: readonly number[]; readonly speed: number; readonly y0: number; readonly y1: number }
  /** Gotas que golpean los charcos y dibujan ondas. */
  | { readonly type: 'ripples'; readonly x0: number; readonly x1: number; readonly y0: number; readonly y1: number; readonly everyMs: number; readonly color: number }
  /** Niebla o bruma baja que pasa despacio. */
  | { readonly type: 'fog'; readonly y0: number; readonly y1: number; readonly color: number; readonly alpha: number; readonly speed: number }
  /** Rayas de velocidad horizontales (carrera, autobús). */
  | { readonly type: 'speedlines'; readonly count: number; readonly speed: number; readonly color: number; readonly alpha: number };

export interface SceneCard {
  readonly title: string;
  readonly sub?: string;
}

export interface ScenePan {
  readonly fromX: number;
  readonly fromY: number;
  readonly toX: number;
  readonly toY: number;
  readonly durationMs: number;
}

export interface StoryScene {
  /** Sirve también de nombre para la música: "escena-1" -> src/assets/music/escena-1.mp3 */
  readonly id: string;
  /** Qué ilustración dibujar (clave de game/cinematic/art). */
  readonly art: string;
  readonly caption: string;
  readonly lines: readonly StoryLine[];
  readonly rain: boolean;
  readonly lights: readonly SceneLight[];
  readonly effects: readonly SceneEffect[];
  readonly pan: ScenePan;
  /** Tono de color sobre toda la escena (cálido, frío...): color y fuerza (0 a 0.3 suele bastar). */
  readonly grade?: { readonly color: number; readonly alpha: number };
  /** Cómo se entra en la escena: fundido a negro (por defecto) o destello blanco. */
  readonly transition?: 'fade' | 'flash';
  /** Título grande sobre negro antes de la escena ("2078 / ONCE AÑOS ANTES"). */
  readonly card?: SceneCard;
}

/** La fuente de píxeles solo tiene mayúsculas: se pasa a mayúsculas justo antes de dibujar. */
export function forFont(text: string): string {
  return text.toUpperCase();
}
