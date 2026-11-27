import { describe, expect, it } from 'vitest';
import { CinematicRunner, type RunnerEvent } from '../src/core/cinematic/cinematicRunner';

const CFG = { charsPerSecond: 10, pauseAfterMs: {}, advanceLockMs: 200 };
const SCRIPT = [['AB', 'CD'], ['EF']];
const types = (e: RunnerEvent[]): string[] => e.map((x) => x.type);

describe('motor de la cinemática', () => {
  it('no admite guiones vacíos', () => {
    expect(() => new CinematicRunner([], CFG)).toThrow();
    expect(() => new CinematicRunner([[]], CFG)).toThrow();
    expect(() => new CinematicRunner([['  ']], CFG)).toThrow();
  });
  it('empieza en la primera frase y no hace nada antes de arrancar', () => {
    const r = new CinematicRunner(SCRIPT, CFG);
    expect(r.update(500)).toEqual([]);
    expect(r.advance()).toEqual([]);
    expect(types(r.start())).toEqual(['scene-start', 'line-start']);
    expect(r.start()).toEqual([]);
  });
  it('va escribiendo con el tiempo y avisa de qué letras aparecen', () => {
    const r = new CinematicRunner(SCRIPT, CFG);
    r.start();
    expect(r.update(50)).toEqual([]);
    const e = r.update(60);
    expect(e).toEqual([{ type: 'chars', scene: 0, line: 0, from: 0, to: 1, instant: false }]);
    expect(r.snapshot().visible).toBe(1);
    const e2 = r.update(100);
    expect(types(e2)).toEqual(['chars', 'line-complete']);
    expect(r.snapshot().phase).toBe('waiting');
  });
  it('pulsar mientras escribe muestra la frase entera de golpe', () => {
    const r = new CinematicRunner(SCRIPT, CFG);
    r.start();
    const e = r.advance();
    expect(e[0]).toEqual({ type: 'chars', scene: 0, line: 0, from: 0, to: 2, instant: true });
    expect(types(e)).toEqual(['chars', 'line-complete']);
    expect(r.snapshot().visible).toBe(2);
  });
  it('tras terminar una frase, una pulsación inmediata se ignora (bloqueo) y luego avanza', () => {
    const r = new CinematicRunner(SCRIPT, CFG);
    r.start();
    r.advance(); // frase entera
    expect(r.advance()).toEqual([]); // demasiado pronto
    r.update(100);
    expect(r.advance()).toEqual([]); // aún bloqueado
    r.update(150);
    expect(r.advance()).toEqual([{ type: 'line-start', scene: 0, line: 1 }]);
  });
  it('al acabar las frases de una escena pasa a la siguiente', () => {
    const r = new CinematicRunner(SCRIPT, CFG);
    r.start();
    r.advance();
    r.update(300);
    r.advance(); // -> frase 2
    r.advance();
    r.update(300);
    const e = r.advance();
    expect(e).toEqual([
      { type: 'scene-start', scene: 1 },
      { type: 'line-start', scene: 1, line: 0 }
    ]);
  });
  it('al acabar todo avisa de que terminó, sin saltarla', () => {
    const r = new CinematicRunner([['AB']], CFG);
    r.start();
    r.advance();
    r.update(300);
    expect(r.advance()).toEqual([{ type: 'finished', skipped: false }]);
    expect(r.snapshot().phase).toBe('finished');
    expect(r.advance()).toEqual([]);
    expect(r.update(1000)).toEqual([]);
  });
  it('saltar la cinemática termina de inmediato y lo marca como saltada', () => {
    const r = new CinematicRunner(SCRIPT, CFG);
    expect(r.skip()).toEqual([]); // antes de empezar no hay nada que saltar
    r.start();
    expect(r.skip()).toEqual([{ type: 'finished', skipped: true }]);
    expect(r.skip()).toEqual([]);
    expect(r.update(500)).toEqual([]);
  });
  it('recorre el guion completo con pulsaciones sin que se atasque', () => {
    const r = new CinematicRunner([['A', 'B'], ['C', 'D', 'E']], CFG);
    const seen: string[] = [];
    const note = (events: RunnerEvent[]): void => {
      for (const e of events) if (e.type === 'line-start') seen.push(`${e.scene}.${e.line}`);
    };
    note(r.start());
    for (let i = 0; i < 100 && r.snapshot().phase !== 'finished'; i++) {
      note(r.advance());
      r.update(250);
    }
    expect(seen).toEqual(['0.0', '0.1', '1.0', '1.1', '1.2']);
    expect(r.snapshot().phase).toBe('finished');
  });
  it('puede empezar por otra escena (para probar una sola) y desde ahí sigue con normalidad', () => {
    const r = new CinematicRunner(SCRIPT, CFG);
    expect(r.start(1)).toEqual([
      { type: 'scene-start', scene: 1 },
      { type: 'line-start', scene: 1, line: 0 }
    ]);
    expect(r.snapshot().text).toBe('EF');
    r.advance();
    r.update(300);
    expect(r.advance()).toEqual([{ type: 'finished', skipped: false }]);
  });
  it('no deja empezar por una escena que no existe', () => {
    expect(() => new CinematicRunner(SCRIPT, CFG).start(2)).toThrow();
    expect(() => new CinematicRunner(SCRIPT, CFG).start(-1)).toThrow();
  });
});
