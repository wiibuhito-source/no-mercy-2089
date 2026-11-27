import { describe, expect, it } from 'vitest';
import { CinematicRunner } from '../src/core/cinematic/cinematicRunner';
import { forFont, lineSpeaker, lineText } from '../src/core/cinematic/storyTypes';
import { ART_BUILDERS } from '../src/game/cinematic/art';
import { wrapText } from '../src/core/cinematic/wrapText';
import { textPixels, measureText } from '../src/core/pixelFont';
import { CINEMATIC } from '../src/data/cinematic';
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
  it('el texto del botón de prueba del menú se puede dibujar con la fuente de píxeles', () => {
    expect(() => textPixels(forFont(CINEMATIC.testButtonLabel))).not.toThrow();
  });
  it('los rótulos caben en la pantalla', () => {
    for (const s of STORY_SCENES) expect(measureText(forFont(s.caption)).width).toBeLessThan(440);
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
        }
        if (e.fromLine !== undefined) expect(e.fromLine, `${s.id} fromLine`).toBeLessThan(s.lines.length);
        if (e.untilLine !== undefined) expect(e.untilLine, `${s.id} untilLine`).toBeLessThanOrEqual(s.lines.length);
        if (e.fromLine !== undefined && e.untilLine !== undefined) expect(e.untilLine).toBeGreaterThan(e.fromLine);
        if (e.type === 'searchlight') {
          expect(e.sweepDeg).toBeGreaterThan(0);
          expect(e.sweepDeg).toBeLessThanOrEqual(45);
          expect(e.periodMs).toBeGreaterThanOrEqual(4000); // barridos lentos, nunca destellos rápidos
          expect(e.alpha).toBeLessThanOrEqual(0.35);
        }
        if (e.type === 'blimp') expect(Math.abs(e.speed)).toBeLessThanOrEqual(20);
        if (e.type === 'meteor') expect(e.minGapMs).toBeGreaterThanOrEqual(5000);
        if (e.type === 'twinkle') {
          expect(e.x1).toBeGreaterThan(e.x0);
          expect(e.y1).toBeGreaterThan(e.y0);
          expect(e.colors.length).toBeGreaterThan(0);
        }
        if (e.type === 'dust' || e.type === 'speedlines' || e.type === 'traffic' || e.type === 'wind' || e.type === 'birds' || e.type === 'twinkle') expect(e.count).toBeGreaterThan(0);
        if (e.type === 'wind') expect(e.colors.length).toBeGreaterThan(0);
        if (e.type === 'fog') {
          expect(e.y1).toBeGreaterThan(e.y0);
          expect(e.alpha).toBeGreaterThan(0);
          expect(e.alpha).toBeLessThanOrEqual(0.4); // la niebla nunca tapa la escena
        }
        if (e.type === 'ripples') {
          expect(e.x1).toBeGreaterThan(e.x0);
          expect(e.y1).toBeGreaterThan(e.y0);
          expect(e.everyMs).toBeGreaterThanOrEqual(60);
        }
      }
    }
  });
  it('el tono de color de cada escena es suave (nunca tapa la ilustración)', () => {
    for (const s of STORY_SCENES) {
      if (!s.grade) continue;
      expect(s.grade.alpha, s.id).toBeGreaterThan(0);
      expect(s.grade.alpha, s.id).toBeLessThanOrEqual(0.15);
    }
  });
  it('las escenas de lluvia tienen ondas en los charcos (la lluvia se nota en el suelo)', () => {
    for (const s of STORY_SCENES.filter((x) => x.rain)) expect(s.effects.some((e) => e.type === 'ripples'), s.id).toBe(true);
  });
  it('las escenas de exterior tienen viento (cosas que vuelan) o niebla', () => {
    for (const id of ['escena-2', 'escena-5', 'escena-6', 'escena-8', 'escena-9']) {
      const s = STORY_SCENES.find((x) => x.id === id);
      expect(s?.effects.some((e) => e.type === 'wind' || e.type === 'fog'), id).toBe(true);
    }
  });
  it('la primera escena tiene muchas animaciones de fondo (luces que barren, dirigible, pájaros, ventanas que parpadean, estrella fugaz)', () => {
    const kinds = new Set((STORY_SCENES[0]?.effects ?? []).map((e) => e.type));
    for (const k of ['searchlight', 'blimp', 'birds', 'twinkle', 'meteor', 'traffic']) expect(kinds.has(k as never), k).toBe(true);
    const art = ART_BUILDERS[STORY_SCENES[0]?.art ?? '']?.() ?? [];
    expect(art.some((l) => l.tile && l.autoScrollX !== undefined), 'capas que se mueven solas (nubes, coches del puente)').toBe(true);
  });
  it('al sonar el móvil cambian la postura de Adrián, el móvil y la pantalla proyectada a la vez (frase 3)', () => {
    const scene = STORY_SCENES[10];
    expect(scene?.lines.length).toBeGreaterThanOrEqual(4);
    const art = ART_BUILDERS[scene?.art ?? '']?.() ?? [];
    const ring = art.filter((l) => l.revealAtLine !== undefined);
    const gone = art.filter((l) => l.hideAtLine !== undefined);
    expect(ring.length).toBeGreaterThanOrEqual(2); // postura de alerta + móvil sonando
    expect(gone.length).toBe(1); // la postura tranquila desaparece
    for (const l of [...ring, ...gone]) expect(l.revealAtLine ?? l.hideAtLine).toBe(2);
    // el humo de la taza se acaba cuando la deja, y empieza el de la taza sobre el banco
    expect((scene?.effects ?? []).some((e) => e.type === 'smoke' && e.untilLine === 2)).toBe(true);
    expect((scene?.effects ?? []).some((e) => e.type === 'smoke' && e.fromLine === 2)).toBe(true);
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
