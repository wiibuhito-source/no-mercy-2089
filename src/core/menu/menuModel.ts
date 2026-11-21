// Lógica pura del menú (sin Phaser): se puede probar con tests.
export type MenuAction = 'play' | 'settings' | 'quit';

export interface MenuItem {
  readonly id: MenuAction;
  readonly label: string;
  /** Frase corta que aparece escrita bajo los botones cuando la opción está seleccionada. */
  readonly hint: string;
}

/** Mueve la selección; al pasar del último al primero (o al revés) da la vuelta. */
export function moveSelection(current: number, delta: number, count: number): number {
  if (count <= 0) return 0;
  return (((current + delta) % count) + count) % count;
}
