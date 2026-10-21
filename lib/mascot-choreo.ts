/**
 * The mascot's flight, phase by phase: it puts the tablet away, crouches with its rockets on,
 * jumps, flies, takes the tablet back out on the way in, lands on bent knees and stands up.
 */

export type FlightPhase =
  | "stow"
  | "ready"
  | "launch"
  | "fly"
  | "approach"
  | "land"
  | "recover";

/** Length (ms) of every phase but `fly`, which fills the flight path up to `approach`. */
export const PHASE_MS = {
  stow: 700,
  ready: 650,
  launch: 380,
  approach: 900,
  land: 1400,
  recover: 600,
} as const;

export type Cue = { mode: FlightPhase; at: number; ms: number };

const ORDER: readonly FlightPhase[] = [
  "stow",
  "ready",
  "launch",
  "fly",
  "approach",
  "land",
  "recover",
];

/** The phases back to back from 0; the flight path runs through `fly` and `approach`. */
export const buildTimeline = (flightMs: number): Cue[] => {
  let at = 0;
  return ORDER.map((mode) => {
    const ms = mode === "fly" ? flightMs - PHASE_MS.approach : PHASE_MS[mode];
    const cue = { mode, at, ms };
    at += ms;
    return cue;
  });
};

/** When the flight path starts and ends: from take-off to touchdown. */
export const flightWindow = (timeline: Cue[]) => {
  const at = (mode: FlightPhase) =>
    timeline.find((c) => c.mode === mode)?.at ?? 0;
  return { start: at("fly"), end: at("land") };
};
