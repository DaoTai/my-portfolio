"use client";

import { memo, useRef } from "react";
import type { CSSProperties } from "react";
import { useInView } from "motion/react";

/** Inline custom properties (`--d`, `--k`…) for the CSS in ProjectsShowcase.css. */
const vars = (v: Record<string, string | number>) => v as CSSProperties;

/** One decimal, so server and client markup match exactly. */
const r1 = (v: number) => Math.round(v * 10) / 10;

/* ---- trading chart: deterministic price series, candles + a moving-average trace ---- */

const CHART_W = 1440;
const CHART_H = 320;
const CANDLES = 38;
const STEP = CHART_W / CANDLES;

const price = (k: number) =>
  190 -
  k * 2.6 -
  44 * Math.sin(k * 0.34) -
  20 * Math.sin(k * 0.93 + 1.2) -
  8 * Math.sin(k * 2.2);

const CANDLE_DATA = Array.from({ length: CANDLES }, (_, k) => {
  const open = price(k);
  const close = price(k + 1);
  const wick = 5 + 9 * Math.abs(Math.sin(k * 1.7));
  const top = Math.min(open, close);
  const bottom = Math.max(open, close);
  return {
    x: r1(STEP * k + STEP / 2),
    high: r1(top - wick),
    low: r1(bottom + wick * 0.7),
    y: r1(top),
    h: r1(Math.max(bottom - top, 2)),
    up: close < open,
    delay: `${(k * 0.04).toFixed(2)}s`,
  };
});

const TRACE_PTS = Array.from({ length: CANDLES + 1 }, (_, k) => [
  r1(STEP * k),
  r1((price(k - 1) + price(k) + price(k + 1)) / 3),
]);

/** Smooth path through the points: quadratic curves between midpoints. */
const TRACE = TRACE_PTS.reduce((d, [x, y], k) => {
  if (k === 0) return `M${x} ${y}`;
  const [px, py] = TRACE_PTS[k - 1];
  return `${d} Q${px} ${py} ${r1((px + x) / 2)} ${r1((py + y) / 2)}`;
}, "").concat(` L${TRACE_PTS[CANDLES][0]} ${TRACE_PTS[CANDLES][1]}`);

const AREA = `${TRACE} L${CHART_W} ${CHART_H} L0 ${CHART_H} Z`;
const LAST_Y = TRACE_PTS[CANDLES][1];

/* ---- 3D wireframes ---- */

const CUBE_FACES = ["front", "back", "right", "left", "top", "bottom"] as const;
const TORUS_RINGS = Array.from({ length: 24 }, (_, k) => r1((360 / 24) * k));
const WINDOWS = [0, 1, 2] as const;

const CubeFaces = () => (
  <>
    {CUBE_FACES.map((f) => (
      <span key={f} className={`pbg-face pbg-face--${f}`} />
    ))}
  </>
);

/** A wireframe cube with a smaller one tumbling the other way inside it. */
const Cube = ({ className }: { className: string }) => (
  <div className={`pbg-shape ${className}`}>
    <div className="pbg-cube">
      <CubeFaces />
      <div className="pbg-cube pbg-cube--inner">
        <CubeFaces />
      </div>
    </div>
  </div>
);

/** Rings swept around a vertical axis form a torus; the whole thing turns on that axis. */
const Torus = () => (
  <div className="pbg-shape pbg-torus-pos">
    <div className="pbg-torus-tilt">
      <div className="pbg-torus">
        {TORUS_RINGS.map((a) => (
          <span key={a} className="pbg-torus-ring" style={vars({ "--a": `${a}deg` })} />
        ))}
      </div>
    </div>
  </div>
);

/** Exploded view of three browser windows, layers breathing apart in Z. */
const WindowStack = () => (
  <div className="pbg-shape pbg-stack-pos">
    <div className="pbg-stack">
      {WINDOWS.map((k) => (
        <div key={k} className="pbg-window" style={vars({ "--k": k })}>
          <span className="pbg-window-bar">
            <i />
            <i />
            <i />
          </span>
          {k === 2 && (
            <span className="pbg-window-body">
              <span className="pbg-skel pbg-skel--side" />
              <span className="pbg-skel pbg-skel--a" />
              <span className="pbg-skel pbg-skel--b" />
              <svg viewBox="0 0 120 40" className="pbg-window-spark">
                <polyline points="0,32 14,26 26,30 40,18 54,22 68,10 82,16 96,6 120,12" />
              </svg>
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
);

/* ---- blueprint annotations (percent coordinates, so no scaling) ---- */

type Pos = { x: string; y: string; d: string };

/** Registration crosshair: cross + circle that draw themselves in. */
const Crosshair = ({ x, y, d, label }: Pos & { label?: string }) => (
  <svg x={x} y={y} overflow="visible">
    <line x1={-14} y1={0} x2={14} y2={0} pathLength={1} className="pbg-draw" style={vars({ "--d": d })} />
    <line x1={0} y1={-14} x2={0} y2={14} pathLength={1} className="pbg-draw" style={vars({ "--d": d })} />
    <circle r={5} pathLength={1} className="pbg-draw pbg-draw--accent" style={vars({ "--d": d })} />
    {label && (
      <text x={12} y={-10} className="pbg-label" style={vars({ "--d": d })}>
        {label}
      </text>
    )}
  </svg>
);

/** Architectural tick: short bar across the dimension line plus a 45° slash. */
const Tick = ({ x, y, d, vertical = false }: Pos & { vertical?: boolean }) => (
  <svg x={x} y={y} overflow="visible">
    {vertical ? (
      <line x1={-7} y1={0} x2={7} y2={0} className="pbg-fade" style={vars({ "--d": d })} />
    ) : (
      <line x1={0} y1={-7} x2={0} y2={7} className="pbg-fade" style={vars({ "--d": d })} />
    )}
    <line x1={-4} y1={4} x2={4} y2={-4} className="pbg-fade pbg-fade--accent" style={vars({ "--d": d })} />
  </svg>
);

const Blueprint = () => (
  <svg className="pbg-blueprint" width="100%" height="100%">
    {/* overall width, split around its label */}
    <line x1="4%" y1="4.5%" x2="46%" y2="4.5%" pathLength={1} className="pbg-draw" style={vars({ "--d": "0.15s" })} />
    <line x1="54%" y1="4.5%" x2="96%" y2="4.5%" pathLength={1} className="pbg-draw" style={vars({ "--d": "0.15s" })} />
    <Tick x="4%" y="4.5%" d="0.1s" />
    <Tick x="96%" y="4.5%" d="0.1s" />
    <text x="50%" y="4.5%" dy={3.5} textAnchor="middle" className="pbg-label" style={vars({ "--d": "0.9s" })}>
      1240
    </text>
    <line x1="4%" y1="4.5%" x2="4%" y2="9%" className="pbg-ext pbg-fade" style={vars({ "--d": "0.6s" })} />
    <line x1="96%" y1="4.5%" x2="96%" y2="9%" className="pbg-ext pbg-fade" style={vars({ "--d": "0.6s" })} />

    {/* overall height, along the left edge */}
    <g className="pbg-hide-sm">
      <line x1="1.8%" y1="9%" x2="1.8%" y2="47%" pathLength={1} className="pbg-draw" style={vars({ "--d": "0.4s" })} />
      <line x1="1.8%" y1="53%" x2="1.8%" y2="93%" pathLength={1} className="pbg-draw" style={vars({ "--d": "0.4s" })} />
      <Tick x="1.8%" y="9%" d="0.35s" vertical />
      <Tick x="1.8%" y="93%" d="0.35s" vertical />
      <svg x="1.8%" y="50%" overflow="visible">
        <text transform="rotate(-90)" dy={3.5} textAnchor="middle" className="pbg-label" style={vars({ "--d": "1.1s" })}>
          GRID 24
        </text>
      </svg>
    </g>

    {/* centre lines through the carousel (dash-dot, like a drawing's axis) */}
    <line x1="50%" y1="9%" x2="50%" y2="93%" className="pbg-axis pbg-fade" style={vars({ "--d": "0.8s" })} />
    <line x1="4%" y1="57%" x2="96%" y2="57%" className="pbg-axis pbg-fade" style={vars({ "--d": "0.9s" })} />

    {/* ruler ticks down the right edge */}
    <svg x="100%" y="0" overflow="visible" className="pbg-hide-sm">
      <line x1={-16} y1="14%" x2={-16} y2="88%" className="pbg-ruler pbg-fade" style={vars({ "--d": "1s" })} />
      <line x1={-16} y1="14%" x2={-16} y2="88%" className="pbg-ruler pbg-ruler--major pbg-fade" style={vars({ "--d": "1s" })} />
    </svg>

    <Crosshair x="4%" y="9%" d="0.5s" label="X 0.00  Y 0.00" />
    <Crosshair x="96%" y="9%" d="0.65s" />
    <Crosshair x="4%" y="93%" d="0.8s" />
    <Crosshair x="96%" y="93%" d="0.95s" />
  </svg>
);

const CHART_VIEW = {
  viewBox: `0 0 ${CHART_W} ${CHART_H}`,
  preserveAspectRatio: "xMidYMax slice",
} as const;

/**
 * Candles and the last-price line are one SVG that paints once (after the arrival rise). The
 * trace + area sit in a second, identical SVG behind a wipe: the clip box slides right while
 * its content slides back by the same amount, so the line draws in left → right with two
 * composited translates instead of repainting a full-width stroke-dashoffset every frame. The
 * clip box's right edge carries the scan line.
 */
const Chart = () => (
  <div className="pbg-chart">
    <svg {...CHART_VIEW}>
      <g className="pbg-candles">
        {CANDLE_DATA.map((c) => (
          <g
            key={c.x}
            className={c.up ? "pbg-candle is-up" : "pbg-candle"}
            style={vars({ "--d": c.delay })}
          >
            <line x1={c.x} y1={c.high} x2={c.x} y2={c.low} />
            <rect x={c.x - 5} y={c.y} width={10} height={c.h} rx={1} />
          </g>
        ))}
      </g>

      {/* last-price line with its tag */}
      <line x1={0} y1={LAST_Y} x2={CHART_W} y2={LAST_Y} className="pbg-last pbg-fade" style={vars({ "--d": "1.2s" })} />
    </svg>

    <div className="pbg-reveal">
      <div className="pbg-reveal-inner">
        <svg {...CHART_VIEW}>
          <defs>
            <linearGradient id="pbg-trace-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" style={{ stopColor: "var(--pbg-t1)", stopOpacity: 0 }} />
              <stop offset="0.2" style={{ stopColor: "var(--pbg-t1)" }} />
              <stop offset="0.6" style={{ stopColor: "var(--pbg-t2)" }} />
              <stop offset="0.85" style={{ stopColor: "var(--pbg-t3)" }} />
              <stop offset="1" style={{ stopColor: "var(--pbg-t3)", stopOpacity: 0 }} />
            </linearGradient>
            <linearGradient id="pbg-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style={{ stopColor: "rgb(var(--pbg-accent))", stopOpacity: "var(--pbg-area-a)" }} />
              <stop offset="1" style={{ stopColor: "rgb(var(--pbg-accent))", stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <path d={AREA} className="pbg-area" />
          <path d={TRACE} className="pbg-trace pbg-trace--glow" />
          <path d={TRACE} className="pbg-trace" />
        </svg>
      </div>
    </div>
  </div>
);

/**
 * "Blueprint / build workspace" backdrop for the projects section: drafting grid, dimension
 * lines and crosshairs that draw themselves in, floating CSS-3D wireframes at a few depths,
 * a candlestick chart trace across the bottom and orbit rings behind the carousel.
 * Animations are pure CSS (transform / opacity / stroke-dashoffset) and stay paused until the
 * section is near the viewport, which also makes the draw-in play on arrival.
 */
export const ProjectsBackground = memo(() => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "160px 0px" });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pbg pointer-events-none absolute inset-0 overflow-hidden${inView ? "" : " is-paused"}`}
    >
      <div className="pbg-grid" />
      <div className="pbg-glow" />

      <div className="pbg-orbits">
        <span className="pbg-orbit pbg-orbit--outer" />
        <span className="pbg-orbit pbg-orbit--inner" />
        <span className="pbg-orbit-sweep" />
      </div>

      <Chart />
      <Blueprint />

      <Torus />
      <Cube className="pbg-cube-pos" />
      <Cube className="pbg-cube-pos pbg-cube-pos--far" />
      <WindowStack />
    </div>
  );
});
ProjectsBackground.displayName = "ProjectsBackground";
