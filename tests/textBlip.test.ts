import { describe, expect, it } from 'vitest';
import { blipFrequency, shouldBlip } from '../src/core/cinematic/textBlip';
import { CINEMATIC } from '../src/data/cinematic';

const CFG = CINEMATIC.blip;

describe('sonido del texto', () => {
  it('solo suenan letras y números, no espacios ni signos', () => {
    expect(shouldBlip(' ', 0, CFG)).toBe(false);
    expect(shouldBlip('.', 0, CFG)).toBe(false);
    expect(shouldBlip('A', 0, CFG)).toBe(true);
    expect(shouldBlip('7', 0, CFG)).toBe(true);
    expect(shouldBlip('Ñ', 0, CFG)).toBe(true);
  });
  it('suena una de cada N letras', () => {
    const n = CFG.everyNthChar;
    const sounding = Array.from({ length: 20 }, (_, i) => shouldBlip('A', i, CFG)).filter(Boolean).length;
    expect(sounding).toBe(Math.ceil(20 / n));
  });
  it('la misma letra suena igual siempre, sea mayúscula o minúscula', () => {
    expect(blipFrequency('a', CFG)).toBe(blipFrequency('A', CFG));
  });
  it('el tono siempre queda dentro del rango previsto', () => {
    for (const ch of 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789ÁÉÍÓÚ') {
      const f = blipFrequency(ch, CFG);
      expect(f).toBeGreaterThanOrEqual(CFG.baseHz);
      expect(f).toBeLessThanOrEqual(CFG.baseHz + (CFG.steps - 1) * CFG.stepHz);
    }
  });
});
