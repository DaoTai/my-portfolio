/**
 * Cuts public/mascot.png into rig layers (public/mascot/*.webp) and writes their boxes, pivots
 * and overlay anchors to lib/mascot-parts.ts. Run after replacing the source art:
 *
 *   node scripts/slice-mascot.mjs
 *
 * All coordinates below are in source pixels (1139 × 1381).
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
const SRC = path.join(ROOT, "public/mascot.png");
const OUT_DIR = path.join(ROOT, "public/mascot");
const OUT_TS = path.join(ROOT, "lib/mascot-parts.ts");
/** Output width of the full canvas: ~3x the largest on-screen size. */
const OUT_W = 560;
const QUALITY = 86;

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

/** Back → front. `pivot` is the joint the part rotates around. */
const PARTS = {
  legL: {
    poly: [[310, 950], ...LEG_SEAM, [290, 1381], [290, 1100]],
    pivot: [450, 960],
    anchors: { flame: [432, 1335] },
  },
  legR: {
    poly: [[820, 950], [820, 1381], ...[...LEG_SEAM].reverse()],
    pivot: [670, 960],
    anchors: { flame: [618, 1360] },
  },
  body: { poly: null, pivot: [560, 1100], anchors: {} },
  head: {
    poly: [
      [188, 30],
      [840, 30],
      [840, 300],
      [830, 420],
      [800, 462],
      [722, 496],
      [622, 515],
      [522, 522],
      [422, 526],
      [342, 532],
      [290, 540],
      [228, 528],
      [188, 500],
    ],
    pivot: [545, 520],
    anchors: { eyeL: [500, 360], eyeR: [717, 338], mouth: [612, 418] },
    ellipses: { visor: [585, 355, 222, 146] },
  },
  tablet: {
    poly: [
      [148, 600],
      [300, 582],
      [470, 585],
      [493, 650],
      [519, 750],
      [542, 835],
      [470, 852],
      [432, 905],
      [400, 950],
      [300, 958],
      [195, 945],
      [185, 800],
      [148, 720],
    ],
    pivot: [415, 905],
    anchors: {},
    clips: {
      screen: [
        [165, 636],
        [462, 600],
        [527, 826],
        [375, 840],
        [370, 795],
        [215, 792],
      ],
    },
  },
  arm: {
    poly: [
      [822, 420],
      [1000, 420],
      [1000, 790],
      [880, 795],
      [830, 770],
      [805, 740],
      [798, 700],
      [808, 620],
      [818, 560],
    ],
    pivot: [800, 700],
    anchors: {},
  },
  bubble: {
    poly: [
      [840, 160],
      [1139, 160],
      [1139, 420],
      [840, 420],
    ],
    pivot: [985, 300],
    anchors: { dot1: [932, 292], dot2: [985, 292], dot3: [1037, 290] },
  },
};

/** Everything under the jacket hem belongs to the legs. */
const BELOW_HEM = [
  [0, 985],
  [1139, 985],
  [1139, 1381],
  [0, 1381],
];

/**
 * Dark fill behind the body, so a moving part uncovers a neck or jacket instead of a hole.
 * Clipped to the cut-outs, it never shows while the parts sit in place.
 */
const BACKFILL = [
  [
    [390, 480],
    [790, 440],
    [790, 505],
    [720, 508],
    [600, 528],
    [440, 538],
    [390, 538],
  ],
  [
    [425, 600],
    [493, 650],
    [519, 750],
    [542, 835],
    [470, 852],
    [432, 905],
    [400, 950],
    [380, 950],
    [380, 850],
    [425, 700],
  ],
];
const BACKFILL_COLOR = "#07081a";

const pts = (poly) => poly.map(([x, y]) => `${x},${y}`).join(" ");

const polySvg = (W, H, polys, fill = "#fff") =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">` +
      polys
        .map((p) => `<polygon points="${pts(p)}" fill="${fill}"/>`)
        .join("") +
      `</svg>`,
  );

const bounds = (poly, W, H) => {
  const xs = poly.map((p) => p[0]);
  const ys = poly.map((p) => p[1]);
  const left = Math.max(0, Math.min(...xs));
  const top = Math.max(0, Math.min(...ys));
  return {
    left,
    top,
    width: Math.min(W, Math.max(...xs)) - left,
    height: Math.min(H, Math.max(...ys)) - top,
  };
};

const pct = (v, of) => +((v / of) * 100).toFixed(3);

/**
 * Solid silhouettes of each slice for its thickness in 3D, lit from the top left: a bright rim
 * just behind the face, the sides, and the back plate (also used to shade the face as it turns).
 * Baked rather than CSS-masked, because every masked layer costs a render pass per frame.
 */
const SKINS = {
  rim: ["#a5f3fc", "#8b5cf6"],
  side: ["#4a5a8c", "#161c40"],
  back: ["#2c3768", "#0b0f27"],
};

const gradientSvg = (w, h, [from, to]) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${from}"/><stop offset="0.75" stop-color="${to}"/>` +
      `</linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/></svg>`,
  );

const main = async () => {
  const { width: W, height: H } = await sharp(SRC).metadata();
  const scale = OUT_W / W;
  await mkdir(OUT_DIR, { recursive: true });

  const others = Object.entries(PARTS)
    .filter(([name]) => name !== "body" && !name.startsWith("leg"))
    .map(([, p]) => p.poly);

  const out = {};
  for (const [name, part] of Object.entries(PARTS)) {
    const isBody = part.poly === null;
    // The body keeps everything except the other parts; each part keeps only its polygon.
    let layer = sharp(SRC)
      .ensureAlpha()
      .composite([
        isBody
          ? { input: polySvg(W, H, [...others, BELOW_HEM]), blend: "dest-out" }
          : { input: polySvg(W, H, [part.poly]), blend: "dest-in" },
      ]);

    if (isBody) {
      const fill = await sharp(polySvg(W, H, BACKFILL, BACKFILL_COLOR))
        .composite([{ input: polySvg(W, H, others), blend: "dest-in" }])
        .png()
        .toBuffer();
      layer = sharp(await layer.png().toBuffer()).composite([
        { input: fill, blend: "dest-over" },
      ]);
    }

    const box = isBody
      ? { left: 0, top: 0, width: W, height: H }
      : bounds(part.poly, W, H);
    const file = path.join(OUT_DIR, `${name}.webp`);
    const slice = await sharp(await layer.png().toBuffer())
      .extract(box)
      .resize(Math.round(box.width * scale))
      .png()
      .toBuffer();
    await sharp(slice)
      .webp({ quality: QUALITY, alphaQuality: 90, effort: 6 })
      .toFile(file);

    const { width: w, height: h } = await sharp(slice).metadata();
    const skins = {};
    for (const [skin, colors] of Object.entries(SKINS)) {
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
      skins,
      box: {
        left: pct(box.left, W),
        top: pct(box.top, H),
        width: pct(box.width, W),
        height: pct(box.height, H),
      },
      origin: rel(part.pivot),
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
    if (part.clips) {
      entry.clips = Object.fromEntries(
        Object.entries(part.clips).map(([k, poly]) => [
          k,
          `polygon(${poly
            .map((p) => {
              const r = rel(p);
              return `${r.x}% ${r.y}%`;
            })
            .join(", ")})`,
        ]),
      );
    }
    out[name] = entry;
    console.log(
      `${name.padEnd(7)} ${box.width}x${box.height} -> ${path.relative(ROOT, file)}`,
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
