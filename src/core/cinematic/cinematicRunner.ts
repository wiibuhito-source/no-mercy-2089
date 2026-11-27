// Máquina de estados de la cinemática (lógica pura, sin Phaser): qué escena y qué frase toca,
// cuántas letras se ven y qué hacer cuando el jugador pulsa. Devuelve eventos; quien la use (la pantalla)
// decide cómo dibujarlos y qué sonidos poner.
import { typewriterTimeline, visibleChars, type TypewriterConfig } from './typewriter';

export interface RunnerConfig extends TypewriterConfig {
  /** Tras terminar una frase, tiempo (ms) en que una pulsación se ignora (evita saltarse la frase sin querer). */
  readonly advanceLockMs: number;
}

export type RunnerEvent =
  | { readonly type: 'scene-start'; readonly scene: number }
  | { readonly type: 'line-start'; readonly scene: number; readonly line: number }
  /** Letras con índice en [from, to) acaban de aparecer. */
  | { readonly type: 'chars'; readonly scene: number; readonly line: number; readonly from: number; readonly to: number; readonly instant: boolean }
  | { readonly type: 'line-complete'; readonly scene: number; readonly line: number }
  | { readonly type: 'finished'; readonly skipped: boolean };

export type RunnerPhase = 'idle' | 'typing' | 'waiting' | 'finished';

export interface RunnerSnapshot {
  readonly phase: RunnerPhase;
  readonly scene: number;
  readonly line: number;
  readonly text: string;
  readonly visible: number;
  readonly total: number;
}

/** `script[escena][frase]`: el texto de cada frase, ya listo para dibujar. */
export type RunnerScript = readonly (readonly string[])[];

export class CinematicRunner {
  private phase: RunnerPhase = 'idle';
  private scene = 0;
  private line = 0;
  private elapsed = 0;
  private shown = 0;
  private lock = 0;
  private timeline: number[] = [];
  private total = 0;

  constructor(
    private readonly script: RunnerScript,
    private readonly cfg: RunnerConfig
  ) {
    if (script.length === 0) throw new Error('La cinemática no tiene escenas');
    script.forEach((lines, s) => {
      if (lines.length === 0) throw new Error(`La escena ${s} no tiene frases`);
      lines.forEach((text, l) => {
        if (text.trim() === '') throw new Error(`La frase ${l} de la escena ${s} está vacía`);
      });
    });
  }

  snapshot(): RunnerSnapshot {
    return { phase: this.phase, scene: this.scene, line: this.line, text: this.currentText(), visible: this.shown, total: this.total };
  }

  private currentText(): string {
    return this.script[this.scene]?.[this.line] ?? '';
  }

  private beginLine(): void {
    const text = this.currentText();
    this.timeline = typewriterTimeline(text, this.cfg);
    this.total = this.timeline.length;
    this.elapsed = 0;
    this.shown = 0;
    this.lock = 0;
    this.phase = 'typing';
  }

  /** Arranca en la primera frase de la escena `scene` (por defecto, la primera). */
  start(scene = 0): RunnerEvent[] {
    if (this.phase !== 'idle') return [];
    if (!Number.isInteger(scene) || scene < 0 || scene >= this.script.length) throw new Error(`Escena de inicio no válida: ${scene}`);
    this.scene = scene;
    this.line = 0;
    this.beginLine();
    return [
      { type: 'scene-start', scene },
      { type: 'line-start', scene, line: 0 }
    ];
  }

  update(dtMs: number): RunnerEvent[] {
    if (this.phase === 'waiting') {
      this.lock = Math.max(0, this.lock - dtMs);
      return [];
    }
    if (this.phase !== 'typing') return [];
    this.elapsed += dtMs;
    const now = visibleChars(this.timeline, this.elapsed);
    if (now <= this.shown) return [];
    const events: RunnerEvent[] = [{ type: 'chars', scene: this.scene, line: this.line, from: this.shown, to: now, instant: false }];
    this.shown = now;
    if (this.shown >= this.total) events.push(this.completeLine());
    return events;
  }

  private completeLine(): RunnerEvent {
    this.phase = 'waiting';
    this.lock = this.cfg.advanceLockMs;
    return { type: 'line-complete', scene: this.scene, line: this.line };
  }

  /** El jugador pulsa: si se está escribiendo, la frase sale entera; si ya está entera, pasa a la siguiente. */
  advance(): RunnerEvent[] {
    if (this.phase === 'typing') {
      const events: RunnerEvent[] = [];
      if (this.shown < this.total) {
        events.push({ type: 'chars', scene: this.scene, line: this.line, from: this.shown, to: this.total, instant: true });
        this.shown = this.total;
      }
      events.push(this.completeLine());
      return events;
    }
    if (this.phase !== 'waiting' || this.lock > 0) return [];

    const lines = this.script[this.scene] ?? [];
    if (this.line + 1 < lines.length) {
      this.line += 1;
      this.beginLine();
      return [{ type: 'line-start', scene: this.scene, line: this.line }];
    }
    if (this.scene + 1 < this.script.length) {
      this.scene += 1;
      this.line = 0;
      this.beginLine();
      return [
        { type: 'scene-start', scene: this.scene },
        { type: 'line-start', scene: this.scene, line: 0 }
      ];
    }
    this.phase = 'finished';
    return [{ type: 'finished', skipped: false }];
  }

  /** Saltar toda la cinemática. */
  skip(): RunnerEvent[] {
    if (this.phase === 'idle' || this.phase === 'finished') return [];
    this.phase = 'finished';
    return [{ type: 'finished', skipped: true }];
  }
}
