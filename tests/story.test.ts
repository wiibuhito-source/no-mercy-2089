import { describe, expect, it } from 'vitest';
import { validateAmbience, validateRecipe, recipeLengthMs } from '../src/core/audio/sfxRecipe';
import { CinematicRunner } from '../src/core/cinematic/cinematicRunner';
import { cuesForLine, forFont } from '../src/core/cinematic/storyTypes';
import { wrapText } from '../src/core/cinematic/wrapText';
import { textPixels, measureText } from '../src/core/pixelFont';
import { CINEMATIC } from '../src/data/cinematic';
import { AMBIENCES, SFX } from '../src/data/sfx';
import { PROTAGONIST, STORY_SCENES } from '../src/data/story';

describe('guion de la cinemática', () => {
  it('tiene las seis escenas del guion aprobado, con id único y nombre de música "escena-N"', () => {
    expect(STORY_SCENES).toHaveLength(6);
    expect(new Set(STORY_SCENES.map((s) => s.id)).size).toBe(6);
    STORY_SCENES.forEach((s, i) => expect(s.id).toBe(`escena-${i + 1}`));
  });
  it('el protagonista se llama Adrián Vargas y su nombre sale en la primera y la última escena', () => {
    expect(PROTAGONIST.fullName).toBe('Adrián Vargas');
    expect(forFont(STORY_SCENES[0]?.caption ?? '')).toContain('ADRIÁN VARGAS');
    expect(forFont(STORY_SCENES[5]?.caption ?? '')).toContain('ADRIÁN VARGAS');
  });
  it('todas las letras del guion existen en la fuente de píxeles', () => {
    for (const s of STORY_SCENES) {
      for (const text of [...s.lines, s.caption, CINEMATIC.endCard.text]) {
        expect(() => textPixels(forFont(text)), text).not.toThrow();
      }
    }
  });
  it('cada frase cabe en la caja de texto (máximo de líneas) sin pasarse de ancho', () => {
    const { width, maxLines, scale } = CINEMATIC.text;
    for (const s of STORY_SCENES) {
      for (const line of s.lines) {
        const wrapped = wrapText(forFont(line), width, scale);
        expect(wrapped.length, line).toBeLessThanOrEqual(maxLines);
        for (const w of wrapped) expect(measureText(w).width * scale, w).toBeLessThanOrEqual(width);
      }
    }
  });
  it('los rótulos caben en la pantalla', () => {
    for (const s of STORY_SCENES) expect(measureText(forFont(s.caption)).width).toBeLessThan(440);
  });
  it('los efectos y ambientes que pide cada escena existen y apuntan a frases reales', () => {
    for (const s of STORY_SCENES) {
      if (s.ambience !== null) expect(AMBIENCES[s.ambience], `${s.id}: ambiente`).toBeDefined();
      for (const c of s.cues) {
        expect(SFX[c.sfx], `${s.id}: ${c.sfx}`).toBeDefined();
        expect(c.line).toBeGreaterThanOrEqual(0);
        expect(c.line).toBeLessThan(s.lines.length);
        expect(c.delayMs).toBeGreaterThanOrEqual(0);
      }
    }
  });
  it('cuesForLine devuelve solo los efectos de esa frase', () => {
    const s = STORY_SCENES[4];
    if (!s) throw new Error('falta la escena 5');
    expect(cuesForLine(s, 0).map((c) => c.sfx)).toEqual(['doorThud', 'siren']);
    expect(cuesForLine(s, 1)).toEqual([]);
  });
  it('las luces y el movimiento de cámara tienen valores razonables', () => {
    for (const s of STORY_SCENES) {
      for (const l of s.lights) {
        expect(l.radius).toBeGreaterThan(0);
        expect(l.peakAlpha).toBeGreaterThan(0);
        expect(l.peakAlpha).toBeLessThanOrEqual(1);
        expect(l.pulseMs).toBeGreaterThanOrEqual(300);
      }
      expect(s.pan.durationMs).toBeGreaterThan(0);
      // El arte mide 500x280 y se ve una ventana de 480x270: el desplazamiento nunca puede enseñar el borde.
      for (const v of [s.pan.fromX, s.pan.toX]) expect(v >= -20 && v <= 0).toBe(true);
      for (const v of [s.pan.fromY, s.pan.toY]) expect(v >= -10 && v <= 0).toBe(true);
    }
  });
  it('el motor recorre el guion real de principio a fin', () => {
    const r = new CinematicRunner(STORY_SCENES.map((s) => s.lines.map(forFont)), CINEMATIC.runner);
    let lines = r.start().filter((e) => e.type === 'line-start').length;
    for (let i = 0; i < 500 && r.snapshot().phase !== 'finished'; i++) {
      lines += r.advance().filter((e) => e.type === 'line-start').length;
      r.update(CINEMATIC.runner.advanceLockMs + 10);
    }
    expect(r.snapshot().phase).toBe('finished');
    expect(lines).toBe(STORY_SCENES.reduce((n, s) => n + s.lines.length, 0));
  });
});

describe('sonidos sintetizados', () => {
  it('todas las recetas de efectos son válidas', () => {
    for (const [id, recipe] of Object.entries(SFX)) expect(validateRecipe(recipe), id).toEqual([]);
  });
  it('todos los ambientes son válidos y los pulsos apuntan a efectos que existen', () => {
    for (const [id, a] of Object.entries(AMBIENCES)) {
      expect(validateAmbience(a), id).toEqual([]);
      for (const p of a.pulses ?? []) expect(SFX[p.sfx], `${id}: ${p.sfx}`).toBeDefined();
    }
  });
  it('ningún efecto dura una eternidad', () => {
    for (const [id, recipe] of Object.entries(SFX)) expect(recipeLengthMs(recipe), id).toBeLessThanOrEqual(4000);
  });
  it('validateRecipe detecta recetas rotas', () => {
    expect(validateRecipe({ voices: [] })).not.toEqual([]);
    expect(validateRecipe({ voices: [{ wave: 'sine', freq: 0, startMs: 0, durationMs: 100, volume: 0.1 }] })).not.toEqual([]);
    expect(validateRecipe({ voices: [{ wave: 'sine', freq: 440, startMs: 0, durationMs: 100, volume: 2 }] })).not.toEqual([]);
    expect(validateRecipe({ voices: [{ wave: 'noise', freq: 1, startMs: 0, durationMs: 100, volume: 0.1 }] })).toEqual([]);
  });
});
