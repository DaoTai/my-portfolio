"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { listProject } from "@/lib/init";
import { ChevronLeft, ChevronRight, UserRound, X, CheckCircle2, Zap } from "lucide-react";
import Image from "next/image";
import CarouselImages from "./CarouselImages";

// ── role styles ───────────────────────────────────────────────
type RoleStyle = {
  badge: string;
  border: string;
  activeBorder: string;
  glow: string;
  dot: string;
  section: string;
  ring: string;
  stroke: string; // hex for SVG lines
};

const ROLE_STYLES: Record<string, RoleStyle> = {
  "Frontend Developer": {
    badge: "bg-sky-500/15 text-sky-400 border-sky-500/40",
    border: "border-sky-500/20",
    activeBorder: "border-sky-400/70",
    glow: "shadow-[0_0_44px_rgba(14,165,233,0.32)]",
    dot: "bg-sky-400",
    section: "text-sky-400",
    ring: "ring-sky-400/30",
    stroke: "#38bdf8",
  },
  "Backend Developer": {
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
    border: "border-emerald-500/20",
    activeBorder: "border-emerald-400/70",
    glow: "shadow-[0_0_44px_rgba(16,185,129,0.32)]",
    dot: "bg-emerald-400",
    section: "text-emerald-400",
    ring: "ring-emerald-400/30",
    stroke: "#34d399",
  },
  "Full-stack Developer": {
    badge: "bg-violet-500/15 text-violet-400 border-violet-500/40",
    border: "border-violet-500/20",
    activeBorder: "border-violet-400/70",
    glow: "shadow-[0_0_44px_rgba(139,92,246,0.32)]",
    dot: "bg-violet-400",
    section: "text-violet-400",
    ring: "ring-violet-400/30",
    stroke: "#a78bfa",
  },
};
const FALLBACK_STYLE: RoleStyle = {
  badge: "bg-primary/15 text-primary border-primary/40",
  border: "border-primary/20",
  activeBorder: "border-primary/70",
  glow: "shadow-[0_0_44px_rgba(99,102,241,0.32)]",
  dot: "bg-primary",
  section: "text-primary",
  ring: "ring-primary/30",
  stroke: "#6366f1",
};

function rs(role: string) {
  return ROLE_STYLES[role] ?? FALLBACK_STYLE;
}

// ── constants ─────────────────────────────────────────────────
const CARD_W   = 260;
const AUTOPLAY = 4200; // ms per slide

const X_STEP   = [0, 238, 416] as const;
const SCALE    = [1, 0.78, 0.60] as const;
const ROT_Y    = [0, 44, 64] as const;
const Z_DEPTH  = [0, -130, -260] as const;
const OPACITY  = [1, 0.72, 0.38] as const;
const Z_IDX    = [20, 13, 7] as const;

function circularOffset(i: number, active: number, total: number) {
  let d = i - active;
  if (d > total / 2) d -= total;
  if (d < -total / 2) d += total;
  return d;
}

// ── neural tree node definitions ──────────────────────────────
// SVG viewBox="0 0 100 100"; card centre ≈ (50, 42)
type NeuralNode = {
  svgX: number; svgY: number;
  left: string; top: string;
  delay: number;
  content: (p: IProject, s: RoleStyle) => React.ReactNode;
};

const NEURAL_NODES: NeuralNode[] = [
  {
    svgX: 7,  svgY: 15, left: "7%",  top: "15%", delay: 0,
    content: (p, s) => (
      <span className={`flex items-center gap-1 text-[11px] font-bold ${s.section}`}>
        <UserRound size={10} />{p.role}
      </span>
    ),
  },
  {
    svgX: 48, svgY: 4,  left: "48%", top: "4%",  delay: 0.07,
    content: (p) => (
      <span className="text-[11px] leading-snug text-foreground/80">
        {p.technicalHighlights[0]}
      </span>
    ),
  },
  {
    svgX: 93, svgY: 12, left: "90%", top: "12%", delay: 0.14,
    content: (p) => (
      <span className="text-[11px] leading-snug text-foreground/80">
        {p.technicalHighlights[1]}
      </span>
    ),
  },
  {
    svgX: 6,  svgY: 82, left: "6%",  top: "82%", delay: 0.21,
    content: (p) => (
      <span className="text-[11px] leading-snug text-foreground/80">
        {p.technicalHighlights[2]}
      </span>
    ),
  },
  {
    svgX: 94, svgY: 80, left: "90%", top: "80%", delay: 0.28,
    content: (p) => (
      <span className="line-clamp-2 text-[10px] leading-snug text-foreground/70">
        {p.responsibilities[0].length > 60
          ? p.responsibilities[0].slice(0, 60) + "…"
          : p.responsibilities[0]}
      </span>
    ),
  },
];

// ── NeuralTree overlay ────────────────────────────────────────
function NeuralTree({ project, s }: { project: IProject; s: RoleStyle }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      {/* connecting lines */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ overflow: "visible" }}
      >
        {NEURAL_NODES.map((n, i) => (
          <motion.path
            key={i}
            d={`M 50 42 L ${n.svgX} ${n.svgY}`}
            stroke={s.stroke}
            strokeWidth="0.32"
            fill="none"
            strokeDasharray="1.6 0.9"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.55 }}
            exit={{ pathLength: 0, opacity: 0 }}
            transition={{ delay: n.delay, duration: 0.48, ease: "easeOut" }}
          />
        ))}
        {/* node dots on the line endpoint */}
        {NEURAL_NODES.map((n, i) => (
          <motion.circle
            key={`dot-${i}`}
            cx={n.svgX} cy={n.svgY} r="0.9"
            fill={s.stroke}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.9 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: n.delay + 0.35, duration: 0.22 }}
          />
        ))}
      </svg>

      {/* glass cards */}
      {NEURAL_NODES.map((n, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            left: n.left,
            top: n.top,
            transform: "translate(-50%, -50%)",
            maxWidth: 148,
          }}
          initial={{ opacity: 0, scale: 0.45 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.45 }}
          transition={{ delay: n.delay + 0.14, duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="rounded-xl border border-white/25 bg-white/10 px-2.5 py-1.5 backdrop-blur-md dark:bg-black/35"
            style={{ boxShadow: `0 2px 16px 2px ${s.stroke}28` }}
          >
            {n.content(project, s)}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── ProjectModal ──────────────────────────────────────────────
function ProjectModal({
  project,
  index,
  s,
  onClose,
}: {
  project: IProject;
  index: number;
  s: RoleStyle;
  onClose: () => void;
}) {
  // lock body scroll + escape key
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      {/* backdrop */}
      <motion.div
        className="absolute inset-0 bg-background/75 backdrop-blur-lg"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* card */}
      <motion.div
        className={`relative z-10 flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border bg-background/92 shadow-2xl backdrop-blur-xl ${s.activeBorder}`}
        initial={{ opacity: 0, scale: 0.86, y: 36 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 24 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full border border-white/20 bg-background/60 p-1.5 backdrop-blur-sm transition-all hover:bg-background hover:scale-110 active:scale-95"
          aria-label="Close"
        >
          <X size={15} />
        </button>

        {/* header */}
        <div className="flex flex-wrap items-center gap-3 border-b border-white/10 px-6 py-5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient text-sm font-bold text-white shadow-lg">
            {index}
          </span>
          <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">{project.name}</h3>
          <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${s.badge}`}>
            <UserRound size={12} />
            {project.role}
          </span>
        </div>

        {/* scrollable body */}
        <div className="overflow-y-auto">
          <div className="grid gap-6 p-6 lg:grid-cols-2">
            {/* left */}
            <div className="space-y-6">
              <p className="leading-relaxed text-foreground/80">{project.summary}</p>

              <div>
                <h4 className={`mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest ${s.section}`}>
                  <CheckCircle2 size={13} />
                  My Responsibilities
                </h4>
                <ul className="space-y-2">
                  {project.responsibilities.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + i * 0.04 }}
                      className="flex items-start gap-2.5 text-sm text-foreground/75"
                    >
                      <span className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${s.dot}`} />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className={`mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest ${s.section}`}>
                  <Zap size={13} />
                  Technical Highlights
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.technicalHighlights.map((h, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.18 + i * 0.05 }}
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${s.badge}`}
                    >
                      {h}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>

            {/* right — image carousel */}
            {project.previewImages.length > 0 && (
              <div className="overflow-hidden rounded-xl border border-white/10">
                <CarouselImages previewImages={project.previewImages} />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main export ───────────────────────────────────────────────
export default function ProjectCarousel() {
  const [active, setActive]           = useState(0);
  const [paused, setPaused]           = useState(false);
  const [centerHovered, setCenterHovered] = useState(false);
  const [modalOpen, setModalOpen]     = useState(false);

  const total   = listProject.length;
  const project = listProject[active];
  const s       = rs(project.role);

  // auto-play
  useEffect(() => {
    if (paused || modalOpen) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % total), AUTOPLAY);
    return () => clearTimeout(id);
  }, [active, paused, modalOpen, total]);

  function navigate(dir: 1 | -1) {
    setPaused(true);
    setActive((a) => (a + dir + total) % total);
    setTimeout(() => setPaused(false), 9000);
  }

  function selectDot(i: number) {
    setPaused(true);
    setActive(i);
    setTimeout(() => setPaused(false), 9000);
  }

  return (
    <>
      {/* ── carousel section ─────────────────────────────────── */}
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => { setPaused(false); setCenterHovered(false); }}
      >
        {/* 3D track */}
        <div
          className="relative mx-auto h-[300px] sm:h-[340px]"
          style={{ perspective: "1100px" }}
        >
          {/* neural tree (z-30, not inside preserve-3d so it renders flat) */}
          <AnimatePresence>
            {centerHovered && !modalOpen && (
              <NeuralTree key={active} project={project} s={s} />
            )}
          </AnimatePresence>

          {/* 3D cards — clipped so they don't cause horizontal scroll */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="relative flex h-full items-center justify-center"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="relative" style={{ width: CARD_W, transformStyle: "preserve-3d" }}>
                {listProject.map((p, i) => {
                  const offset = circularOffset(i, active, total);
                  const abs    = Math.abs(offset);
                  if (abs > 2) return null;

                  const sign     = Math.sign(offset);
                  const ps       = rs(p.role);
                  const isActive = offset === 0;

                  return (
                    <motion.div
                      key={p.name}
                      onClick={() =>
                        isActive ? setModalOpen(true) : (setPaused(true), setActive(i), setTimeout(() => setPaused(false), 9000))
                      }
                      onHoverStart={() => isActive && setCenterHovered(true)}
                      onHoverEnd={() => setCenterHovered(false)}
                      animate={{
                        x:       sign * X_STEP[abs],
                        rotateY: -sign * ROT_Y[abs],
                        scale:   SCALE[abs],
                        z:       Z_DEPTH[abs],
                        opacity: OPACITY[abs],
                        zIndex:  Z_IDX[abs],
                      }}
                      transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        position: "absolute",
                        width: CARD_W,
                        transformStyle: "preserve-3d",
                        cursor: "pointer",
                      }}
                      className={`overflow-hidden rounded-2xl border bg-background/90 backdrop-blur-md transition-[border-color,box-shadow] duration-300 ${
                        isActive
                          ? `${ps.activeBorder} ${ps.glow} ring-2 ${ps.ring}`
                          : ps.border
                      }`}
                    >
                      {/* thumbnail */}
                      <div className="relative h-[185px] w-full overflow-hidden bg-black/70 select-none">
                        {p.previewImages[0] && (
                          <Image
                            unoptimized
                            src={p.previewImages[0]}
                            alt={p.name}
                            fill
                            draggable={false}
                            className="object-cover object-top"
                          />
                        )}
                        {!isActive && (
                          <div className="absolute inset-0 bg-background/55" />
                        )}
                        {/* "click" hint for active card */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-x-0 bottom-2 flex justify-center"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                          >
                            <span className="rounded-full bg-background/75 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                              Click for details
                            </span>
                          </motion.div>
                        )}
                      </div>

                      {/* card footer */}
                      <div className="px-3 py-2.5">
                        <p className="truncate text-sm font-bold">{p.name}</p>
                        <span className={`mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${ps.badge}`}>
                          <UserRound size={9} />
                          {p.role}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* nav arrows */}
          <button
            onClick={() => navigate(-1)}
            aria-label="Previous"
            className="absolute left-0 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/15 bg-background/70 p-2.5 shadow backdrop-blur-sm transition hover:bg-background active:scale-90 sm:-left-5"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => navigate(1)}
            aria-label="Next"
            className="absolute right-0 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/15 bg-background/70 p-2.5 shadow backdrop-blur-sm transition hover:bg-background active:scale-90 sm:-right-5"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* progress bar */}
        <div className="mx-auto mt-5 h-0.5 max-w-[180px] overflow-hidden rounded-full bg-foreground/10">
          <style>{`@keyframes pb { from { transform:scaleX(0) } to { transform:scaleX(1) } }`}</style>
          <div
            key={`${active}-${paused}`}
            className={`h-full rounded-full ${s.dot}`}
            style={{
              transformOrigin: "left",
              animation: `pb ${AUTOPLAY}ms linear forwards`,
              animationPlayState: paused ? "paused" : "running",
            }}
          />
        </div>

        {/* dot indicators */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {listProject.map((p, i) => {
            const ps = rs(p.role);
            return (
              <button
                key={i}
                onClick={() => selectDot(i)}
                aria-label={`Go to ${p.name}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? `w-6 ${ps.dot}` : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* ── modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {modalOpen && (
          <ProjectModal
            project={project}
            index={active + 1}
            s={s}
            onClose={() => setModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
