import Phaser from 'phaser';
import { CinematicRunner, type RunnerEvent } from '../../core/cinematic/cinematicRunner';
import { markIntroSeen } from '../../core/cinematic/introSeen';
import { cuesForLine, forFont } from '../../core/cinematic/storyTypes';
import { blipFrequency, shouldBlip } from '../../core/cinematic/textBlip';
import { createFpsMeter } from '../../debug/fpsMeter';
import { CINEMATIC } from '../../data/cinematic';
import { STORY_SCENES } from '../../data/story';
import { MusicPlayer } from '../audio/musicPlayer';
import { createSynth, type Synth } from '../audio/synth';
import { createDialogueBox, type DialogueBox } from '../cinematic/dialogueBox';
import { showEndCard } from '../cinematic/endCard';
import { createSkipHold, type SkipHold } from '../cinematic/skipHold';
import { createStage, type Stage } from '../cinematic/stage';
import { introStore } from '../introStore';
import { prefersReducedMotion } from '../platform';
import { fadeToScene } from '../sceneTransition';

type SceneData = { next?: string };

/**
 * Cinemática inicial: la historia de Adrián Vargas en seis escenas ilustradas, con texto que se escribe letra a letra,
 * sonidos y música. Se ve la primera vez que se pulsa JUGAR. La lógica (tiempos, guion, "¿ya la vio?") vive en src/core.
 */
export class CinematicScene extends Phaser.Scene {
  private runner!: CinematicRunner;
  private stage!: Stage;
  private dialogue!: DialogueBox;
  private synth!: Synth;
  private music!: MusicPlayer;
  private skipHold!: SkipHold;
  private nextScene = 'PlayPlaceholderScene';
  private sceneIndex = -1;
  private chars: string[] = [];
  private cueTimers: Phaser.Time.TimerEvent[] = [];
  private transitioning = false;
  private ended = false;

  constructor() {
    super('CinematicScene');
  }

  init(data: SceneData): void {
    this.nextScene = data?.next ?? 'PlayPlaceholderScene';
    this.sceneIndex = -1;
    this.chars = [];
    this.cueTimers = [];
    this.transitioning = false;
    this.ended = false;
  }

  create(): void {
    this.cameras.main.setBackgroundColor(0x05020d);
    this.cameras.main.fadeIn(CINEMATIC.fadeInMs, 0, 0, 0);
    const reduce = prefersReducedMotion();

    this.synth = createSynth(this);
    this.music = new MusicPlayer();
    this.stage = createStage(this, reduce);
    this.dialogue = createDialogueBox(this);
    this.skipHold = createSkipHold(this, () => this.handle(this.runner.skip()));
    createFpsMeter(this);

    this.runner = new CinematicRunner(
      STORY_SCENES.map((s) => s.lines.map(forFont)),
      CINEMATIC.runner
    );

    const kb = this.input.keyboard;
    kb?.on('keydown-SPACE', () => this.press());
    kb?.on('keydown-ENTER', () => this.press());
    this.input.on('pointerdown', () => this.press());

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.synth.dispose();
      this.music.dispose();
    });

    this.handle(this.runner.start());
  }

  update(time: number, delta: number): void {
    this.stage.update(time, delta);
    this.skipHold.update(delta);
    if (this.transitioning || this.ended) return;
    this.handle(this.runner.update(delta));
  }

  private press(): void {
    if (this.transitioning || this.ended) return;
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
          this.revealChars(e.from, e.to, e.instant);
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
    for (const t of this.cueTimers) t.remove(false);
    this.cueTimers = [];
    this.stage.show(index);
    this.synth.setAmbience(story.ambience);
    this.music.enterScene(story.id);
    this.dialogue.clear();
  }

  /** Funde a negro, cambia de ilustración y vuelve a mostrar (mientras tanto el texto y las pulsaciones esperan). */
  private transitionTo(index: number, pending: RunnerEvent[]): void {
    this.transitioning = true;
    this.dialogue.clear();
    const cam = this.cameras.main;
    const ms = CINEMATIC.fadeBetweenScenesMs;
    cam.fadeOut(ms, 0, 0, 0);
    cam.once('camerafadeoutcomplete', () => {
      if (this.ended) return;
      this.enterScene(index);
      cam.fadeIn(ms, 0, 0, 0);
      this.transitioning = false;
      this.handle(pending);
    });
  }

  private startLine(sceneIdx: number, line: number): void {
    const story = STORY_SCENES[sceneIdx];
    const raw = story?.lines[line];
    if (!story || raw === undefined) return;
    const text = forFont(raw);
    this.chars = Array.from(text);
    this.dialogue.setLine(text);
    for (const cue of cuesForLine(story, line)) {
      this.cueTimers.push(
        this.time.delayedCall(cue.delayMs, () => {
          if (!this.ended) this.synth.playSfx(cue.sfx);
        })
      );
    }
  }

  private revealChars(from: number, to: number, instant: boolean): void {
    this.dialogue.reveal(to);
    if (instant) return;
    // Un solo sonidito por fotograma, aunque aparezcan varias letras de golpe
    for (let i = from; i < to; i++) {
      const ch = this.chars[i];
      if (ch !== undefined && shouldBlip(ch, i, CINEMATIC.blip)) {
        this.synth.blip(blipFrequency(ch, CINEMATIC.blip), CINEMATIC.blip);
        break;
      }
    }
  }

  private finish(skipped: boolean): void {
    if (this.ended) return;
    this.ended = true;
    markIntroSeen(introStore);
    this.dialogue.clear();
    this.synth.setAmbience(null);
    this.music.stop(skipped ? 600 : CINEMATIC.audio.musicFadeMs + 400);
    if (skipped) {
      fadeToScene(this, this.nextScene, 450);
    } else {
      showEndCard(this, this.synth, () => fadeToScene(this, this.nextScene, 600));
    }
  }
}
