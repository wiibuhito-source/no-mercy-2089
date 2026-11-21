// Tráfico aéreo del menú (lógica pura, sin Phaser): coches voladores y un dirigible de vez en cuando.
import { randomBetween } from './motion';

export interface Lane {
  readonly y: number;
  readonly depth: number;
  readonly speedPxPerSec: readonly [number, number];
}

export interface TrafficSettings {
  readonly lanes: readonly Lane[];
  readonly spawnEveryMs: readonly [number, number];
  readonly blimpEveryMs: readonly [number, number];
  readonly blimp: { readonly y: number; readonly speedPxPerSec: number };
  readonly margin: number;
}

export interface Flyer {
  readonly id: number;
  readonly kind: 'car' | 'blimp';
  x: number;
  readonly y: number;
  /** Velocidad en píxeles por segundo (negativa = va hacia la izquierda). */
  readonly vx: number;
  readonly depth: number;
  /** Variante visual (color) del coche. */
  readonly variant: number;
}

export const CAR_VARIANTS = 3;
const BLIMP_MARGIN = 80;

export class TrafficField {
  private list: Flyer[] = [];
  private nextId = 1;
  private carTimer: number;
  private blimpTimer: number;

  constructor(
    private readonly settings: TrafficSettings,
    private readonly rnd: () => number,
    private readonly width: number,
    firstBlimpMs = 9000
  ) {
    this.carTimer = 0;
    this.blimpTimer = firstBlimpMs;
  }

  get flyers(): readonly Flyer[] {
    return this.list;
  }

  /** Avanza el tiempo: mueve, elimina los que salen de pantalla y crea otros nuevos. */
  update(deltaMs: number): void {
    const dt = deltaMs / 1000;
    for (const f of this.list) f.x += f.vx * dt;
    this.list = this.list.filter((f) => {
      const m = f.kind === 'blimp' ? BLIMP_MARGIN : this.settings.margin;
      return f.vx > 0 ? f.x < this.width + m + 1 : f.x > -m - 1;
    });
    this.carTimer -= deltaMs;
    if (this.carTimer <= 0) {
      this.spawnCar();
      this.carTimer = randomBetween(this.rnd, this.settings.spawnEveryMs);
    }
    this.blimpTimer -= deltaMs;
    if (this.blimpTimer <= 0) {
      this.spawnBlimp();
      this.blimpTimer = randomBetween(this.rnd, this.settings.blimpEveryMs);
    }
  }

  /** Simula `ms` milisegundos de tiempo para que el cielo no empiece vacío. */
  prewarm(ms: number, stepMs = 100): void {
    for (let t = 0; t < ms; t += stepMs) this.update(stepMs);
  }

  private spawnCar(): void {
    const lane = this.settings.lanes[Math.min(this.settings.lanes.length - 1, Math.floor(this.rnd() * this.settings.lanes.length))];
    if (!lane) return;
    const dir = this.rnd() < 0.5 ? 1 : -1;
    const speed = randomBetween(this.rnd, lane.speedPxPerSec);
    this.list.push({
      id: this.nextId++,
      kind: 'car',
      x: dir > 0 ? -this.settings.margin : this.width + this.settings.margin,
      y: lane.y,
      vx: dir * speed,
      depth: lane.depth,
      variant: Math.min(CAR_VARIANTS - 1, Math.floor(this.rnd() * CAR_VARIANTS))
    });
  }

  private spawnBlimp(): void {
    if (this.list.some((f) => f.kind === 'blimp')) return;
    const dir = this.rnd() < 0.5 ? 1 : -1;
    this.list.push({
      id: this.nextId++,
      kind: 'blimp',
      x: dir > 0 ? -BLIMP_MARGIN : this.width + BLIMP_MARGIN,
      y: this.settings.blimp.y,
      vx: dir * this.settings.blimp.speedPxPerSec,
      depth: 0.4,
      variant: 0
    });
  }
}
