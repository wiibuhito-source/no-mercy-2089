import { defineConfig } from 'vite';

// base './' es imprescindible: en el .exe (Electron) la página se abre desde un
// archivo local y con rutas absolutas ("/assets/...") no cargaría nada.
export default defineConfig({
  base: './',
  build: { outDir: 'dist', chunkSizeWarningLimit: 2000 },
  test: { include: ['tests/**/*.test.ts'], environment: 'node' }
});
