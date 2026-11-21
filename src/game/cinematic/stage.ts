import Phaser from 'phaser';
import { flickerLevel } from '../../core/cinematic/effectMath';
import { forFont, type SceneLight } from '../../core/cinematic/storyTypes';
import { PixelCanvas } from '../../core/pixelCanvas';
import { renderText } from '../../core/pixelText';
import { createRng } from '../../core/rng';
import { BASE_HEIGHT, BASE_WIDTH } from '../../core/version';
import { CINEMATIC } from '../../data/cinematic';
import { AMBIENCE } from '../../data/menuScene';
import { STORY_SCENES } from '../../data/story';
import { addPixelImage, ensureTexture } from '../menu/canvasTexture';
import { buildGlowDisc } from '../menu/art/glow';
import { buildVignette } from '../menu/art/vignette';
import { RAIN_TILE, buildRainTile } from '../menu/art/weather';
import { ART_BUILDERS } from './art';
import { ART_H, ART_W } from './art/kit';
import { CIN_DEPTH } from './depth';
import { createEffect, type Effect } from './effects';

export interface Stage {
  /** Monta la escena: capas, luces, efectos, lluvia y rótulo. */
  show(sceneIndex: number): void;
  /** Empieza una frase: aparecen las capas y luces que esperaban a esa frase. */
  onLine(line: number): void;
  update(timeMs: number, deltaMs: number): void;
  /** Para los efectos al terminar. */
  destroy(): void;
}

interface PreparedLayer {
  readonly key: string;
  readonly parallax: number;
  readonly tile: boolean;
  readonly autoScrollX: number;
  readonly revealAtLine: number | null;
  readonly actors: readonly { readonly key: string; readonly x: number; readonly y: number; readonly bobPx: number; readonly bobMs: number; readonly phaseMs: number }[];
}

// Las ilustraciones se dibujan una sola vez; después solo se guardan sus texturas y sus datos de movimiento.
const prepared = new Map<string, readonly PreparedLayer[]>();

function prepare(scene: Phaser.Scene, sceneId: string, artId: string): readonly PreparedLayer[] {
  const got = prepared.get(sceneId);
  if (got && got.every((l) => scene.textures.exists(l.key))) return got;
  const build = ART_BUILDERS[artId];
  if (!build) throw new Error(`Ilustración desconocida: ${artId}`);
  const layers = build().map((l, i): PreparedLayer => {
    const key = `cin-${sceneId}-L${i}`;
    ensureTexture(scene, key, () => l.canvas);
    return {
      key,
      parallax: l.parallax,
      tile: l.tile ?? false,
      autoScrollX: l.autoScrollX ?? 0,
      revealAtLine: l.revealAtLine ?? null,
      actors: (l.actors ?? []).map((a, j) => {
        const akey = `${key}-A${j}`;
        ensureTexture(scene, akey, () => a.canvas);
        return { key: akey, x: a.x, y: a.y, bobPx: a.bobPx, bobMs: a.bobMs, phaseMs: a.phaseMs };
      })
    };
  });
  prepared.set(sceneId, layers);
  return layers;
}

/** Lo que no cambia entre escenas: viñeta oscura en los bordes, bandas de cine y el panel donde va el texto. */
function createFrame(scene: Phaser.Scene): void {
  addPixelImage(scene, 'nm-vignette', () => buildVignette(BASE_WIDTH, BASE_HEIGHT), 0, 0, CIN_DEPTH.vignette);
  scene.add.rectangle(0, 0, BASE_WIDTH, CINEMATIC.bars.top, 0x05020d).setOrigin(0, 0).setDepth(CIN_DEPTH.bars);
  const h = CINEMATIC.bars.bottomPanelHeight + 22;
  addPixelImage(
    scene,
    'cin-panel',
    () => {
      const c = new PixelCanvas(BASE_WIDTH, h);
      for (let y = 0; y < h; y++) {
        const k = Math.min(1, y / 22);
        c.fillRect(0, y, BASE_WIDTH, 1, 0x05020d, CINEMATIC.bars.panelAlpha * k * k);
      }
      return c;
    },
    0,
    BASE_HEIGHT - h,
    CIN_DEPTH.panel
  );
}

interface LightRuntime {
  readonly img: Phaser.GameObjects.Image;
  readonly def: SceneLight;
  readonly rnd: () => number;
  nextAt: number;
  level: number;
  shown: boolean;
  tween: Phaser.Tweens.Tween | null;
}

interface LayerRuntime {
  readonly container: Phaser.GameObjects.Container;
  readonly data: PreparedLayer;
  readonly tile: Phaser.GameObjects.TileSprite | null;
  readonly actors: { readonly img: Phaser.GameObjects.Image; readonly def: PreparedLayer['actors'][number] }[];
  scroll: number;
  revealed: boolean;
}

export function createStage(scene: Phaser.Scene, reduceMotion: boolean, playSfx: (id: string) => void): Stage {
  createFrame(scene);

  let layers: LayerRuntime[] = [];
  let lights: LightRuntime[] = [];
  let effects: Effect[] = [];
  let world: Phaser.GameObjects.Container | null = null;
  let panFrom = { x: 0, y: 0 };
  let panTo = { x: 0, y: 0 };
  let panDuration = 1;
  let panElapsed = 0;
  let caption: Phaser.GameObjects.Image | null = null;
  let currentScene = -1;

  // Lluvia: las mismas dos capas del menú, solo en las escenas de exterior.
  let rainFar: Phaser.GameObjects.TileSprite | null = null;
  let rainNear: Phaser.GameObjects.TileSprite | null = null;
  if (AMBIENCE.rain.enabled && !reduceMotion) {
    ensureTexture(scene, 'nm-rain-far', () => buildRainTile(11, 26, 5, 0x9aa4ff));
    ensureTexture(scene, 'nm-rain-near', () => buildRainTile(23, 14, 8, 0xd6dcff));
    rainFar = scene.add.tileSprite(0, 0, BASE_WIDTH, BASE_HEIGHT, 'nm-rain-far').setOrigin(0, 0).setDepth(CIN_DEPTH.rain).setAlpha(AMBIENCE.rain.alpha * 0.8).setVisible(false);
    rainNear = scene.add.tileSprite(0, 0, BASE_WIDTH, BASE_HEIGHT, 'nm-rain-near').setOrigin(0, 0).setDepth(CIN_DEPTH.rain).setAlpha(AMBIENCE.rain.alpha).setVisible(false);
  }

  function teardown(): void {
    for (const l of lights) {
      l.tween?.stop();
      l.img.destroy();
    }
    for (const e of effects) e.destroy();
    for (const l of layers) l.container.destroy(true);
    world?.destroy(true);
    lights = [];
    effects = [];
    layers = [];
    world = null;
  }

  function showLight(l: LightRuntime): void {
    if (l.shown) return;
    l.shown = true;
    l.img.setVisible(true);
    if (l.def.mode === 'flicker' || reduceMotion) {
      l.img.setAlpha(l.def.peakAlpha * (reduceMotion ? 0.7 : 1));
      return;
    }
    l.img.setAlpha(0);
    scene.tweens.add({ targets: l.img, alpha: l.def.peakAlpha * 0.25, duration: 500 });
    l.tween = scene.tweens.add({ targets: l.img, alpha: l.def.peakAlpha, duration: l.def.pulseMs / 2, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 500 + (l.def.delayMs ?? 0) });
  }

  return {
    show(index) {
      const story = STORY_SCENES[index];
      if (!story) throw new Error(`Escena de cinemática desconocida: ${index}`);
      teardown();
      currentScene = index;

      const data = prepare(scene, story.id, story.art);
      layers = data.map((d, i) => {
        const container = scene.add.container(0, 0).setDepth(i * 0.1);
        const tile = d.tile ? scene.add.tileSprite(0, 0, ART_W, ART_H, d.key).setOrigin(0, 0) : null;
        container.add(tile ?? scene.add.image(0, 0, d.key).setOrigin(0, 0));
        const actors = d.actors.map((a) => {
          const img = scene.add.image(a.x, a.y, a.key).setOrigin(0, 0);
          container.add(img);
          return { img, def: a };
        });
        const revealed = d.revealAtLine === null;
        if (!revealed) container.setAlpha(0);
        return { container, data: d, tile, actors, scroll: 0, revealed };
      });

      // Todo lo "vivo" (luces, humo, chispas...) va sobre las capas que se mueven con la cámara y bajo las de primer plano.
      let lastWorldLayer = 0;
      layers.forEach((l, i) => {
        if (l.data.parallax <= 1) lastWorldLayer = i;
      });
      world = scene.add.container(0, 0).setDepth(lastWorldLayer * 0.1 + 0.05);

      lights = story.lights.map((def, i) => {
        const key = `cin-glow-${story.id}-${i}`;
        ensureTexture(scene, key, () => buildGlowDisc(def.radius, def.color, 5, 1));
        const img = scene.add.image(def.x - def.radius, def.y - def.radius, key).setOrigin(0, 0).setBlendMode(Phaser.BlendModes.ADD).setVisible(false).setAlpha(0);
        world?.add(img);
        return { img, def, rnd: createRng(300 + i), nextAt: 0, level: 1, shown: false, tween: null };
      });

      if (!reduceMotion) {
        const host = { scene, world, layers: layers.map((l) => l.container), playSfx };
        effects = story.effects.map((def, i) => createEffect(host, def, 900 + index * 31 + i));
      }

      const { pan } = story;
      panFrom = { x: pan.fromX, y: pan.fromY };
      panTo = { x: pan.toX, y: pan.toY };
      panDuration = pan.durationMs;
      panElapsed = 0;
      if (reduceMotion) {
        panFrom = panTo = { x: (pan.fromX + pan.toX) / 2, y: (pan.fromY + pan.toY) / 2 };
      }

      rainFar?.setVisible(story.rain);
      rainNear?.setVisible(story.rain);

      caption?.destroy();
      const capKey = `cin-caption-${story.id}`;
      ensureTexture(scene, capKey, () => renderText(forFont(story.caption), { color: CINEMATIC.caption.color, shadow: CINEMATIC.caption.shadow }));
      caption = scene.add.image(CINEMATIC.caption.x, CINEMATIC.caption.y, capKey).setOrigin(0, 0).setDepth(CIN_DEPTH.caption).setAlpha(0);
      scene.tweens.add({ targets: caption, alpha: 1, duration: CINEMATIC.caption.fadeMs, delay: CINEMATIC.caption.delayMs });
    },

    onLine(line) {
      for (const l of layers) {
        if (!l.revealed && l.data.revealAtLine !== null && line >= l.data.revealAtLine) {
          l.revealed = true;
          scene.tweens.add({ targets: l.container, alpha: 1, duration: 450 });
        }
      }
      for (const l of lights) if (!l.shown && (l.def.fromLine ?? 0) <= line) showLight(l);
    },

    update(timeMs, deltaMs) {
      const dt = deltaMs / 1000;
      panElapsed += deltaMs;
      const t = Math.min(1, panElapsed / panDuration);
      const px = panFrom.x + (panTo.x - panFrom.x) * t;
      const py = panFrom.y + (panTo.y - panFrom.y) * t;
      for (const l of layers) {
        l.container.setPosition(Math.round(px * l.data.parallax), Math.round(py * l.data.parallax));
        if (l.tile && !reduceMotion) {
          l.scroll += -l.data.autoScrollX * dt;
          l.tile.tilePositionX = Math.floor(l.scroll % ART_W);
        }
        if (!reduceMotion) {
          for (const a of l.actors) {
            const wave = 0.5 + 0.5 * Math.sin(((timeMs + a.def.phaseMs) / a.def.bobMs) * Math.PI * 2);
            a.img.y = a.def.y + Math.round(wave * a.def.bobPx);
          }
        }
      }
      world?.setPosition(Math.round(px), Math.round(py));
      for (const l of lights) {
        if (l.def.mode === 'flicker' && l.shown && !reduceMotion && timeMs >= l.nextAt) {
          l.level = flickerLevel(l.rnd);
          l.nextAt = timeMs + 40 + l.rnd() * 150;
          l.img.setAlpha(l.def.peakAlpha * l.level);
        }
      }
      for (const e of effects) e.update(deltaMs, timeMs);
      if (rainFar && rainNear) {
        rainFar.tilePositionY = (rainFar.tilePositionY - AMBIENCE.rain.speedFar * dt) % RAIN_TILE;
        rainFar.tilePositionX = (rainFar.tilePositionX + AMBIENCE.rain.speedFar * dt * 0.25) % RAIN_TILE;
        rainNear.tilePositionY = (rainNear.tilePositionY - AMBIENCE.rain.speedNear * dt) % RAIN_TILE;
        rainNear.tilePositionX = (rainNear.tilePositionX + AMBIENCE.rain.speedNear * dt * 0.25) % RAIN_TILE;
      }
      void currentScene;
    },

    destroy() {
      teardown();
    }
  };
}
