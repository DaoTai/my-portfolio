# Mascot Flight Choreography Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The mascot puts its tablet away, crouches, fades in two rockets, flies with straight arms and tucked legs while showing a real back view and making rocket sound, then lands with bent knees and takes its tablet back out.

**Architecture:** The 2.5D CSS rig stays, but it becomes a tree of nested slices (upper arm→forearm, thigh→shin) cut from three new art sheets by an extended slicer. Each slice also gets a real back face. Poses live in a typed table in `lib/mascot-poses.ts`. They are written as registered CSS custom properties on `.mascot-rig`, and CSS transitions blend between poses. `lib/mascot-choreo.ts` holds the phase timeline that `MascotFlyer` plays. The sound is synthesised with Web Audio, its gain/pan/brightness curves come from the flight path in pure code, and a mute toggle switches it off.

**Tech Stack:** Next.js 15 App Router, React 19, Motion 12 (`useAnimate`), CSS 3D transforms + `@property`, Web Audio API, sharp (via Next) for slicing, Node 24 `node --test` with native TS type stripping, Playwright MCP for visual checks.

**Spec:** `docs/superpowers/specs/2026-10-21-mascot-flight-choreography-design.md`

## Global Constraints

- No three.js and no new runtime npm dependencies. Sound is synthesised, with no audio files.
- `L`/`R` in part and joint names mean the **image side in front view** (the current `legL` is on the image's left). Keep this convention everywhere.
- Phase durations (ms), verbatim: `stow 700`, `ready 650`, `launch 380`, `approach 900`, `land 1400`, `recover 600`. `fly = FLIGHT_MS − approach`, with `FLIGHT_MS = 7500` (the existing `FLIGHT_S`).
- Animate only `transform`, `opacity` and registered custom properties. No layout properties.
- `lib/mascot-parts.ts` is generated: change `scripts/slice-mascot.mjs` and re-run it, never hand-edit the file. Source art lives in `art/mascot/` and is not served. Output goes to `public/mascot/`.
- `lib/mascot-flight.ts` and its tests stay unchanged and passing.
- Sound plays only when `navigator.userActivation?.hasBeenActive` is true **and** the toggle is on. Master peak gain `0.22`. The preference is stored in `localStorage` key `mascot-sound` with values `"on"` | `"off"`, default `"on"`.
- Toggle copy, verbatim: `aria-label` `Mute mascot sounds` when on, `Unmute mascot sounds` when off.
- `prefers-reduced-motion`: no flights and no sound (as today).
- Project rules: arrow-function `const` components and helpers. Component files stay under 600 lines. `React.memo` only on the rig root and on parts rendered in a `.map`. New SVGs must read on both the dark theme and `html.light`.

## Review Focus

1. **Chat opened mid-sequence** (during stow/ready/fly/approach): the mascot snaps back to the idle pose with the tablet in hand and rockets hidden, and the sound stops at once. Test in Task 6, step 5.
2. **No user gesture yet**: the first flight (10 s after load) runs silently, no `AudioContext` is created, and the console shows no autoplay warning. Test in Task 7, step 6.
3. **`localStorage` throws** (Safari private mode, blocked storage): the preference reads as `"on"`, writing does nothing, and nothing crashes. Test in Task 7, step 1 (`readSoundPref` / `writeSoundPref`).
4. **Back view at roll 90° and 180°**: no slice comes loose, there are no gaps at the shoulder/elbow/hip/knee joints, and the back art lines up with the front outline. Test in Task 3, step 6 (dev lab screenshots).
5. **Light theme and the 80 px mobile size**: the rockets, the tablet and the flames stay visible on the pale background, and the anchors still sit on the hand and the thigh at the small size. Test in Task 8, step 2.

---

### Task 0: Install animation and audio skills (setup)

**Files:** none in the repo (skills install to `~/.claude/skills`).

- [ ] **Step 1: Install the skills found with `npx skills find`**

```bash
npx -y skills add emilkowalski/skills@improve-animations
npx -y skills add emilkowalski/skills@review-animations
npx -y skills add mengto/skills@build-game-audio-feedback
```

- [ ] **Step 2: Read each installed `SKILL.md` before use**, and drop any that asks for network calls or deps outside the Global Constraints. Usage: `improve-animations` in Tasks 3–6 (easing and timing of the pose transitions), `build-game-audio-feedback` in Task 7, `review-animations` in Task 8.

---

### Task 1: Art kit + multi-source slicer with nested parts and back faces

**Files:**
- Create: `art/mascot/front-clean.png`, `art/mascot/front-tpose.png`, `art/mascot/back-tpose.png` (**user-supplied**, see the spec's Art kit)
- Modify: `scripts/slice-mascot.mjs`
- Regenerate: `lib/mascot-parts.ts`, `public/mascot/*.webp` (delete stale `arm*`, `tablet*`, `legL*`, `legR*`, `body*`, `*-back.webp`)
- Test: `lib/mascot-parts.test.ts`

**Interfaces:**
- Produces `MASCOT_PARTS` with keys `torso, head, upperArmL, forearmL, upperArmR, forearmR, thighL, shinL, thighR, shinR, bubble`. Each entry is `{ src, back, skins: { rim, side }, box, origin, parent: MascotPartName | null, depth: number, anchors, ellipses?, clips? }`. `box`/`anchors` follow today's convention (box in % of the canvas, anchors/origin in % of the part's own box).
- Required anchors: `torso.pocket`, `forearmL.hand`, `forearmR.hand`, `thighL.rocket`, `thighR.rocket`, `shinL.sole`, `shinR.sole`, plus head `eyeL/eyeR/mouth` + `ellipses.visor`, and bubble `dot1–3`.
- Parents: `head→torso`, `upperArm*→torso`, `forearm*→upperArm*`, `thigh*→torso`, `shin*→thigh*`, `bubble→null`, `torso→null`.
- `depth` (px, translateZ at 112 px width) replaces the per-part CSS depths: thighs `-4/-2`, torso `0`, head `6`, upper arms `10`, forearms `14`, bubble `34`.

- [ ] **Step 1: Confirm the three art files exist** at 1139×1381 (`front-clean`), or any size (`*-tpose`), with an alpha channel. Run: `node -e "require('sharp')..."`, or check with `file`. If any is missing, stop and ask the user. Everything below depends on them.

- [ ] **Step 2: Write the failing test** `lib/mascot-parts.test.ts`:

```ts
test("every part has a back face, skins and a box inside the canvas", () => {
  for (const [name, p] of Object.entries(MASCOT_PARTS)) {
    assert.match(p.back, /^\/mascot\/.+-back\.webp$/, name);
    assert.ok(p.skins.rim && p.skins.side, name);
    assert.ok(p.box.left >= -20 && p.box.left + p.box.width <= 120, name); // T-pose arms may overhang
    assert.ok(p.origin.x >= -5 && p.origin.x <= 105, name);
  }
});
test("the rig is one tree rooted at the torso (bubble floats free)", () => { /* parent map equals the Interfaces list */ });
test("required anchors exist", () => { /* torso.pocket, forearm{L,R}.hand, thigh{L,R}.rocket, shin{L,R}.sole */ });
test("each thigh overlaps its shin at the knee so a bend shows no gap", () => {
  // thigh box bottom ≥ shin box top + 1.5 (% of canvas height)
});
```

- [ ] **Step 3: Run** `pnpm test`. Expected: FAIL (the new keys are missing).

- [ ] **Step 4: Extend `scripts/slice-mascot.mjs`**

  - Per-part `src` (default `front-clean.png`; the bubble keeps `../public/mascot.png`).
  - Optional `mount: [x, y]` (canvas px where the part's `pivot` lands) and `scale`. A part without `mount` that shares its parent's `src` inherits the parent's transform. Parts cut from `front-tpose.png` are placed so the T-pose shoulder lands on the original shoulder, so "rest" = arms horizontal.
  - Write `parent` and `depth` straight from config.
  - Split each leg at the knee (seam `y≈1160`; the thigh polygon runs 25 px past the seam).
  - Back faces: flip `back-tpose.png` horizontally. Cut each part with its own `back: { poly, pivot }` in flipped-sheet pixels, scale it so its height matches the front box, align the back pivot to the front pivot, and write `<name>-back.webp` at the front box size. For the bubble, use its own front slice as the back.
  - Skins: only `rim` and `side`. The real back replaces the old `back` skin.

- [ ] **Step 5: Run** `node scripts/slice-mascot.mjs`, then `pnpm test`. Expected: the slicer prints 11 parts, and all tests pass, `mascot-flight` tests included.

- [ ] **Step 6: Commit** `feat(mascot): articulated, two-sided rig slices from the new art kit`.

---

### Task 2: Rig geometry + pose table

**Files:**
- Create: `lib/mascot-rig.ts`, `lib/mascot-poses.ts`
- Test: `lib/mascot-rig.test.ts`, `lib/mascot-poses.test.ts`

**Interfaces:**
- Consumes `MASCOT_PARTS`, `MASCOT_ASPECT` (Task 1).
- `lib/mascot-poses.ts` produces:
  - `type Joint = "shoulderL" | "elbowL" | "shoulderR" | "elbowR" | "hipL" | "kneeL" | "hipR" | "kneeR"`
  - `type Pose = Record<Joint, number> & { tablet: number; rockets: number; throttle: number; dance: number; ms: number }`. Joints are in degrees. `tablet`/`rockets`/`throttle`/`dance` run 0–1. `ms` is the blend time *into* the pose.
  - `type MascotMode = "idle" | "stow" | "ready" | "launch" | "fly" | "approach" | "land" | "recover"` (moved here from `Mascot.tsx`; `Mascot.tsx` re-exports it)
  - `const POSES: Record<MascotMode, Pose>`
- Joint semantics: shoulder 0 = T-pose horizontal and + raises the arm (in plane). Elbow 0 = straight, and the forearm's absolute angle = shoulder + elbow. Hip 0 = straight down and + swings the thigh forward (rotateX). Knee 0 = straight and + swings the shin back (rotateX).
- `lib/mascot-rig.ts` produces:
  - `childrenOf(parent: MascotPartName | null): MascotPartName[]`
  - `relativeBox(name: MascotPartName): { left; top; width; height }`: the part's box in % of its parent's box (or of the canvas for roots)
  - `handPoint(side: "L" | "R", pose: Pose): { x: number; y: number }`: in-plane FK of `forearm{side}.hand`, in canvas % (x of width, y of height). Do the maths in width units using `MASCOT_ASPECT`. For side L, CSS `rotate(+angle)`; for side R, `rotate(-angle)`.
  - `rootDrop(pose: Pose): number`: how far the torso drops (in % of canvas height) so the soles stay on the ground line, given hip/knee flexion and the thigh/shin lengths (pivot→pivot, pivot→`sole`), using `max(L, R)`.

- [ ] **Step 1: Write the failing tests**

`lib/mascot-rig.test.ts`:
```ts
test("relativeBox of a root equals its canvas box", ...);
test("a child's relativeBox maps back to its canvas box through the parent", ...);
test("rootDrop is 0 with straight legs and grows with knee bend", () => {
  assert.equal(rootDrop(POSES.idle), 0);
  assert.ok(rootDrop(POSES.land) > 3);
});
```

`lib/mascot-poses.test.ts`, which pins the spec:
```ts
test("idle reproduces the original art: left hand at the tablet, right finger at the bubble", () => {
  near(handPoint("L", POSES.idle), { x: 25, y: 60.8 }, 4);   // (285, 840) px in mascot.png
  near(handPoint("R", POSES.idle), { x: 82.5, y: 32.2 }, 4); // fingertip (940, 445) px
  assert.deepEqual([POSES.idle.tablet, POSES.idle.rockets, POSES.idle.dance], [1, 0, 1]);
});
test("stow: the left hand reaches the pocket and the tablet is away", () => {
  near(handPoint("L", POSES.stow), pocketCanvasPoint, 5); assert.equal(POSES.stow.tablet, 0);
});
test("ready: hands meet at the chest, knees loaded, rockets in", () => {
  const l = handPoint("L", POSES.ready), r = handPoint("R", POSES.ready);
  assert.ok(Math.hypot(l.x - r.x, (l.y - r.y) / MASCOT_ASPECT) < 8);
  assert.ok((l.x + r.x) / 2 > 40 && (l.x + r.x) / 2 < 60 && l.y > 45 && l.y < 65);
  assert.ok(POSES.ready.kneeL >= 30 && POSES.ready.kneeR >= 30);
  assert.equal(POSES.ready.rockets, 1); assert.equal(POSES.ready.tablet, 0);
});
test("fly: arms straight and leading overhead, legs tucked, full throttle", () => {
  for (const s of ["L", "R"] as const) {
    assert.ok(Math.abs(POSES.fly[`elbow${s}`]) <= 10);
    assert.ok(POSES.fly[`shoulder${s}`] >= 75);
    assert.ok(POSES.fly[`knee${s}`] >= 60 && POSES.fly[`hip${s}`] >= 15);
  }
  assert.deepEqual([POSES.fly.throttle, POSES.fly.tablet, POSES.fly.dance], [1, 0, 0]);
});
test("approach: arms in, tablet out, legs reaching down", ...);   // tablet 1, both hands inside x∈[15,85], knees ≤ 20
test("land: knees bent with the body dropped, rockets off", ...);  // knees ≥ 50, rootDrop > 3, rockets 0, tablet 1
test("recover blends back to idle", () => { /* joints equal idle, ms ≥ 400 */ });
test("every pose's blend time fits inside its phase", ...);       // POSES[m].ms ≤ PHASE_MS[m] (import from Task 6's file once it exists; until then inline the constants)
```

- [ ] **Step 2: Run** `pnpm test`. Expected: FAIL, the modules don't exist yet.

- [ ] **Step 3: Implement both files.** Start from these guesses and tune them until the tests pass: idle from the art, stow shoulderL −75/elbowL −10, ready knees 40/hips 20, fly shoulders 95/elbows 0/hips 20/knees 80, land knees 70/hips 35. The exact idle values come from Task 3's lab; get them roughly right here so the tests pass.

- [ ] **Step 4: Run** `pnpm test`. Expected: PASS.

- [ ] **Step 5: Commit** `feat(mascot): pose table and rig geometry`.

---

### Task 3: Rig renderer — nested parts, back faces, pose variables, dev lab

**Files:**
- Create: `components/portfolio/Chat/MascotPart.tsx`, `components/portfolio/Chat/MascotPart.css`, `components/portfolio/Chat/MascotEffects.tsx` (move `Sparkle`, `Comets` out of `Mascot.tsx`)
- Create: `app/dev/mascot/page.tsx`, `app/dev/mascot/MascotLab.tsx`
- Modify: `components/portfolio/Chat/Mascot.tsx`, `components/portfolio/Chat/Mascot.css` (drop the per-part depth rules, the old leg/arm/tablet joints, `mascot-land`/`mascot-crouch` and the boot flame CSS)

**Interfaces:**
- Consumes `POSES`, `MascotMode`, `rootDrop`, `childrenOf`, `relativeBox`.
- `MascotPart = memo(({ name, children }: { name: MascotPartName; children?: ReactNode }) => …)` renders its own child parts recursively through `childrenOf(name)`. Overlays for a given part are passed in from `Mascot` through a `slots: Partial<Record<MascotPartName, ReactNode>>` prop on the root call.
- `poseVars(pose: Pose): CSSProperties` in `Mascot.tsx` maps the pose to `--shoulder-l`, `--elbow-l`, `--shoulder-r`, `--elbow-r`, `--hip-l`, `--knee-l`, `--hip-r`, `--knee-r` (`<angle>`), `--tablet`, `--rockets`, `--throttle`, `--dance` (`<number>`), `--drop` (`<percentage>`) and `--pose-ms` (`<time>`).
- `Mascot` keeps its signature `memo(({ mode }: { mode: MascotMode }) => …)` and keeps `.mascot-orient` (MascotFlyer still drives `--heading/--roll/--pitch`).
- `/dev/mascot` calls `notFound()` when `process.env.NODE_ENV === "production"`. It has mode buttons, a roll slider (0–360) and a heading slider, and shows pivot dots when `?pivots` is set.

- [ ] **Step 1: Register the properties** in `MascotPart.css` with `@property` (`inherits: true`, `initial-value` = the idle value). On `.mascot-rig`, transition every one of them with `transition-duration: var(--pose-ms)` and `cubic-bezier(0.34, 1.2, 0.64, 1)` (soft overshoot), but `--rockets`/`--tablet`/`--dance` use `ease` over 400 ms.

- [ ] **Step 2: Joint transforms in CSS.** These go on `.mascot-part-move`, keyed by part:
  - upperArmL `rotate(var(--shoulder-l))`, forearmL `rotate(var(--elbow-l))`
  - upperArmR `rotate(calc(-1 * var(--shoulder-r)))`, forearmR `rotate(calc(-1 * var(--elbow-r)))`
  - thigh `rotateX(calc(-1 * var(--hip-*)))`, shin `rotateX(var(--knee-*))`
  - torso root `translateY(var(--drop))`

  Each idle dance keyframe multiplies its amplitude by `var(--dance)`, so leaving idle fades the dance out instead of snapping. Check in Chrome that the dance really fades. If a browser snaps, accept the snap; don't fight it.

- [ ] **Step 3: Back face.** In `MascotPart`, after the edge layers, add `<span class="mascot-back">` (background = `back`). It is placed at `translateZ(calc(var(--thickness) * -1)) rotateY(180deg)` with `backface-visibility: hidden`. `EDGE_LAYERS` becomes `["rim", "side", "side", "side", "side"]`.

- [ ] **Step 4: Build `/dev/mascot`** and open it with Playwright (`pnpm dev`, then navigate to `http://localhost:3000/dev/mascot?pivots`). Tune the `idle` joint values in `lib/mascot-poses.ts` until a screenshot of idle at roll 0 overlays `public/mascot.png` (hands, legs and head in place). Re-run `pnpm test`.

- [ ] **Step 5: Run** `pnpm lint && pnpm build`. Expected: no errors. `/dev/mascot` builds, and the production server answers it with 404.

- [ ] **Step 6: Visual check (Review Focus 4).** Take screenshots of the `idle`, `ready`, `fly` and `land` poses at roll 0, 90 and 180 and save them to the scratchpad. Pass: the back art shows at 180, it has the helmet back and the hood, no slice floats loose, and there are no gaps at the joints. Fix gaps with the slicer's overlap or by changing `depth`, not with CSS hacks.

- [ ] **Step 7: Commit** `feat(mascot): nested two-sided rig driven by pose variables`.

---

### Task 4: Holo tablet — held, stowed, drawn out

**Files:**
- Create: `components/portfolio/Chat/MascotTablet.tsx`, `components/portfolio/Chat/MascotTablet.css`
- Modify: `components/portfolio/Chat/Mascot.tsx` (put it in the `forearmL` slot at the `hand` anchor; drop the old tablet `Part` and the `.mascot-holo*` markup), `Mascot.css` (move `.mascot-holo*` and `.mascot-bit` into `MascotTablet.css`)

**Interfaces:**
- `MascotTablet = () => JSX`, with no props. It reads `--tablet`.
- Visible state: `opacity: var(--tablet)`, `scale: calc(0.15 + 0.85 * var(--tablet))`, with the transform origin at the bottom-left corner (in the palm), so it shrinks into the hand as the hand reaches the pocket.

- [ ] **Step 1: Draw the SVG** (viewBox `0 0 200 150`). Draw a rounded, slightly skewed panel with a cyan→violet gradient fill at 35% opacity and a 1.5 px cyan stroke. Add three text bars, a `</>` chip and a round logo glyph, matching the original tablet. Keep the existing scan line, sweep and drifting bits, clipped to the panel. Add a second, darker copy at `rotateY(180deg)` as its back. In `html.light`, use a 60% fill and a `#0891b2` stroke.

- [ ] **Step 2: Add the stow/draw "digitize" flash**: a short cyan glow (`box-shadow` on a pseudo-element, opacity only) whose opacity is `calc(4 * var(--tablet) * (1 - var(--tablet)))`. It peaks halfway through the blend.

- [ ] **Step 3: Verify in `/dev/mascot`.** Switch `idle → stow → ready` and `fly → approach`. Pass: the tablet sits in the left hand at idle, shrinks into it at the pocket, and is gone at `ready`; at `approach` it grows back in the hand.

- [ ] **Step 4: Run** `pnpm lint`. Expected: no errors. Then commit `feat(mascot): SVG holo tablet that stows and draws out`.

---

### Task 5: Rocket pods with fade-in and throttle

**Files:**
- Create: `components/portfolio/Chat/MascotRocket.tsx`, `components/portfolio/Chat/MascotRocket.css`
- Modify: `components/portfolio/Chat/Mascot.tsx` (put a rocket in the `thighL` and `thighR` slots at the `rocket` anchor; remove `Flame` from the legs), `Mascot.css` (move the `.mascot-flame*` rules into `MascotRocket.css`)

**Interfaces:**
- `MascotRocket = ({ side }: { side: "L" | "R" }) => JSX`. It reads `--rockets` and `--throttle`.
- It still renders `.mascot-flame-tip` at the nozzle (`MascotTrail` emits from it, unchanged).

- [ ] **Step 1: Build the pod.** Two identical SVG planes (rotateY 0° and 90°, `transform-style: preserve-3d`) make a cylinder with a nose cone and a nozzle ring. Body `#1e1b4b → #4c1d95`, with a cyan piping stroke that matches the jacket. It is about 22% of the thigh's width, on the outer side (mirror for `R`). Visibility: `opacity: var(--rockets)`, `scale: calc(0.6 + 0.4 * var(--rockets))`, with a 400 ms `ease` blend from Task 3.

- [ ] **Step 2: Flame under the nozzle**, reusing the outer/mid/core layers. Set `scaleY(var(--throttle))` and `opacity: min(1, calc(var(--throttle) * 3))`.

- [ ] **Step 3: Verify in `/dev/mascot`.** Pass: in `ready` the pods fade in with a small sputtering flame, `fly` gives a full flame that points along the body toward the feet, and at roll 90 the pods still look round.

- [ ] **Step 4: Run** `pnpm lint`. Expected: no errors. Then commit `feat(mascot): rocket pods fade in beside the legs`.

---

### Task 6: Choreography timeline + MascotFlyer playback

**Files:**
- Create: `lib/mascot-choreo.ts`
- Test: `lib/mascot-choreo.test.ts`
- Modify: `components/portfolio/Chat/MascotFlyer.tsx`, `lib/mascot-poses.test.ts` (import `PHASE_MS` instead of the inline constants)

**Interfaces:**
- `const PHASE_MS = { stow: 700, ready: 650, launch: 380, approach: 900, land: 1400, recover: 600 } as const`
- `type Cue = { mode: Exclude<MascotMode, "idle">; at: number; ms: number }`
- `buildTimeline(flightMs: number): Cue[]`, in the order stow, ready, launch, fly, approach, land, recover
- `flightWindow(timeline: Cue[]): { start: number; end: number }`, where `start = fly.at` and `end = land.at`
- `MascotFlyer` props are unchanged in this task. Task 7 adds `sound: RocketSoundControls`, passed from `ChatLauncher`, which owns the hook so the toggle and the flyer share one state.

- [ ] **Step 1: Write the failing tests**

```ts
test("phases run back to back from 0, in the spec's order", () => {
  const t = buildTimeline(7500);
  assert.deepEqual(t.map((c) => c.mode), ["stow","ready","launch","fly","approach","land","recover"]);
  t.slice(1).forEach((c, i) => assert.equal(c.at, t[i].at + t[i].ms));
  assert.equal(t[0].at, 0);
});
test("the flight path spans fly + approach exactly", () => {
  const w = flightWindow(buildTimeline(7500));
  assert.equal(w.end - w.start, 7500);
  assert.equal(buildTimeline(7500).find((c) => c.mode === "fly")!.ms, 6600);
});
test("the landing crouch holds 1–2 s", () => { /* land.ms in [1000, 2000] */ });
test("the tablet is put away before the hands come together", () => { /* stow precedes ready */ });
```

- [ ] **Step 2: Run** `pnpm test`. Expected: FAIL.

- [ ] **Step 3: Implement `lib/mascot-choreo.ts`.**

- [ ] **Step 4: Rewrite the loop in `MascotFlyer`.** For each cue, set a timer at `cue.at` that calls `setMode(cue.mode)`. At `flightWindow.start`, start today's three `animate` calls (path, orient, ground). At `flightWindow.end`, square the orient (as `land()` does today). After the last cue, `setMode("idle")` and `schedule(FLIGHT_GAP_MS)`. Delete `LAUNCH_MS` and `LAND_MS`. All timer ids go into one array that the effect cleanup clears.

- [ ] **Step 5: Review Focus 1 test.** Using Playwright on `http://localhost:3000`, temporarily set `FIRST_FLIGHT_MS` to 1000 or click a lab "play" button. Open the chat while the cue is `fly`, close it again, and wait 1 s. Pass: `.mascot-rig[data-mode="idle"]`, and the computed `--tablet` on the rig is `1` and `--rockets` is `0`. Restore `FIRST_FLIGHT_MS`.

- [ ] **Step 6: Watch a full flight** (screenshots at stow/ready/fly/approach/land/recover). Run `pnpm test && pnpm lint`. Expected: all pass. Commit `feat(mascot): play the stow → fly → land choreography`.

---

### Task 7: Rocket sound + mute toggle

**Files:**
- Create: `lib/mascot-sound-curves.ts`, `lib/mascot-sound.ts`, `lib/hooks/useMascotSound.ts`, `components/portfolio/Chat/MascotSoundToggle.tsx`
- Test: `lib/mascot-sound-curves.test.ts`
- Modify: `components/portfolio/Chat/MascotFlyer.tsx` (new `sound: RocketSoundControls` prop, called on cues), `components/portfolio/Chat/index.tsx` (`ChatLauncher` calls `useMascotSound()`, passes `controls` to `MascotFlyer`, renders the toggle, hidden while the chat is open)

**Interfaces:**
- `lib/mascot-sound-curves.ts` (pure):
  - `buildSoundCurves(path: FlightKeyframes, travelX: number): { gain: number[]; pan: number[]; cutoff: number[] }`. All three tracks have the same length as `path.times`. `gain = (0.35 + 0.65·speedNorm) · clamp(scale, 0.7, 1.25) / 1.25`, `pan = clamp(0.8 + 1.6·x/travelX, −0.85, 0.85)`, `cutoff = 400 + 2600·speedNorm` Hz.
  - `readSoundPref(storage: Pick<Storage, "getItem"> | undefined): "on" | "off"` and `writeSoundPref(storage, value): void`. Both catch anything thrown.
- `lib/mascot-sound.ts` (browser only): `createRocketSound(): RocketSound`, with methods `ignite()`, `cruise(curves, seconds)`, `throttleDown(ms)`, `touchdown()`, `stop()`, `dispose()`. It creates its `AudioContext` lazily on the first call. Signal chain: looped 2 s noise buffer → lowpass `BiquadFilter` (cutoff curve) → `Gain` (gain curve, via `setValueCurveAtTime`) → `StereoPanner` (pan curve) → master `Gain` 0.22 → destination. `ignite` is a bandpassed noise burst plus a sine thump 90→40 Hz over 250 ms. `touchdown` is a sine 110→45 Hz over 180 ms plus a short noise click.
- `lib/hooks/useMascotSound.ts`: `useMascotSound(): { enabled: boolean; toggle: () => void; controls: RocketSoundControls }`. `RocketSoundControls` has the same five play methods. They do nothing when the sound is disabled or `!navigator.userActivation?.hasBeenActive`. The hook suspends the context on `visibilitychange` → hidden, resumes it when visible, and disposes it on unmount.
- `MascotSoundToggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => JSX`. It is a 32 px round button with lucide `Volume2`/`VolumeX`, `aria-pressed={!enabled}`, and the Global Constraints copy. It is placed just left of the mascot's home: `fixed bottom-[80px] right-[92px] sm:bottom-[88px] sm:right-[136px] z-40`.

- [ ] **Step 1: Write the failing tests**

```ts
test("curves have one value per keyframe, gain within (0, 1]", ...);
test("pan starts right (home) and swings left at the far turn", () => {
  const p = buildFlightPath(1200, 700), c = buildSoundCurves(p, 1200);
  assert.equal(c.pan[0], 0.8); assert.ok(Math.min(...c.pan) <= -0.6);
});
test("brightness peaks where the flight is fastest", ...);
test("pref defaults to on, survives a throwing storage, round-trips", () => {
  assert.equal(readSoundPref(undefined), "on");
  assert.equal(readSoundPref({ getItem: () => { throw new Error("denied"); } }), "on");
  assert.doesNotThrow(() => writeSoundPref({ setItem: () => { throw new Error(); } } as never, "off"));
});
```

- [ ] **Step 2: Run** `pnpm test`. Expected: FAIL.

- [ ] **Step 3: Implement the curves, the prefs, the engine, the hook and the toggle** as specified in the Interfaces block above.

- [ ] **Step 4: Wire up the cues in `MascotFlyer`**: `launch` → `ignite()`, `fly` start → `cruise(buildSoundCurves(path, travelX), FLIGHT_MS / 1000)`, `approach` → `throttleDown(PHASE_MS.approach)`, `land` → `touchdown()`, effect cleanup → `stop()`.

- [ ] **Step 5: Run** `pnpm test && pnpm lint`. Expected: all pass.

- [ ] **Step 6: Review Focus 2 check.** In Playwright, load the page without clicking anything and wait for the first flight. Check `browser_console_messages`: there must be no `AudioContext` / autoplay warning. Then click anywhere and wait for the next flight (temporarily shorten `FLIGHT_GAP_MS`), and use `browser_evaluate` to check that an `AudioContext` exists and its `state === "running"`. Toggle mute and reload: the toggle still shows unmute, and `localStorage["mascot-sound"] === "off"`. Restore the constants.

- [ ] **Step 7: Commit** `feat(mascot): synthesised rocket sound with a mute toggle`.

---

### Task 8: Polish and final verification

**Files:** only what the checks below turn up.

- [ ] **Step 1: Run `review-animations`** (from Task 0) on the diff. Apply the easing/timing fixes that fit the Global Constraints.

- [ ] **Step 2: Review Focus 5.** In Playwright, take screenshots of a flight at 375 px width (80 px mascot) and at 1440 px, in both themes (toggle `html.light`). Pass: the pods, flames and tablet are visible and the anchors sit on the thigh and the hand.

- [ ] **Step 3: Run the `react-doctor` skill**, then `pnpm test && pnpm lint && pnpm build`. Expected: all pass. Every component file is under 600 lines (`wc -l components/portfolio/Chat/*.tsx`).

- [ ] **Step 4: Reduced motion.** Use Playwright `browser_emulate_media` with `reducedMotion: "reduce"`. Pass: no flight after 12 s, no sound, and the mascot is static with its tablet.

- [ ] **Step 5: Commit** `chore(mascot): polish flight choreography`.
