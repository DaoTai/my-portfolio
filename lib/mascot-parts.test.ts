import assert from "node:assert/strict";
import { test } from "node:test";
import { MASCOT_PARTS } from "./mascot-parts.ts";

type Name = keyof typeof MASCOT_PARTS;
const parts = MASCOT_PARTS as Record<
  Name,
  {
    back: string;
    skins: Record<string, string>;
    box: { left: number; top: number; width: number; height: number };
    origin: { x: number; y: number };
    parent: Name | null;
    anchors: Record<string, { x: number; y: number }>;
  }
>;

test("every part has a back face, edge skins and a box inside the canvas", () => {
  for (const [name, p] of Object.entries(parts)) {
    assert.match(p.back, /^\/mascot\/.+-back\.webp$/, name);
    assert.ok(p.skins.rim && p.skins.side, name);
    assert.ok(p.box.left >= -20 && p.box.left + p.box.width <= 120, name);
    assert.ok(p.origin.x >= -5 && p.origin.x <= 105, name);
  }
});

test("the rig is one tree rooted at the torso (the bubble floats free)", () => {
  const parents = Object.fromEntries(
    Object.entries(parts).map(([name, p]) => [name, p.parent]),
  );
  assert.deepEqual(parents, {
    torso: null,
    head: "torso",
    upperArmL: "torso",
    forearmL: "upperArmL",
    upperArmR: "torso",
    forearmR: "upperArmR",
    thighL: "torso",
    shinL: "thighL",
    thighR: "torso",
    shinR: "thighR",
    bubble: null,
  });
});

test("required anchors exist", () => {
  const need: [Name, string][] = [
    ["torso", "pocket"],
    ["forearmL", "hand"],
    ["forearmR", "hand"],
    ["thighL", "rocket"],
    ["thighR", "rocket"],
    ["shinL", "sole"],
    ["shinR", "sole"],
  ];
  for (const [name, anchor] of need) assert.ok(parts[name].anchors[anchor], `${name}.${anchor}`);
});

test("each limb segment overlaps the next at its joint, so a bend shows no gap", () => {
  const pairs: [Name, Name][] = [
    ["thighL", "shinL"],
    ["thighR", "shinR"],
    ["upperArmL", "forearmL"],
    ["upperArmR", "forearmR"],
  ];
  for (const [upper, lower] of pairs) {
    const a = parts[upper].box;
    const b = parts[lower].box;
    assert.ok(a.top + a.height >= b.top + 1.5, `${upper} → ${lower}`);
  }
});
