// Qué canción suena en cada escena (lógica pura). Sin tocar código: el jugador deja un archivo de audio
// en src/assets/music/ con el MISMO nombre que la escena (por ejemplo "escena-3.mp3") y suena solo.
// Si una escena no tiene archivo, sigue sonando la canción anterior (o ninguna).

/** "../../assets/music/escena-1.mp3" -> "escena-1" */
export function trackNameFromPath(path: string): string {
  const file = path.split('/').pop() ?? path;
  const dot = file.lastIndexOf('.');
  return dot > 0 ? file.slice(0, dot) : file;
}

/** La canción de esa escena, si existe un archivo con su nombre. */
export function trackForScene(sceneId: string, available: readonly string[]): string | null {
  return available.includes(sceneId) ? sceneId : null;
}

/** Volumen de un fundido: va de `from` a `to` durante `durationMs` (lineal y siempre entre 0 y 1). */
export function fadeVolume(elapsedMs: number, durationMs: number, from: number, to: number): number {
  const k = durationMs <= 0 ? 1 : Math.min(1, Math.max(0, elapsedMs / durationMs));
  return Math.min(1, Math.max(0, from + (to - from) * k));
}
