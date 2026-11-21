// Diferencias entre navegador y .exe (Electron). El .exe expone `window.nomercy`
// desde electron/preload.cjs; en el navegador no existe.
declare global {
  interface Window {
    nomercy?: { quit: () => void };
  }
}

export function canQuitNatively(): boolean {
  return typeof window.nomercy?.quit === 'function';
}

export function quitNatively(): void {
  window.nomercy?.quit();
}

/** ¿La persona ha pedido menos movimiento en su sistema? (accesibilidad). */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
