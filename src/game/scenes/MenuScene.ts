import Phaser from 'phaser';
import { shouldPlayIntro, wantsIntroReplay } from '../../core/cinematic/introSeen';
import { createFpsMeter } from '../../debug/fpsMeter';
import { createIntroButton } from '../../debug/introButton';
import { createIntroReset } from '../../debug/introReset';
import { moveSelection } from '../../core/menu/menuModel';
import { MAIN_MENU_ITEMS } from '../../data/mainMenu';
import { buildVignette } from '../menu/art/vignette';
import { buildNeonSign, buildVerticalNeon } from '../menu/art/neon';
import { PAL } from '../../data/menuPalette';
import { BASE_HEIGHT, BASE_WIDTH } from '../../core/version';
import { DEPTH, type Animated } from '../menu/animated';
import { createBackdrop } from '../menu/backdrop';
import { addPixelImage, cached } from '../menu/canvasTexture';
import { createCityLife } from '../menu/cityLife';
import { createFlyerLayer } from '../menu/flyerLayer';
import { createFooterHints } from '../menu/footerHints';
import { createHero } from '../menu/hero';
import { MenuPanel } from '../menu/menuPanel';
import { createNeonSign } from '../menu/neonSign';
import { createPalmTree } from '../menu/palmTree';
import { createParallax } from '../menu/parallax';
import { createRain } from '../menu/rain';
import { createRooftop } from '../menu/rooftop';
import { createSkyLife } from '../menu/skyLife';
import { createStreetLife } from '../menu/streetLife';
import { createTitleBlock } from '../menu/titleBlock';
import { introStore } from '../introStore';
import { canQuitNatively, prefersReducedMotion, quitNatively } from '../platform';
import { fadeToScene } from '../sceneTransition';

/**
 * Menú principal: una esquina de Little Havana de noche. Adrián descansa sobre el capó de su coche mientras la ciudad
 * sigue su vida (un gato salta por la azotea, un pandillero fuma, pasan coches voladores...). Todo el arte es provisional.
 */
export class MenuScene extends Phaser.Scene {
  private selected = 0;
  private busy = false;
  private animated: Animated[] = [];
  private panel!: MenuPanel;

  constructor() {
    super('MenuScene');
  }

  create(): void {
    this.selected = 0;
    this.busy = false;
    this.animated = [];
    this.cameras.main.fadeIn(300, 0, 0, 0);
    const reduce = prefersReducedMotion();

    const backdrop = createBackdrop(this);
    const anchors = backdrop.near.anchors;
    this.animated.push(
      createParallax(this, backdrop, !reduce),
      createSkyLife(this, reduce),
      createCityLife(this, backdrop, reduce),
      createFlyerLayer(this, reduce),
      createPalmTree(this, anchors, reduce),
      createStreetLife(this, anchors, reduce),
      createHero(this, reduce),
      createRooftop(this, anchors, reduce)
    );

    // Carteles de neón: café cubano (cian) y hotel (rosa)
    const cafe = cached('sign-cafe', () => buildNeonSign('CAFÉ', PAL.cyan, 2));
    const hotel = cached('sign-hotel', () => buildVerticalNeon('HOTEL', PAL.magenta));
    this.animated.push(
      createNeonSign(this, 'nm-sign-cafe', cafe, anchors.cafeSign.x, anchors.cafeSign.y, 11, reduce),
      createNeonSign(this, 'nm-sign-hotel', hotel, anchors.hotelSign.x, anchors.hotelSign.y, 23, reduce),
      createRain(this, anchors, reduce)
    );

    addPixelImage(this, 'nm-vignette', () => buildVignette(BASE_WIDTH, BASE_HEIGHT), 0, 0, DEPTH.vignette);

    this.animated.push(createTitleBlock(this, reduce));
    this.panel = new MenuPanel(
      this,
      MAIN_MENU_ITEMS,
      {
        onHover: (i) => this.setSelected(i),
        onClick: (i) => {
          this.setSelected(i);
          this.activate();
        }
      },
      reduce
    );
    this.animated.push(this.panel);
    createFooterHints(this);
    createFpsMeter(this);
    createIntroReset(this);
    createIntroButton(this, () => {
      this.busy = true; // al pulsar VER INTRO el menú deja de responder mientras funde
    });
    this.bindKeyboard();
  }

  update(time: number, delta: number): void {
    for (const a of this.animated) a.update(time, delta);
  }

  private bindKeyboard(): void {
    const kb = this.input.keyboard;
    if (!kb) return;
    kb.on('keydown-UP', () => this.move(-1));
    kb.on('keydown-W', () => this.move(-1));
    kb.on('keydown-DOWN', () => this.move(1));
    kb.on('keydown-S', () => this.move(1));
    kb.on('keydown-ENTER', () => this.activate());
    kb.on('keydown-SPACE', () => this.activate());
  }

  private move(delta: number): void {
    if (this.busy) return;
    this.setSelected(moveSelection(this.selected, delta, MAIN_MENU_ITEMS.length));
  }

  private setSelected(index: number): void {
    if (this.busy || index === this.selected) return;
    this.selected = index;
    this.panel.setSelected(index);
  }

  private activate(): void {
    const item = MAIN_MENU_ITEMS[this.selected];
    if (!item || this.busy) return;
    this.busy = true;
    this.panel.press(this.selected, () => {
      switch (item.id) {
        case 'play':
          // Quien nunca ha jugado ve primero la cinemática; quien ya la vio va directo al juego.
          fadeToScene(this, shouldPlayIntro(introStore, wantsIntroReplay(window.location.search)) ? 'CinematicScene' : 'PlayPlaceholderScene');
          break;
        case 'settings':
          fadeToScene(this, 'SettingsScene');
          break;
        case 'quit':
          // En el .exe se cierra el juego; en el navegador no se puede cerrar la pestaña desde el código.
          if (canQuitNatively()) quitNatively();
          else fadeToScene(this, 'ExitScene');
          break;
      }
    });
  }
}
