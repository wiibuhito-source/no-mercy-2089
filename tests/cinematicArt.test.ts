import { describe, expect, it } from 'vitest';
import { BASE_HEIGHT, BASE_WIDTH } from '../src/core/version';
import { STORY_SCENES } from '../src/data/story';
import { ART_BUILDERS } from '../src/game/cinematic/art';
import { ART_H, ART_W } from '../src/game/cinematic/art/kit';

describe('ilustraciones de la cinemática', () => {
  it('el arte es un poco más grande que la pantalla, para poder deslizar la cámara sin enseñar bordes', () => {
    expect(ART_W).toBeGreaterThanOrEqual(BASE_WIDTH + 20);
    expect(ART_H).toBeGreaterThanOrEqual(BASE_HEIGHT + 10);
  });
  it('cada escena del guion tiene su ilustración y cada ilustración se usa', () => {
    for (const s of STORY_SCENES) expect(ART_BUILDERS[s.art], `${s.id} -> ${s.art}`).toBeTypeOf('function');
    expect(new Set(STORY_SCENES.map((s) => s.art)).size).toBe(Object.keys(ART_BUILDERS).length);
  });
  for (const [name, build] of Object.entries(ART_BUILDERS)) {
    describe(`"${name}"`, () => {
      const art = build();
      it('tiene varias capas (profundidad)', () => {
        expect(art.length).toBeGreaterThanOrEqual(3);
      });
      it('con la cámara en cualquier punto de su recorrido no se ve nunca un hueco (todos los píxeles de pantalla están cubiertos)', () => {
        const story = STORY_SCENES.find((s) => s.art === name);
        if (!story) throw new Error('sin escena');
        const { fromX, fromY, toX, toY } = story.pan;
        const stops = [[fromX, fromY], [toX, toY], [fromX, toY], [toX, fromY], [(fromX + toX) / 2, (fromY + toY) / 2]] as const;
        for (const [px, py] of stops) {
          const placed = art.map((l) => ({ l, ox: Math.round(px * l.parallax), oy: Math.round(py * l.parallax) }));
          let holes = 0;
          for (let sy = 0; sy < BASE_HEIGHT; sy += 2) {
            for (let sx = 0; sx < BASE_WIDTH; sx += 2) {
              const covered = placed.some(({ l, ox, oy }) => {
                const x = l.tile ? (((sx - ox) % ART_W) + ART_W) % ART_W : sx - ox;
                return l.canvas.alphaAt(x, sy - oy) > 0;
              });
              if (!covered) holes++;
            }
          }
          expect(holes, `${name} pan ${px},${py}`).toBe(0);
        }
      });
      it('todas las capas miden lo que toca y tienen una profundidad razonable', () => {
        for (const l of art) {
          expect(l.canvas.width).toBe(ART_W);
          expect(l.canvas.height).toBe(ART_H);
          expect(l.parallax).toBeGreaterThanOrEqual(0);
          expect(l.parallax).toBeLessThanOrEqual(1.25);
          expect(l.canvas.countOpaque()).toBeGreaterThan(0);
        }
      });
      it('las capas que se repiten solas tienen velocidad, y solo ellas', () => {
        for (const l of art) {
          if (l.tile) expect(l.autoScrollX).toBeDefined();
          else expect(l.autoScrollX).toBeUndefined();
        }
      });
      it('los personajes (sprites que respiran) caben dentro del lienzo', () => {
        for (const l of art) {
          for (const a of l.actors ?? []) {
            expect(a.x + a.canvas.width).toBeGreaterThan(0);
            expect(a.x).toBeLessThan(ART_W);
            expect(a.y + a.canvas.height).toBeGreaterThan(0);
            expect(a.y).toBeLessThan(ART_H);
            expect(a.bobMs).toBeGreaterThan(0);
          }
        }
      });
      it('las capas que aparecen más tarde lo hacen en una frase que existe', () => {
        const story = STORY_SCENES.find((s) => s.art === name);
        for (const l of art) if (l.revealAtLine !== undefined) expect(l.revealAtLine).toBeLessThan(story?.lines.length ?? 0);
      });
      it('se dibuja igual cada vez', () => {
        const again = build();
        art.forEach((l, i) => expect(Array.from(l.canvas.data)).toEqual(Array.from(again[i]?.canvas.data ?? [])));
      });
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
