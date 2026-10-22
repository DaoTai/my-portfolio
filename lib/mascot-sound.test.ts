import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { createRocketSound } from "./mascot-sound.ts";

/**
 * A minimal stand-in for the Web Audio API (Node has none): it records contexts, resumes and
 * every node started, which is what the engine's gating decides.
 */
const fake = { contexts: 0, resumes: 0, started: 0, state: "running" as AudioContextState };

const param = () => ({
  value: 0,
  setValueAtTime() {},
  linearRampToValueAtTime() {},
  exponentialRampToValueAtTime() {},
  setValueCurveAtTime() {},
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
  state = fake.state;
  constructor() {
    fake.contexts++;
  }
  resume() {
    fake.resumes++;
    return Promise.resolve();
  }
  suspend() {
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
  Object.assign(fake, { contexts: 0, resumes: 0, started: 0, state: "running" });
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
  fake.state = "suspended";
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
