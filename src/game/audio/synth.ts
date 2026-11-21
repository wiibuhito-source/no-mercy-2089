import Phaser from 'phaser';
import type { AmbienceLayer, AmbienceRecipe, SfxRecipe, SfxVoice } from '../../core/audio/sfxRecipe';
import type { TextBlipConfig } from '../../core/cinematic/textBlip';
import { CINEMATIC } from '../../data/cinematic';
import { AMBIENCES, SFX } from '../../data/sfx';

/** Reproduce los efectos y ambientes sintetizados (recetas de src/data/sfx.ts) con Web Audio. Si no hay audio, no hace nada. */
export interface Synth {
  playSfx(id: string): void;
  blip(hz: number, cfg: TextBlipConfig): void;
  setAmbience(id: string | null): void;
  dispose(): void;
}

interface AmbienceHandle {
  readonly gain: GainNode;
  readonly sources: AudioScheduledSourceNode[];
  readonly timers: number[];
}

const SILENT: Synth = { playSfx() {}, blip() {}, setAmbience() {}, dispose() {} };

export function createSynth(scene: Phaser.Scene): Synth {
  const manager = scene.sound;
  if (!(manager instanceof Phaser.Sound.WebAudioSoundManager)) return SILENT;
  const ctx = manager.context;
  if (ctx.state === 'suspended') void ctx.resume().catch(() => undefined);

  const master = ctx.createGain();
  master.gain.value = CINEMATIC.audio.masterVolume;
  master.connect(ctx.destination);

  // Un ratito de ruido blanco que se repite en bucle (lluvia, chispas, golpes...)
  const noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  let ambience: AmbienceHandle | null = null;

  function makeSource(wave: string, freq: number, loop: boolean): AudioScheduledSourceNode {
    if (wave === 'noise') {
      const src = ctx.createBufferSource();
      src.buffer = noise;
      src.loop = loop;
      return src;
    }
    const osc = ctx.createOscillator();
    osc.type = wave as OscillatorType;
    osc.frequency.value = freq;
    return osc;
  }

  /** Empieza la fuente; el ruido arranca en un punto al azar de su buffer para que no suene siempre igual. */
  function startSource(src: AudioScheduledSourceNode, when: number): void {
    if (src instanceof AudioBufferSourceNode) src.start(when, Math.random());
    else src.start(when);
  }

  function chain(src: AudioNode, out: AudioNode, lowpass?: number, highpass?: number): void {
    let node: AudioNode = src;
    if (highpass !== undefined) {
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = highpass;
      node.connect(hp);
      node = hp;
    }
    if (lowpass !== undefined) {
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = lowpass;
      node.connect(lp);
      node = lp;
    }
    node.connect(out);
  }

  function playVoice(v: SfxVoice, when: number): void {
    const t0 = when + v.startMs / 1000;
    const dur = v.durationMs / 1000;
    const attack = Math.min(dur * 0.5, (v.attackMs ?? 4) / 1000);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(v.volume, t0 + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    const src = makeSource(v.wave, v.freq, true);
    if (src instanceof OscillatorNode && v.freqEnd !== undefined) src.frequency.exponentialRampToValueAtTime(v.freqEnd, t0 + dur);
    chain(src, gain, v.lowpass, v.highpass);
    gain.connect(master);
    startSource(src, t0);
    src.stop(t0 + dur + 0.05);
  }

  function playRecipe(recipe: SfxRecipe): void {
    const now = ctx.currentTime + 0.01;
    for (const v of recipe.voices) playVoice(v, now);
  }

  function startAmbience(recipe: AmbienceRecipe): AmbienceHandle {
    const gain = ctx.createGain();
    const fade = CINEMATIC.audio.ambienceFadeMs / 1000;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(1, ctx.currentTime + fade);
    gain.connect(master);
    const sources: AudioScheduledSourceNode[] = [];
    recipe.layers.forEach((layer: AmbienceLayer) => {
      const lg = ctx.createGain();
      lg.gain.value = layer.volume;
      lg.connect(gain);
      const src = makeSource(layer.wave, layer.freq ?? 50, true);
      chain(src, lg, layer.lowpass, layer.highpass);
      startSource(src, ctx.currentTime);
      sources.push(src);
    });
    const timers = (recipe.pulses ?? []).map((p) =>
      window.setInterval(() => {
        const r = SFX[p.sfx];
        if (r) playRecipe(r);
      }, p.everyMs)
    );
    return { gain, sources, timers };
  }

  function stopAmbience(handle: AmbienceHandle, fadeMs: number): void {
    for (const t of handle.timers) window.clearInterval(t);
    const now = ctx.currentTime;
    handle.gain.gain.cancelScheduledValues(now);
    handle.gain.gain.setValueAtTime(Math.max(0.0001, handle.gain.gain.value), now);
    handle.gain.gain.linearRampToValueAtTime(0.0001, now + fadeMs / 1000);
    for (const s of handle.sources) s.stop(now + fadeMs / 1000 + 0.05);
  }

  return {
    playSfx(id) {
      const r = SFX[id];
      if (r) playRecipe(r);
    },
    blip(hz, cfg) {
      playVoice({ wave: cfg.wave, freq: hz, startMs: 0, durationMs: cfg.durationMs, volume: cfg.volume, attackMs: 2, lowpass: 3200 }, ctx.currentTime + 0.005);
    },
    setAmbience(id) {
      if (ambience) stopAmbience(ambience, CINEMATIC.audio.ambienceFadeMs);
      ambience = null;
      const recipe = id === null ? undefined : AMBIENCES[id];
      if (recipe) ambience = startAmbience(recipe);
    },
    dispose() {
      if (ambience) stopAmbience(ambience, 500);
      ambience = null;
    }
  };
}
