/**
 * Geometry of the mascot's rig: which slice hangs from which, where each sits inside its parent,
 * where the hands end up for a pose, and how far the body must drop to keep the feet down.
 */
import { MASCOT_ASPECT, MASCOT_PARTS, type MascotPartName } from "./mascot-parts.ts";
import type { Pose } from "./mascot-poses";

type Box = { left: number; top: number; width: number; height: number };
type Vec = { x: number; y: number };
type Side = "L" | "R";

const NAMES = Object.keys(MASCOT_PARTS) as MascotPartName[];

export const childrenOf = (parent: MascotPartName | null): MascotPartName[] =>
  NAMES.filter((name) => MASCOT_PARTS[name].parent === parent);

/** The part's box in % of its parent's box, or of the canvas for a root. */
export const relativeBox = (name: MascotPartName): Box => {
  const { box, parent } = MASCOT_PARTS[name];
  if (!parent) return box;
  const p = MASCOT_PARTS[parent].box;
  return {
    left: ((box.left - p.left) / p.width) * 100,
    top: ((box.top - p.top) / p.height) * 100,
    width: (box.width / p.width) * 100,
    height: (box.height / p.height) * 100,
  };
};

/** A point of a part in canvas width units (x and y on the same scale). */
const canvasPoint = (name: MascotPartName, at: Vec): Vec => {
  const { box } = MASCOT_PARTS[name];
  return {
    x: (box.left + (at.x / 100) * box.width) / 100,
    y: (box.top + (at.y / 100) * box.height) / 100 / MASCOT_ASPECT,
  };
};

const pivot = (name: MascotPartName) => canvasPoint(name, MASCOT_PARTS[name].origin);

/** CSS `rotate()`: positive turns clockwise on screen. */
const rotate = (v: Vec, deg: number): Vec => {
  const r = (deg * Math.PI) / 180;
  return { x: v.x * Math.cos(r) - v.y * Math.sin(r), y: v.x * Math.sin(r) + v.y * Math.cos(r) };
};

const sub = (a: Vec, b: Vec): Vec => ({ x: a.x - b.x, y: a.y - b.y });

/**
 * Where a hand lands for a pose, in canvas % (x of the width, y of the height). The left arm
 * turns with `rotate(+angle)`, the right one mirrored with `rotate(-angle)`.
 */
export const handPoint = (side: Side, pose: Pose): Vec => {
  const sign = side === "L" ? 1 : -1;
  const shoulder = pivot(`upperArm${side}`);
  const elbow = pivot(`forearm${side}`);
  const hand = canvasPoint(`forearm${side}`, MASCOT_PARTS[`forearm${side}`].anchors.hand);
  const upper = rotate(sub(elbow, shoulder), sign * pose[`shoulder${side}`]);
  const lower = rotate(sub(hand, elbow), sign * (pose[`shoulder${side}`] + pose[`elbow${side}`]));
  return {
    x: (shoulder.x + upper.x + lower.x) * 100,
    y: (shoulder.y + upper.y + lower.y) * 100 * MASCOT_ASPECT,
  };
};

const length = (v: Vec) => Math.hypot(v.x, v.y);

/** How much a leg's height shrinks as its hip and knee bend, in canvas width units. */
const legRise = (side: Side, pose: Pose) => {
  const hip = pivot(`thigh${side}`);
  const knee = pivot(`shin${side}`);
  const sole = canvasPoint(`shin${side}`, MASCOT_PARTS[`shin${side}`].anchors.sole);
  const thigh = length(sub(knee, hip));
  const shin = length(sub(sole, knee));
  const h = (pose[`hip${side}`] * Math.PI) / 180;
  const k = (pose[`knee${side}`] * Math.PI) / 180;
  return thigh + shin - (thigh * Math.cos(h) + shin * Math.cos(k - h));
};

/**
 * How far (% of the canvas height) the body drops so the feet stay on the floor; the more bent
 * leg decides. In the air the legs simply tuck up.
 */
export const rootDrop = (pose: Pose): number =>
  pose.grounded ? Math.max(legRise("L", pose), legRise("R", pose)) * 100 * MASCOT_ASPECT : 0;
