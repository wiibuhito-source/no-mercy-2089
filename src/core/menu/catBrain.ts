// Cerebro del gato del menú (lógica pura, sin Phaser): decide cuándo se sienta, salta y a dónde.
import { arcPosition, randomBetween } from './motion';

export interface Perch {
  readonly id: string;
  readonly x: number;
  readonly y: number;
}

export interface CatSettings {
  readonly perches: readonly Perch[];
  readonly sitMs: readonly [number, number];
  readonly crouchMs: number;
  readonly landMs: number;
  readonly jumpSpeedPxPerSec: number;
  readonly jumpMinMs: number;
  readonly jumpMaxMs: number;
  readonly arcHeightBase: number;
  readonly arcHeightPerPx: number;
  readonly maxJumpPx: number;
  readonly tailFlickMs: readonly [number, number];
}

export type CatPhase = 'sit' | 'crouch' | 'jump' | 'land';

export interface CatPose {
  readonly phase: CatPhase;
  /** Posición de los pies. */
  readonly x: number;
  readonly y: number;
  readonly facing: 1 | -1;
  readonly tailUp: boolean;
  readonly perchId: string;
}

const TAIL_UP_MS = 260;

export class CatBrain {
  private phase: CatPhase = 'sit';
  private timer = 0;
  private phaseMs: number;
  private current: Perch;
  private target: Perch;
  private facing: 1 | -1 = -1;
  private jumpMs = 0;
  private jumpHeight = 0;
  private tailUp = false;
  private tailTimer: number;
  private pose: CatPose;

  constructor(private readonly settings: CatSettings, private readonly rnd: () => number) {
    const first = settings.perches[0];
    if (!first) throw new Error('El gato necesita al menos un sitio donde sentarse');
    this.current = first;
    this.target = first;
    this.phaseMs = randomBetween(rnd, settings.sitMs);
    this.tailTimer = randomBetween(rnd, settings.tailFlickMs);
    this.pose = this.buildPose(first.x, first.y);
  }

  /** Avanza el tiempo y devuelve la pose actual. */
  update(deltaMs: number): CatPose {
    this.updateTail(deltaMs);
    this.timer += deltaMs;
    // Puede encadenar fases si el delta es grande
    for (let guard = 0; guard < 8 && this.timer >= this.phaseMs; guard++) {
      this.timer -= this.phaseMs;
      this.nextPhase();
    }
    this.pose = this.computePose();
    return this.pose;
  }

  get currentPose(): CatPose {
    return this.pose;
  }

  private updateTail(deltaMs: number): void {
    this.tailTimer -= deltaMs;
    if (this.tailTimer > 0) return;
    this.tailUp = !this.tailUp;
    this.tailTimer = this.tailUp ? TAIL_UP_MS : randomBetween(this.rnd, this.settings.tailFlickMs);
  }

  private nextPhase(): void {
    switch (this.phase) {
      case 'sit': {
        const next = this.pickTarget();
        if (!next) {
          this.phaseMs = randomBetween(this.rnd, this.settings.sitMs);
          return;
        }
        this.target = next;
        const dx = next.x - this.current.x;
        if (dx !== 0) this.facing = dx > 0 ? 1 : -1;
        this.phase = 'crouch';
        this.phaseMs = this.settings.crouchMs;
        return;
      }
      case 'crouch': {
        const dist = Math.hypot(this.target.x - this.current.x, this.target.y - this.current.y);
        const raw = (dist / this.settings.jumpSpeedPxPerSec) * 1000;
        this.jumpMs = Math.min(this.settings.jumpMaxMs, Math.max(this.settings.jumpMinMs, raw));
        const climb = Math.max(0, this.current.y - this.target.y);
        this.jumpHeight = this.settings.arcHeightBase + this.settings.arcHeightPerPx * dist + climb * 0.5;
        this.phase = 'jump';
        this.phaseMs = this.jumpMs;
        return;
      }
      case 'jump':
        this.current = this.target;
        this.phase = 'land';
        this.phaseMs = this.settings.landMs;
        return;
      case 'land':
        this.phase = 'sit';
        this.phaseMs = randomBetween(this.rnd, this.settings.sitMs);
        return;
    }
  }

  private pickTarget(): Perch | undefined {
    const options = this.settings.perches.filter(
      (p) => p.id !== this.current.id && Math.hypot(p.x - this.current.x, p.y - this.current.y) <= this.settings.maxJumpPx
    );
    if (options.length === 0) return undefined;
    return options[Math.min(options.length - 1, Math.floor(this.rnd() * options.length))];
  }

  private computePose(): CatPose {
    if (this.phase === 'jump') {
      const p = arcPosition(this.current, this.target, this.timer / this.jumpMs, this.jumpHeight);
      return this.buildPose(p.x, p.y);
    }
    return this.buildPose(this.current.x, this.current.y);
  }

  private buildPose(x: number, y: number): CatPose {
    return { phase: this.phase, x, y, facing: this.facing, tailUp: this.tailUp && this.phase === 'sit', perchId: this.current.id };
  }
}
