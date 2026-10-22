import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";
import { test } from "node:test";
import { MASCOT_PARTS } from "./mascot-parts.ts";

// sharp ships with Next.js as an optional dependency, so resolve it through next.
const require = createRequire(import.meta.url);
const sharp = require(require.resolve("sharp", { paths: [require.resolve("next")] }));

const ROOT = path.resolve(import.meta.dirname, "..");
const W = 96;

/** Solid coverage of an image, resized to a fixed grid. */
const mask = async (src: string, flip: boolean) => {
  let img = sharp(path.join(ROOT, "public", src)).ensureAlpha().resize(W, W, { fit: "fill" });
  if (flip) img = img.flop();
  const { data } = await img.extractChannel(3).raw().toBuffer({ resolveWithObject: true });
  return Array.from(data as Uint8Array, (a) => a > 128);
};

const overlap = (a: boolean[], b: boolean[]) => {
  let both = 0;
  let either = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] && b[i]) both++;
    if (a[i] || b[i]) either++;
  }
  return either ? both / either : 1;
};

test("each back face fills the turned slice: its outline is the front's, mirrored", async () => {
  // Turned round, a slice shows its face's outline mirrored (its edge layers prove it); the back
  // art has to cover exactly that, or the dark edge stack shows beside it.
  for (const [name, part] of Object.entries(MASCOT_PARTS)) {
    const [front, back] = await Promise.all([mask(part.src, true), mask(part.back, false)]);
    const iou = overlap(front, back);
    assert.ok(iou > 0.95, `${name}: back covers ${iou.toFixed(2)} of the mirrored outline`);
  }
});
