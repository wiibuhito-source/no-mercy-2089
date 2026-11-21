import { describe, expect, it } from 'vitest';
import { moveSelection } from '../src/core/menu/menuModel';
import { MAIN_MENU_ICONS, MAIN_MENU_ITEMS } from '../src/data/mainMenu';
import { BUTTON, PANEL } from '../src/data/menuLayout';
import { textSize } from '../src/core/pixelText';

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

describe('datos del menú principal', () => {
  it('cada opción tiene texto, frase descriptiva e icono', () => {
    for (const item of MAIN_MENU_ITEMS) {
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.hint.length).toBeGreaterThan(0);
      expect(MAIN_MENU_ICONS[item.id]).toBeDefined();
    }
  });
  it('las frases descriptivas caben en el panel', () => {
    for (const item of MAIN_MENU_ITEMS) expect(textSize(item.hint).width).toBeLessThanOrEqual(PANEL.w - 20);
  });
  it('las etiquetas caben dentro de los botones', () => {
    for (const item of MAIN_MENU_ITEMS) expect(BUTTON.labelX + textSize(item.label, 2).width).toBeLessThanOrEqual(BUTTON.w - BUTTON.slant - 1);
  });
});
