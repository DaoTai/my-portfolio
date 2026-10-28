import assert from "node:assert/strict";
import { test } from "node:test";
import { PHASE_MS } from "./mascot-choreo.ts";
import { MASCOT_ASPECT } from "./mascot-parts.ts";
import { POSES, type MascotMode } from "./mascot-poses.ts";
import { handPoint, rootDrop } from "./mascot-rig.ts";

type Point = { x: number; y: number };
/** Distance between two canvas points (% of width, % of height) in % of the width. */
const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, (a.y - b.y) / MASCOT_ASPECT);
const near = (p: Point, want: Point, tol: number) =>
  assert.ok(dist(p, want) < tol, `${JSON.stringify(p)} not within ${tol} of ${JSON.stringify(want)}`);
const px = (x: number, y: number) => ({ x: (x / 1139) * 100, y: (y / 1381) * 100 });

test("idle reproduces the original art: left hand at the tablet, right finger at the bubble", () => {
  near(handPoint("L", POSES.idle), px(285, 840), 4);
  near(handPoint("R", POSES.idle), px(940, 445), 4);
  assert.deepEqual([POSES.idle.tablet, POSES.idle.carpet, POSES.idle.dance], [1, false, 1]);
});

test("stow: the left hand reaches the jacket pocket and the tablet is away", () => {
  near(handPoint("L", POSES.stow), px(474, 840), 5);
  assert.equal(POSES.stow.tablet, 0);
});

const RIDING = ["ready", "launch", "fly", "approach", "land"] as const;

test("riding: kneels on the carpet from the run-up to touchdown, tablet away", () => {
  for (const m of RIDING) {
    const p = POSES[m];
    assert.equal(p.carpet, true, m);
    assert.equal(p.tablet, 0, m);
    // The carpet is its floor: the body drops so the folded legs rest on it.
    assert.equal(p.grounded, true, m);
    assert.ok(rootDrop(p) > 8, `${m} drop ${rootDrop(p)}`);
    for (const s of ["L", "R"] as const) {
      // Thighs near upright, shins folded well back toward the carpet.
      assert.ok(p[`hip${s}`] <= 40, `${m} hip${s}`);
      assert.ok(p[`knee${s}`] - p[`hip${s}`] >= 55, `${m} shin${s}`);
    }
  }
});

test("riding: the left hand holds the carpet's rim, low and out to its side", () => {
  for (const m of RIDING) {
    const h = handPoint("L", POSES[m]);
    const drop = rootDrop(POSES[m]);
    assert.ok(h.y + drop > 72, `${m} hand y ${h.y + drop}`);
    assert.ok(h.x < 35, `${m} hand x ${h.x}`);
  }
});

test("in the air the right hand points the way: out and above the shoulder", () => {
  for (const m of ["launch", "fly"] as const) {
    const h = handPoint("R", POSES[m]);
    assert.ok(h.x > 85, `${m} hand x ${h.x}`);
    assert.ok(h.y < px(0, 640).y, `${m} hand y ${h.y}`);
  }
  // Lower on the way in, toward the landing spot.
  assert.ok(handPoint("R", POSES.approach).y > handPoint("R", POSES.fly).y);
  assert.deepEqual([POSES.fly.throttle, POSES.fly.dance], [1, 0]);
});

test("land: throttle off, still on the carpet; recover stands up and lets it go", () => {
  assert.equal(POSES.land.throttle, 0);
  assert.equal(POSES.recover.carpet, false);
});

test("recover blends back to the idle stance", () => {
  const joints = ["shoulderL", "elbowL", "shoulderR", "elbowR", "hipL", "kneeL", "hipR", "kneeR"] as const;
  for (const j of joints) assert.equal(POSES.recover[j], POSES.idle[j], j);
  assert.ok(POSES.recover.ms >= 400);
});

test("every pose's blend fits inside its phase", () => {
  const timed = Object.keys(PHASE_MS) as (keyof typeof PHASE_MS)[];
  for (const m of timed) assert.ok(POSES[m as MascotMode].ms <= PHASE_MS[m], m);
});
