import assert from "node:assert/strict";
import { test } from "node:test";
import { createRateLimiter } from "./rate-limit.ts";

const clock = (start = 0) => {
  let t = start;
  return { now: () => t, advance: (ms: number) => (t += ms) };
};

test("allows up to the limit, then blocks", () => {
  const { now } = clock();
  const allow = createRateLimiter({ limit: 3, windowMs: 1000, now });
  assert.deepEqual([allow("a"), allow("a"), allow("a"), allow("a")], [true, true, true, false]);
});

test("tracks keys independently", () => {
  const { now } = clock();
  const allow = createRateLimiter({ limit: 1, windowMs: 1000, now });
  assert.equal(allow("a"), true);
  assert.equal(allow("b"), true);
  assert.equal(allow("a"), false);
});

test("resets after the window", () => {
  const { now, advance } = clock();
  const allow = createRateLimiter({ limit: 1, windowMs: 1000, now });
  assert.equal(allow("a"), true);
  advance(999);
  assert.equal(allow("a"), false);
  advance(1);
  assert.equal(allow("a"), true);
});

test("keeps working after many expired keys are pruned", () => {
  const { now, advance } = clock();
  const allow = createRateLimiter({ limit: 1, windowMs: 1000, now });
  for (let i = 0; i < 1500; i++) allow(`ip-${i}`);
  advance(1000);
  assert.equal(allow("ip-0"), true);
  assert.equal(allow("ip-0"), false);
});
