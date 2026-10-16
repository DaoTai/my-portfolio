import assert from "node:assert/strict";
import { test } from "node:test";
import { buildFlightPath } from "./mascot-flight.ts";

test("the flight starts and lands at home, upright and at full size", () => {
  const path = buildFlightPath(800, 500);
  const last = path.x.length - 1;
  for (const i of [0, last]) {
    assert.equal(path.x[i], 0);
    assert.equal(path.y[i], 0);
    assert.equal(path.scale[i], 1);
    assert.equal(path.rotate[i], 0);
    assert.equal(path.pitch[i], 0);
    assert.equal(path.altitude[i], 0);
  }
  // Squared up both times: the barrel roll leaves it a whole turn round.
  assert.equal(path.roll[0], 0);
  assert.equal(path.roll[last], 360);
});

test("every track has one value per time, times run 0 → 1", () => {
  const path = buildFlightPath(800, 500, 32);
  assert.equal(path.times.length, 33);
  const { x, y, scale, rotate, roll, pitch, altitude } = path;
  for (const track of [x, y, scale, rotate, roll, pitch, altitude]) {
    assert.equal(track.length, path.times.length);
  }
  assert.equal(path.times[0], 0);
  assert.equal(path.times.at(-1), 1);
});

test("the mascot stays inside the travel box (only left and up from home)", () => {
  const path = buildFlightPath(600, 400);
  for (const x of path.x) assert.ok(x <= 0 && x >= -600, `x=${x}`);
  for (const y of path.y) assert.ok(y <= 0.5 && y >= -400, `y=${y}`);
});

test("it flies head first: flat when crossing the screen, never upside down", () => {
  const path = buildFlightPath(1600, 900);
  for (const r of path.rotate) assert.ok(Math.abs(r) <= 90, `rotate=${r}`);
  // Heading left it lies close to horizontal, head to the left.
  assert.ok(Math.min(...path.rotate) < -70, `min=${Math.min(...path.rotate)}`);
  // Heading back right it lies flat the other way.
  assert.ok(Math.max(...path.rotate) > 60, `max=${Math.max(...path.rotate)}`);
});

test("it cruises three-quarter on and barrel-rolls once at the far turn", () => {
  const path = buildFlightPath(1600, 900);
  const turn = path.x.indexOf(Math.min(...path.x));
  // Before the roll it shows its side without ever turning its back.
  const before = path.roll.slice(0, turn - 6);
  assert.ok(Math.max(...before) > 25, `max=${Math.max(...before)}`);
  for (const r of before) assert.ok(r >= -62 && r <= 62, `roll=${r}`);
  // A full turn around the far end, and it never unwinds.
  assert.ok(path.roll[turn + 6] - path.roll[turn - 6] > 300);
  for (let i = 1; i < path.roll.length; i++) {
    assert.ok(path.roll[i] - path.roll[i - 1] > -20, `unwinds at ${i}`);
  }
});

test("it nods toward the viewer when coming closer", () => {
  const path = buildFlightPath(1600, 900);
  for (const p of path.pitch) assert.ok(Math.abs(p) <= 26, `pitch=${p}`);
  const nearest = path.scale.indexOf(Math.max(...path.scale));
  const approaching = path.pitch.slice(nearest - 8, nearest);
  assert.ok(Math.min(...approaching) < -10, `min=${Math.min(...approaching)}`);
});
