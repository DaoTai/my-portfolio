"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { listProject } from "@/lib/init";
import { UserRound, X, CheckCircle2, Zap } from "lucide-react";
import Image from "next/image";
import ImageCarousel3D from "./ImageCarousel3D";

// ── role styles ───────────────────────────────────────────────
type RoleStyle = {
  badge: string;
  border: string;
  activeBorder: string;
  glow: string;
  glowRgb: string;
  dot: string;
  dotHex: string;
  section: string;
  ring: string;
};

const ROLE_STYLES: Record<string, RoleStyle> = {
  "Frontend Developer": {
    badge: "bg-sky-500/15 text-sky-400 border-sky-500/40",
    border: "border-sky-500/20",
    activeBorder: "border-sky-400/70",
    glow: "shadow-[0_0_56px_rgba(14,165,233,0.35)]",
    glowRgb: "14,165,233",
    dot: "bg-sky-400",
    dotHex: "#38bdf8",
    section: "text-sky-400",
    ring: "ring-sky-400/30",
  },
  "Backend Developer": {
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
    border: "border-emerald-500/20",
    activeBorder: "border-emerald-400/70",
    glow: "shadow-[0_0_56px_rgba(16,185,129,0.35)]",
    glowRgb: "16,185,129",
    dot: "bg-emerald-400",
    dotHex: "#34d399",
    section: "text-emerald-400",
    ring: "ring-emerald-400/30",
  },
  "Full-stack Developer": {
    badge: "bg-violet-500/15 text-violet-400 border-violet-500/40",
    border: "border-violet-500/20",
    activeBorder: "border-violet-400/70",
    glow: "shadow-[0_0_56px_rgba(139,92,246,0.35)]",
    glowRgb: "139,92,246",
    dot: "bg-violet-400",
    dotHex: "#a78bfa",
    section: "text-violet-400",
    ring: "ring-violet-400/30",
  },
};

const FALLBACK_STYLE: RoleStyle = {
  badge: "bg-primary/15 text-primary border-primary/40",
  border: "border-primary/20",
  activeBorder: "border-primary/70",
  glow: "shadow-[0_0_56px_rgba(99,102,241,0.35)]",
  glowRgb: "99,102,241",
  dot: "bg-primary",
  dotHex: "#6366f1",
  section: "text-primary",
  ring: "ring-primary/30",
};

function rs(role: string) {
  return ROLE_STYLES[role] ?? FALLBACK_STYLE;
}

// ── constants ─────────────────────────────────────────────────
const CARD_W = 400;
const CARD_H = 370; // approximate card height for Y-offset math
const AUTOPLAY = 6200;

const X_STEP = [0, 460, 790] as const;
const SCALE = [1, 0.72, 0.54] as const;
const ROT_Y = [0, 48, 68] as const;
const Z_DEPTH = [0, -160, -310] as const;
const OPACITY = [1, 0.62, 0.28] as const;
const Z_IDX = [20, 13, 7] as const;

// Push side cards DOWN so their visual bottom aligns with the active card bottom.
// scale from center means visual bottom of scaled card rises by (CARD_H/2)*(1-scale).
// We compensate with an equal positive Y offset.
const Y_OFFSET = [
  0,
  Math.round((CARD_H / 2) * (1 - SCALE[1])),
  Math.round((CARD_H / 2) * (1 - SCALE[2])),
] as const;

function circularOffset(i: number, active: number, total: number) {
  let d = i - active;
  if (d > total / 2) d -= total;
  if (d < -total / 2) d += total;
  return d;
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
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="absolute inset-0 bg-background/80 backdrop-blur-lg"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        className={`relative z-10 flex max-h-[98vh] w-full  flex-col overflow-hidden rounded-2xl border bg-background/95 shadow-2xl backdrop-blur-xl ${s.activeBorder}`}
        initial={{ opacity: 0, scale: 0.88, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 24 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* top accent line */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${s.dotHex}80, transparent)`,
          }}
        />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full border border-white/20 bg-background/60 p-1.5 backdrop-blur-sm transition-all hover:scale-110 hover:bg-background active:scale-95"
          aria-label="Close"
        >
          <X size={15} />
        </button>

        <div className="flex flex-wrap items-center gap-3 border-b border-white/10 px-6 py-5">
          {/* logo / letter */}
          {project.logo ? (
            <div className="relative size-11 shrink-0 overflow-hidden shadow-md">
              <Image
                src={project.logo}
                alt={`${project.name} logo`}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div
              className={`relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border shadow-md ${s.activeBorder}`}
              style={{
                background: `radial-gradient(circle at 35% 35%, rgba(${s.glowRgb}, 0.55), rgba(${s.glowRgb}, 0.1))`,
              }}
            >
              <span className={`text-2xl font-black leading-none ${s.section}`}>
                {project.name[0]}
              </span>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {project.name}
            </h3>
            <span
              className={`flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${s.badge}`}
            >
              <UserRound size={16} />
              {project.role}
            </span>
          </div>
        </div>

        <div className="overflow-y-auto">
          <div className="grid gap-6 overflow-x-hidden p-6 lg:grid-cols-2">
            <div className="space-y-6 pr-8 md:pr-0">
              <p className="leading-relaxed text-foreground/80">
                {project.summary}
              </p>

              <div>
                <h4
                  className={`mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest ${s.section}`}
                >
                  <CheckCircle2 size={16} /> My Responsibilities
                </h4>
                <ul className="space-y-2">
                  {project.responsibilities.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 + i * 0.04 }}
                      className="flex items-start gap-2.5 text-sm text-foreground/75"
                    >
                      <span
                        className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${s.dot}`}
                      />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div>
                <h4
                  className={`mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest ${s.section}`}
                >
                  <Zap size={16} /> Technical Highlights
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.technicalHighlights.map((h, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.16 + i * 0.04 }}
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${s.badge}`}
                    >
                      {h}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>

            {project.previewImages.length > 0 && (
              <div className=" min-h-[400px]">
                <div className="w-full">
                  <ImageCarousel3D images={project.previewImages} />
                </div>
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
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const total = listProject.length;
  const project = listProject[active];
  const s = rs(project.role);

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

  return (
    <>
      {/* ── full-bleed wrapper ────────────────────────────────── */}
      <div
        className="relative pt-6"
        style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* ── ambient background glow (transitions per project) ─ */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`glow-${active}`}
            className="pointer-events-none absolute inset-0 -z-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
          >
            {/* primary orb */}
            <div
              className="absolute left-1/2 top-[40%] h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
              style={{ background: `rgba(${s.glowRgb}, 0.14)` }}
            />
            {/* secondary smaller orb offset left */}
            <div
              className="absolute left-[30%] top-[60%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
              style={{ background: `rgba(${s.glowRgb}, 0.08)` }}
            />
          </motion.div>
        </AnimatePresence>

        {/* ── 3D track ──────────────────────────────────────────── */}
        <motion.div
          className="relative mx-auto h-[360px] cursor-grab select-none sm:h-[410px]"
          style={{ perspective: "1400px" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.08}
          dragMomentum={false}
          whileDrag={{ cursor: "grabbing" }}
          onDragStart={() => setPaused(true)}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60 || info.velocity.x < -400) navigate(1);
            else if (info.offset.x > 60 || info.velocity.x > 400) navigate(-1);
            setTimeout(() => setPaused(false), 9000);
          }}
        >
          <div
            className="relative flex h-full items-start justify-center pt-2"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className="relative"
              style={{ width: CARD_W, transformStyle: "preserve-3d" }}
            >
              {listProject.map((p, i) => {
                const offset = circularOffset(i, active, total);
                const abs = Math.abs(offset);
                if (abs > 2) return null;

                const sign = Math.sign(offset);
                const ps = rs(p.role);
                const isActive = offset === 0;

                return (
                  <motion.div
                    key={p.name}
                    onClick={() =>
                      isActive
                        ? setModalOpen(true)
                        : (setPaused(true),
                          setActive(i),
                          setTimeout(() => setPaused(false), 9000))
                    }
                    animate={{
                      x: sign * X_STEP[abs],
                      y: Y_OFFSET[abs],
                      rotateY: -sign * ROT_Y[abs],
                      scale: SCALE[abs],
                      z: Z_DEPTH[abs],
                      opacity: OPACITY[abs],
                      zIndex: Z_IDX[abs],
                    }}
                    transition={{ duration: 0.54, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      position: "absolute",
                      width: CARD_W,
                      transformStyle: "preserve-3d",
                      cursor: "pointer",
                    }}
                  >
                    {/* ── inner: float + card ───────────────────── */}
                    <motion.div
                      animate={isActive ? { y: [0, -10, 0] } : { y: 0 }}
                      transition={
                        isActive
                          ? {
                              duration: 3.6,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }
                          : { duration: 0.4 }
                      }
                      className={`overflow-hidden rounded-2xl border bg-background/90 backdrop-blur-md transition-[border-color,box-shadow] duration-300 ${
                        isActive
                          ? `${ps.activeBorder} ${ps.glow} ring-2 ${ps.ring}`
                          : ps.border
                      }`}
                    >
                      {/* thumbnail */}
                      <div className="group relative h-[200px] w-full select-none overflow-hidden bg-black/70 sm:h-[215px]">
                        {p.previewImages[0] && (
                          <Image
                            src={p.previewImages[0]}
                            alt={p.name}
                            fill
                            draggable={false}
                            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                          />
                        )}

                        {/* dim overlay for non-active */}
                        {!isActive && (
                          <div className="absolute inset-0 bg-background/55" />
                        )}

                        {/* shimmer sweep on active */}
                        {isActive && (
                          <motion.div
                            className="pointer-events-none absolute inset-0"
                            animate={{ x: ["-110%", "210%"] }}
                            transition={{
                              duration: 1.6,
                              repeat: Infinity,
                              repeatDelay: 3.5,
                              ease: "easeInOut",
                            }}
                            style={{
                              background:
                                "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.09) 50%, transparent 65%)",
                            }}
                          />
                        )}

                        {/* "click" hint */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-x-0 bottom-2 flex justify-center"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                              Click for details
                            </span>
                          </motion.div>
                        )}

                        {/* project logo / letter badge */}
                        <div className="absolute bottom-3 left-3 z-10">
                          {p.logo ? (
                            <div className="relative size-12  overflow-hidden rounded-xl border border-white/25 bg-background/70 shadow-lg backdrop-blur-sm">
                              <Image
                                src={p.logo}
                                alt={`${p.name} logo`}
                                fill
                                className="object-contain py-1"
                              />
                            </div>
                          ) : (
                            <div
                              className={`relative flex size-10 items-center justify-center overflow-hidden rounded-xl border shadow-lg backdrop-blur-sm ${ps.activeBorder}`}
                              style={{
                                background: `radial-gradient(circle at 35% 35%, rgba(${ps.glowRgb}, 0.6), rgba(${ps.glowRgb}, 0.12))`,
                              }}
                            >
                              <span
                                className={`text-xl font-black leading-none ${ps.section}`}
                              >
                                {p.name[0]}
                              </span>
                              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* card body */}
                      <div className="px-4 pb-4 pt-3">
                        <p className="truncate text-base font-bold sm:text-lg">
                          {p.name}
                        </p>
                        <span
                          className={`mt-1.5 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${ps.badge}`}
                        >
                          <UserRound size={9} />
                          {p.role}
                        </span>

                        {/* summary — only on active card, animated */}
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={p.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ delay: 0.2, duration: 0.32 }}
                            className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-foreground/65 sm:text-sm"
                          >
                            {p.summary}
                          </motion.p>
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
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
