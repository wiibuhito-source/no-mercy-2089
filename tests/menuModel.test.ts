import { describe, expect, it } from 'vitest';
import { moveSelection } from '../src/core/menu/menuModel';
import { MAIN_MENU_ITEMS } from '../src/data/mainMenu';

describe('menú principal', () => {
  it('tiene Jugar, Ajustes y Salir, en ese orden', () => {
    expect(MAIN_MENU_ITEMS.map((item) => item.id)).toEqual(['play', 'settings', 'quit']);
  });
  it('baja y sube la selección', () => {
    expect(moveSelection(0, 1, 3)).toBe(1);
    expect(moveSelection(2, -1, 3)).toBe(1);
  });
  it('da la vuelta al llegar a un extremo', () => {
    expect(moveSelection(2, 1, 3)).toBe(0);
    expect(moveSelection(0, -1, 3)).toBe(2);
  });
  it('sin opciones devuelve 0', () => {
    expect(moveSelection(0, 1, 0)).toBe(0);
  });
});
