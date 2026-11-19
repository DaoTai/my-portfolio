"use client";

import { memo, useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

import { vars } from "./GlassCube";

/** One decimal, so server and client markup match exactly. */
const r1 = (v: number) => Math.round(v * 10) / 10;

// Deterministic scatter (no Math.random) so SSR and hydration agree.
const STARS = Array.from({ length: 54 }, (_, k) => ({
  x: `${r1((k * 47.3 + 11) % 100)}%`,
  y: `${r1((k * 71.9 + 29) % 100)}%`,
  s: `${r1(1 + (k % 3) * 0.7)}px`,
  d: `${r1((k * 0.37) % 5)}s`,
  t: `${r1(2.8 + (k % 5) * 0.9)}s`,
  cls: k % 7 === 0 ? "cbg-star is-bright" : k % 4 === 0 ? "cbg-star is-drift" : "cbg-star",
}));

const TRAILS = [
  { x: "8%", y: "14%", w: "32%", rot: "-12deg", d: "0s", t: "9s" },
  { x: "46%", y: "38%", w: "26%", rot: "-18deg", d: "3.4s", t: "11s" },
  { x: "18%", y: "72%", w: "36%", rot: "-8deg", d: "6.2s", t: "10s" },
  { x: "60%", y: "86%", w: "24%", rot: "-14deg", d: "1.8s", t: "12s" },
];

const SPRING = { stiffness: 50, damping: 18, mass: 0.9 };

/**
 * Cosmic overlay on top of the blueprint backdrop (ProjectsBackground supplies the grid, glow,
 * orbits and wireframes): twinkling/drifting star particles and light trails. Loops are CSS
 * (transform / opacity only) and pause off-screen; the two layers drift against the pointer
 * through springs for a parallax depth effect.
 */
export const CosmicBackground = memo(() => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "160px 0px" });
  const reduce = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, SPRING);
  const sy = useSpring(my, SPRING);
  const farX = useTransform(sx, [-1, 1], [6, -6]);
  const farY = useTransform(sy, [-1, 1], [4, -4]);
  const nearX = useTransform(sx, [-1, 1], [30, -30]);
  const nearY = useTransform(sy, [-1, 1], [20, -20]);

  useEffect(() => {
    if (!inView || reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [inView, reduce, mx, my]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`cbg pointer-events-none absolute inset-0 overflow-hidden${inView ? "" : " is-paused"}`}
    >
      <motion.div className="cbg-layer" style={{ x: farX, y: farY }}>
        {STARS.map((s) => (
          <span
            key={`${s.x}-${s.y}`}
            className={s.cls}
            style={vars({ "--x": s.x, "--y": s.y, "--s": s.s, "--d": s.d, "--t": s.t })}
          />
        ))}
      </motion.div>

      <motion.div className="cbg-layer" style={{ x: nearX, y: nearY }}>
        {TRAILS.map((t) => (
          <span
            key={t.y}
            className="cbg-trail"
            style={vars({ "--x": t.x, "--y": t.y, "--w": t.w, "--rot": t.rot, "--d": t.d, "--t": t.t })}
          />
        ))}
      </motion.div>
    </div>
  );
});
CosmicBackground.displayName = "CosmicBackground";
