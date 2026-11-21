// Forma de los datos de la historia (solo tipos). El guion en sí vive en src/data/story.ts.
export interface SfxCue {
  /** Frase (dentro de la escena) cuyo comienzo dispara el efecto. 0 = al empezar la escena. */
  readonly line: number;
  readonly delayMs: number;
  /** Nombre del efecto en src/data/sfx.ts. */
  readonly sfx: string;
}

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
  readonly lines: readonly string[];
  /** Sonido ambiente (clave de src/data/sfx.ts) o null. */
  readonly ambience: string | null;
  readonly rain: boolean;
  readonly cues: readonly SfxCue[];
  readonly lights: readonly SceneLight[];
  readonly pan: ScenePan;
}

/** La fuente de píxeles solo tiene mayúsculas: se pasa a mayúsculas justo antes de dibujar. */
export function forFont(text: string): string {
  return text.toUpperCase();
}

/** Efectos que hay que disparar al empezar la frase `line` de la escena. */
export function cuesForLine(scene: StoryScene, line: number): readonly SfxCue[] {
  return scene.cues.filter((c) => c.line === line);
}
