import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildSoundCurves,
  readSoundPref,
  writeSoundPref,
} from "./mascot-sound-curves.ts";

/** A hand-made path: out to the far left (x = -400 of 400), closest at the second sample. */
const PATH = {
  x: [0, -100, -300, -400, -400],
  y: [0, 0, 0, 0, 0],
  scale: [1, 1.25, 1, 0.5, 1],
};
const r3 = (values: number[]) => values.map((v) => Math.round(v * 1000) / 1000);

test("pan follows the screen position: right at home, far left at the turn", () => {
  assert.deepEqual(r3(buildSoundCurves(PATH, 400).pan), [0.8, 0.4, -0.4, -0.8, -0.8]);
});

test("pan never goes past ±0.85, even beyond the travel box", () => {
  const { pan } = buildSoundCurves({ x: [0, -900], y: [0, 0], scale: [1, 1] }, 400);
  assert.equal(pan[1], -0.85);
});

test("brightness rises with speed: 400 Hz at rest, 3 kHz at top speed", () => {
  // Speeds 100, 150, 150, 50, 0 → normalised 2/3, 1, 1, 1/3, 0.
  assert.deepEqual(
    r3(buildSoundCurves(PATH, 400).cutoff),
    [2133.333, 3000, 3000, 1266.667, 400],
  );
});

test("loudness rises with speed and closeness, never above 1", () => {
  assert.deepEqual(
    r3(buildSoundCurves(PATH, 400).gain),
    [0.627, 1, 0.8, 0.317, 0.28],
  );
});

test("pref defaults to on, and a stored value round-trips", () => {
  assert.equal(readSoundPref(undefined), "on");
  const store = new Map<string, string>();
  const storage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
  };
  writeSoundPref(storage, "off");
  assert.equal(store.get("mascot-sound"), "off");
  assert.equal(readSoundPref(storage), "off");
});

test("pref ignores junk values and survives a storage that throws", () => {
  assert.equal(readSoundPref({ getItem: () => "loud" }), "on");
  const denied = () => {
    throw new Error("denied");
  };
  assert.equal(readSoundPref({ getItem: denied }), "on");
  assert.doesNotThrow(() => writeSoundPref({ setItem: denied }, "off"));
});
