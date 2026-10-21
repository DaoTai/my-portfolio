import assert from "node:assert/strict";
import { test } from "node:test";
import { MASCOT_PARTS } from "./mascot-parts.ts";
import { POSES } from "./mascot-poses.ts";
import { childrenOf, relativeBox, rootDrop } from "./mascot-rig.ts";

test("roots are the torso and the bubble; limbs hang from their joints", () => {
  assert.deepEqual(childrenOf(null), ["torso", "bubble"]);
  assert.deepEqual(childrenOf("upperArmL"), ["forearmL"]);
  assert.deepEqual(childrenOf("forearmL"), []);
});

test("relativeBox of a root is its canvas box", () => {
  assert.deepEqual(relativeBox("bubble"), MASCOT_PARTS.bubble.box);
});

test("a child's relativeBox maps back to its canvas box through its parent", () => {
  // shinL sits inside thighL: rebuild its canvas box from the relative one.
  const parent = MASCOT_PARTS.thighL.box;
  const rel = relativeBox("shinL");
  const back = {
    left: parent.left + (rel.left / 100) * parent.width,
    top: parent.top + (rel.top / 100) * parent.height,
    width: (rel.width / 100) * parent.width,
    height: (rel.height / 100) * parent.height,
  };
  const want = MASCOT_PARTS.shinL.box;
  for (const k of ["left", "top", "width", "height"] as const) {
    assert.ok(Math.abs(back[k] - want[k]) < 1e-6, `${k}: ${back[k]} vs ${want[k]}`);
  }
});

test("standing straight drops nothing; bent knees drop the body to keep the feet down", () => {
  assert.equal(rootDrop(POSES.idle), 0);
  // Hip 35° and knee 70° on a 163 px thigh and 247 px shin: 410 − (163·cos35 + 247·cos35) ≈ 74 px.
  assert.ok(Math.abs(rootDrop(POSES.land) - (74 / 1381) * 100) < 0.6);
});

test("in the air the legs tuck up instead of dropping the body", () => {
  assert.ok(POSES.fly.kneeL > 0);
  assert.equal(rootDrop(POSES.fly), 0);
});
