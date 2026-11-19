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
