import assert from "node:assert/strict";
import { test } from "node:test";
import { hopStops, nearestSlot, notchedBarPath, slotCenter } from "./tab-notch.ts";

const W = 350;
const PAD = 18;

test("slot centres split the padded width evenly", () => {
  assert.equal(slotCenter(0, 5, W, PAD), PAD + 31.4);
  assert.ok(Math.abs(slotCenter(4, 5, W, PAD) - (W - PAD - 31.4)) < 1e-9);
});

test("nearestSlot maps each centre back to its index and clamps the ends", () => {
  for (let i = 0; i < 5; i++) assert.equal(nearestSlot(slotCenter(i, 5, W, PAD), 5, W, PAD), i);
  assert.equal(nearestSlot(-50, 5, W, PAD), 0);
  assert.equal(nearestSlot(W + 50, 5, W, PAD), 4);
});

test("hopStops visits every tab between, in travel order", () => {
  const c = (i: number) => slotCenter(i, 5, W, PAD);
  assert.deepEqual(hopStops(c(0), 3, 5, W, PAD), [c(0), c(1), c(2), c(3)]);
  assert.deepEqual(hopStops(c(4), 1, 5, W, PAD), [c(4), c(3), c(2), c(1)]);
  assert.deepEqual(hopStops(c(2), 2, 5, W, PAD), [c(2)]);
});

test("hopStops starts from a mid-flight position without revisiting the tab behind it", () => {
  const c = (i: number) => slotCenter(i, 5, W, PAD);
  const mid = (c(1) + c(2)) / 2;
  assert.deepEqual(hopStops(mid, 4, 5, W, PAD), [mid, c(2), c(3), c(4)]);
  assert.deepEqual(hopStops(mid, 0, 5, W, PAD), [mid, c(1), c(0)]);
});

test("notch near an edge shrinks that corner instead of overlapping it", () => {
  const d = notchedBarPath({ width: W, height: 62, radius: 22, cx: 40, half: 36, depth: 28 });
  assert.match(d, /^M0 4 A4 4 0 0 1 4 0 L4 0 /);
  assert.ok(!d.includes("NaN"));
});
