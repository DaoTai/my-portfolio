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
  assert.deepEqual([POSES.idle.tablet, POSES.idle.rockets, POSES.idle.dance], [1, 0, 1]);
});

test("stow: the left hand reaches the jacket pocket and the tablet is away", () => {
  near(handPoint("L", POSES.stow), px(474, 840), 5);
  assert.equal(POSES.stow.tablet, 0);
});

test("ready: hands meet at the chest, knees loaded, rockets in", () => {
  const l = handPoint("L", POSES.ready);
  const r = handPoint("R", POSES.ready);
  assert.ok(dist(l, r) < 8, `hands ${dist(l, r)} apart`);
  const mid = (l.x + r.x) / 2;
  assert.ok(mid > 40 && mid < 60, `mid x ${mid}`);
  assert.ok(l.y > 45 && l.y < 65, `y ${l.y}`);
  assert.ok(POSES.ready.kneeL >= 30 && POSES.ready.kneeR >= 30);
  assert.equal(POSES.ready.rockets, 1);
  assert.equal(POSES.ready.tablet, 0);
});

test("fly: arms straight along the body, legs tucked, full throttle", () => {
  for (const s of ["L", "R"] as const) {
    assert.ok(Math.abs(POSES.fly[`elbow${s}`]) <= 10);
    // Spread a little from the body like fins, never raised over the visor.
    assert.ok(POSES.fly[`shoulder${s}`] >= 12 && POSES.fly[`shoulder${s}`] <= 40);
    assert.ok(POSES.fly[`knee${s}`] >= 60 && POSES.fly[`hip${s}`] >= 15);
  }
  // Fully reached out: each hand is a whole arm's length (102 + forearm) below its shoulder.
  assert.ok(handPoint("L", POSES.fly).y > px(0, 840).y);
  assert.ok(handPoint("R", POSES.fly).y > px(0, 940).y);
  assert.deepEqual([POSES.fly.throttle, POSES.fly.tablet, POSES.fly.dance], [1, 0, 0]);
});

test("approach: arms in, tablet out, legs reaching down", () => {
  assert.equal(POSES.approach.tablet, 1);
  for (const s of ["L", "R"] as const) {
    const h = handPoint(s, POSES.approach);
    assert.ok(h.x > 15 && h.x < 85, `${s} hand x ${h.x}`);
    assert.ok(POSES.approach[`knee${s}`] <= 20);
  }
});

test("land: knees bent with the body dropped, rockets off, tablet in hand", () => {
  assert.ok(POSES.land.kneeL >= 50 && POSES.land.kneeR >= 50);
  assert.ok(rootDrop(POSES.land) > 3);
  assert.equal(POSES.land.rockets, 0);
  assert.equal(POSES.land.tablet, 1);
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
