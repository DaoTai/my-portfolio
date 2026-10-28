import { memo } from "react";

/**
 * A Đông Sơn bronze-drum (trống đồng) face: a central sunburst star, concentric rings, and a
 * band of Lạc birds. It stands behind the mascot's head as a halo and lies down under its knees
 * as a flying carpet in flight (see Mascot.css). Drawn once in a 100×100 box, tinted by the
 * --drum-* colours. Purely decorative: Mascot.tsx marks the rig aria-hidden.
 */

const CX = 50;
const CY = 50;

/** A closed star path: `points` tips alternating between the outer and inner radius. */
const starPath = (points: number, rOuter: number, rInner: number) => {
  const step = Math.PI / points;
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = -Math.PI / 2 + i * step;
    const x = (CX + r * Math.cos(a)).toFixed(2);
    const y = (CY + r * Math.sin(a)).toFixed(2);
    d += `${i === 0 ? "M" : "L"}${x} ${y} `;
  }
  return `${d}Z`;
};

/** One Lạc bird in flight, beak toward +x, body centred near the origin (local units ≈ 18 wide). */
const BIRD =
  "M9.5 -0.2 L3.4 0.9 L1.3 2 L-2.3 0.7 L-8.4 1.7 L-6.9 -0.2 L-8.5 -2.1 " +
  "L-2.8 -1.1 L0 -0.7 L-1 -4.6 L-3.4 -1 L-2.6 -0.9 L3 -1.2 L4.5 -3.4 " +
  "L4.1 -0.9 Z";

const BIRD_COUNT = 12;
const BIRD_R = 37.5;
const birds = Array.from({ length: BIRD_COUNT }, (_, i) => {
  // Fly counter-clockwise, as on the real drums.
  const a = -Math.PI / 2 - (i / BIRD_COUNT) * 2 * Math.PI;
  const x = (CX + BIRD_R * Math.cos(a)).toFixed(2);
  const y = (CY + BIRD_R * Math.sin(a)).toFixed(2);
  const deg = ((a * 180) / Math.PI - 90).toFixed(1);
  return { key: i, t: `translate(${x} ${y}) rotate(${deg}) scale(0.62)` };
});

const DOT_COUNT = 28;
const dots = Array.from({ length: DOT_COUNT }, (_, i) => {
  const a = (i / DOT_COUNT) * 2 * Math.PI;
  return {
    key: i,
    cx: (CX + 25 * Math.cos(a)).toFixed(2),
    cy: (CY + 25 * Math.sin(a)).toFixed(2),
  };
});

export const MascotDrum = memo(() => (
  <div className="mascot-totem">
    <div className="mascot-totem-tilt">
      <svg
        className="mascot-totem-wheel"
        viewBox="0 0 100 100"
        role="presentation"
        focusable="false"
      >
        <defs>
          {/* Sheen: alternating light and dark bands across the whole face (user space, so
            every ring and bird shares one light). It turns with the wheel, so the glints drift. */}
          <linearGradient
            id="mascot-drum-fill"
            gradientUnits="userSpaceOnUse"
            x1="8"
            y1="8"
            x2="92"
            y2="92"
          >
            <stop offset="0%" stopColor="var(--drum-2)" />
            <stop offset="16%" stopColor="var(--drum-1)" />
            <stop offset="28%" stopColor="var(--drum-hi)" />
            <stop offset="38%" stopColor="var(--drum-1)" />
            <stop offset="54%" stopColor="var(--drum-2)" />
            <stop offset="66%" stopColor="var(--drum-1)" />
            <stop offset="76%" stopColor="var(--drum-hi)" />
            <stop offset="86%" stopColor="var(--drum-1)" />
            <stop offset="100%" stopColor="var(--drum-2)" />
          </linearGradient>
        </defs>

        {/* Faint full disc behind the ornament. */}
        <circle
          cx={CX}
          cy={CY}
          r="48"
          fill="url(#mascot-drum-fill)"
          opacity="0.16"
        />

        {/* Concentric rings. The head covers the centre, so the bird band sits outermost. */}
        <g fill="none" stroke="url(#mascot-drum-fill)" strokeOpacity="0.85">
          <circle cx={CX} cy={CY} r="48" strokeWidth="0.8" />
          <circle
            cx={CX}
            cy={CY}
            r="45"
            strokeWidth="2.6"
            strokeOpacity="0.35"
          />
          <circle cx={CX} cy={CY} r="45" strokeWidth="0.8" />
          <circle cx={CX} cy={CY} r="30.5" strokeWidth="0.8" />
          <circle cx={CX} cy={CY} r="28.5" strokeWidth="0.6" />
          <circle cx={CX} cy={CY} r="21.5" strokeWidth="0.8" />
        </g>

        {/* Band of Lạc birds between the outer ring pairs. */}
        <g fill="url(#mascot-drum-fill)" fillOpacity="0.95">
          {birds.map((b) => (
            <path key={b.key} d={BIRD} transform={b.t} />
          ))}
        </g>

        {/* Ring of dots, then the central sunburst star. */}
        <g fill="url(#mascot-drum-fill)">
          {dots.map((d) => (
            <circle key={d.key} cx={d.cx} cy={d.cy} r="0.9" />
          ))}
          <path d={starPath(14, 18.5, 9)} />
          <circle cx={CX} cy={CY} r="6" />
        </g>
        <circle cx={CX} cy={CY} r="2" fill="var(--drum-2)" />
      </svg>
      <span className="mascot-trail-tip mascot-trail-tip--l" />
      <span className="mascot-trail-tip mascot-trail-tip--r" />
    </div>
  </div>
));

MascotDrum.displayName = "MascotDrum";
