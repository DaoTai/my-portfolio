import { useId } from "react";
import type { CSSProperties } from "react";
import { MASCOT_PARTS } from "@/lib/mascot-parts";
import "./MascotTablet.css";

const hand = MASCOT_PARTS.forearmL.anchors.hand;

/** The panel's corners (viewBox units): drawn in perspective, as the original art holds it. */
const PANEL = "M22 52 L312 18 L384 238 L42 268 Z";
const SCREEN = "M40 66 L296 38 L320 120 L52 146 Z";
/** The same quads as clip paths, in % of the 394 × 278 box. */
const PANEL_CLIP = "polygon(5.6% 18.7%, 79.2% 6.5%, 97.5% 85.6%, 10.7% 96.4%)";

type Point = readonly [number, number];
type Bar = readonly [from: Point, to: Point];
const BARS: readonly Bar[] = [
  [
    [132, 70],
    [286, 54],
  ],
  [
    [136, 92],
    [262, 80],
  ],
  [
    [140, 114],
    [230, 106],
  ],
];

type FaceProps = { back?: boolean };

const Face = ({ back = false }: FaceProps) => {
  // Unique per face, so each mascot's tablet fills from its own gradient.
  const fill = useId();
  return (
    <svg
      viewBox="0 0 394 278"
      className={back ? "mascot-tablet-back" : "mascot-tablet-face"}
    >
      <defs>
        <linearGradient id={fill} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" className="mascot-tablet-stop-a" />
          <stop offset="1" className="mascot-tablet-stop-b" />
        </linearGradient>
      </defs>
      <path d={PANEL} fill={`url(#${fill})`} className="mascot-tablet-panel" />
      {!back && (
        <g className="mascot-tablet-ink">
          <path d={SCREEN} fill="none" />
          {/* The assistant's knot logo. */}
          <g transform="translate(92 98)">
            <circle r="22" fill="none" />
            <ellipse rx="22" ry="9" fill="none" transform="rotate(60)" />
            <ellipse rx="22" ry="9" fill="none" transform="rotate(-60)" />
          </g>
          {BARS.map(([[x1, y1], [x2, y2]]) => (
            <line key={x1} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
          {/* A code chip and two more lines along the bottom. */}
          <path d="M150 178 L214 172 L220 222 L156 228 Z" fill="none" />
          <path
            d="M176 190 l-10 12 l12 10 M196 188 l12 10 l-10 12 M190 186 l-6 30"
            fill="none"
          />
          <line x1="236" y1="186" x2="330" y2="178" />
          <line x1="240" y1="208" x2="316" y2="202" />
        </g>
      )}
    </svg>
  );
};

/**
 * The holographic tablet, held at the left hand. It counter-turns against the arm so it stays
 * level, and shrinks into the hand as --tablet falls to 0 (put away) and back out as it rises.
 */
export const MascotTablet = () => (
  <div
    className="mascot-tablet"
    style={{ left: `${hand.x}%`, top: `${hand.y}%` }}
  >
    <div className="mascot-tablet-hold">
      <Face />
      <Face back />
      <div
        className="mascot-holo"
        style={{ clipPath: PANEL_CLIP } as CSSProperties}
      >
        <span className="mascot-holo-scan" />
        <span className="mascot-holo-sweep" />
      </div>
      <span className="mascot-bit" style={{ left: "30%", top: "14%" }} />
      <span className="mascot-bit" style={{ left: "52%", top: "8%" }} />
      <span className="mascot-bit" style={{ left: "72%", top: "5%" }} />
    </div>
  </div>
);
