/**
 * The mascot's poses, one per mode. Angles are in degrees from the rest pose the art is drawn in
 * (arms hanging straight down, legs straight):
 *
 * - shoulder: + swings the arm out to its side, − across the body (in the screen plane)
 * - elbow:    the forearm's angle on top of the shoulder's, same direction
 * - hip:      + swings the thigh forward, toward the viewer (in 3D)
 * - knee:     + folds the shin back (in 3D)
 *
 * `tablet`, `throttle` and `dance` run 0 → 1; `ms` is how long blending into the pose takes;
 * `carpet` lays the bronze drum down under the knees as a flying carpet (otherwise it stands
 * behind the head); `grounded` poses drop the body so the legs stay on the floor, or the carpet.
 */
import type { FlightPhase } from "./mascot-choreo";

export type Joint =
  | "shoulderL"
  | "elbowL"
  | "shoulderR"
  | "elbowR"
  | "hipL"
  | "kneeL"
  | "hipR"
  | "kneeR";

export type Pose = Record<Joint, number> & {
  tablet: number;
  carpet: boolean;
  throttle: number;
  dance: number;
  ms: number;
  grounded: boolean;
};

export type MascotMode = "idle" | FlightPhase;

/** Left hand holding the tablet up, right arm raised with the finger at the bubble. */
const ARMS_IDLE = { shoulderL: -8.5, elbowL: 63, shoulderR: 43, elbowR: 119 };
const LEGS_STRAIGHT = { hipL: 0, kneeL: 0, hipR: 0, kneeR: 0 };
/** Kneeling lightly on the carpet: thighs near upright (the right knee a little forward), shins
 *  folded back toward it. Folded flatter, a shin's edge layers fan out into visible strips. */
const LEGS_KNEEL = { hipL: 15, kneeL: 75, hipR: 35, kneeR: 95 };
/** Left hand down at the carpet's rim, holding on. */
const HOLD_L = { shoulderL: 28, elbowL: -6 };
/** Right arm out and up, the finger pointing the way. */
const POINT_R = { shoulderR: 105, elbowR: 25 };
/** Right hand resting forward on the knee. */
const REST_R = { shoulderR: 18, elbowR: -32 };

const IDLE: Pose = {
  ...ARMS_IDLE,
  ...LEGS_STRAIGHT,
  tablet: 1,
  carpet: false,
  throttle: 0,
  dance: 1,
  ms: 400,
  grounded: true,
};

export const POSES: Record<MascotMode, Pose> = {
  idle: IDLE,
  // The left hand drops to the jacket pocket and the tablet shrinks into it.
  stow: {
    ...IDLE,
    shoulderL: 34.7,
    elbowL: -81.6,
    tablet: 0,
    dance: 0,
    ms: 600,
  },
  // The drum slides down under it as a carpet and it kneels on, holding the rim.
  ready: {
    ...HOLD_L,
    ...REST_R,
    ...LEGS_KNEEL,
    tablet: 0,
    carpet: true,
    throttle: 0.3,
    dance: 0,
    ms: 550,
    grounded: true,
  },
  // Lift-off: the free hand points the way.
  launch: {
    ...HOLD_L,
    ...POINT_R,
    ...LEGS_KNEEL,
    tablet: 0,
    carpet: true,
    throttle: 0.6,
    dance: 0,
    ms: 300,
    grounded: true,
  },
  // Riding the carpet: still kneeling, one hand on the rim, the other pointing ahead.
  fly: {
    ...HOLD_L,
    ...POINT_R,
    ...LEGS_KNEEL,
    tablet: 0,
    carpet: true,
    throttle: 1,
    dance: 0,
    ms: 400,
    grounded: true,
  },
  // Coming in: the pointing arm lowers toward the landing spot.
  approach: {
    ...HOLD_L,
    shoulderR: 62,
    elbowR: 12,
    ...LEGS_KNEEL,
    tablet: 0,
    carpet: true,
    throttle: 0.4,
    dance: 0,
    ms: 600,
    grounded: true,
  },
  // Touchdown: the carpet settles, hand back on the knee.
  land: {
    ...HOLD_L,
    ...REST_R,
    ...LEGS_KNEEL,
    tablet: 0,
    carpet: true,
    throttle: 0,
    dance: 0,
    ms: 220,
    grounded: true,
  },
  // Stands back up, slowly, takes the tablet out; the drum rises back behind the head.
  recover: { ...IDLE, dance: 0, ms: 600 },
};
