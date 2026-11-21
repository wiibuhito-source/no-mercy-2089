import type { KeyValueStore } from '../core/cinematic/introSeen';

// Almacén del navegador (localStorage) para recordar si ya se vio la cinemática.
// Si el navegador no deja guardar (ventana privada, permisos...), recuerda solo mientras el juego esté abierto.
const memory = new Map<string, string>();

export const introStore: KeyValueStore = {
  get(key) {
    try {
      return window.localStorage.getItem(key) ?? memory.get(key) ?? null;
    } catch {
      return memory.get(key) ?? null;
    }
  },
  set(key, value) {
    memory.set(key, value);
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* sin almacenamiento: queda en memoria */
    }
  },
  remove(key) {
    memory.delete(key);
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* nada que borrar */
    }
  }
};
