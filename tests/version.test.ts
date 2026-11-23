import { describe, expect, it } from 'vitest';
import { BASE_HEIGHT, BASE_WIDTH, GAME_TAGLINE, GAME_TITLE, buildBanner } from '../src/core/version';

describe('datos básicos del juego', () => {
  it('usa la resolución base del GDD (480x270, 16:9)', () => {
    expect(BASE_WIDTH).toBe(480);
    expect(BASE_HEIGHT).toBe(270);
    expect(BASE_WIDTH / BASE_HEIGHT).toBeCloseTo(16 / 9, 5);
  });
  it('el título y el tagline son los oficiales', () => {
    expect(GAME_TITLE).toBe('NO MERCY 2089');
    expect(GAME_TAGLINE).toBe('Miami no perdona.');
  });
  it('el banner incluye el título y el prototipo', () => {
    expect(buildBanner()).toContain('NO MERCY 2089');
    expect(buildBanner()).toContain('0.0');
  });
});
