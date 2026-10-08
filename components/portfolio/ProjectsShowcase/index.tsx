"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { AnimatedNumber, TWO_DIGITS } from "@/components/common/AnimatedNumber";
import { EASE_OUT, Reveal } from "@/components/common/Reveal";
import { TiltCard } from "@/components/common/TiltCard";
import ProjectModal from "@/components/portfolio/ProjectModal";
import { PROJECTS } from "@/lib/portfolio-data";
import type { Project } from "@/lib/portfolio-data";
import { ProjectsBackground } from "./ProjectsBackground";
import "./ProjectsShowcase.css";

type ProjectsShowcaseProps = {
  autoplay?: boolean;
};

const AUTOPLAY_MS = 5000;
const SIDES_MIN_WIDTH = 820;

const NAV_BUTTON =
  "grid h-11 w-11 flex-none place-items-center rounded-full border border-pf-ink/[0.18] bg-pf-ink/[0.03] text-lg text-pf-text2 transition-[border-color,color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-pf-g2 hover:text-pf-text hover:shadow-[0_10px_30px_-10px_rgba(var(--glow3),0.8)]";

/** Side cards lean back toward the center card, coverflow style. */
const SIDE_TRANSFORM = {
  left: "origin-right [transform:rotateY(26deg)_translateZ(-70px)_scale(.94)] hover:[transform:rotateY(12deg)_translateZ(-30px)_scale(.97)]",
  right:
    "origin-left [transform:rotateY(-26deg)_translateZ(-70px)_scale(.94)] hover:[transform:rotateY(-12deg)_translateZ(-30px)_scale(.97)]",
};

type SideCardProps = {
  project: Project;
  side: keyof typeof SIDE_TRANSFORM;
  onClick: () => void;
};

const SideCard = memo(({ project, side, onClick }: SideCardProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={`Show ${project.name}`}
    className={`flex min-w-0 flex-[1_1_0] flex-col gap-3.5 rounded-2xl border border-pf-ink/[0.08] bg-[linear-gradient(180deg,rgba(var(--ink),0.035),rgba(var(--ink),0.01))] p-3.5 text-left opacity-[0.55] [transition:opacity_.3s,transform_.6s_cubic-bezier(.22,1,.36,1)] hover:opacity-[0.85] ${SIDE_TRANSFORM[side]}`}
  >
    <span className="relative block aspect-video w-full overflow-hidden rounded-[10px] bg-pf-tilebg">
      <Image
        src={project.images[0]}
        alt=""
        fill
        sizes="360px"
        className="object-cover object-top"
      />
    </span>
    <span className="flex flex-col gap-1.5 px-1 pb-1.5">
      <span className="text-[11px] text-pf-t7">{project.role}</span>
      <span className="font-display text-[15px] font-semibold text-pf-text">
        {project.name}
      </span>
      <span className="text-xs leading-[1.5] text-pf-t6">{project.blurb}</span>
    </span>
  </button>
));
SideCard.displayName = "SideCard";

const ProjectsShowcase = ({ autoplay = false }: ProjectsShowcaseProps) => {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [narrow, setNarrow] = useState(false);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const carRef = useRef<HTMLDivElement>(null);

  const n = PROJECTS.length;
  const cur = PROJECTS[i];
  const prevP = PROJECTS[(i - 1 + n) % n];
  const nextP = PROJECTS[(i + 1) % n];

  const go = useCallback(
    (d: number) => {
      setDir(d);
      setI((s) => (s + d + n) % n);
    },
    [n],
  );
  const goPrev = useCallback(() => go(-1), [go]);
  const goNext = useCallback(() => go(1), [go]);
  const goTo = (k: number) => {
    setDir(k >= i ? 1 : -1);
    setI(k);
  };
  const openCur = () => setModalIndex(i);
  const closeModal = useCallback(() => setModalIndex(null), []);

  // Hide the side cards when the carousel is narrower than 820px.
  useEffect(() => {
    const el = carRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => {
      setNarrow(entry.contentRect.width < SIDES_MIN_WIDTH);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    const t = setInterval(goNext, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [autoplay, goNext]);

  const showSides = !narrow;

  return (
    <section
      id="projects"
      data-screen-label="Projects"
      className="relative overflow-hidden border-t border-pf-ink/[0.06] bg-pf-bg2"
    >
      <ProjectsBackground />

      <div className="relative mx-auto flex max-w-[1240px] flex-col gap-10 px-8 pb-24 pt-[88px]">
        <Reveal className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-end gap-6">
          <div className="flex flex-col gap-3.5">
            <span className="flex items-center gap-2.5 text-xs font-semibold text-pf-t7">
              <span className="h-px w-[18px] bg-pf-g2" />
              Projects
            </span>
            <h2 className="m-0 font-display text-[clamp(34px,4vw,48px)] font-semibold tracking-[-0.025em] text-pf-text">
              Featured{" "}
              <span className="bg-[linear-gradient(100deg,var(--g1)_0%,var(--g2)_45%,var(--g3)_100%)] bg-clip-text text-transparent">
                Projects
              </span>
            </h2>
          </div>
          <p className="m-0 max-w-[440px] text-[15px] leading-[1.65] text-pf-t6">
            Trading platforms, Web3 marketplaces and booking systems I’ve built
            across frontend and backend.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            ref={carRef}
            className="flex items-center gap-5 [perspective:1600px]"
          >
            {showSides && (
              <SideCard project={prevP} side="left" onClick={goPrev} />
            )}
            <motion.div
              key={cur.name}
              className="flex min-w-0 flex-[1.35_1_0]"
              initial={
                reduce ? false : { opacity: 0, rotateY: dir * -32, x: dir * 70 }
              }
              animate={{ opacity: 1, rotateY: 0, x: 0 }}
              transition={{ duration: 0.75, ease: EASE_OUT }}
            >
              <TiltCard
                max={5}
                className="flex w-full flex-col gap-[18px] rounded-[20px] border border-[rgba(160,170,255,0.3)] p-4 shadow-[0_30px_80px_-30px_rgba(110,116,255,0.45)] [background:radial-gradient(circle_at_100%_0%,rgba(143,147,255,0.16),transparent_50%),var(--bg3)]"
              >
                <button
                  type="button"
                  onClick={openCur}
                  aria-label={`Open ${cur.name}`}
                  className="relative block aspect-video w-full cursor-zoom-in overflow-hidden rounded-xl bg-pf-tilebg shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)] [transform:translateZ(30px)]"
                >
                  <Image
                    src={cur.images[0]}
                    alt={cur.name}
                    fill
                    sizes="(max-width: 900px) 100vw, 520px"
                    className="object-cover object-top transition-transform duration-700 hover:scale-[1.04]"
                  />
                </button>
                <div className="flex flex-col gap-3.5 px-2 pb-2.5 [transform:translateZ(18px)]">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <span className="font-display text-[22px] font-semibold tracking-[-0.02em] text-pf-text">
                      {cur.name}
                    </span>
                    <span className="text-xs text-pf-t6">{cur.role}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cur.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[rgba(143,147,255,0.3)] bg-[rgba(143,147,255,0.08)] px-3 py-[5px] text-xs font-semibold text-pf-chip"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="m-0 text-pretty text-sm leading-[1.6] text-pf-t4">
                    {cur.blurb}
                  </p>
                  <button
                    type="button"
                    onClick={openCur}
                    className="group flex items-center gap-2 self-start border-none bg-transparent p-0 text-sm font-semibold text-pf-link hover:text-pf-text"
                  >
                    View Project{" "}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                </div>
              </TiltCard>
            </motion.div>
            {showSides && (
              <SideCard project={nextP} side="right" onClick={goNext} />
            )}
          </div>
        </Reveal>

        <div className="flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous project"
            className={NAV_BUTTON}
          >
            ‹
          </button>
          <div className="flex items-center gap-2">
            {PROJECTS.map((p, k) => (
              <button
                key={p.name}
                type="button"
                onClick={() => goTo(k)}
                aria-label={p.name}
                className={`h-2 rounded-[4px] border-none p-0 [transition:width_.25s] ${
                  k === i ? "w-7 bg-pf-g2" : "w-2 bg-pf-ink/[0.18]"
                }`}
              />
            ))}
          </div>
          <span className="min-w-[52px] text-center font-display text-[13px] text-pf-t7">
            <AnimatedNumber value={i + 1} format={TWO_DIGITS} /> /{" "}
            <AnimatedNumber value={n} format={TWO_DIGITS} />
          </span>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next project"
            className={NAV_BUTTON}
          >
            ›
          </button>
        </div>
      </div>

      {modalIndex !== null && (
        <ProjectModal
          index={modalIndex}
          onClose={closeModal}
          onNavigate={setModalIndex}
        />
      )}
    </section>
  );
};

export default ProjectsShowcase;
