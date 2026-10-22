import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { createRocketSound } from "./mascot-sound.ts";

/**
 * A minimal stand-in for the Web Audio API (Node has none): it records contexts, resumes and
 * every node started, which is what the engine's gating decides.
 */
const fake = {
  contexts: 0,
  resumes: 0,
  started: 0,
  /** The browser refuses to start the context (no gesture yet, or Safari outside one). */
  blocked: false,
  last: null as null | { state: AudioContextState },
  /** Every setValueCurveAtTime call: points, start and duration. */
  curves: [] as { points: number; start: number; duration: number }[],
};

const param = () => ({
  value: 0,
  setValueAtTime() {},
  linearRampToValueAtTime() {},
  exponentialRampToValueAtTime() {},
  setValueCurveAtTime(values: Float32Array, start: number, duration: number) {
    fake.curves.push({ points: values.length, start, duration });
  },
  cancelScheduledValues() {},
});
const node = (extra: object = {}) => ({
  connect: (next: unknown) => next,
  start: () => void fake.started++,
  stop() {},
  onended: null,
  ...extra,
});

class FakeContext {
  sampleRate = 8000;
  currentTime = 0;
  destination = node();
  state: AudioContextState = fake.blocked ? "suspended" : "running";
  constructor() {
    fake.contexts++;
    fake.last = this;
  }
  resume() {
    fake.resumes++;
    if (!fake.blocked) this.state = "running";
    return Promise.resolve();
  }
  suspend() {
    this.state = "suspended";
    return Promise.resolve();
  }
  close() {
    return Promise.resolve();
  }
  createGain() {
    return node({ gain: param() });
  }
  createBuffer(_: number, length: number) {
    return { getChannelData: () => new Float32Array(length) };
  }
  createBufferSource() {
    return node({ buffer: null, loop: false });
  }
}

Object.assign(globalThis, {
  AudioContext: FakeContext,
  GainNode: class { constructor() { return node({ gain: param() }); } },
  BiquadFilterNode: class { constructor() { return node({ frequency: param() }); } },
  OscillatorNode: class { constructor() { return node({ frequency: param() }); } },
  StereoPannerNode: class { constructor() { return node({ pan: param() }); } },
});

const CURVES = { gain: [0.5, 1], pan: [0.8, 0], cutoff: [400, 3000] };

beforeEach(() => {
  Object.assign(fake, { contexts: 0, resumes: 0, started: 0, blocked: false, last: null, curves: [] });
});

test("nothing is created or scheduled before the sound is unlocked", () => {
  const sound = createRocketSound();
  sound.ignite();
  sound.cruise(CURVES, 7.5);
  sound.touchdown();
  assert.deepEqual([fake.contexts, fake.started], [0, 0]);
});

test("unlocking creates the context and resumes it, inside the visitor's gesture", () => {
  const sound = createRocketSound();
  sound.unlock();
  assert.equal(fake.contexts, 1);
  assert.ok(fake.resumes >= 1);
  sound.unlock();
  assert.equal(fake.contexts, 1, "a second unlock reuses the context");
});

test("a context that is not running schedules nothing, so nodes never pile up", () => {
  fake.blocked = true;
  const sound = createRocketSound();
  sound.unlock();
  const before = fake.started;
  sound.ignite();
  sound.cruise(CURVES, 7.5);
  assert.equal(fake.started, before);
});

test("a running context plays the ignition and the cruise", () => {
  const sound = createRocketSound();
  sound.unlock();
  const before = fake.started;
  sound.ignite();
  assert.equal(fake.started - before, 2, "noise burst + thump");
  sound.cruise(CURVES, 7.5);
  assert.equal(fake.started - before, 4, "+ roar + flutter");
});

test("the context rests shortly after touchdown instead of rendering silence until the next flight", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const sound = createRocketSound();
  sound.unlock();
  sound.touchdown();
  assert.equal(fake.last?.state, "running", "the thud still plays");
  t.mock.timers.tick(1000);
  assert.equal(fake.last?.state, "suspended");
});

test("waking before the next flight resumes a resting context", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const sound = createRocketSound();
  sound.unlock();
  sound.rest();
  assert.equal(fake.last?.state, "suspended");
  sound.wake();
  assert.equal(fake.last?.state, "running");
});

test("coming back to the tab between flights leaves a resting context asleep", () => {
  const sound = createRocketSound();
  sound.unlock();
  sound.rest();
  sound.resume();
  assert.equal(fake.last?.state, "suspended");
});

test("coming back to the tab mid-flight resumes the roar", () => {
  const sound = createRocketSound();
  sound.unlock();
  sound.cruise(CURVES, 7.5);
  sound.suspend();
  sound.resume();
  assert.equal(fake.last?.state, "running");
});

test("the roar's loudness follows the path in step with its pan and brightness", () => {
  const sound = createRocketSound();
  sound.unlock();
  sound.cruise({ gain: [0.5, 1, 0.4], pan: [0.8, 0, -0.8], cutoff: [400, 3000, 900] }, 7.5);
  const ends = fake.curves.map((c) => c.start + c.duration);
  assert.equal(fake.curves.length, 3);
  assert.ok(fake.curves.every((c) => c.points === 3), "one point per keyframe on every curve");
  assert.ok(ends.every((e) => Math.abs(e - ends[0]) < 1e-9), "all curves end together");
});
