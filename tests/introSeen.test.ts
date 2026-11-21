import { describe, expect, it } from 'vitest';
import { hasSeenIntro, markIntroSeen, resetIntroSeen, shouldPlayIntro, wantsIntroReplay, type KeyValueStore } from '../src/core/cinematic/introSeen';

function memoryStore(): KeyValueStore {
  const m = new Map<string, string>();
  return { get: (k) => m.get(k) ?? null, set: (k, v) => void m.set(k, v), remove: (k) => void m.delete(k) };
}

describe('¿ha visto ya la cinemática?', () => {
  it('quien nunca ha jugado la ve; quien ya la vio va directo al juego', () => {
    const s = memoryStore();
    expect(hasSeenIntro(s)).toBe(false);
    expect(shouldPlayIntro(s, false)).toBe(true);
    markIntroSeen(s);
    expect(hasSeenIntro(s)).toBe(true);
    expect(shouldPlayIntro(s, false)).toBe(false);
  });
  it('se puede forzar la repetición aunque ya la haya visto', () => {
    const s = memoryStore();
    markIntroSeen(s);
    expect(shouldPlayIntro(s, true)).toBe(true);
  });
  it('reiniciar vuelve a mostrarla', () => {
    const s = memoryStore();
    markIntroSeen(s);
    resetIntroSeen(s);
    expect(shouldPlayIntro(s, false)).toBe(true);
  });
  it('reconoce ?intro en la dirección', () => {
    expect(wantsIntroReplay('?intro')).toBe(true);
    expect(wantsIntroReplay('?intro=1')).toBe(true);
    expect(wantsIntroReplay('?a=2&intro')).toBe(true);
    expect(wantsIntroReplay('?intro=0')).toBe(false);
    expect(wantsIntroReplay('?otra=cosa')).toBe(false);
    expect(wantsIntroReplay('')).toBe(false);
  });
});
