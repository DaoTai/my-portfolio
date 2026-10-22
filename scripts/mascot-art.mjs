/**
 * Draws the mascot's rig art from public/mascot.png, for scripts/slice-mascot.mjs to cut:
 *
 *   art/mascot/front-clean.png  the figure without its tablet and arms, jacket painted in
 *   art/mascot/front-arms.png   both arms hanging straight down from the shoulders
 *   art/mascot/back-body.png    the back of the head, hoodie, pants and shoes
 *   art/mascot/back-arms.png    the back of both arms
 *
 * Every sheet shares the source canvas (1139 × 1381), and the back sheets are drawn as seen
 * *through* the front, so each slice's back lines up with its face without any re-alignment.
 *
 *   node scripts/mascot-art.mjs
 */
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require(
  require.resolve("sharp", { paths: [require.resolve("next")] }),
);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "public/mascot.png");
const OUT = path.join(ROOT, "art/mascot");
const W = 1139;
const H = 1381;

/** The tablet together with the hand holding it. */
const TABLET = [
  [148, 600], [300, 582], [470, 585], [493, 650], [519, 750], [542, 835], [470, 852],
  [432, 905], [400, 958], [300, 975], [195, 965], [150, 900], [148, 720],
];
/** The left sleeve showing under the tablet. */
const LEFT_SLEEVE = [[128, 840], [388, 840], [388, 998], [128, 998]];
/** The raised right arm: fist, forearm and elbow. */
const RIGHT_ARM = [
  [818, 405], [1010, 405], [1010, 812], [862, 818], [808, 782], [790, 700], [795, 620],
  [808, 560],
];
/** Where the jacket is once the arms are gone; holes outside it stay empty. */
const TORSO = [
  [404, 578], [440, 560], [785, 566], [806, 590], [814, 640], [816, 760], [812, 880],
  [790, 930], [600, 962], [400, 966], [384, 930], [378, 840], [382, 720], [390, 630],
];
/** Glow streaks of the old tablet and orbit that would float free once it is gone. */
const STRAY = [
  [[0, 470], [180, 470], [180, 545], [384, 548], [378, 840], [384, 930], [400, 1000], [0, 1000]],
  [[818, 440], [1139, 440], [1139, 950], [818, 950]],
];
/** The bubble is cut from mascot.png as is; keep it out of the body's back. */
const BUBBLE = [[840, 150], [1139, 150], [1139, 425], [840, 425]];

/** Joints of the hanging arms (canvas px). */
export const ARM = {
  L: { shoulder: [408, 640], elbow: [408, 742], wrist: [408, 836] },
  R: { shoulder: [782, 640], elbow: [782, 742], wrist: [782, 836] },
};

/**
 * Gloves cut from the source: polygon, the wrist and the hand's tip in source px. The left one
 * holds the tablet from below; the right one points up at the bubble.
 */
const GLOVES = {
  L: {
    poly: [[166, 822], [205, 800], [300, 826], [338, 870], [336, 942], [300, 962], [205, 955], [162, 905]],
    wrist: [252, 958],
    tip: [262, 806],
  },
  R: {
    poly: [[880, 418], [962, 420], [988, 500], [992, 598], [968, 640], [902, 634], [834, 608], [814, 560], [818, 500], [852, 466]],
    wrist: [902, 628],
    tip: [916, 428],
  },
};

const pts = (poly) => poly.map(([x, y]) => `${x},${y}`).join(" ");
const svg = (inner, w = W, h = H) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${inner}</svg>`,
  );
const polys = (list, fill = "#fff") =>
  list.map((p) => `<polygon points="${pts(p)}" fill="${fill}"/>`).join("");
const png = (img) => img.png().toBuffer();

/** Keeps only what lies inside `mask` (an SVG or image buffer of the canvas). */
const clip = async (input, mask) =>
  png(sharp(input).composite([{ input: mask, blend: "dest-in" }]));

/**
 * Paints the holes by spreading the colours around them inwards: the image and its coverage are
 * blurred alike and divided, so the fill keeps the jacket's tones without a hard seam.
 */
const spread = async (image, sigma) => {
  const { data, info } = await sharp(image).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const n = info.width * info.height;
  const pre = Buffer.alloc(n * 3);
  const cover = Buffer.alloc(n);
  for (let i = 0; i < n; i++) {
    const a = data[i * 4 + 3] > 200 ? 255 : 0;
    cover[i] = a;
    for (let c = 0; c < 3; c++) pre[i * 3 + c] = a ? data[i * 4 + c] : 0;
  }
  const raw = (buf, channels) =>
    sharp(buf, { raw: { width: info.width, height: info.height, channels } }).blur(sigma).raw().toBuffer();
  const [p, m] = await Promise.all([raw(pre, 3), raw(cover, 1)]);
  const out = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    const k = m[i] / 255;
    // A touch darker than the surroundings: the hidden side of the jacket is in shade.
    for (let c = 0; c < 3; c++) out[i * 4 + c] = k > 0.001 ? Math.min(255, (p[i * 3 + c] / k) * 0.8) : 8;
    out[i * 4 + 3] = 255;
  }
  return png(sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }));
};

const GLOW = `<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;

/** Violet neon piping, as on the jacket. */
const piping = (d, width = 4) =>
  `<path d="${d}" fill="none" stroke="#7c6cff" stroke-width="${width}" stroke-linecap="round" filter="url(#glow)"/>`;

const frontClean = async () => {
  const holes = svg(polys([TABLET, LEFT_SLEEVE, RIGHT_ARM]));
  const cut = await png(
    sharp(SRC)
      .ensureAlpha()
      .composite([{ input: holes, blend: "dest-out" }, { input: svg(polys(STRAY)), blend: "dest-out" }]),
  );
  const fill = await clip(await spread(cut, 22), svg(polys([TORSO])));
  const seams = svg(
    `<defs>${GLOW}</defs>` +
      // Side seams and a hem band where the tablet and arm used to hide them.
      `<linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a2f6a" stop-opacity="0"/><stop offset="0.5" stop-color="#2a2f6a" stop-opacity="0.55"/><stop offset="1" stop-color="#2a2f6a" stop-opacity="0"/></linearGradient>` +
      // A soft fold of light down the front panel, then its seams, a pocket and the hem band.
      `<path d="M420 600 C 470 700 480 820 450 950 L 520 950 C 540 820 520 700 470 600 Z" fill="url(#sheen)"/>` +
      `<path d="M404 640 C 392 740 392 840 404 940" fill="none" stroke="#000" stroke-opacity="0.5" stroke-width="10"/>` +
      piping("M410 650 C 400 740 400 830 410 925", 3) +
      piping("M440 610 L 492 660 L 492 760", 3) +
      `<path d="M430 840 L 520 830" stroke="#000" stroke-opacity="0.55" stroke-width="5"/>` +
      piping("M432 846 L 516 836", 2) +
      piping("M800 640 C 806 740 806 820 796 905", 3) +
      piping("M396 922 C 440 934 500 940 560 936", 4),
  );
  const holeDetail = await clip(seams, svg(polys([TABLET, LEFT_SLEEVE, RIGHT_ARM])));
  return png(
    sharp(cut).composite([
      { input: fill, blend: "dest-over" },
      { input: await clip(holeDetail, svg(polys([TORSO]))) },
    ]),
  );
};

/** One hanging arm: upper sleeve, puffy forearm sleeve and a glowing cuff, drawn as vectors. */
const sleeveSvg = (side, back) => {
  const { shoulder: [x, y0], elbow: [, y1], wrist: [, y2] } = ARM[side];
  const out = side === "L" ? -1 : 1;
  const tone = back
    ? ["#05061a", "#151839", "#0c0e2a", "#04051a"]
    : ["#07081b", "#272b62", "#151839", "#05061a"];
  const grad = (id) =>
    `<linearGradient id="${id}" x1="${side === "L" ? 0 : 1}" x2="${side === "L" ? 1 : 0}" y1="0" y2="0">` +
    tone.map((c, i) => `<stop offset="${[0, 0.4, 0.72, 1][i]}" stop-color="${c}"/>`).join("") +
    `</linearGradient>`;
  const pipeX = x + out * 30;
  return (
    `<defs>${GLOW}${grad(`s${side}`)}</defs>` +
    // Upper arm, then the forearm overlapping it at the elbow.
    `<rect x="${x - 44}" y="${y0 - 36}" width="88" height="${y1 - y0 + 66}" rx="44" fill="url(#s${side})"/>` +
    `<rect x="${x - 52}" y="${y1 - 26}" width="104" height="${y2 - y1 + 34}" rx="46" fill="url(#s${side})"/>` +
    // Fabric folds.
    `<path d="M${x - 40} ${y1 + 6} Q ${x} ${y1 + 22} ${x + 40} ${y1 + 6}" fill="none" stroke="#000" stroke-opacity="0.45" stroke-width="5"/>` +
    `<path d="M${x - 44} ${y2 - 26} Q ${x} ${y2 - 12} ${x + 44} ${y2 - 26}" fill="none" stroke="#000" stroke-opacity="0.35" stroke-width="4"/>` +
    piping(`M${pipeX} ${y0 - 4} L ${pipeX} ${y1 - 18}`, 3) +
    piping(`M${pipeX + out * 6} ${y1 + 4} L ${pipeX + out * 6} ${y2 - 30}`, 3) +
    // Cuff ring at the wrist.
    `<rect x="${x - 44}" y="${y2 - 12}" width="88" height="16" rx="8" fill="${back ? "#3b4a8c" : "#c7d2fe"}" filter="url(#glow)"/>` +
    `<rect x="${x - 40}" y="${y2 - 6}" width="80" height="5" rx="2.5" fill="#67e8f9" opacity="${back ? 0.5 : 0.9}"/>`
  );
};

/** The glove cut from the source, turned to hang down, with its wrist at the arm's wrist. */
const placedGlove = async (side) => {
  const g = GLOVES[side];
  const xs = g.poly.map((p) => p[0]);
  const ys = g.poly.map((p) => p[1]);
  const box = { left: Math.min(...xs), top: Math.min(...ys), width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys) };
  const local = g.poly.map(([x, y]) => [x - box.left, y - box.top]);
  const crop = await clip(
    await png(sharp(SRC).ensureAlpha().extract(box)),
    svg(polys([local]), box.width, box.height),
  );
  // Turn the wrist→tip direction to point straight down.
  const dir = (Math.atan2(g.tip[1] - g.wrist[1], g.tip[0] - g.wrist[0]) * 180) / Math.PI;
  const turn = 90 - dir;
  const rotated = await png(sharp(crop).rotate(turn, { background: "#0000" }));
  const meta = await sharp(rotated).metadata();
  const r = (turn * Math.PI) / 180;
  const [px, py] = [g.wrist[0] - box.left - box.width / 2, g.wrist[1] - box.top - box.height / 2];
  const wx = meta.width / 2 + px * Math.cos(r) - py * Math.sin(r);
  const wy = meta.height / 2 + px * Math.sin(r) + py * Math.cos(r);
  const [ax, ay] = ARM[side].wrist;
  const tipLen = Math.hypot(g.tip[0] - g.wrist[0], g.tip[1] - g.wrist[1]);
  // Sit the cuff a little up inside the glove's own wrist band.
  return { input: rotated, left: Math.round(ax - wx), top: Math.round(ay - wx * 0 - wy - 6), tip: [ax, ay + tipLen - 6] };
};

const frontArms = async () => {
  const gloves = await Promise.all(["L", "R"].map(placedGlove));
  const sleeves = svg(sleeveSvg("L", false) + sleeveSvg("R", false));
  const base = sharp({ create: { width: W, height: H, channels: 4, background: "#0000" } });
  const img = await png(base.composite([{ input: sleeves }, ...gloves.map(({ input, left, top }) => ({ input, left, top }))]));
  return { img, tips: { L: gloves[0].tip, R: gloves[1].tip } };
};

/** Solid coverage of a sheet (ignores the soft glow halo around the figure). */
const solid = async (image) => {
  const { data, info } = await sharp(image).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4, 255);
  for (let i = 0; i < info.width * info.height; i++) out[i * 4 + 3] = data[i * 4 + 3] > 150 ? 255 : 0;
  return png(sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).blur(0.6));
};

/**
 * The "TD" monogram: a T bar and a D bowl. Drawn mirrored, because the back sheets are seen
 * through the front and are flipped back when the slices turn round.
 */
const monogram = (x, y, s, color) =>
  `<g transform="translate(${x} ${y}) scale(${-s} ${s})" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)">` +
  `<path d="M-38 -26 H 8 M-16 -26 V 30"/><path d="M8 -26 H 14 C 44 -26 50 2 50 2 C 50 2 44 30 14 30 H 4"/></g>`;

const backBody = async (front) => {
  const art = svg(
    `<defs>${GLOW}` +
      `<radialGradient id="shell" cx="0.45" cy="0.3" r="0.75"><stop offset="0" stop-color="#f6f8fd"/><stop offset="0.55" stop-color="#cfd5e8"/><stop offset="1" stop-color="#7d86a8"/></radialGradient>` +
      `<linearGradient id="hoodie" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1e48"/><stop offset="0.5" stop-color="#0d0f2a"/><stop offset="1" stop-color="#06071a"/></linearGradient>` +
      `<linearGradient id="pants" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#05061a"/><stop offset="0.45" stop-color="#181b42"/><stop offset="1" stop-color="#05061a"/></linearGradient>` +
      `</defs>` +
      // Helmet shell, with a dark spine panel and a glowing vent band across the back.
      `<rect x="0" y="0" width="${W}" height="545" fill="url(#shell)"/>` +
      `<path d="M500 40 C 520 30 610 30 630 42 L 640 300 C 600 312 530 312 492 300 Z" fill="#111430"/>` +
      monogram(566, 140, 0.9, "#a5f3fc") +
      `<path d="M250 330 C 420 300 700 300 840 320 L 836 372 C 700 352 420 352 256 384 Z" fill="#141838"/>` +
      `<path d="M262 356 C 420 330 700 330 832 346" fill="none" stroke="#67e8f9" stroke-width="5" filter="url(#glow)"/>` +
      // Headphone cups on both sides.
      `<circle cx="262" cy="410" r="72" fill="#0c0f2a"/><circle cx="262" cy="410" r="52" fill="none" stroke="#38bdf8" stroke-width="10" filter="url(#glow)"/>` +
      `<circle cx="826" cy="360" r="58" fill="#0c0f2a"/><circle cx="826" cy="360" r="40" fill="none" stroke="#38bdf8" stroke-width="8" filter="url(#glow)"/>` +
      `<path d="M300 470 C 420 520 660 520 790 455 L 800 545 L 290 545 Z" fill="#090b20"/>` +
      // Hoodie: hood, centre seam, shoulder piping, monogram and hem band.
      `<rect x="0" y="545" width="${W}" height="${975 - 545}" fill="url(#hoodie)"/>` +
      `<path d="M392 560 C 450 530 740 528 800 566 C 790 660 700 720 596 724 C 490 720 404 660 392 560 Z" fill="#23275a"/>` +
      piping("M400 566 C 420 650 500 716 596 722 C 692 716 778 650 796 572") +
      piping("M596 726 L 596 905", 3) +
      piping("M430 640 L 470 600", 3) +
      piping("M762 640 L 722 600", 3) +
      monogram(600, 815, 1.25, "#e0e7ff") +
      piping("M396 915 C 500 930 700 930 806 905", 5) +
      // Pants: dark legs with side cargo pockets and piping.
      `<rect x="0" y="975" width="${W}" height="${1175 - 975}" fill="url(#pants)"/>` +
      `<rect x="388" y="1000" width="82" height="92" rx="10" fill="#1d2150" stroke="#2d3270" stroke-width="3"/>` +
      `<rect x="684" y="1014" width="80" height="100" rx="10" fill="#1d2150" stroke="#2d3270" stroke-width="3"/>` +
      piping("M450 1012 L 446 1080", 3) +
      piping("M748 1124 L 760 1160", 3) +
      `<path d="M578 975 L 576 1150" stroke="#000" stroke-opacity="0.5" stroke-width="6"/>` +
      // Shoes from behind: black uppers, white heel counters, glowing heel tabs and soles.
      `<rect x="0" y="1175" width="${W}" height="${H - 1175}" fill="#0b0c1e"/>` +
      `<path d="M360 1290 C 400 1250 520 1250 560 1290 L 560 1381 L 330 1381 Z" fill="#d5dbec"/>` +
      `<path d="M560 1300 C 600 1260 720 1262 760 1300 L 760 1381 L 540 1381 Z" fill="#d5dbec"/>` +
      `<rect x="420" y="1180" width="70" height="80" rx="14" fill="#151838"/>` +
      `<rect x="612" y="1188" width="70" height="80" rx="14" fill="#151838"/>` +
      piping("M440 1200 L 470 1200", 4) +
      piping("M632 1208 L 662 1208", 4) +
      `<rect x="0" y="1352" width="${W}" height="30" fill="#232a55"/>`,
  );
  const bubbleOut = svg(polys([BUBBLE, ...STRAY]));
  const mask = await png(sharp(await solid(front)).composite([{ input: bubbleOut, blend: "dest-out" }]));
  return clip(art, mask);
};

const backArms = async (arms) => {
  const glove = (side) => {
    const [x, y] = ARM[side].wrist;
    return (
      `<rect x="${x - 90}" y="${y}" width="180" height="230" fill="#0a0c24"/>` +
      `<path d="M${x - 50} ${y + 70} Q ${x} ${y + 90} ${x + 50} ${y + 70}" fill="none" stroke="#38bdf8" stroke-width="5" filter="url(#glow)"/>`
    );
  };
  const art = svg(sleeveSvg("L", true) + sleeveSvg("R", true) + glove("L") + glove("R"));
  // The sleeves are drawn whole; only the gloves need their outline from the front sheet.
  return clip(art, await solid(arms));
};

const main = async () => {
  await mkdir(OUT, { recursive: true });
  const front = await frontClean();
  const { img: arms, tips } = await frontArms();
  const write = (name, buf) => sharp(buf).png({ compressionLevel: 9 }).toFile(path.join(OUT, name));
  await Promise.all([
    write("front-clean.png", front),
    write("front-arms.png", arms),
    write("back-body.png", await backBody(front)),
    write("back-arms.png", await backArms(arms)),
  ]);
  console.log("glove tips (canvas px):", JSON.stringify(tips));
  console.log(`wrote ${path.relative(ROOT, OUT)}/{front-clean,front-arms,back-body,back-arms}.png`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
