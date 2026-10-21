/**
 * How the rocket sound follows the flight: louder and brighter the faster and closer the mascot
 * is, panned with its position on screen. Also the saved on/off preference for the sound.
 */
import type { FlightKeyframes } from "./mascot-flight";

export type SoundCurves = { gain: number[]; pan: number[]; cutoff: number[] };
export type SoundPref = "on" | "off";

const KEY = "mascot-sound";
/** Home sits at the bottom right, so the flight starts panned right. */
const HOME_PAN = 0.8;
const MAX_PAN = 0.85;
const MIN_CUTOFF = 400;
const CUTOFF_RANGE = 2600;

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

/** Distance flown per sample around each keyframe, as a fraction of the fastest. */
const speedNorm = (x: number[], y: number[]) => {
  const last = x.length - 1;
  const speed = x.map((_, i) => {
    const a = Math.max(i - 1, 0);
    const b = Math.min(i + 1, last);
    return Math.hypot(x[b] - x[a], y[b] - y[a]) / Math.max(b - a, 1);
  });
  const top = Math.max(1e-9, ...speed);
  return speed.map((s) => s / top);
};

export const buildSoundCurves = (
  path: Pick<FlightKeyframes, "x" | "y" | "scale">,
  travelX: number,
): SoundCurves => {
  const norm = speedNorm(path.x, path.y);
  return {
    gain: norm.map(
      (n, i) => ((0.35 + 0.65 * n) * clamp(path.scale[i], 0.7, 1.25)) / 1.25,
    ),
    pan: path.x.map((x) =>
      clamp(HOME_PAN + (1.6 * x) / Math.max(travelX, 1), -MAX_PAN, MAX_PAN),
    ),
    cutoff: norm.map((n) => MIN_CUTOFF + CUTOFF_RANGE * n),
  };
};

/** Storage can be missing or throw (private mode, blocked site data): the sound stays on. */
export const readSoundPref = (
  storage: Pick<Storage, "getItem"> | undefined,
): SoundPref => {
  try {
    return storage?.getItem(KEY) === "off" ? "off" : "on";
  } catch {
    return "on";
  }
};

export const writeSoundPref = (
  storage: Pick<Storage, "setItem"> | undefined,
  value: SoundPref,
) => {
  try {
    storage?.setItem(KEY, value);
  } catch {
    // Not saved; the choice still holds for this visit.
  }
};
