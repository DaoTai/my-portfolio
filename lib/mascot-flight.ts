/**
 * Keyframes for the mascot's rocket flight: a smooth loop out from its home corner and back.
 * Positions are offsets in px from home (it lives bottom-right, so it only travels left and up).
 */

type Point = readonly [x: number, y: number, depth: number];

/**
 * Waypoints as fractions of the available travel (x of the left travel, y of the up travel)
 * plus a depth scale: below 1 reads as farther away, above 1 as closer to the viewer.
 */
const WAYPOINTS: readonly Point[] = [
  [0, 0, 1],
  [-0.05, -0.5, 1.05],
  [-0.45, -0.95, 0.85],
  [-0.9, -0.65, 0.7],
  [-0.6, -0.15, 0.95],
  [-0.25, -0.6, 1.25],
  [-0.05, -0.35, 1.1],
  [0, 0, 1],
];

/**
 * Keeps the body upright at low horizontal speed (as a fraction of the top speed): the smaller
 * it is, the sooner the mascot tips over to fly flat, head first.
 */
const UPRIGHT_BIAS = 0.12;
/** Fraction of the flight at each end spent straightening up for take-off and landing. */
const TAPER = 0.1;
/** Samples averaged on each side of the tilt, so swinging over at a turn takes ~0.4s. */
const TILT_SMOOTHING = 3;
/** Roll (deg) around its spine at full speed, so it cruises in a three-quarter view. */
const CRUISE_ROLL = 30;
/** Extra roll (deg) leaning into the tightest curve, like a plane banking. */
const MAX_BANK = 36;
/** Roll stays within this (deg) outside the barrel roll, so the front stays readable. */
const MAX_ROLL = 62;
/** Nod (deg) toward the viewer while coming closest, away while receding. */
const MAX_PITCH = 26;
/** Samples on each side of the far turn spent on the barrel roll (~0.9s in all). */
const BARREL_HALF = 4;

export type FlightKeyframes = {
  x: number[];
  y: number[];
  scale: number[];
  /** Screen-plane tilt: the head points along the direction of travel. */
  rotate: number[];
  /** Turn (deg) around its own spine: banking, and one full barrel roll at the far turn. */
  roll: number[];
  /** Nod (deg) of the head away from the viewer; negative tips it toward them. */
  pitch: number[];
  /** Height above home's ground line, 0 → 1 of the up travel. */
  altitude: number[];
  times: number[];
};

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

const smoothstep = (t: number) => {
  const c = clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
};

/** 0 at both ends of the flight, 1 in between, so it leaves and lands upright and facing front. */
const taper = (t: number) => smoothstep(Math.min(t, 1 - t) / TAPER);

const round = (v: number, places = 1) => {
  const k = 10 ** places;
  return Math.round(v * k) / k || 0;
};

/** Moving average over `radius` samples on each side. */
const smooth = (values: number[], radius: number) =>
  values.map((_, i) => {
    const span = values.slice(Math.max(i - radius, 0), i + radius + 1);
    return span.reduce((a, b) => a + b, 0) / span.length;
  });

/** Central difference of each sample, per unit of flight time. */
const derivative = (values: number[]) => {
  const last = values.length - 1;
  return values.map((_, i) => {
    const a = Math.max(i - 1, 0);
    const b = Math.min(i + 1, last);
    return (values[b] - values[a]) / ((b - a) / last);
  });
};

/** Scales values so the largest magnitude is 1. */
const normalise = (values: number[]) => {
  const peak = Math.max(1e-9, ...values.map(Math.abs));
  return values.map((v) => v / peak);
};

const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

const catmullRom = (
  p0: number,
  p1: number,
  p2: number,
  p3: number,
  t: number,
) => {
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
  );
};

/** Point on the spline through the waypoints, u in [0, 1]. */
const sample = (u: number): Point => {
  const n = WAYPOINTS.length - 1;
  const g = clamp(u, 0, 1) * n;
  const i = Math.min(Math.floor(g), n - 1);
  const t = g - i;
  const p = (k: number) => WAYPOINTS[clamp(k, 0, n)];
  const [a, b, c, d] = [p(i - 1), p(i), p(i + 1), p(i + 2)];
  return [0, 1, 2].map((axis) =>
    catmullRom(a[axis], b[axis], c[axis], d[axis], t),
  ) as unknown as Point;
};

/**
 * Samples the loop into keyframes for a linear-eased animation. The easing is baked into the
 * spacing of the samples, so the flight eases in and out without stopping at each waypoint.
 */
export const buildFlightPath = (
  travelX: number,
  travelY: number,
  samples = 64,
): FlightKeyframes => {
  const x: number[] = [];
  const y: number[] = [];
  const scale: number[] = [];
  const altitude: number[] = [];
  const times: number[] = [];

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const [sx, sy, depth] = sample(easeInOutSine(t));
    // The spline overshoots a little near home; past it the mascot would leave the screen.
    const px = clamp(sx, -1, 0);
    const py = clamp(sy, -1, 0);
    x.push(round(px * travelX));
    y.push(round(py * travelY));
    scale.push(round(depth, 3));
    altitude.push(round(-py, 3));
    times.push(t);
  }

  // Screen-space velocity and acceleration (px per unit of flight time).
  const vx = derivative(x);
  const vy = derivative(y);
  const ax = derivative(vx);
  const ay = derivative(vy);
  const speed = vx.map((v, i) => Math.hypot(v, vy[i]));
  const topSpeed = Math.max(1, ...speed);
  const w = times.map(taper);

  // Head along the heading, like a superhero: climbing tips it toward the climb, level or
  // descending flight lays it flat, and the bias keeps it upright when barely moving sideways.
  const tilt = vx.map((v, i) => {
    const climb = Math.max(-vy[i], 0);
    return (Math.atan2(v, climb + UPRIGHT_BIAS * topSpeed) * 180) / Math.PI;
  });
  const rotate = smooth(tilt, TILT_SMOOTHING).map((r, i) => round(r * w[i]));

  // Bank into curves (sideways acceleration), on top of a three-quarter cruise.
  const lateral = normalise(
    vx.map(
      (v, i) =>
        (v * ay[i] - vy[i] * ax[i]) / Math.max(speed[i], 0.05 * topSpeed),
    ),
  );
  const bank = smooth(
    lateral.map((l, i) =>
      clamp(
        CRUISE_ROLL * (speed[i] / topSpeed) - MAX_BANK * l,
        -MAX_ROLL,
        MAX_ROLL,
      ),
    ),
    TILT_SMOOTHING,
  );
  // One full turn around its spine at the far end of the loop, where it swings round.
  const turn = x.indexOf(Math.min(...x));
  const roll = bank.map((b, i) =>
    round(
      b * w[i] + 360 * smoothstep((i - turn + BARREL_HALF) / (2 * BARREL_HALF)),
    ),
  );

  // Coming closer tips the head toward the viewer; receding tips it away.
  const approach = normalise(derivative(scale));
  const pitch = smooth(approach, TILT_SMOOTHING).map((a, i) =>
    round(-MAX_PITCH * a * w[i]),
  );

  return { x, y, scale, rotate, roll, pitch, altitude, times };
};
