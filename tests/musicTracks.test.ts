import { describe, expect, it } from 'vitest';
import { fadeVolume, trackForScene, trackNameFromPath } from '../src/core/audio/musicTracks';

describe('música de las escenas', () => {
  it('saca el nombre de la canción de la ruta del archivo', () => {
    expect(trackNameFromPath('../../assets/music/escena-1.mp3')).toBe('escena-1');
    expect(trackNameFromPath('../../assets/music/mi.tema.final.ogg')).toBe('mi.tema.final');
    expect(trackNameFromPath('escena-2.wav')).toBe('escena-2');
  });
  it('una escena solo tiene canción si hay un archivo con su nombre', () => {
    expect(trackForScene('escena-3', ['escena-1', 'escena-3'])).toBe('escena-3');
    expect(trackForScene('escena-2', ['escena-1', 'escena-3'])).toBeNull();
    expect(trackForScene('escena-1', [])).toBeNull();
  });
  it('los fundidos van de un volumen a otro sin salirse de 0 a 1', () => {
    expect(fadeVolume(0, 1000, 0, 0.8)).toBe(0);
    expect(fadeVolume(500, 1000, 0, 1)).toBeCloseTo(0.5);
    expect(fadeVolume(1000, 1000, 0.8, 0)).toBe(0);
    expect(fadeVolume(5000, 1000, 0, 0.7)).toBeCloseTo(0.7);
    expect(fadeVolume(-5, 1000, 0.3, 1)).toBeCloseTo(0.3);
    expect(fadeVolume(10, 0, 0, 0.6)).toBeCloseTo(0.6);
  });
});
