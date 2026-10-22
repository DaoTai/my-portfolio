# Mascot flight choreography — design

**Date:** 2026-10-21 · **Owner:** Dao Duc Tai · **Status:** approved direction, plan pending review

## Problem

The flying mascot (`components/portfolio/Chat/Mascot*.tsx`) reads as a flat sticker in flight:

- The tablet and the left hand are one slice and the left arm is baked into the body, so the
  mascot cannot put the tablet away or move its arms in any meaningful way.
- Each leg is one slice, so it cannot tuck its legs or bend its knees on landing.
- When it turns its back (the barrel roll in `lib/mascot-flight.ts`), what shows is a dark
  gradient in the outline of the *front* (`public/mascot/*-back.webp`), not a back view.
- Flights are silent.

## What the user asked for (verbatim intent)

1. **Getting ready to fly:** put the tablet into a pocket, bring both hands together at the centre,
   bend both legs to load up for the jump.
2. **Two rockets fade in**, one beside each leg.
3. **In flight:** both arms straight out, both legs tucked. When it turns its back it must look like the
   mascot's real back, not a flat picture. Add a **sound** while it flies.
4. **Getting ready to land:** bring the arms in and take the tablet back out. Both feet touch down
   naturally, the knees **bend for 1–2 s**, then it stands up straight as usual.

## Decisions

- **Approach: keep the 2.5D CSS rig and give it new art** (user choice). No three.js and no new
  runtime dependencies.
- **Sound: synthesised with Web Audio, plus a mute toggle** (user choice). No audio files.
- **New art comes from AI image editing of `public/mascot.png`**, which the user makes (brief below),
  and is cut by the existing slicer (`scripts/slice-mascot.mjs`), extended to read more than one
  source image.
- **The tablet is redrawn as SVG** (a holo panel), so it can be held, put away and taken out
  separately from the hand.
- **Articulated limbs:** upper arm + forearm per side, thigh + shin per side, nested so a child
  follows its parent joint. Arm joints turn in the screen plane. Hip and knee joints turn in 3D
  (`rotateX`), so tucked legs look bent from the side, not squashed.
- **Poses are data** (`lib/mascot-poses.ts`), applied as registered CSS custom properties
  (`@property`) on the rig, with CSS transitions between them. Any phase change blends smoothly,
  including an interrupted one.
- **Rockets** are SVG pods on the outer side of each thigh, built from two crossed planes so they
  keep their volume as the mascot rolls. They replace the boot flames, and the trail canvas keeps
  reading `.mascot-flame-tip`.
- **Back faces** come from a back-view art sheet, mounted `rotateY(180deg)` behind every slice.

## Phase timeline (ms)

| Phase | Starts | Lasts | What happens |
|---|---|---|---|
| stow | 0 | 700 | left hand goes to the jacket pocket, tablet shrinks into it |
| ready | 700 | 650 | hands come together at the chest, knees bend, rockets fade in (throttle 0.3) |
| launch | 1350 | 380 | the jump: legs push straight, throttle 0.6 |
| fly | 1730 | 6600 | arms straight, spread a little down along the body (raised chibi arms would cover the visor), legs tucked, throttle 1, cruise sound |
| approach | 8330 | 900 | flight path still running: arms come in, tablet comes out, legs reach down, throttle 0.4 |
| land | 9230 | 1400 | touchdown thud, knees bent and holding, rockets fade out |
| recover | 10630 | 600 | stands straight, idle dance resumes |

The flight path itself (`buildFlightPath`, 7.5 s) runs from `fly.at` to `land.at` (fly + approach).

## Art kit (made by the user)

All files are PNG with transparency, saved in `art/mascot/` (source art, not served):

| File | Content | How |
|---|---|---|
| `front-clean.png` | `mascot.png` with the **tablet and both arms removed** and the jacket/torso painted in where they were. Everything else unchanged, same 1139×1381 canvas. | generative fill / inpaint on `mascot.png` |
| `front-tpose.png` | the same character, front view, **T-pose** (arms straight out to the sides). Left glove relaxed and open. Right glove with the index finger pointing along the arm, as in the original. | image-to-image from `mascot.png` |
| `back-tpose.png` | the same character **seen from behind**, T-pose: back of the helmet with headphones and the TD logo, hood, back of the jacket, back of the pants, heels of the shoes. | image-to-image from `front-tpose.png` |

Prompt seed (English, for the image model): *"Same chibi robot character as the reference: white
helmet with dark visor and glowing cyan headphones, black techwear hoodie with violet neon piping and
TD logos, black cargo pants, black-white sneakers. Full body, [front | back] view, T-pose with arms
straight out to the sides, neutral standing legs, same proportions and colours, transparent
background, no glow halo, no props."*

## Out of scope

A real 3D model, a dedicated side-view sheet, changing the flight path, a new chat bubble behaviour.
