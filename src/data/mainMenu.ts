import type { MenuItem } from '../core/menu/menuModel';

// Opciones del menú principal (datos, no código): cambiar el orden o el texto se hace aquí.
export const MAIN_MENU_ITEMS: readonly MenuItem[] = [
  { id: 'play', label: 'JUGAR' },
  { id: 'settings', label: 'AJUSTES' },
  { id: 'quit', label: 'SALIR' }
];
