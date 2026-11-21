import Phaser from 'phaser';
import { PixelCanvas } from '../../core/pixelCanvas';
import { renderText } from '../../core/pixelText';
import { forFont } from '../../core/cinematic/storyTypes';
import { BASE_HEIGHT, BASE_WIDTH } from '../../core/version';
import { CINEMATIC } from '../../data/cinematic';
import { AMBIENCE } from '../../data/menuScene';
import { STORY_SCENES } from '../../data/story';
import { addPixelImage, ensureTexture } from '../menu/canvasTexture';
import { buildGlowDisc } from '../menu/art/glow';
import { buildVignette } from '../menu/art/vignette';
import { RAIN_TILE, buildRainTile } from '../menu/art/weather';
import { ART_BUILDERS } from './art';
import { CIN_DEPTH } from './depth';

export interface Stage {
  /** Muestra la ilustración, las luces, la lluvia y el rótulo de esa escena. */
  show(sceneIndex: number): void;
  update(timeMs: number, deltaMs: number): void;
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

export function createStage(scene: Phaser.Scene, reduceMotion: boolean): Stage {
  createFrame(scene);
  const art = scene.add.container(0, 0).setDepth(CIN_DEPTH.art);
  let panTween: Phaser.Tweens.Tween | null = null;
  let lightTweens: Phaser.Tweens.Tween[] = [];
  let caption: Phaser.GameObjects.Image | null = null;

  // Lluvia: las mismas dos capas del menú, solo en las escenas de exterior.
  let rainFar: Phaser.GameObjects.TileSprite | null = null;
  let rainNear: Phaser.GameObjects.TileSprite | null = null;
  if (AMBIENCE.rain.enabled && !reduceMotion) {
    ensureTexture(scene, 'nm-rain-far', () => buildRainTile(11, 26, 5, 0x9aa4ff));
    ensureTexture(scene, 'nm-rain-near', () => buildRainTile(23, 14, 8, 0xd6dcff));
    rainFar = scene.add.tileSprite(0, 0, BASE_WIDTH, BASE_HEIGHT, 'nm-rain-far').setOrigin(0, 0).setDepth(CIN_DEPTH.rain).setAlpha(AMBIENCE.rain.alpha * 0.8).setVisible(false);
    rainNear = scene.add.tileSprite(0, 0, BASE_WIDTH, BASE_HEIGHT, 'nm-rain-near').setOrigin(0, 0).setDepth(CIN_DEPTH.rain).setAlpha(AMBIENCE.rain.alpha).setVisible(false);
  }

  return {
    show(index) {
      const story = STORY_SCENES[index];
      const build = story ? ART_BUILDERS[story.art] : undefined;
      if (!story || !build) throw new Error(`Escena de cinemática desconocida: ${index}`);

      panTween?.stop();
      for (const t of lightTweens) t.stop();
      lightTweens = [];
      art.removeAll(true);

      const artKey = `cin-art-${story.art}`;
      ensureTexture(scene, artKey, build);
      art.add(scene.add.image(0, 0, artKey).setOrigin(0, 0));

      story.lights.forEach((l, i) => {
        const key = `cin-glow-${story.id}-${i}`;
        ensureTexture(scene, key, () => buildGlowDisc(l.radius, l.color, 5, 1));
        const img = scene.add.image(l.x - l.radius, l.y - l.radius, key).setOrigin(0, 0).setBlendMode(Phaser.BlendModes.ADD);
        art.add(img);
        if (reduceMotion) {
          img.setAlpha(l.peakAlpha * 0.7);
        } else {
          img.setAlpha(l.peakAlpha * 0.25);
          lightTweens.push(
            scene.tweens.add({ targets: img, alpha: l.peakAlpha, duration: l.pulseMs / 2, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: l.delayMs ?? 0 })
          );
        }
      });

      const { pan } = story;
      if (reduceMotion) {
        art.setPosition((pan.fromX + pan.toX) / 2, (pan.fromY + pan.toY) / 2);
      } else {
        art.setPosition(pan.fromX, pan.fromY);
        panTween = scene.tweens.add({ targets: art, x: pan.toX, y: pan.toY, duration: pan.durationMs, ease: 'Linear' });
      }

      rainFar?.setVisible(story.rain);
      rainNear?.setVisible(story.rain);

      caption?.destroy();
      const capKey = `cin-caption-${story.id}`;
      ensureTexture(scene, capKey, () => renderText(forFont(story.caption), { color: CINEMATIC.caption.color, shadow: CINEMATIC.caption.shadow }));
      caption = scene.add.image(CINEMATIC.caption.x, CINEMATIC.caption.y, capKey).setOrigin(0, 0).setDepth(CIN_DEPTH.caption).setAlpha(0);
      scene.tweens.add({ targets: caption, alpha: 1, duration: CINEMATIC.caption.fadeMs, delay: CINEMATIC.caption.delayMs });
    },
    update(_timeMs, deltaMs) {
      const dt = deltaMs / 1000;
      if (rainFar && rainNear) {
        rainFar.tilePositionY = (rainFar.tilePositionY - AMBIENCE.rain.speedFar * dt) % RAIN_TILE;
        rainFar.tilePositionX = (rainFar.tilePositionX + AMBIENCE.rain.speedFar * dt * 0.25) % RAIN_TILE;
        rainNear.tilePositionY = (rainNear.tilePositionY - AMBIENCE.rain.speedNear * dt) % RAIN_TILE;
        rainNear.tilePositionX = (rainNear.tilePositionX + AMBIENCE.rain.speedNear * dt * 0.25) % RAIN_TILE;
      }
    }
  };
}
