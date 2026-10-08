"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { memo, useEffect, useRef, type CSSProperties } from "react";
import "./TechStack.css";

type Point = readonly [number, number];

type Trace = {
  d: string;
  /** Terminal pad that flashes when the pulse arrives. */
  end?: Point;
  dur: number;
  delay: number;
  alt?: boolean;
};

type BoardSpec = {
  traces: Trace[];
  chip: Point;
  pads: Point[];
};

/** Three parallel traces with 45° chamfers; offsets keep them 12px apart through the bend. */
const busLeft = (i: number): Trace => ({
  d: `M0 ${420 + 12 * i}H${120 - 5 * i}L${180 - 5 * i} ${480 + 12 * i}H300`,
  dur: 5,
  delay: -0.4 - 1.3 * i,
  alt: i === 1,
});

const busRight = (i: number): Trace => ({
  d: `M360 ${600 + 12 * i}H${240 + 5 * i}L${180 + 5 * i} ${660 + 12 * i}H70`,
  dur: 5.6,
  delay: -2.1 - 1.4 * i,
  alt: i !== 1,
});

/** Boards are 360×1000 in px (no scaling), pinned to the section's left/right edges. */
const LEFT_BOARD: BoardSpec = {
  traces: [
    { d: "M0 70H200L240 30H320", end: [320, 30], dur: 7, delay: -1.5 },
    {
      d: "M0 150H130L170 190V330H250",
      end: [250, 330],
      dur: 6,
      delay: -3.2,
      alt: true,
    },
    busLeft(0),
    busLeft(1),
    busLeft(2),
    {
      d: "M0 640H70L110 680V800L150 840H230",
      end: [230, 840],
      dur: 8,
      delay: -5,
    },
    {
      d: "M0 930H60L90 900H140",
      end: [140, 900],
      dur: 6.5,
      delay: -2,
      alt: true,
    },
  ],
  chip: [300, 468],
  pads: [
    [214, 606],
    [226, 606],
    [238, 606],
    [52, 262],
  ],
};

const RIGHT_BOARD: BoardSpec = {
  traces: [
    { d: "M360 40H260L230 10H150", end: [150, 10], dur: 6.8, delay: -4.4 },
    {
      d: "M360 110H240L200 150V270H110",
      end: [110, 270],
      dur: 6.2,
      delay: -0.8,
      alt: true,
    },
    { d: "M360 330H290V450L250 490H160", end: [160, 490], dur: 7.4, delay: -3 },
    busRight(0),
    busRight(1),
    busRight(2),
    {
      d: "M330 1000V880L290 840H200L170 810V760",
      end: [170, 760],
      dur: 7.8,
      delay: -6,
      alt: true,
    },
  ],
  chip: [40, 648],
  pads: [
    [118, 380],
    [118, 392],
    [118, 404],
    [300, 560],
  ],
};

const timing = (t: Trace) =>
  ({ "--dur": `${t.dur}s`, "--delay": `${t.delay}s` }) as CSSProperties;

/**
 * The SVG only holds the static board, so it paints once. Comets ride the same path strings as
 * HTML elements (offset-path) and the pads blink with opacity: neither repaints the board.
 */
const Board = ({ spec, className }: { spec: BoardSpec; className: string }) => (
  <div className={`tsbg-board ${className}`}>
    <svg viewBox="0 0 360 1000" width="360" height="1000" fill="none">
      {spec.traces.map((t) => (
        <path key={t.d} d={t.d} className="tsbg-trace" />
      ))}
      {spec.traces.map(
        (t) =>
          t.end && (
            <circle
              key={t.d}
              cx={t.end[0]}
              cy={t.end[1]}
              r={4}
              className="tsbg-node"
            />
          ),
      )}
      <rect
        x={spec.chip[0]}
        y={spec.chip[1]}
        width={30}
        height={48}
        rx={3}
        className="tsbg-chip"
      />
      <rect
        x={spec.chip[0] + 7}
        y={spec.chip[1] + 10}
        width={16}
        height={28}
        rx={1.5}
        className="tsbg-chip-die"
      />
      {spec.pads.map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={5}
          height={5}
          className="tsbg-pad"
        />
      ))}
    </svg>
    {spec.traces.map((t) => (
      <span
        key={t.d}
        className={`tsbg-comet${t.alt ? " tsbg-comet--alt" : ""}`}
        style={{ ...timing(t), offsetPath: `path("${t.d}")` }}
      />
    ))}
    {spec.traces.map(
      (t) =>
        t.end && (
          <span
            key={t.d}
            className="tsbg-node-core"
            style={{ ...timing(t), left: t.end[0], top: t.end[1] }}
          />
        ),
    )}
  </div>
);

/* ---- wireframe solids ---- */

const CUBE_FACES = [
  "rotateY(0deg)",
  "rotateY(90deg)",
  "rotateY(180deg)",
  "rotateY(-90deg)",
  "rotateX(90deg)",
  "rotateX(-90deg)",
];

/** An octahedron's 12 edges are exactly the edges of three orthogonal squares set on their corners. */
const OCTA_PLANES = [
  "rotateZ(45deg)",
  "rotateX(90deg) rotateZ(45deg)",
  "rotateY(90deg) rotateZ(45deg)",
];

const Cube = ({ inner = false }: { inner?: boolean }) => (
  <div className={`tsbg-cube${inner ? " tsbg-cube--inner" : ""}`}>
    {CUBE_FACES.map((r) => (
      <span
        key={r}
        className="tsbg-face"
        style={{ "--r": r } as CSSProperties}
      />
    ))}
  </div>
);

const Octahedron = () => (
  <>
    {OCTA_PLANES.map((r) => (
      <span
        key={r}
        className="tsbg-octa-plane"
        style={{ "--r": r } as CSSProperties}
      />
    ))}
    <span className="tsbg-core" />
  </>
);

type ShapeSpec = {
  kind: "tesseract" | "octa" | "cube";
  size: number;
  /** Parallax travel in px at the viewport edge; nearer solids move further. */
  depth: number;
  opacity: number;
  dur: number;
  delay: number;
  reverse?: boolean;
  pos: CSSProperties;
};

const SHAPES: ShapeSpec[] = [
  {
    kind: "tesseract",
    size: 128,
    depth: 30,
    opacity: 0.85,
    dur: 32,
    delay: -6,
    pos: { right: "5%", top: "11%" },
  },
  {
    kind: "octa",
    size: 150,
    depth: 16,
    opacity: 0.6,
    dur: 40,
    delay: -14,
    reverse: true,
    pos: { left: "2.5%", top: "44%" },
  },
  {
    kind: "cube",
    size: 54,
    depth: 46,
    opacity: 0.9,
    dur: 24,
    delay: -3,
    pos: { right: "13%", bottom: "13%" },
  },
];

const Shape = ({
  spec,
  mx,
  my,
}: {
  spec: ShapeSpec;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) => {
  const x = useTransform(mx, (v) => v * -spec.depth);
  const y = useTransform(my, (v) => v * -spec.depth * 0.7);

  return (
    <motion.div
      className="tsbg-shape hidden md:block"
      style={{
        ...spec.pos,
        width: spec.size,
        height: spec.size,
        opacity: spec.opacity,
        x,
        y,
      }}
    >
      <div
        className="tsbg-float"
        style={
          {
            "--s": `${spec.size}px`,
            "--dur": `${spec.dur}s`,
            "--delay": `${spec.delay}s`,
          } as CSSProperties
        }
      >
        <div className={`tsbg-spin${spec.reverse ? " tsbg-spin--rev" : ""}`}>
          {spec.kind === "octa" ? (
            <Octahedron />
          ) : (
            <>
              <Cube />
              {spec.kind === "tesseract" && <Cube inner />}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const SPRING = { stiffness: 50, damping: 18, mass: 0.9 };

/**
 * "Engine room" backdrop for the Tech Stack section: a wireframe floor scrolling toward the
 * viewer, circuit traces with travelling pulses, and slowly tumbling wireframe solids that
 * drift against the cursor. Pauses every animation while off-screen.
 */
export const TechStackBackground = memo(() => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "200px 0px" });
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const mx = useSpring(px, SPRING);
  const my = useSpring(py, SPRING);
  const floorX = useTransform(mx, (v) => v * 24);

  useEffect(() => {
    if (!inView || reduce) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [inView, reduce, px, py]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`tsbg pointer-events-none absolute inset-0${inView ? "" : " tsbg--paused"}`}
    >
      <div className="tsbg-horizon" />
      <motion.div className="tsbg-floor" style={{ x: floorX }}>
        <div className="tsbg-plane" />
      </motion.div>

      <Board spec={LEFT_BOARD} className="left-0 top-0" />
      <Board spec={RIGHT_BOARD} className="bottom-0 right-0 hidden md:block" />

      {SHAPES.map((s) => (
        <Shape key={s.kind} spec={s} mx={mx} my={my} />
      ))}
    </div>
  );
});
TechStackBackground.displayName = "TechStackBackground";
