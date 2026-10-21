/**
 * The mascot's poses, one per mode. Angles are in degrees from the rest pose the art is drawn in
 * (arms hanging straight down, legs straight):
 *
 * - shoulder: + swings the arm out to its side, − across the body (in the screen plane)
 * - elbow:    the forearm's angle on top of the shoulder's, same direction
 * - hip:      + swings the thigh forward, toward the viewer (in 3D)
 * - knee:     + folds the shin back (in 3D)
 *
 * `tablet`, `rockets`, `throttle` and `dance` run 0 → 1; `ms` is how long blending into the pose
 * takes; `grounded` poses drop the body so the feet stay on the floor as the knees bend.
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
  rockets: number;
  throttle: number;
  dance: number;
  ms: number;
  grounded: boolean;
};

export type MascotMode = "idle" | FlightPhase;

/** Left hand holding the tablet up, right arm raised with the finger at the bubble. */
const ARMS_IDLE = { shoulderL: -8.5, elbowL: 63, shoulderR: 43, elbowR: 119 };
/** Both hands meeting in front of the chest. */
const ARMS_TOGETHER = { shoulderL: -9.6, elbowL: -80.6, shoulderR: 63.9, elbowR: -142.7 };
const LEGS_STRAIGHT = { hipL: 0, kneeL: 0, hipR: 0, kneeR: 0 };

const IDLE: Pose = {
  ...ARMS_IDLE,
  ...LEGS_STRAIGHT,
  tablet: 1,
  rockets: 0,
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
  // Hands together, knees loaded for the jump, rockets fading in and sputtering.
  ready: {
    ...ARMS_TOGETHER,
    hipL: 22,
    kneeL: 44,
    hipR: 22,
    kneeR: 44,
    tablet: 0,
    rockets: 1,
    throttle: 0.3,
    dance: 0,
    ms: 550,
    grounded: true,
  },
  // The jump: legs push straight.
  launch: {
    ...ARMS_TOGETHER,
    ...LEGS_STRAIGHT,
    tablet: 0,
    rockets: 1,
    throttle: 0.6,
    dance: 0,
    ms: 260,
    grounded: true,
  },
  // Arms straight and spread a little like fins, legs tucked up, full thrust.
  fly: {
    shoulderL: 22,
    elbowL: 0,
    shoulderR: 22,
    elbowR: 0,
    hipL: 24,
    kneeL: 82,
    hipR: 18,
    kneeR: 74,
    tablet: 0,
    rockets: 1,
    throttle: 1,
    dance: 0,
    ms: 500,
    grounded: false,
  },
  // Coming in: arms close in, the tablet comes back out, legs reach for the floor.
  approach: {
    shoulderL: 10,
    elbowL: 40,
    shoulderR: 10,
    elbowR: -10,
    hipL: 6,
    kneeL: 10,
    hipR: 6,
    kneeR: 10,
    tablet: 1,
    rockets: 1,
    throttle: 0.4,
    dance: 0,
    ms: 700,
    grounded: false,
  },
  // Touchdown: knees give and hold, rockets off.
  land: {
    ...ARMS_IDLE,
    hipL: 35,
    kneeL: 70,
    hipR: 35,
    kneeR: 70,
    tablet: 1,
    rockets: 0,
    throttle: 0,
    dance: 0,
    ms: 220,
    grounded: true,
  },
  // Stands back up, slowly.
  recover: { ...IDLE, dance: 0, ms: 600 },
};
