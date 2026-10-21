/**
 * Cuts the mascot's art sheets (art/mascot/*.png, drawn by scripts/mascot-art.mjs) into rig
 * layers (public/mascot/*.webp) and writes their boxes, pivots, parents and overlay anchors to
 * lib/mascot-parts.ts. Run after changing the art:
 *
 *   node scripts/mascot-art.mjs && node scripts/slice-mascot.mjs
 *
 * All coordinates below are in source pixels (1139 × 1381). Every sheet shares that canvas, and
 * each back sheet is drawn as seen through the front, so a slice's back is cut with its own mask.
 */
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// sharp ships with Next.js as an optional dependency, so resolve it through next.
const require = createRequire(import.meta.url);
const sharp = require(
  require.resolve("sharp", { paths: [require.resolve("next")] }),
);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ART = path.join(ROOT, "art/mascot");
const OUT_DIR = path.join(ROOT, "public/mascot");
const OUT_TS = path.join(ROOT, "lib/mascot-parts.ts");
/** Output width of the full canvas: ~3x the largest on-screen size. */
const OUT_W = 560;
const QUALITY = 86;

const SHEETS = {
  body: { front: path.join(ART, "front-clean.png"), back: path.join(ART, "back-body.png") },
  arms: { front: path.join(ART, "front-arms.png"), back: path.join(ART, "back-arms.png") },
  // The bubble is a flat panel: its back is its own face, seen mirrored.
  bubble: { front: path.join(ROOT, "public/mascot.png"), back: null },
};

/** Seam between the legs, shared by both leg polygons (top → bottom). */
const LEG_SEAM = [
  [578, 950],
  [581, 1040],
  [576, 1128],
  [553, 1150],
  [540, 1200],
  [526, 1250],
  [514, 1290],
  [518, 1345],
  [506, 1381],
];
const LEG_L = [[310, 950], ...LEG_SEAM, [290, 1381], [290, 1100]];
const LEG_R = [[820, 950], [820, 1381], ...[...LEG_SEAM].reverse()];
/** Knee line: the thigh runs past it and the shin starts above it, so a bend shows no gap. */
const THIGH_END = 1150;
const SHIN_START = 1112;

const HEAD = [
  [188, 30], [840, 30], [840, 300], [830, 420], [800, 462], [722, 496], [622, 515],
  [522, 522], [422, 526], [342, 532], [290, 540], [228, 528], [188, 500],
];

const BUBBLE = [[840, 160], [1139, 160], [1139, 420], [840, 420]];

/** Hanging arms in art/mascot/front-arms.png: the elbow overlap goes to both segments. */
const upperArm = (x) => [[x - 52, 596], [x + 52, 596], [x + 52, 770], [x - 52, 770]];
const forearm = (x) => [[x - 100, 712], [x + 100, 712], [x + 100, 1060], [x - 100, 1060]];

const rect = (top, bottom) => [[0, top], [1139, top], [1139, bottom], [0, bottom]];

/**
 * Back → front. `pivot` is the joint the part turns around, `parent` the part it hangs from,
 * and `depth` its offset (px at 112 px wide) toward the viewer. `clip` trims the polygon to a
 * band; `minus` cuts other polygons out of it.
 */
const PARTS = {
  torso: {
    sheet: "body",
    poly: rect(0, 985),
    minus: [HEAD, BUBBLE],
    pivot: [590, 965],
    parent: null,
    depth: 0,
    anchors: { pocket: [474, 840] },
  },
  thighL: {
    sheet: "body",
    poly: LEG_L,
    clip: [940, THIGH_END],
    pivot: [450, 962],
    parent: "torso",
    depth: -4,
    anchors: { rocket: [378, 1060] },
  },
  shinL: {
    sheet: "body",
    poly: LEG_L,
    clip: [SHIN_START, 1381],
    pivot: [445, 1125],
    parent: "thighL",
    depth: 0,
    anchors: { sole: [432, 1372] },
  },
  thighR: {
    sheet: "body",
    poly: LEG_R,
    clip: [940, THIGH_END],
    pivot: [670, 962],
    parent: "torso",
    depth: -2,
    anchors: { rocket: [790, 1075] },
  },
  shinR: {
    sheet: "body",
    poly: LEG_R,
    clip: [SHIN_START, 1381],
    pivot: [655, 1125],
    parent: "thighR",
    depth: 0,
    anchors: { sole: [618, 1376] },
  },
  head: {
    sheet: "body",
    poly: HEAD,
    pivot: [545, 520],
    parent: "torso",
    depth: 6,
    anchors: { eyeL: [500, 360], eyeR: [717, 338], mouth: [612, 418] },
    ellipses: { visor: [585, 355, 222, 146] },
  },
  upperArmL: {
    sheet: "arms",
    poly: upperArm(408),
    pivot: [408, 640],
    parent: "torso",
    depth: 10,
    anchors: {},
  },
  forearmL: {
    sheet: "arms",
    poly: forearm(408),
    pivot: [408, 742],
    parent: "upperArmL",
    depth: 4,
    anchors: { hand: [408, 912] },
  },
  upperArmR: {
    sheet: "arms",
    poly: upperArm(782),
    pivot: [782, 640],
    parent: "torso",
    depth: 10,
    anchors: {},
  },
  forearmR: {
    sheet: "arms",
    poly: forearm(782),
    pivot: [782, 742],
    parent: "upperArmR",
    depth: 4,
    anchors: { hand: [782, 1026] },
  },
  bubble: {
    sheet: "bubble",
    poly: BUBBLE,
    pivot: [985, 300],
    parent: null,
    depth: 34,
    anchors: { dot1: [932, 292], dot2: [985, 292], dot3: [1037, 290] },
  },
};

/**
 * Dark fill behind the torso where the head is cut out, so a nodding head uncovers a neck
 * instead of a hole. Clipped to the cut-out, it never shows while the head sits in place.
 */
const NECK = [
  [390, 480], [790, 440], [790, 505], [720, 508], [600, 528], [440, 538], [390, 538],
];
const NECK_COLOR = "#07081a";

const pts = (poly) => poly.map(([x, y]) => `${x},${y}`).join(" ");

const polySvg = (W, H, polys, fill = "#fff") =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">` +
      polys
        .map((p) => `<polygon points="${pts(p)}" fill="${fill}"/>`)
        .join("") +
      `</svg>`,
  );

const bounds = (poly, W, H, [top, bottom] = [0, H]) => {
  const xs = poly.map((p) => p[0]);
  const ys = poly.map((p) => p[1]);
  const left = Math.max(0, Math.min(...xs));
  const y0 = Math.max(0, top, Math.min(...ys));
  return {
    left,
    top: y0,
    width: Math.min(W, Math.max(...xs)) - left,
    height: Math.min(H, bottom, Math.max(...ys)) - y0,
  };
};

const pct = (v, of) => +((v / of) * 100).toFixed(3);

/**
 * Solid silhouettes of each slice for its thickness in 3D, lit from the top left: a bright rim
 * just behind the face and the sides. Baked rather than CSS-masked, because every masked layer
 * costs a render pass per frame.
 */
const SKINS = {
  rim: ["#a5f3fc", "#8b5cf6"],
  side: ["#262d5c", "#090b20"],
};
/** The white helmet's shell is light on its sides too. */
const SKIN_OVERRIDES = { head: { side: ["#dfe4f2", "#6b7396"] } };

const gradientSvg = (w, h, [from, to]) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${from}"/><stop offset="0.75" stop-color="${to}"/>` +
      `</linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/></svg>`,
  );

/** The part's pixels from one sheet, masked and cropped to its box at output scale. */
const cutLayer = async (file, part, W, H, box, scale) => {
  const composites = [{ input: polySvg(W, H, [part.poly]), blend: "dest-in" }];
  if (part.clip) {
    composites.push({ input: polySvg(W, H, [rect(...part.clip)]), blend: "dest-in" });
  }
  if (part.minus) {
    composites.push({ input: polySvg(W, H, part.minus), blend: "dest-out" });
  }
  let layer = sharp(await sharp(file).ensureAlpha().composite(composites).png().toBuffer());
  if (part === PARTS.torso) {
    const fill = await sharp(polySvg(W, H, [NECK], NECK_COLOR))
      .composite([{ input: polySvg(W, H, [HEAD]), blend: "dest-in" }])
      .png()
      .toBuffer();
    layer = sharp(await layer.png().toBuffer()).composite([
      { input: fill, blend: "dest-over" },
    ]);
  }
  return sharp(await layer.png().toBuffer())
    .extract(box)
    .resize(Math.round(box.width * scale))
    .png()
    .toBuffer();
};

const main = async () => {
  const { width: W, height: H } = await sharp(SHEETS.body.front).metadata();
  const scale = OUT_W / W;
  await mkdir(OUT_DIR, { recursive: true });

  const out = {};
  for (const [name, part] of Object.entries(PARTS)) {
    const sheet = SHEETS[part.sheet];
    const box = bounds(part.poly, W, H, part.clip);
    const slice = await cutLayer(sheet.front, part, W, H, box, scale);
    const back = sheet.back ? await cutLayer(sheet.back, part, W, H, box, scale) : slice;

    const file = path.join(OUT_DIR, `${name}.webp`);
    const webp = (buf, q = QUALITY) =>
      sharp(buf).webp({ quality: q, alphaQuality: 90, effort: 6 });
    await webp(slice).toFile(file);
    await webp(back).toFile(path.join(OUT_DIR, `${name}-back.webp`));

    const { width: w, height: h } = await sharp(slice).metadata();
    const skins = {};
    for (const [skin, base] of Object.entries(SKINS)) {
      const colors = SKIN_OVERRIDES[name]?.[skin] ?? base;
      // Flat colour, so half the resolution of the slice is plenty.
      const silhouette = await sharp(gradientSvg(w, h, colors))
        .composite([{ input: slice, blend: "dest-in" }])
        .png()
        .toBuffer();
      await sharp(silhouette)
        .resize(Math.round(w / 2))
        .webp({ quality: 80, alphaQuality: 80, effort: 6 })
        .toFile(path.join(OUT_DIR, `${name}-${skin}.webp`));
      skins[skin] = `/mascot/${name}-${skin}.webp`;
    }

    const rel = ([x, y]) => ({
      x: pct(x - box.left, box.width),
      y: pct(y - box.top, box.height),
    });
    const entry = {
      src: `/mascot/${name}.webp`,
      back: `/mascot/${name}-back.webp`,
      skins,
      box: {
        left: pct(box.left, W),
        top: pct(box.top, H),
        width: pct(box.width, W),
        height: pct(box.height, H),
      },
      origin: rel(part.pivot),
      parent: part.parent,
      depth: part.depth,
      anchors: Object.fromEntries(
        Object.entries(part.anchors).map(([k, p]) => [k, rel(p)]),
      ),
    };
    if (part.ellipses) {
      entry.ellipses = Object.fromEntries(
        Object.entries(part.ellipses).map(([k, [cx, cy, rx, ry]]) => [
          k,
          { ...rel([cx, cy]), rx: pct(rx, box.width), ry: pct(ry, box.height) },
        ]),
      );
    }
    out[name] = entry;
    console.log(
      `${name.padEnd(9)} ${box.width}x${box.height} -> ${path.relative(ROOT, file)}`,
    );
  }

  const ts =
    `// Generated by scripts/slice-mascot.mjs — do not edit by hand.\n` +
    `// Boxes and anchors are percentages: boxes of the full canvas, anchors of their own part.\n\n` +
    `export const MASCOT_ASPECT = ${W} / ${H};\n\n` +
    `export const MASCOT_PARTS = ${JSON.stringify(out, null, 2)} as const;\n\n` +
    `export type MascotPartName = keyof typeof MASCOT_PARTS;\n`;
  await writeFile(OUT_TS, ts);
  console.log(`wrote ${path.relative(ROOT, OUT_TS)}`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
