import type { MenuItem } from '../core/menu/menuModel';
import type { IconName } from '../game/menu/art/ui';

// Opciones del menú principal (datos, no código): cambiar el orden o el texto se hace aquí.
export const MAIN_MENU_ITEMS: readonly MenuItem[] = [
  { id: 'play', label: 'JUGAR', hint: 'ENTRA EN MIAMI.' },
  { id: 'settings', label: 'AJUSTES', hint: 'PRONTO: SONIDO.' },
  { id: 'quit', label: 'SALIR', hint: 'VUELVE PRONTO.' }
];

/** Icono de cada opción (el dibujo está en game/menu/art/ui.ts). */
export const MAIN_MENU_ICONS: Readonly<Record<string, IconName>> = {
  play: 'play',
  settings: 'gear',
  quit: 'power'
};
