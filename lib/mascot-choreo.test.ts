import assert from "node:assert/strict";
import { test } from "node:test";
import { buildTimeline, flightWindow } from "./mascot-choreo.ts";

const cue = (mode: string) => {
  const c = buildTimeline(7500).find((c) => c.mode === mode);
  assert.ok(c, `no ${mode} cue`);
  return c;
};

test("phases run back to back from 0, in the spec's order", () => {
  const t = buildTimeline(7500);
  assert.deepEqual(
    t.map((c) => c.mode),
    ["stow", "ready", "launch", "fly", "approach", "land", "recover"],
  );
  assert.equal(t[0].at, 0);
  t.slice(1).forEach((c, i) => assert.equal(c.at, t[i].at + t[i].ms));
});

test("the flight path spans fly + approach exactly", () => {
  const w = flightWindow(buildTimeline(7500));
  assert.equal(w.start, cue("fly").at);
  assert.equal(w.end, cue("land").at);
  assert.equal(w.end - w.start, 7500);
  assert.equal(cue("fly").ms, 6600);
});

test("the landing crouch holds 1–2 s", () => {
  assert.ok(cue("land").ms >= 1000 && cue("land").ms <= 2000);
});

test("the tablet is put away before the hands come together", () => {
  assert.equal(cue("stow").at + cue("stow").ms, cue("ready").at);
});
