import { describe, expect, it } from 'vitest';
import { CatBrain, type CatPhase, type CatSettings } from '../src/core/menu/catBrain';
import { createRng } from '../src/core/rng';
import { CAT } from '../src/data/menuScene';

const settings: CatSettings = CAT;

function run(brain: CatBrain, totalMs: number, stepMs = 16): { phases: CatPhase[]; ids: string[] } {
  const phases: CatPhase[] = [];
  const ids: string[] = [];
  for (let t = 0; t < totalMs; t += stepMs) {
    const pose = brain.update(stepMs);
    if (phases[phases.length - 1] !== pose.phase) phases.push(pose.phase);
    if (ids[ids.length - 1] !== pose.perchId) ids.push(pose.perchId);
  }
  return { phases, ids };
}

describe('gato del menú', () => {
  it('empieza sentado en su primer sitio', () => {
    const brain = new CatBrain(settings, createRng(1));
    const pose = brain.update(0);
    expect(pose.phase).toBe('sit');
    expect(pose.x).toBe(settings.perches[0]?.x);
    expect(pose.y).toBe(settings.perches[0]?.y);
  });
  it('repite el ciclo sentado → agacharse → saltar → aterrizar → sentado', () => {
    const { phases } = run(new CatBrain(settings, createRng(3)), 60000);
    expect(phases.length).toBeGreaterThan(8);
    const order: CatPhase[] = ['sit', 'crouch', 'jump', 'land'];
    phases.forEach((p, i) => expect(p).toBe(order[i % 4]));
  });
  it('es determinista con la misma semilla', () => {
    const a = run(new CatBrain(settings, createRng(9)), 40000);
    const b = run(new CatBrain(settings, createRng(9)), 40000);
    expect(a).toEqual(b);
  });
  it('cambia de sitio y nunca salta al mismo donde está', () => {
    const { ids } = run(new CatBrain(settings, createRng(5)), 90000);
    expect(ids.length).toBeGreaterThan(3);
    for (let i = 1; i < ids.length; i++) expect(ids[i]).not.toBe(ids[i - 1]);
  });
  it('en el aire sube por encima de la línea recta y nunca salta más lejos de lo permitido', () => {
    const brain = new CatBrain(settings, createRng(11));
    let lastGround = brain.update(0);
    let jumps = 0;
    for (let t = 0; t < 90000; t += 16) {
      const pose = brain.update(16);
      if (pose.phase === 'sit') lastGround = pose;
      if (pose.phase === 'jump') {
        jumps++;
        expect(Math.hypot(pose.x - lastGround.x, pose.y - lastGround.y)).toBeLessThanOrEqual(settings.maxJumpPx + 20);
      }
    }
    expect(jumps).toBeGreaterThan(20);
  });
  it('mira hacia donde va a saltar', () => {
    const brain = new CatBrain(settings, createRng(2));
    let fromX = brain.update(0).x;
    let facingAtCrouch: 1 | -1 | undefined;
    let checked = 0;
    for (let t = 0; t < 120000; t += 16) {
      const pose = brain.update(16);
      if (pose.phase === 'crouch' && facingAtCrouch === undefined) facingAtCrouch = pose.facing;
      if (pose.phase === 'sit' && facingAtCrouch !== undefined) {
        expect(Math.sign(pose.x - fromX)).toBe(facingAtCrouch);
        checked++;
        fromX = pose.x;
        facingAtCrouch = undefined;
      }
    }
    expect(checked).toBeGreaterThan(10);
  });
  it('con un solo sitio se queda sentado', () => {
    const brain = new CatBrain({ ...settings, perches: [{ id: 'solo', x: 5, y: 5 }] }, createRng(1));
    const { phases } = run(brain, 30000);
    expect(phases).toEqual(['sit']);
  });
  it('sin ningún sitio da error claro', () => {
    expect(() => new CatBrain({ ...settings, perches: [] }, createRng(1))).toThrow();
  });
  it('un salto de tiempo grande no rompe nada', () => {
    const brain = new CatBrain(settings, createRng(4));
    const pose = brain.update(500000);
    expect(Number.isFinite(pose.x)).toBe(true);
    expect(Number.isFinite(pose.y)).toBe(true);
  });
});
