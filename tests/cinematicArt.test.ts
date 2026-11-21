import { describe, expect, it } from 'vitest';
import { ART_H, ART_W } from '../src/game/cinematic/art/kit';
import { ART_BUILDERS } from '../src/game/cinematic/art';
import { STORY_SCENES } from '../src/data/story';
import { BASE_HEIGHT, BASE_WIDTH } from '../src/core/version';

describe('ilustraciones de la cinemática', () => {
  it('el arte es un poco más grande que la pantalla, para poder deslizar la cámara sin enseñar bordes', () => {
    expect(ART_W).toBeGreaterThanOrEqual(BASE_WIDTH + 20);
    expect(ART_H).toBeGreaterThanOrEqual(BASE_HEIGHT + 10);
  });
  it('cada escena del guion tiene su ilustración', () => {
    for (const s of STORY_SCENES) expect(ART_BUILDERS[s.art], `${s.id} -> ${s.art}`).toBeTypeOf('function');
  });
  for (const [name, build] of Object.entries(ART_BUILDERS)) {
    it(`"${name}" mide lo que toca y no deja huecos transparentes`, () => {
      const c = build();
      expect(c.width).toBe(ART_W);
      expect(c.height).toBe(ART_H);
      expect(c.countOpaque()).toBe(ART_W * ART_H);
    });
    it(`"${name}" sale igual cada vez que se dibuja`, () => {
      expect(Array.from(build().data)).toEqual(Array.from(build().data));
    });
  }
  it('las luces caen dentro de la ilustración', () => {
    for (const s of STORY_SCENES) {
      for (const l of s.lights) {
        expect(l.x).toBeGreaterThan(0);
        expect(l.x).toBeLessThan(ART_W);
        expect(l.y).toBeGreaterThan(0);
        expect(l.y).toBeLessThan(ART_H);
      }
    }
  });
});
