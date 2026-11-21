import { describe, expect, it } from 'vitest';
import { validateAmbience, validateRecipe, recipeLengthMs } from '../src/core/audio/sfxRecipe';
import { CinematicRunner } from '../src/core/cinematic/cinematicRunner';
import { cuesForLine, forFont, lineSpeaker, lineText } from '../src/core/cinematic/storyTypes';
import { ART_BUILDERS } from '../src/game/cinematic/art';
import { wrapText } from '../src/core/cinematic/wrapText';
import { textPixels, measureText } from '../src/core/pixelFont';
import { CINEMATIC } from '../src/data/cinematic';
import { AMBIENCES, SFX } from '../src/data/sfx';
import { PROTAGONIST, STORY_SCENES } from '../src/data/story';
import { ART_H, ART_W } from '../src/game/cinematic/art/kit';
import { BASE_HEIGHT, BASE_WIDTH } from '../src/core/version';

describe('guion de la cinemática', () => {
  it('tiene las once escenas, con id único y nombre de música "escena-N"', () => {
    expect(STORY_SCENES).toHaveLength(11);
    expect(new Set(STORY_SCENES.map((s) => s.id)).size).toBe(11);
    STORY_SCENES.forEach((s, i) => expect(s.id).toBe(`escena-${i + 1}`));
  });
  it('empieza en Miami 2089 y acaba en el taller con la llamada', () => {
    expect(STORY_SCENES[0]?.art).toBe('skyline');
    expect(STORY_SCENES[10]?.art).toBe('present');
  });
  it('el nombre del protagonista sale en el rótulo de la escena del chaval y la del taller', () => {
    expect(forFont(STORY_SCENES[1]?.caption ?? '')).toContain('ADRIÁN VARGAS');
    expect(forFont(STORY_SCENES[10]?.caption ?? '')).toContain('ADRIÁN VARGAS');
  });
  it('el protagonista se llama Adrián Vargas', () => {
    expect(PROTAGONIST.fullName).toBe('Adrián Vargas');
  });
  it('todas las letras del guion existen en la fuente de píxeles', () => {
    for (const s of STORY_SCENES) {
      for (const text of [...s.lines.map(lineText), s.caption, CINEMATIC.endCard.text, s.card?.title ?? 'A', s.card?.sub ?? 'A']) {
        expect(() => textPixels(forFont(text)), text).not.toThrow();
      }
    }
  });
  it('cada frase cabe en la caja de texto (máximo de líneas) sin pasarse de ancho', () => {
    const { width, maxLines, scale } = CINEMATIC.text;
    for (const s of STORY_SCENES) {
      for (const l of s.lines) {
        const line = lineText(l);
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
    const s = STORY_SCENES[8];
    if (!s) throw new Error('falta la escena 9');
    expect(cuesForLine(s, 0).map((c) => c.sfx)).toEqual(['impact', 'swell']);
    expect(cuesForLine(s, 1).map((c) => c.sfx)).toEqual(['doorThud']);
    expect(cuesForLine(s, 5)).toEqual([]);
  });
  it('la sirena ya no existe en el juego (no gustó)', () => {
    expect(SFX.siren).toBeUndefined();
    for (const s of STORY_SCENES) for (const c of s.cues) expect(c.sfx).not.toBe('siren');
  });
  it('quien habla existe en los ajustes de voces, con nombre que cabe en la fuente', () => {
    for (const s of STORY_SCENES) {
      for (const l of s.lines) {
        const who = lineSpeaker(l);
        if (who === null) continue;
        const voice = CINEMATIC.speakers[who];
        expect(voice, `${s.id}: ${who}`).toBeDefined();
        expect(() => textPixels(forFont(voice?.name ?? ''))).not.toThrow();
      }
    }
  });
  it('hay diálogo de verdad (no todo es narración) y cada voz se oye en algún sitio', () => {
    const used = new Set<string>();
    for (const s of STORY_SCENES) for (const l of s.lines) { const w = lineSpeaker(l); if (w) used.add(w); }
    expect([...used].sort()).toEqual(['adrian', 'madre', 'tipo', 'voz']);
  });
  it('los títulos grandes (2078 y 2089) están donde toca', () => {
    const cards = STORY_SCENES.filter((s) => s.card).map((s) => s.card?.title);
    expect(cards).toEqual(['2078', '2089']);
  });
  it('la noche en que salió mal entra con un destello blanco', () => {
    expect(STORY_SCENES[8]?.transition).toBe('flash');
  });
  it('las luces y los efectos tienen valores razonables', () => {
    for (const s of STORY_SCENES) {
      for (const l of s.lights) {
        expect(l.radius).toBeGreaterThan(0);
        expect(l.peakAlpha).toBeGreaterThan(0);
        expect(l.peakAlpha).toBeLessThanOrEqual(1);
        expect(l.pulseMs).toBeGreaterThanOrEqual(300);
        if (l.fromLine !== undefined) expect(l.fromLine).toBeLessThan(s.lines.length);
      }
      for (const e of s.effects) {
        if (e.type === 'smoke') expect(e.everyMs).toBeGreaterThanOrEqual(150);
        if (e.type === 'sparks') expect(e.everyMs).toBeGreaterThanOrEqual(600);
        if (e.type === 'lightning') {
          expect(e.minGapMs).toBeGreaterThanOrEqual(5000); // nunca parpadeos rápidos (seguridad)
          expect(e.maxGapMs).toBeGreaterThanOrEqual(e.minGapMs);
          if (e.sfx !== null) expect(SFX[e.sfx], `${s.id}: ${e.sfx}`).toBeDefined();
        }
        if (e.type === 'dust' || e.type === 'speedlines' || e.type === 'traffic') expect(e.count).toBeGreaterThan(0);
      }
    }
  });
  it('el movimiento de cámara nunca enseña el borde de la ilustración, ni en las capas de primer plano', () => {
    const slackX = ART_W - BASE_WIDTH;
    const slackY = ART_H - BASE_HEIGHT;
    for (const s of STORY_SCENES) {
      expect(s.pan.durationMs).toBeGreaterThan(0);
      const art = ART_BUILDERS[s.art]?.();
      const maxParallax = Math.max(...(art ?? []).map((l) => l.parallax));
      for (const v of [s.pan.fromX, s.pan.toX]) expect(Math.abs(v) * maxParallax, `${s.id} x`).toBeLessThanOrEqual(slackX);
      for (const v of [s.pan.fromY, s.pan.toY]) expect(Math.abs(v) * maxParallax, `${s.id} y`).toBeLessThanOrEqual(slackY);
    }
  });
  it('los coches de fondo se meten en capas que existen', () => {
    for (const s of STORY_SCENES) {
      const n = ART_BUILDERS[s.art]?.().length ?? 0;
      for (const e of s.effects) if (e.type === 'traffic' && e.layer !== undefined) expect(e.layer, s.id).toBeLessThan(n);
    }
  });
  it('el motor recorre el guion real de principio a fin', () => {
    const r = new CinematicRunner(STORY_SCENES.map((s) => s.lines.map((l) => forFont(lineText(l)))), CINEMATIC.runner);
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
