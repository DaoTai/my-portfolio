"use client";
import { techStack } from "@/lib/init";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useVelocity,
  useMotionValueEvent,
  animate as motionAnimate,
  type MotionValue,
} from "motion/react";
import Image from "next/image";
import { useState, useCallback, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Pause,
  Play,
  Layers,
  Server,
  Database,
} from "lucide-react";

type Category = "all" | "frontend" | "backend" | "tools";

const tabs: { label: string; value: Category }[] = [
  { label: "All", value: "all" },
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Tools", value: "tools" },
];

const categoryMeta: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  frontend: {
    label: "Frontend",
    bg: "bg-cyan-500/15",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-500/30",
  },
  backend: {
    label: "Backend",
    bg: "bg-emerald-500/15",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/30",
  },
  tools: {
    label: "Tools",
    bg: "bg-amber-500/15",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/30",
  },
};

type RingDims = {
  radius: number;
  container: number;
  item: number;
  hub: number;
};

const computeDims = (w: number): RingDims => {
  const radius = Math.max(120, Math.min(Math.round(w * 0.41), 255));
  const container = radius * 2 + 90;
  const item = Math.max(38, Math.min(Math.round(radius * 0.27), 48));
  const hub = Math.max(72, Math.min(Math.round(radius * 0.5), 108));
  return { radius, container, item, hub };
};

const BLUR_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRm4zBvW3pMXoaLmy2JX2LsUWSPVqC7GsrKU8MrzgUMQ&s";

const SPRING = { type: "spring" as const, stiffness: 120, damping: 22 };

const SPARK_COLORS = [
  "#8b5cf6",
  "#06b6d4",
  "#a78bfa",
  "#22d3ee",
  "#f0abfc",
  "#ffffff",
];

interface Spark {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  tx: number;
  ty: number;
  duration: number;
}

const WingSvg = ({
  side,
  w,
  h,
}: {
  side: "left" | "right";
  w: number;
  h: number;
}) => {
  const isLeft = side === "left";
  const attachX = isLeft ? w : 0;
  const tipX = isLeft ? 0 : w;
  const ctrlX = isLeft ? w * 0.42 : w * 0.58;
  const innerCtrlX = isLeft ? w * 0.56 : w * 0.44;
  const innerTipX = isLeft ? w * 0.22 : w * 0.78;
  const gradId = `wing-grad-${side}`;
  const glowId = `wing-glow-${side}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
      <defs>
        <linearGradient
          id={gradId}
          x1={isLeft ? "100%" : "0%"}
          y1="50%"
          x2={isLeft ? "0%" : "100%"}
          y2="50%"
        >
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.82" />
          <stop offset="50%" stopColor="#6366f1" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
        </linearGradient>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Outer wing layer */}
      <path
        d={`M ${attachX} ${h / 2} Q ${ctrlX} ${h * 0.04} ${tipX} ${h / 2} Q ${ctrlX} ${h * 0.96} ${attachX} ${h / 2} Z`}
        fill={`url(#${gradId})`}
        opacity="0.65"
        filter={`url(#${glowId})`}
      />
      {/* Inner wing layer — brighter toward hub */}
      <path
        d={`M ${attachX} ${h / 2} Q ${innerCtrlX} ${h * 0.2} ${innerTipX} ${h / 2} Q ${innerCtrlX} ${h * 0.8} ${attachX} ${h / 2} Z`}
        fill={`url(#${gradId})`}
        opacity="0.9"
      />
      {/* Leading edge highlight */}
      <path
        d={`M ${attachX} ${h / 2} Q ${ctrlX} ${h * 0.04} ${tipX} ${h / 2}`}
        fill="none"
        stroke="#a78bfa"
        strokeWidth="0.9"
        strokeOpacity="0.55"
      />
    </svg>
  );
};

const PETAL_COUNT = 48;
const SPIN_CYCLE = 1.1;
const IDLE_CYCLE = 3.6;

const LotusWeaveRing = ({
  ringRotation,
  radius,
  center,
  container,
  isHovered,
}: {
  ringRotation: MotionValue<number>;
  radius: number;
  center: number;
  container: number;
  isHovered: boolean;
}) => {
  const velocity = useVelocity(ringRotation);
  const [isSpinning, setIsSpinning] = useState(false);

  useMotionValueEvent(velocity, "change", (v) => {
    setIsSpinning(Math.abs(v) > 8);
  });

  const isActive = isHovered || isSpinning;
  const baseR = radius + 60;

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ width: container, height: container }}
    >
      {/* Shared SVG defs */}
      <svg width="0" height="0" className="absolute overflow-hidden">
        <defs>
          {/* Violet petals */}
          <linearGradient id="lotus-grad-violet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c4b5fd" stopOpacity="1" />
            <stop offset="35%" stopColor="#8b5cf6" stopOpacity="0.95" />
            <stop offset="72%" stopColor="#6366f1" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.22" />
          </linearGradient>
          {/* Teal petals */}
          <linearGradient id="lotus-grad-teal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a5f3fc" stopOpacity="1" />
            <stop offset="35%" stopColor="#22d3ee" stopOpacity="0.95" />
            <stop offset="72%" stopColor="#06b6d4" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.22" />
          </linearGradient>
          <filter id="lotus-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {Array.from({ length: PETAL_COUNT }, (_, i) => {
        const isTeal = i % 2 === 1;
        // Alternate radii create the over-under weave illusion
        const petalR = isTeal ? baseR - 6 : baseR + 6;
        const angle = (2 * Math.PI * i) / PETAL_COUNT;
        const x = center + petalR * Math.cos(angle);
        const y = center + petalR * Math.sin(angle);
        const rotateDeg = (angle * 180) / Math.PI + 90;
        const gradId = isTeal ? "lotus-grad-teal" : "lotus-grad-violet";
        const strokeClr = isTeal ? "#67e8f9" : "#c4b5fd";
        const ridgeClr = isTeal ? "#cffafe" : "#ede9fe";
        const veinClr = isTeal ? "#a5f3fc" : "#ddd6fe";
        const spinDelay = (i / PETAL_COUNT) * SPIN_CYCLE;
        const idleDelay = (i / PETAL_COUNT) * IDLE_CYCLE;

        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: x,
              top: y,
              perspective: "260px",
              zIndex: isTeal ? 4 : 5,
            }}
          >
            <motion.div
              style={{
                translateX: "-50%",
                translateY: "-50%",
                rotate: rotateDeg,
                transformStyle: "preserve-3d",
              }}
              animate={
                !isActive
                  ? { rotateX: 0, opacity: 0, scaleY: 1 }
                  : isSpinning
                    ? {
                        rotateX: [0, -72, 0],
                        opacity: [0.6, 1, 0.6],
                        scaleY: [1, 0.76, 1],
                      }
                    : {
                        rotateX: [0, -24, 0],
                        opacity: [0.55, 0.82, 0.55],
                        scaleY: 1,
                      }
              }
              transition={
                !isActive
                  ? { duration: 0.35, ease: "easeOut" }
                  : isSpinning
                    ? {
                        duration: SPIN_CYCLE,
                        repeat: Infinity,
                        delay: spinDelay,
                        ease: [0.45, 0, 0.55, 1],
                        repeatDelay: 0,
                      }
                    : {
                        duration: IDLE_CYCLE,
                        repeat: Infinity,
                        delay: idleDelay,
                        ease: "easeInOut",
                        repeatDelay: 0,
                      }
              }
            >
              <svg
                width={30}
                height={54}
                viewBox="0 0 20 36"
                overflow="visible"
              >
                <path
                  d="M 10 0 C 19 9 19 25 10 36 C 1 25 1 9 10 0 Z"
                  fill={`url(#${gradId})`}
                  stroke={strokeClr}
                  strokeWidth="1.4"
                  strokeOpacity="0.88"
                  filter="url(#lotus-glow)"
                />
                <path
                  d="M 10 2 C 15 10 15 24 10 34"
                  fill="none"
                  stroke={ridgeClr}
                  strokeWidth="0.9"
                  strokeOpacity="0.55"
                />
                <line
                  x1="10"
                  y1="5"
                  x2="10"
                  y2="31"
                  stroke={veinClr}
                  strokeWidth="0.9"
                  strokeOpacity="0.62"
                />
                <path
                  d="M 10 13 Q 5 18 3 24"
                  fill="none"
                  stroke={veinClr}
                  strokeWidth="0.6"
                  strokeOpacity="0.45"
                />
                <path
                  d="M 10 13 Q 15 18 17 24"
                  fill="none"
                  stroke={veinClr}
                  strokeWidth="0.6"
                  strokeOpacity="0.45"
                />
              </svg>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

const EXPERTISE_DOMAINS = [
  {
    title: "Frontend Engineering",
    Icon: Layers,
    years: 4,
    accent: {
      gradient: "from-cyan-500/10 to-transparent",
      border: "border-cyan-500/25 hover:border-cyan-500/50",
      text: "text-cyan-500",
      badge: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    },
    summary:
      "Deep confidence in React internals and JavaScript fundamentals — building interfaces that are fast, maintainable, and visually refined.",
    highlights: [
      "React Performance & Optimization",
      "Advanced JavaScript Patterns",
      "Next.js SSR · SSG · ISR",
      "TypeScript Type Engineering",
      "Framer Motion & Animations",
      "TanStack Query & Zustand",
      "Complex UI Architecture",
      "Responsive & Accessible UI",
    ],
  },
  {
    title: "Node.js & Backend",
    Icon: Server,
    years: 4,
    featured: true,
    accent: {
      gradient: "from-violet-500/10 to-indigo-500/5",
      border: "border-violet-500/40 hover:border-violet-500/70",
      text: "text-violet-400",
      badge: "bg-violet-500/15 text-violet-400 border-violet-500/25",
    },
    summary:
      "NestJS is my primary backend framework — I know its architecture deeply and apply it to build robust, production-ready server systems.",
    highlights: [
      "NestJS — Primary Framework",
      "Modular & DI Architecture",
      "RESTful API Design",
      "Real-time WebSocket Systems",
      "Microservices & Event-driven",
      "JWT Auth & Security Patterns",
      "Redis Caching & Pub/Sub",
      "RabbitMQ Message Queues",
    ],
  },
  {
    title: "Data & Infrastructure",
    Icon: Database,
    years: 3,
    accent: {
      gradient: "from-emerald-500/10 to-transparent",
      border: "border-emerald-500/25 hover:border-emerald-500/50",
      text: "text-emerald-500",
      badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    summary:
      "Experienced in designing schemas, optimizing queries, and setting up cloud infrastructure that scales with the application.",
    highlights: [
      "PostgreSQL Schema Design",
      "MongoDB Aggregations",
      "Prisma ORM & Migrations",
      "Redis Performance Caching",
      "Docker Containerization",
      "AWS S3 · EC2 · KMS",
      "Real-time Data Pipelines",
      "CI/CD & Deployment Flows",
    ],
  },
];

const Skills = () => {
  const [active, setActive] = useState<Category>("all");
  const [offset, setOffset] = useState(0);
  const [selectedTech, setSelectedTech] = useState<ITech | null>(null);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [dims, setDims] = useState<RingDims>(computeDims(360));
  const [isDragging, setIsDragging] = useState(false);
  const [sparks, setSparks] = useState<Spark[]>([]);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const totalRef = useRef(1);
  const sparkIdRef = useRef(0);
  const lastSparkTimeRef = useRef(0);
  const didDragRef = useRef(false);
  const dragInfo = useRef<{
    lastPointerAngle: number;
    lastTime: number;
    velocity: number;
    accumulated: number;
    rotationStart: number;
  } | null>(null);

  const ringRotation = useMotionValue(0);
  const counterRotation = useTransform(ringRotation, (v) => -v);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => setDims(computeDims(el.clientWidth));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const filtered =
    active === "all"
      ? techStack
      : techStack.filter((t) => t.category === active);
  const total = filtered.length;

  useEffect(() => {
    totalRef.current = total;
  }, [total]);

  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  useEffect(() => {
    setOffset(0);
    offsetRef.current = 0;
    motionAnimate(ringRotation, 0, SPRING);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const normalizedOffset = ((offset % total) + total) % total;
  const featuredItem = filtered[normalizedOffset];

  const next = useCallback(() => {
    const newOffset = offsetRef.current + 1;
    offsetRef.current = newOffset;
    setOffset(newOffset);
    motionAnimate(ringRotation, -newOffset * (360 / totalRef.current), SPRING);
  }, [ringRotation]);

  const prev = useCallback(() => {
    const newOffset = offsetRef.current - 1;
    offsetRef.current = newOffset;
    setOffset(newOffset);
    motionAnimate(ringRotation, -newOffset * (360 / totalRef.current), SPRING);
  }, [ringRotation]);

  const rotateTo = useCallback(
    (targetIndex: number) => {
      const curNorm =
        ((offsetRef.current % totalRef.current) + totalRef.current) %
        totalRef.current;
      const delta =
        (targetIndex - curNorm + totalRef.current) % totalRef.current;
      const shortDelta =
        delta > totalRef.current / 2 ? delta - totalRef.current : delta;
      const newOffset = offsetRef.current + shortDelta;
      offsetRef.current = newOffset;
      setOffset(newOffset);
      motionAnimate(
        ringRotation,
        -newOffset * (360 / totalRef.current),
        SPRING,
      );
    },
    [ringRotation],
  );

  useEffect(() => {
    if (!playing || hovered) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [playing, hovered, next]);

  const getAngle = useCallback((clientX: number, clientY: number) => {
    const el = ringRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return (
      Math.atan2(
        clientY - (rect.top + rect.height / 2),
        clientX - (rect.left + rect.width / 2),
      ) *
      (180 / Math.PI)
    );
  }, []);

  const spawnSparks = useCallback((clientX: number, clientY: number) => {
    const el = ringRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const count = 2 + Math.floor(Math.random() * 3);
    const newSparks: Spark[] = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 20 + Math.random() * 55;
      return {
        id: sparkIdRef.current++,
        x,
        y,
        size: 3 + Math.random() * 5,
        color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist,
        duration: 0.35 + Math.random() * 0.3,
      };
    });
    setSparks((prev) => [...prev, ...newSparks]);
    const ids = newSparks.map((s) => s.id);
    setTimeout(
      () => setSparks((prev) => prev.filter((s) => !ids.includes(s.id))),
      800,
    );
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      dragInfo.current = {
        lastPointerAngle: getAngle(e.clientX, e.clientY),
        lastTime: Date.now(),
        velocity: 0,
        accumulated: 0,
        rotationStart: ringRotation.get(),
      };
      didDragRef.current = false;
      setIsDragging(true);
    },
    [getAngle, ringRotation],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragInfo.current) return;
      const angle = getAngle(e.clientX, e.clientY);
      const now = Date.now();
      const dt = now - dragInfo.current.lastTime;

      let dAngle = angle - dragInfo.current.lastPointerAngle;
      if (dAngle > 180) dAngle -= 360;
      if (dAngle < -180) dAngle += 360;

      dragInfo.current.accumulated += dAngle;
      if (dt > 0) dragInfo.current.velocity = dAngle / dt;
      dragInfo.current.lastPointerAngle = angle;
      dragInfo.current.lastTime = now;

      ringRotation.set(
        dragInfo.current.rotationStart + dragInfo.current.accumulated,
      );

      if (Math.abs(dragInfo.current.accumulated) > 8) didDragRef.current = true;

      if (
        Math.abs(dragInfo.current.velocity) > 0.12 &&
        now - lastSparkTimeRef.current > 80
      ) {
        lastSparkTimeRef.current = now;
        spawnSparks(e.clientX, e.clientY);
      }
    },
    [getAngle, ringRotation, spawnSparks],
  );

  const handlePointerUp = useCallback(() => {
    if (!dragInfo.current) {
      setIsDragging(false);
      return;
    }
    const currentRotation = ringRotation.get();
    const degreesPerItem = 360 / totalRef.current;
    const nearestOffset = -Math.round(currentRotation / degreesPerItem);
    const targetRotation = -nearestOffset * degreesPerItem;
    motionAnimate(ringRotation, targetRotation, {
      ...SPRING,
      velocity: dragInfo.current.velocity * 1000,
    });
    offsetRef.current = nearestOffset;
    setOffset(nearestOffset);
    dragInfo.current = null;
    setIsDragging(false);
  }, [ringRotation]);

  const { radius, container, item, hub } = dims;
  const center = container / 2;

  return (
    <section id="skills" className="scroll-mt-28">
      {/* Heading */}
      <div className="mb-10 flex flex-col items-center justify-center">
        <h2 className="mb-3 text-center text-4xl font-bold md:text-5xl">
          <span className="bg-[linear-gradient(90deg,#06b6d4,#22d3ee)] bg-clip-text text-transparent">
            Tech
          </span>{" "}
          <span className="bg-[linear-gradient(90deg,#a78bfa,#8b5cf6)] bg-clip-text text-transparent">
            Stack
          </span>
        </h2>
        <p className="max-w-lg text-center text-muted-foreground">
          Technologies and tools I work with to build modern web applications
        </p>
      </div>

      {/* Tab switcher */}
      <div className="mb-10 flex justify-center">
        <div className="relative flex gap-1 rounded-full border border-border bg-background/50 p-1 backdrop-blur-sm">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActive(tab.value)}
              className="relative z-10 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200"
            >
              {active === tab.value && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-full bg-gradient"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 ${active === tab.value ? "text-white" : "text-muted-foreground"}`}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orbit ring */}
      <div ref={wrapperRef} className="flex w-full flex-col items-center gap-6">
        <div
          ref={ringRef}
          className="relative select-none"
          style={{
            width: container,
            height: container,
            cursor: isDragging ? "grabbing" : "grab",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Lotus weave outer ring */}
          <LotusWeaveRing
            ringRotation={ringRotation}
            radius={radius}
            center={center}
            container={container}
            isHovered={hovered}
          />

          {/* Spark particles */}
          {sparks.map((spark) => (
            <motion.div
              key={spark.id}
              className="pointer-events-none absolute rounded-full"
              style={{
                left: spark.x - spark.size / 2,
                top: spark.y - spark.size / 2,
                width: spark.size,
                height: spark.size,
                background: spark.color,
                boxShadow: `0 0 ${spark.size * 3}px ${spark.color}`,
              }}
              initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              animate={{ opacity: 0, scale: 0, x: spark.tx, y: spark.ty }}
              transition={{ duration: spark.duration, ease: "easeOut" }}
            />
          ))}

          {/* Decorative orbit track rings */}
          {([radius + 24, radius] as const).map((r, ri) => (
            <div
              key={ri}
              className={`absolute rounded-full border ${
                ri === 0 ? "border-border/50" : "border-primary/25"
              }`}
              style={{
                width: r * 2,
                height: r * 2,
                left: center - r,
                top: center - r,
              }}
            />
          ))}

          {/* Ambient glow behind hub */}
          <div
            className="absolute rounded-full bg-gradient opacity-10 blur-3xl dark:opacity-20"
            style={{
              width: hub * 2,
              height: hub * 2,
              left: center - hub,
              top: center - hub,
            }}
          />

          {/* Single rotating wrapper — driven by ringRotation MotionValue */}
          <motion.div
            className="absolute inset-0"
            style={{ rotate: ringRotation }}
          >
            {/* SVG gradient spokes */}
            <svg
              className="pointer-events-none absolute inset-0"
              width={container}
              height={container}
            >
              <defs>
                <radialGradient
                  id="spoke-radial"
                  cx={center}
                  cy={center}
                  r={radius}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="rgba(99,102,241,0)" />
                  <stop offset="35%" stopColor="rgba(139,92,246,0.28)" />
                  <stop offset="100%" stopColor="rgba(6,182,212,0.48)" />
                </radialGradient>
                <radialGradient
                  id="spoke-radial-featured"
                  cx={center}
                  cy={center}
                  r={radius}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="rgba(99,102,241,0)" />
                  <stop offset="25%" stopColor="rgba(139,92,246,0.9)" />
                  <stop offset="100%" stopColor="rgba(6,182,212,1)" />
                </radialGradient>
              </defs>

              {filtered.map((tech, i) => {
                const angle = (2 * Math.PI * i) / total - Math.PI / 2;
                const x2 = center + radius * Math.cos(angle);
                const y2 = center + radius * Math.sin(angle);
                const isFeatured = i === normalizedOffset;
                return (
                  <line
                    key={tech.name}
                    x1={center}
                    y1={center}
                    x2={x2}
                    y2={y2}
                    stroke={
                      isFeatured
                        ? "url(#spoke-radial-featured)"
                        : "url(#spoke-radial)"
                    }
                    strokeWidth={isFeatured ? 2 : 0.9}
                    strokeDasharray={isFeatured ? "5 7" : "3 11"}
                    className={
                      isFeatured ? "orbit-line-featured" : "orbit-line"
                    }
                  />
                );
              })}
            </svg>

            {/* Ring items — counter-rotate via MotionValue so icons stay upright */}
            <AnimatePresence>
              {filtered.map((tech, i) => {
                const angle = (2 * Math.PI * i) / total - Math.PI / 2;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                const isFeatured = i === normalizedOffset;
                const iconSize = Math.round(item * 0.62);

                return (
                  <motion.button
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: isFeatured ? 1.25 : 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={SPRING}
                    onClick={() => {
                      if (didDragRef.current) {
                        didDragRef.current = false;
                        return;
                      }
                      rotateTo(i);
                      setSelectedTech(tech);
                    }}
                    className={`absolute z-10 flex items-center justify-center rounded-full border bg-background transition-colors duration-300 ${
                      isFeatured
                        ? "item-glow-pulse border-violet-500/50 dark:border-violet-500/70"
                        : "border-border hover:border-primary/50"
                    }`}
                    style={{
                      rotate: counterRotation,
                      width: item,
                      height: item,
                      left: center + x - item / 2,
                      top: center + y - item / 2,
                    }}
                    title={tech.name}
                  >
                    <Image
                      unoptimized
                      src={tech.imageUri}
                      alt={tech.name}
                      placeholder="blur"
                      blurDataURL={BLUR_URL}
                      width={iconSize}
                      height={iconSize}
                      className="rounded-full object-contain"
                      style={{ width: iconSize, height: iconSize }}
                    />
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Wings */}
          {(() => {
            const wingW = Math.round(hub * 0.62);
            const wingH = Math.round(hub * 0.84);
            return (
              <>
                {/* Left wing */}
                <div
                  className="pointer-events-none absolute z-[18]"
                  style={{
                    left: center - hub / 2 - wingW + 6,
                    top: center - wingH / 2,
                    perspective: 480,
                  }}
                >
                  <motion.div
                    key={`left-wing-${wingW}`}
                    initial={{ x: -wingW * 3, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      duration: 1.1,
                      delay: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <motion.div
                      style={{ transformOrigin: "right center" }}
                      animate={{ rotateY: [-10, -72, -10] }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <WingSvg side="left" w={wingW} h={wingH} />
                    </motion.div>
                  </motion.div>
                </div>
                {/* Right wing */}
                <div
                  className="pointer-events-none absolute z-[18]"
                  style={{
                    left: center + hub / 2 - 6,
                    top: center - wingH / 2,
                    perspective: 480,
                  }}
                >
                  <motion.div
                    key={`right-wing-${wingW}`}
                    initial={{ x: wingW * 3, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      duration: 1.1,
                      delay: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <motion.div
                      style={{ transformOrigin: "left center" }}
                      animate={{ rotateY: [10, 72, 10] }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <WingSvg side="right" w={wingW} h={wingH} />
                    </motion.div>
                  </motion.div>
                </div>
              </>
            );
          })()}

          {/* Center hub — outside rotating wrapper; never spins */}
          <motion.button
            onClick={() => {
              if (didDragRef.current) {
                didDragRef.current = false;
                return;
              }
              setSelectedTech(featuredItem);
            }}
            className="absolute z-20 flex rounded-full bg-gradient p-[2px] shadow-[0_0_36px_rgba(139,92,246,0.3)] dark:shadow-[0_0_48px_rgba(139,92,246,0.45)]"
            style={{
              width: hub,
              height: hub,
              left: center - hub / 2,
              top: center - hub / 2,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.93 }}
            title={`View details: ${featuredItem.name}`}
          >
            <div className="relative flex size-full items-center justify-center rounded-full bg-background">
              {/* Icon */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`icon-${featuredItem.name}`}
                  initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <Image
                    unoptimized
                    src={featuredItem.imageUri}
                    alt={featuredItem.name}
                    placeholder="blur"
                    blurDataURL={BLUR_URL}
                    width={Math.round(hub * 0.42)}
                    height={Math.round(hub * 0.42)}
                    className="rounded-full object-contain"
                    style={{
                      width: Math.round(hub * 0.42),
                      height: Math.round(hub * 0.42),
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.button>

          {/* Pendulum half-circle below hub */}
          <div
            className="pointer-events-none absolute z-[19] rotate-180"
            style={{
              left: center - (hub * 0.6) / 2,
              top: center + hub / 2 - 4,
            }}
          >
            <motion.div
              style={{ transformOrigin: "50% 0%" }}
              animate={{ rotate: [-22, 22, -22] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg
                width={hub * 0.6}
                height={hub * 0.3}
                viewBox="0 0 60 30"
                overflow="visible"
              >
                <defs>
                  <linearGradient
                    id="pendulum-grad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.85" />
                    <stop offset="60%" stopColor="#6366f1" stopOpacity="0.6" />
                    <stop
                      offset="100%"
                      stopColor="#06b6d4"
                      stopOpacity="0.25"
                    />
                  </linearGradient>
                  <filter
                    id="pendulum-glow"
                    x="-40%"
                    y="-20%"
                    width="180%"
                    height="180%"
                  >
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Semicircle: flat top, arc curves down */}
                <path
                  d="M 0 0 A 30 30 0 0 1 60 0 Z"
                  fill="url(#pendulum-grad)"
                  stroke="#a78bfa"
                  strokeWidth="1.5"
                  strokeOpacity="0.75"
                  filter="url(#pendulum-glow)"
                />

                {/* Inner arc vein */}
                <path
                  d="M 9 0 Q 30 22 51 0"
                  fill="none"
                  stroke="#c4b5fd"
                  strokeWidth="0.7"
                  strokeOpacity="0.35"
                />
              </svg>
            </motion.div>
          </div>

          {/* Spinning conic ring around hub */}
          <div
            className="hub-spinner pointer-events-none absolute z-20 rounded-full"
            style={{
              width: hub + 12,
              height: hub + 12,
              left: center - (hub + 12) / 2,
              top: center - (hub + 12) / 2,
              background:
                "conic-gradient(from 0deg, rgba(99,102,241,0), rgba(139,92,246,0.9) 25%, rgba(6,182,212,0.7) 55%, rgba(99,102,241,0) 70%)",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 2.5px), white 100%)",
              WebkitMask:
                "radial-gradient(farthest-side, transparent calc(100% - 2.5px), white 100%)",
            }}
          />
        </div>

        {/* Featured label + controls */}
        <div className="flex flex-col items-center gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={featuredItem.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col items-center gap-1"
            >
              <p className="text-sm font-semibold text-foreground">
                {featuredItem.name}
              </p>
              {featuredItem.category && categoryMeta[featuredItem.category] && (
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${categoryMeta[featuredItem.category].bg} ${categoryMeta[featuredItem.category].text} ${categoryMeta[featuredItem.category].border}`}
                >
                  {categoryMeta[featuredItem.category].label}
                </span>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="flex size-9 items-center justify-center rounded-full border border-border bg-background/60 transition-all hover:border-primary/40 hover:bg-background"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => setSelectedTech(featuredItem)}
              className="flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-600 transition-all hover:bg-violet-500/20 dark:text-violet-300"
            >
              <Sparkles className="size-3.5" />
              View Details
            </button>
            <button
              onClick={next}
              className="flex size-9 items-center justify-center rounded-full border border-border bg-background/60 transition-all hover:border-primary/40 hover:bg-background"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <button
            onClick={() => setPlaying((p) => !p)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground"
          >
            {playing ? (
              <Pause className="size-3" />
            ) : (
              <Play className="size-3" />
            )}
            {playing ? "Pause autoplay" : "Resume autoplay"}
          </button>
        </div>
      </div>

      {/* ─── Expertise Profile ─────────────────────────────── */}
      <div id="expertise" className="mt-20 scroll-mt-28 space-y-8">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <h3 className="mb-2 text-center text-3xl font-bold md:text-4xl">
            <span className="bg-[linear-gradient(90deg,#a78bfa,#8b5cf6)] bg-clip-text text-transparent">
              My
            </span>{" "}
            <span className="text-foreground">Expertise</span>
          </h3>
          <p className="max-w-md text-center text-sm text-muted-foreground">
            4 years of full-stack JavaScript development — specialized in
            Node.js backends and modern React frontends
          </p>
        </motion.div>

        {/* Node.js hero banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-background/95 p-7 backdrop-blur-sm md:p-9"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-indigo-500/5" />
          <div className="pointer-events-none absolute -right-12 -top-12 size-64 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-8 left-1/3 size-48 rounded-full bg-cyan-500/10 blur-2xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10">
              <Image
                unoptimized
                src="/node-js.png"
                alt="Node.js"
                placeholder="blur"
                blurDataURL={BLUR_URL}
                width={48}
                height={48}
                className="size-12 object-contain"
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-xl font-bold text-foreground">
                  Node.js Full-Stack Developer
                </h4>
                <span className="rounded-full border border-violet-500/30 bg-violet-500/15 px-3 py-0.5 text-xs font-semibold text-violet-400">
                  4 Years Experience
                </span>
                <span className="rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-0.5 text-xs font-medium text-cyan-500">
                  Full-Stack
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Specialized in building production-grade Node.js applications —
                high-performance REST APIs, real-time WebSocket systems, and
                event-driven microservices. Paired with deep React and Next.js
                expertise on the frontend, I deliver complete, scalable
                JavaScript&thinsp;/&thinsp;TypeScript solutions end-to-end.
              </p>
            </div>
            <div className="flex shrink-0 gap-6 sm:flex-col sm:items-end sm:gap-4">
              {[
                { value: "4+", label: "Years" },
                { value: "10+", label: "Projects" },
                { value: "22+", label: "Technologies" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center sm:items-end sm:text-right"
                >
                  <span className="text-2xl font-extrabold text-foreground">
                    {value}
                  </span>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Domain expertise cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {EXPERTISE_DOMAINS.map((domain, di) => {
            const { Icon } = domain;
            return (
              <motion.div
                key={domain.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: di * 0.1 + 0.2 }}
                className={`group relative overflow-hidden rounded-2xl border bg-background/95 p-6 backdrop-blur-sm transition-all duration-300 ${domain.accent.border}`}
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${domain.accent.gradient}`}
                />
                <div className="relative space-y-4">
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex size-11 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110 ${domain.accent.badge}`}
                    >
                      <Icon className={`size-5 ${domain.accent.text}`} />
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${domain.accent.badge}`}
                    >
                      {domain.years} yr{domain.years !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div>
                    <h4 className="mb-1.5 text-base font-bold text-foreground">
                      {domain.title}
                    </h4>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {domain.summary}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {domain.highlights.map((highlight, hi) => (
                      <motion.span
                        key={highlight}
                        initial={{ opacity: 0, y: 6 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.28,
                          delay: di * 0.08 + hi * 0.045 + 0.2,
                        }}
                        className={`rounded-full border px-2.5 py-[5px] text-[11px] font-medium leading-none ${domain.accent.badge}`}
                      >
                        {highlight}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedTech && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 dark:bg-black/75"
            onClick={() => setSelectedTech(null)}
          >
            <div className="absolute inset-0 backdrop-blur-md" />

            <motion.div
              initial={{ scale: 0.82, y: 32, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.82, y: 32, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-background/95 shadow-2xl backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-x-0 top-0 h-36 bg-gradient opacity-10" />

              <button
                onClick={() => setSelectedTech(null)}
                className="absolute right-4 top-4 z-10 flex size-7 items-center justify-center rounded-full border border-border bg-background/60 transition-all hover:bg-background/90"
              >
                <X className="size-3.5" />
              </button>

              <div className="relative px-6 pb-8 pt-8">
                <div className="mb-5 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient opacity-40 blur-2xl" />
                    <div className="relative rounded-full bg-gradient p-[2.5px] shadow-lg">
                      <div className="flex size-24 items-center justify-center rounded-full bg-background">
                        <Image
                          unoptimized
                          src={selectedTech.imageUri}
                          alt={selectedTech.name}
                          placeholder="blur"
                          blurDataURL={BLUR_URL}
                          width={60}
                          height={60}
                          className="size-14 rounded-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="mb-2 text-center text-xl font-bold text-foreground">
                  {selectedTech.name}
                </h3>

                {selectedTech.category &&
                  categoryMeta[selectedTech.category] && (
                    <div className="mb-5 flex justify-center">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${categoryMeta[selectedTech.category].bg} ${categoryMeta[selectedTech.category].text} ${categoryMeta[selectedTech.category].border}`}
                      >
                        {categoryMeta[selectedTech.category].label}
                      </span>
                    </div>
                  )}

                {selectedTech.description && (
                  <p className="text-center text-sm leading-relaxed text-muted-foreground">
                    {selectedTech.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Skills;
