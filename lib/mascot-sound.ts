/**
 * The mascot's rocket sounds, synthesised with Web Audio (no audio files): an ignition burst,
 * a cruise roar that follows the flight's curves, a throttle-down on the way in and a touchdown
 * thud. Nothing plays until `unlock()` runs inside a visitor's gesture: it creates the
 * AudioContext there, because Safari only lets a context start during the gesture itself.
 */
import type { SoundCurves } from "./mascot-sound-curves";

export type RocketSoundControls = {
  ignite: () => void;
  cruise: (curves: SoundCurves, seconds: number) => void;
  throttleDown: (ms: number) => void;
  touchdown: () => void;
  stop: () => void;
};

export type RocketSound = RocketSoundControls & {
  /** Creates and starts the context; call from a pointer, key or touch handler. */
  unlock: () => void;
  suspend: () => void;
  resume: () => void;
  dispose: () => void;
};

const MASTER_GAIN = 0.22;
/** Throttle while coming in to land, as a fraction of cruise. */
const APPROACH_THROTTLE = 0.3;
/** Brightness flutter of the roar: rate (Hz) and depth (Hz). */
const FLUTTER = [7, 180] as const;

type Cruise = { source: AudioBufferSourceNode; lfo: OscillatorNode; throttle: GainNode };

export const createRocketSound = (): RocketSound => {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let noise: AudioBuffer | null = null;
  let cruising: Cruise | null = null;
  const voices = new Set<AudioScheduledSourceNode>();

  const unlock = () => {
    if (!ctx) {
      ctx = new AudioContext();
      master = ctx.createGain();
      master.gain.value = MASTER_GAIN;
      master.connect(ctx.destination);
      // Two seconds of white noise, looped for the roar and sliced for the bursts.
      noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const data = noise.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    void ctx.resume();
    // A silent blip started during the gesture is what finally unlocks iOS.
    const blip = ctx.createBufferSource();
    blip.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
    blip.connect(ctx.destination);
    blip.start();
  };

  /**
   * The running context, or null: before unlock, while the tab is hidden, or when the browser
   * keeps it suspended. Scheduling into a stopped clock would leave nodes that never end.
   */
  const audio = () =>
    ctx?.state === "running" ? { ctx, master: master!, noise: noise! } : null;

  /** Starts a source and forgets it once it ends, so finished nodes are released. */
  const play = <T extends AudioScheduledSourceNode>(node: T, at: number, end?: number) => {
    voices.add(node);
    node.onended = () => voices.delete(node);
    node.start(at);
    if (end !== undefined) node.stop(end);
    return node;
  };

  const noiseBurst = (filterType: BiquadFilterType, freq: number, peak: number, length: number) => {
    const a = audio();
    if (!a) return;
    const { ctx, master, noise } = a;
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const filter = new BiquadFilterNode(ctx, { type: filterType, frequency: freq, Q: 0.8 });
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(peak, now + 0.02);
    env.gain.exponentialRampToValueAtTime(0.001, now + length);
    src.connect(filter).connect(env).connect(master);
    play(src, now, now + length + 0.05);
  };

  const thump = (from: number, to: number, peak: number, length: number) => {
    const a = audio();
    if (!a) return;
    const { ctx, master } = a;
    const now = ctx.currentTime;
    const osc = new OscillatorNode(ctx, { type: "sine", frequency: from });
    osc.frequency.exponentialRampToValueAtTime(to, now + length);
    const env = ctx.createGain();
    env.gain.setValueAtTime(peak, now);
    env.gain.exponentialRampToValueAtTime(0.001, now + length);
    osc.connect(env).connect(master);
    play(osc, now, now + length + 0.05);
  };

  const endCruise = (fade: number) => {
    if (!cruising || !ctx) return;
    const { source, lfo, throttle } = cruising;
    const now = ctx.currentTime;
    throttle.gain.cancelScheduledValues(now);
    throttle.gain.setValueAtTime(throttle.gain.value, now);
    throttle.gain.linearRampToValueAtTime(0, now + fade);
    source.stop(now + fade + 0.02);
    lfo.stop(now + fade + 0.02);
    cruising = null;
  };

  const stop = () => {
    endCruise(0.08);
    if (!ctx) return;
    const end = ctx.currentTime + 0.1;
    voices.forEach((v) => {
      try {
        v.stop(end);
      } catch {
        // Already stopped.
      }
    });
  };

  return {
    ignite: () => {
      noiseBurst("bandpass", 1200, 0.8, 0.35);
      thump(90, 40, 0.9, 0.25);
    },

    cruise: (curves, seconds) => {
      endCruise(0.05);
      const a = audio();
      if (!a) return;
      const { ctx, master, noise } = a;
      const now = ctx.currentTime;
      const source = ctx.createBufferSource();
      source.buffer = noise;
      source.loop = true;
      const filter = new BiquadFilterNode(ctx, { type: "lowpass", Q: 1.2 });
      // Starting from silence avoids a click; the curves then run the whole flight.
      filter.frequency.setValueCurveAtTime(Float32Array.from(curves.cutoff), now, seconds);
      const body = ctx.createGain();
      body.gain.setValueCurveAtTime(Float32Array.from([0, ...curves.gain]), now, seconds);
      const throttle = ctx.createGain();
      const panner = new StereoPannerNode(ctx);
      panner.pan.setValueCurveAtTime(Float32Array.from(curves.pan), now, seconds);
      const lfo = new OscillatorNode(ctx, { frequency: FLUTTER[0] });
      const depth = new GainNode(ctx, { gain: FLUTTER[1] });
      lfo.connect(depth).connect(filter.frequency);
      source.connect(filter).connect(body).connect(throttle).connect(panner).connect(master);
      play(source, now);
      play(lfo, now);
      cruising = { source, lfo, throttle };
    },

    throttleDown: (ms) => {
      if (!cruising || !ctx) return;
      const now = ctx.currentTime;
      cruising.throttle.gain.setValueAtTime(1, now);
      cruising.throttle.gain.linearRampToValueAtTime(APPROACH_THROTTLE, now + ms / 1000);
    },

    touchdown: () => {
      endCruise(0.25);
      thump(110, 45, 1, 0.18);
      noiseBurst("lowpass", 800, 0.5, 0.06);
    },

    stop,
    unlock,
    suspend: () => void ctx?.suspend(),
    resume: () => void ctx?.resume(),
    dispose: () => {
      stop();
      void ctx?.close();
      ctx = null;
      cruising = null;
    },
  };
};
