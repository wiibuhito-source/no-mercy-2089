import { fadeVolume, trackForScene, trackNameFromPath } from '../../core/audio/musicTracks';
import { CINEMATIC } from '../../data/cinematic';

// Todas las canciones que haya en src/assets/music/ al compilar (mp3, ogg o wav). Si no hay ninguna, el mapa queda vacío.
const FILES = import.meta.glob<string>('../../assets/music/*.{mp3,ogg,wav}', { eager: true, query: '?url', import: 'default' });

const URL_BY_NAME = new Map<string, string>(Object.entries(FILES).map(([path, url]) => [trackNameFromPath(path), url]));

export function availableTrackNames(): string[] {
  return [...URL_BY_NAME.keys()];
}

interface Playing {
  readonly name: string;
  readonly audio: HTMLAudioElement;
}

/** Música con fundidos. Cada escena suena con el archivo que se llame como ella; si no hay, sigue la canción anterior. */
export class MusicPlayer {
  private current: Playing | null = null;
  private readonly timers = new Set<number>();

  /** Cambia a la canción de esa escena (si existe un archivo con su nombre). */
  enterScene(sceneId: string): void {
    const name = trackForScene(sceneId, availableTrackNames());
    if (name === null || name === this.current?.name) return;
    const url = URL_BY_NAME.get(name);
    if (!url) return;
    if (this.current) this.fadeOutAndStop(this.current, CINEMATIC.audio.musicFadeMs);
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0;
    this.current = { name, audio };
    void audio.play().catch(() => undefined); // si el navegador lo bloquea, la cinemática sigue sin música
    this.fade(audio, 0, CINEMATIC.audio.musicVolume, CINEMATIC.audio.musicFadeMs, false);
  }

  stop(fadeMs: number): void {
    if (this.current) this.fadeOutAndStop(this.current, fadeMs);
    this.current = null;
  }

  private fadeOutAndStop(p: Playing, ms: number): void {
    this.fade(p.audio, p.audio.volume, 0, ms, true);
  }

  private fade(audio: HTMLAudioElement, from: number, to: number, ms: number, stopAtEnd: boolean): void {
    const start = performance.now();
    const id = window.setInterval(() => {
      const t = performance.now() - start;
      audio.volume = fadeVolume(t, ms, from, to);
      if (t >= ms) {
        window.clearInterval(id);
        this.timers.delete(id);
        if (stopAtEnd) {
          audio.pause();
          audio.src = '';
        }
      }
    }, 50);
    this.timers.add(id);
  }

  /** Para todo de golpe (al cerrar la escena). */
  dispose(): void {
    for (const id of this.timers) window.clearInterval(id);
    this.timers.clear();
    if (this.current) {
      this.current.audio.pause();
      this.current.audio.src = '';
    }
    this.current = null;
  }
}
