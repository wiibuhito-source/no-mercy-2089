import { describe, expect, it } from 'vitest';
import { typewriterTimeline, visibleChars } from '../src/core/cinematic/typewriter';

const CFG = { charsPerSecond: 10, pauseAfterMs: { '.': 200, ',': 100 } };

describe('máquina de escribir', () => {
  it('cada letra aparece cada 100 ms a 10 letras por segundo, y nada se ve en el instante 0', () => {
    expect(typewriterTimeline('ABC', CFG)).toEqual([100, 200, 300]);
    expect(visibleChars(typewriterTimeline('ABC', CFG), 0)).toBe(0);
  });
  it('los signos de puntuación añaden una pausa antes de la letra siguiente', () => {
    // A(100) .(200) -> pausa 200 -> B(500)
    expect(typewriterTimeline('A.B', CFG)).toEqual([100, 200, 500]);
    expect(typewriterTimeline('A,B', CFG)).toEqual([100, 200, 400]);
  });
  it('cuenta cuántas letras se ven en cada momento', () => {
    const t = typewriterTimeline('ABCD', CFG);
    expect(visibleChars(t, 99)).toBe(0);
    expect(visibleChars(t, 100)).toBe(1);
    expect(visibleChars(t, 250)).toBe(2);
    expect(visibleChars(t, 100000)).toBe(4);
  });
  it('un texto vacío no tiene letras', () => {
    expect(typewriterTimeline('', CFG)).toEqual([]);
    expect(visibleChars([], 500)).toBe(0);
  });
  it('las letras con tilde cuentan como una sola', () => {
    expect(typewriterTimeline('ÁÑ', CFG)).toHaveLength(2);
  });
});
