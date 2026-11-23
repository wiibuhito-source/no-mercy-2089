import Phaser from 'phaser';
import { CinematicRunner, type RunnerEvent } from '../../core/cinematic/cinematicRunner';
import { markIntroSeen } from '../../core/cinematic/introSeen';
import { forFont, lineSpeaker, lineText } from '../../core/cinematic/storyTypes';
import { renderText } from '../../core/pixelText';
import { BASE_HEIGHT, BASE_WIDTH } from '../../core/version';
import { createFpsMeter } from '../../debug/fpsMeter';
import { CINEMATIC } from '../../data/cinematic';
import { STORY_SCENES } from '../../data/story';
import type { SceneCard } from '../../core/cinematic/storyTypes';
import { ensureTexture } from '../menu/canvasTexture';
import { MusicPlayer } from '../audio/musicPlayer';
import { createDialogueBox, type DialogueBox } from '../cinematic/dialogueBox';
import { showEndCard } from '../cinematic/endCard';
import { createSkipHold, type SkipHold } from '../cinematic/skipHold';
import { createStage, type Stage } from '../cinematic/stage';
import { introStore } from '../introStore';
import { prefersReducedMotion } from '../platform';
import { fadeToScene } from '../sceneTransition';

type SceneData = {
  /** A qué escena ir al terminar (por defecto, el juego). */
  next?: string;
  /** Si es false (botón de prueba), ver la cinemática no cuenta como "ya vista". */
  markSeen?: boolean;
  /** Escena por la que empezar (0 = la primera). */
  startScene?: number;
};

/**
 * Cinemática inicial: la historia de Adrián Vargas en seis escenas ilustradas, con texto que se escribe letra a letra,
 * sonidos y música. Se ve la primera vez que se pulsa JUGAR. La lógica (tiempos, guion, "¿ya la vio?") vive en src/core.
 */
export class CinematicScene extends Phaser.Scene {
  private runner!: CinematicRunner;
  private stage!: Stage;
  private dialogue!: DialogueBox;
  private music!: MusicPlayer;
  private skipHold!: SkipHold;
  private nextScene = 'PlayPlaceholderScene';
  private markSeen = true;
  private startScene = 0;
  private sceneIndex = -1;
  private cardSkip: (() => void) | null = null;
  private transitioning = false;
  private ended = false;

  constructor() {
    super('CinematicScene');
  }

  init(data: SceneData): void {
    this.nextScene = data?.next ?? 'PlayPlaceholderScene';
    this.markSeen = data?.markSeen ?? true;
    this.startScene = data?.startScene ?? 0;
    this.sceneIndex = -1;
    this.cardSkip = null;
    this.transitioning = false;
    this.ended = false;
  }

  create(): void {
    this.cameras.main.setBackgroundColor(0x05020d);
    this.cameras.main.fadeIn(CINEMATIC.fadeInMs, 0, 0, 0);
    const reduce = prefersReducedMotion();

    this.music = new MusicPlayer();
    this.stage = createStage(this, reduce);
    this.dialogue = createDialogueBox(this);
    this.skipHold = createSkipHold(this, () => this.handle(this.runner.skip()));
    createFpsMeter(this);

    this.runner = new CinematicRunner(
      STORY_SCENES.map((s) => s.lines.map((l) => forFont(lineText(l)))),
      CINEMATIC.runner
    );

    const kb = this.input.keyboard;
    kb?.on('keydown-SPACE', () => this.press());
    kb?.on('keydown-ENTER', () => this.press());
    this.input.on('pointerdown', () => this.press());

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.stage.destroy();
      this.music.dispose();
    });

    this.handle(this.runner.start(this.startScene));
  }

  update(time: number, delta: number): void {
    this.stage.update(time, delta);
    this.skipHold.update(delta);
    if (this.transitioning || this.ended) return;
    this.handle(this.runner.update(delta));
  }

  private press(): void {
    if (this.ended) return;
    if (this.cardSkip) {
      this.cardSkip();
      return;
    }
    if (this.transitioning) return;
    this.handle(this.runner.advance());
  }

  private handle(events: RunnerEvent[]): void {
    for (let i = 0; i < events.length; i++) {
      const e = events[i];
      if (!e) continue;
      switch (e.type) {
        case 'scene-start':
          if (this.sceneIndex < 0) {
            this.enterScene(e.scene);
          } else {
            this.transitionTo(e.scene, events.slice(i + 1));
            return;
          }
          break;
        case 'line-start':
          this.startLine(e.scene, e.line);
          break;
        case 'chars':
          this.revealChars(e.to);
          break;
        case 'line-complete':
          this.dialogue.setPrompt(true);
          break;
        case 'finished':
          this.finish(e.skipped);
          return;
      }
    }
  }

  private enterScene(index: number): void {
    const story = STORY_SCENES[index];
    if (!story) return;
    this.sceneIndex = index;
    this.stage.show(index);
    this.music.enterScene(story.id);
    this.dialogue.clear();
  }

  /** Funde (a negro o con destello blanco), cambia de escena y vuelve a mostrar; el texto y las pulsaciones esperan. */
  private transitionTo(index: number, pending: RunnerEvent[]): void {
    this.transitioning = true;
    this.dialogue.clear();
    const story = STORY_SCENES[index];
    const flash = story?.transition === 'flash';
    const [r, g, b] = flash ? [255, 255, 255] : [0, 0, 0];
    const outMs = flash ? CINEMATIC.flash.outMs : CINEMATIC.fadeBetweenScenesMs;
    const inMs = flash ? CINEMATIC.flash.inMs : CINEMATIC.fadeBetweenScenesMs;
    const cam = this.cameras.main;
    cam.fadeOut(outMs, r, g, b);
    cam.once('camerafadeoutcomplete', () => {
      if (this.ended) return;
      this.enterScene(index);
      const proceed = (): void => {
        if (this.ended) return;
        this.transitioning = false;
        this.handle(pending);
      };
      if (story?.card) {
        cam.fadeIn(CINEMATIC.card.fadeInMs, 0, 0, 0);
        this.showCard(story.card, proceed);
      } else {
        cam.fadeIn(inMs, r, g, b);
        proceed();
      }
    });
  }

  /** Título grande sobre negro ("2078 / ONCE AÑOS ANTES"); al terminar (o al pulsar) deja ver la escena. */
  private showCard(card: SceneCard, done: () => void): void {
    const k = CINEMATIC.card;
    const black = this.add.rectangle(0, 0, BASE_WIDTH, BASE_HEIGHT, 0x05020d).setOrigin(0, 0).setDepth(190);
    const objects: Phaser.GameObjects.GameObject[] = [black];
    ensureTexture(this, `cin-card-${card.title}`, () => renderText(card.title, { color: k.titleColor, scale: k.titleScale, shadow: k.titleShadow }));
    const title = this.add.image(BASE_WIDTH / 2, BASE_HEIGHT / 2 - (card.sub ? 10 : 0), `cin-card-${card.title}`).setDepth(191).setAlpha(0);
    objects.push(title);
    const fades: Phaser.GameObjects.Image[] = [title];
    if (card.sub) {
      const subKey = `cin-card-sub-${card.sub}`;
      ensureTexture(this, subKey, () => renderText(forFont(card.sub ?? ''), { color: k.subColor, scale: 1, shadow: 0x05020d }));
      const sub = this.add.image(BASE_WIDTH / 2, BASE_HEIGHT / 2 + 26, subKey).setDepth(191).setAlpha(0);
      objects.push(sub);
      fades.push(sub);
    }
    this.tweens.add({ targets: fades, alpha: 1, duration: k.fadeInMs, delay: 150 });
    let finished = false;
    const finish = (): void => {
      if (finished) return;
      finished = true;
      this.cardSkip = null;
      this.tweens.add({
        targets: objects,
        alpha: 0,
        duration: k.fadeOutMs,
        onComplete: () => objects.forEach((o) => o.destroy())
      });
      done();
    };
    this.cardSkip = finish;
    this.time.delayedCall(k.fadeInMs + k.holdMs, finish);
  }

  private startLine(sceneIdx: number, line: number): void {
    const story = STORY_SCENES[sceneIdx];
    const raw = story?.lines[line];
    if (!story || raw === undefined) return;
    const text = forFont(lineText(raw));
    const who = lineSpeaker(raw);
    const voice = who === null ? undefined : CINEMATIC.speakers[who];
    this.dialogue.setSpeaker(voice?.name ?? null, voice?.color ?? 0xffffff);
    this.dialogue.setLine(text);
    this.stage.onLine(line);
  }

  private revealChars(to: number): void {
    this.dialogue.reveal(to);
  }

  private finish(skipped: boolean): void {
    if (this.ended) return;
    this.ended = true;
    if (this.markSeen) markIntroSeen(introStore);
    this.dialogue.clear();
    this.music.stop(skipped ? 600 : CINEMATIC.audio.musicFadeMs + 400);
    if (skipped) {
      fadeToScene(this, this.nextScene, 450);
    } else {
      showEndCard(this, () => fadeToScene(this, this.nextScene, 600));
    }
  }
}
