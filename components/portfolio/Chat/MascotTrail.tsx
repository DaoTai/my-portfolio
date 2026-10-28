import { useEffect, useRef } from "react";
import type { RefObject } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
  sprite: number;
  kind: "spark" | "glow" | "star";
  spin: number;
};

/** Cyan, violet, pink, white — the hero palette. */
const COLORS = ["103,232,249", "167,139,250", "240,171,252", "255,255,255"];
/** Deeper tones that still read on the light theme's pale background. */
const LIGHT_COLORS = ["8,145,178", "124,58,237", "192,38,211", "79,70,229"];
const MAX_PARTICLES = 700;
const GRAVITY = 420;
/** Distance (px) between trail glows, so fast flight still draws an unbroken streak. */
const GLOW_SPACING = 5;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** A soft round dot per colour, drawn once and stamped for every particle. */
const makeSprites = (colors: string[]) =>
  colors.map((rgb) => {
    const c = document.createElement("canvas");
    c.width = c.height = 32;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.25, `rgba(${rgb},0.95)`);
    grad.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, 32, 32);
    return c;
  });

type Loop = {
  emitting: boolean;
  raf: number;
  particles: Particle[];
  /** Detaches the resize listener of the running loop. */
  dispose: () => void;
};

type MascotTrailProps = {
  /** Emit while true; already-emitted particles still fade out after it turns false. */
  active: boolean;
  /** Element containing the `.mascot-trail-tip` emitters (on the carpet's rim). */
  sourceRef: RefObject<HTMLElement | null>;
};

/**
 * Full-screen canvas behind the flying mascot: sparks pour from the carpet's rim and a glowing
 * shooting-star streak stays behind along its path. It only runs while there is something to draw.
 */
export const MascotTrail = ({ active, sourceRef }: MascotTrailProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loop = useRef<Loop>({
    emitting: false,
    raf: 0,
    particles: [],
    dispose: () => {},
  });

  useEffect(() => {
    const state = loop.current;
    state.emitting = active;
    if (!active || state.raf) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const root = sourceRef.current;
    if (!canvas || !ctx || !root) return;

    const light = document.documentElement.classList.contains("light");
    const sprites = makeSprites(light ? LIGHT_COLORS : COLORS);
    const tips = Array.from(root.querySelectorAll<HTMLElement>(".mascot-trail-tip"));
    const previous = new Map<HTMLElement, { x: number; y: number }>();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let last = performance.now();

    const resize = () => {
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    state.dispose = () => window.removeEventListener("resize", resize);

    const spawn = (p: Omit<Particle, "age" | "spin">) => {
      if (state.particles.length < MAX_PARTICLES) {
        state.particles.push({ ...p, age: 0, spin: rand(0, Math.PI) });
      }
    };

    const emit = (tip: HTMLElement, dt: number) => {
      const r = tip.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const prev = previous.get(tip) ?? { x, y };
      previous.set(tip, { x, y });
      const vx = dt > 0 ? (x - prev.x) / dt : 0;
      const vy = dt > 0 ? (y - prev.y) / dt : 0;

      // Shooting-star streak: glows laid along the segment flown since the last frame.
      const dist = Math.hypot(x - prev.x, y - prev.y);
      const steps = Math.max(1, Math.ceil(dist / GLOW_SPACING));
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        spawn({
          x: prev.x + (x - prev.x) * t + rand(-1.5, 1.5),
          y: prev.y + (y - prev.y) * t + rand(-1.5, 1.5),
          vx: rand(-8, 8),
          vy: rand(-8, 8),
          life: rand(0.45, 0.7),
          size: rand(10, 16),
          sprite: i % 2,
          kind: "glow",
        });
      }

      // Sparks shed from the rim: thrown downward, inheriting a little of the opposite of the flight.
      for (let i = 0; i < 3; i++) {
        spawn({
          x: x + rand(-3, 3),
          y,
          vx: rand(-60, 60) - vx * 0.15,
          vy: rand(120, 260) - vy * 0.15,
          life: rand(0.45, 0.9),
          size: rand(3, 6),
          sprite: Math.floor(rand(0, sprites.length)),
          kind: "spark",
        });
      }

      if (Math.random() < 0.08) {
        spawn({
          x: x + rand(-36, 36),
          y: y + rand(-24, 30),
          vx: rand(-10, 10),
          vy: rand(-10, 20),
          life: rand(0.6, 1),
          size: rand(7, 12),
          sprite: 3,
          kind: "star",
        });
      }
    };

    const drawStar = (p: Particle, alpha: number) => {
      const s = p.size * (0.4 + 0.6 * Math.sin((p.age / p.life) * Math.PI));
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.spin + p.age * 2);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = light ? "rgb(79,70,229)" : "#fff";
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(0, 0, s, 0);
      ctx.quadraticCurveTo(0, 0, 0, s);
      ctx.quadraticCurveTo(0, 0, -s, 0);
      ctx.quadraticCurveTo(0, 0, 0, -s);
      ctx.fill();
      ctx.restore();
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (state.emitting) tips.forEach((tip) => emit(tip, dt));

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = light ? "source-over" : "lighter";

      const alive: Particle[] = [];
      for (const p of state.particles) {
        p.age += dt;
        if (p.age >= p.life) continue;
        alive.push(p);
        if (p.kind === "spark") p.vy += GRAVITY * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const k = 1 - p.age / p.life;
        if (p.kind === "star") {
          drawStar(p, k);
          continue;
        }
        const size = p.kind === "glow" ? p.size * (0.35 + 0.65 * k) : p.size * (0.5 + 0.5 * k);
        ctx.globalAlpha = p.kind === "glow" ? k * 0.55 : k;
        ctx.drawImage(sprites[p.sprite], p.x - size / 2, p.y - size / 2, size, size);
      }
      state.particles = alive;
      ctx.globalAlpha = 1;

      if (state.emitting || alive.length) {
        state.raf = requestAnimationFrame(frame);
      } else {
        state.raf = 0;
        state.dispose();
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    state.raf = requestAnimationFrame(frame);
  }, [active, sourceRef]);

  // The loop drains on its own once emitting stops; only an unmount cuts it short.
  useEffect(() => {
    const state = loop.current;
    return () => {
      cancelAnimationFrame(state.raf);
      state.dispose();
      state.raf = 0;
      state.particles = [];
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[39] h-full w-full"
    />
  );
};
