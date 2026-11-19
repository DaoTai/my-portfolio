/**
 * Geometry for the mobile tab bar: a rounded bar with a smooth U-shaped notch bitten out of its
 * top edge, where the marble rides. Pure functions so the shape can be driven by motion values
 * every frame and tested without a DOM.
 */

export type NotchShape = {
  width: number;
  height: number;
  /** Corner radius of the bar. */
  radius: number;
  /** Notch centre along the top edge. */
  cx: number;
  /** Half the notch's width at the top edge (shoulder to shoulder / 2). */
  half: number;
  /** How far the notch dips below the top edge. */
  depth: number;
};

const n = (v: number) => Number(v.toFixed(2));

/** SVG path (also valid inside CSS `path()`) for the notched bar. */
export const notchedBarPath = ({
  width: W,
  height: H,
  radius: R,
  cx,
  half: w,
  depth: d,
}: NotchShape) => {
  const left = Math.max(0, cx - w);
  const right = Math.min(W, cx + w);
  // Shrink a top corner when the notch crowds it, so the outline never folds back on itself.
  const rl = Math.max(0, Math.min(R, left));
  const rr = Math.max(0, Math.min(R, W - right));
  const sw = w * 0.45; // shoulder handle: leaves the top edge flat
  const bw = w * 0.55; // bottom handle: keeps the floor of the notch round

  return [
    `M0 ${n(rl)}`,
    `A${n(rl)} ${n(rl)} 0 0 1 ${n(rl)} 0`,
    `L${n(left)} 0`,
    `C${n(left + sw)} 0 ${n(cx - bw)} ${n(d)} ${n(cx)} ${n(d)}`,
    `C${n(cx + bw)} ${n(d)} ${n(right - sw)} 0 ${n(right)} 0`,
    `L${n(W - rr)} 0`,
    `A${n(rr)} ${n(rr)} 0 0 1 ${n(W)} ${n(rr)}`,
    `L${n(W)} ${n(H - R)}`,
    `A${n(R)} ${n(R)} 0 0 1 ${n(W - R)} ${n(H)}`,
    `L${n(R)} ${n(H)}`,
    `A${n(R)} ${n(R)} 0 0 1 0 ${n(H - R)}`,
    "Z",
  ].join(" ");
};

/** Centre x of tab `i` when `count` tabs share `width` minus `pad` on each side. */
export const slotCenter = (i: number, count: number, width: number, pad: number) =>
  pad + ((width - pad * 2) / count) * (i + 0.5);

/** Index of the tab whose centre is closest to `x`. */
export const nearestSlot = (x: number, count: number, width: number, pad: number) => {
  const slot = (width - pad * 2) / count;
  return Math.min(count - 1, Math.max(0, Math.floor((x - pad) / slot)));
};

/**
 * The x stops a marble passes from `fromX` to tab `to`: where it is now, then every tab centre
 * on the way, ending on the target. Each gap between stops is one hop.
 */
export const hopStops = (
  fromX: number,
  to: number,
  count: number,
  width: number,
  pad: number,
) => {
  const target = slotCenter(to, count, width, pad);
  const stops = [fromX];
  if (Math.abs(target - fromX) < 0.5) return stops;
  const dir = Math.sign(target - fromX);
  for (let i = 0; i < count; i++) {
    const c = slotCenter(i, count, width, pad);
    // Strictly past where we are (a stop we're sitting on isn't a hop), up to the target.
    if ((c - fromX) * dir > 0.5 && (target - c) * dir >= 0) stops.push(c);
  }
  return dir > 0 ? stops : [fromX, ...stops.slice(1).sort((a, b) => b - a)];
};
