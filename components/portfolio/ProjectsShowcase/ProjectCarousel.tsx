"use client";

import { useRef } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { PanInfo } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import { TiltCard } from "@/components/common/TiltCard";
import type { Project } from "@/lib/portfolio-data";
import { GlassCube, vars } from "./GlassCube";
import { ProjectLogo } from "./ProjectLogo";

type ProjectCarouselProps = {
  projects: Project[];
  index: number;
  onSelect: (k: number) => void;
  onPrev: () => void;
  onNext: () => void;
  /** Opens the active project; receives the clicked card as the morph source. */
  onOpen: (source: HTMLElement) => void;
};

// Cards kept mounted on each side. The outermost ring sits fully transparent, so a card
// fades in from / out to it instead of popping when the window slides.
const WINDOW = 3;
const SPREAD = 52; // % of a card's width between neighbours
const SCALE = [1, 0.82, 0.68, 0.6];
const OPACITY = [1, 0.65, 0.1, 0];
const ROTATE = [0, 28, 38, 42];
const SPRING = { type: "spring", stiffness: 110, damping: 20, mass: 0.9 } as const;

// A swipe counts once the drag distance plus a share of the release velocity passes this.
const SWIPE_THRESHOLD = 60;
const SWIPE_VELOCITY_WEIGHT = 0.2;

/** Signed shortest distance from the active slide, wrapping around the ends. */
const offsetOf = (k: number, i: number, n: number) => {
  const d = (((k - i) % n) + n) % n;
  return d > n / 2 ? d - n : d;
};

const pose = (o: number) => {
  const a = Math.min(Math.abs(o), WINDOW);
  return {
    x: `${o * SPREAD}%`,
    z: -a * 130,
    rotateY: -Math.sign(o) * ROTATE[a],
    scale: SCALE[a],
    opacity: OPACITY[a],
  };
};

type SlideProps = {
  project: Project;
  offset: number;
  reduce: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
};

const Slide = ({ project, offset, reduce, onClick }: SlideProps) => {
  const a = Math.abs(offset);
  const active = a === 0;
  const reachable = a <= 1;

  return (
    <motion.div
      className="absolute w-[72%] sm:w-[60%]"
      style={{ zIndex: 10 - a, pointerEvents: reachable ? undefined : "none" }}
      initial={false}
      animate={pose(offset)}
      transition={reduce ? { duration: 0 } : SPRING}
      aria-hidden={reachable ? undefined : true}
    >
      <TiltCard max={active ? 7 : 3} className="rounded-[20px]">
        <button
          type="button"
          onClick={onClick}
          tabIndex={reachable ? 0 : -1}
          aria-label={active ? `Open ${project.name}` : `Show ${project.name}`}
          className={`group relative block aspect-[16/10] w-full overflow-hidden rounded-[20px] border bg-pf-tilebg text-left transition-[border-color,box-shadow] duration-500 ${
            active
              ? "cursor-zoom-in border-[rgba(170,180,255,0.6)] shadow-[0_0_0_1px_rgba(160,170,255,0.18),0_30px_90px_-25px_rgba(110,116,255,0.85)]"
              : "border-pf-ink/[0.12] shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)]"
          }`}
        >
          <Image
            src={project.images[0]}
            alt={active ? project.name : ""}
            fill
            draggable={false}
            sizes="(max-width: 640px) 72vw, 560px"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
          />
          {/* glass reflection + legibility fade */}
          <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,rgba(255,255,255,0.14),transparent_32%),linear-gradient(180deg,transparent_48%,rgba(4,6,16,0.9))]" />
          <span aria-hidden="true" className={`pf-card-rim${active ? " is-active" : ""}`} />
          {active && (
            <>
              {/* periodic sheen + a light beam running round the rim of the front card */}
              <span
                aria-hidden="true"
                className="pf-sweep"
                style={vars({ "--a": "0.12", "--a2": "0.28", "--t": "6s", "--d": "0.6s" })}
              />
              <span aria-hidden="true" className="pf-rim" style={{ inset: 0, zIndex: 4 }}>
                <span className="pf-rim-beam" style={vars({ "--t": "5s" })} />
              </span>
            </>
          )}
          <span className="absolute inset-x-0 bottom-0 z-[3] flex items-center gap-2.5 border-t border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0)_60%),rgba(8,10,24,0.5)] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md sm:px-4 sm:py-3">
            <ProjectLogo project={project} size={26} />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-display text-[13px] font-semibold text-white sm:text-[15px]">
                {project.name}
              </span>
              <span className="truncate text-[10.5px] text-white/60 sm:text-[11px]">
                {project.role}
              </span>
            </span>
            {active && (
              <span className="pf-cta hidden flex-none items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white sm:inline-flex">
                Explore
                <ArrowUpRight size={12} strokeWidth={2.4} aria-hidden="true" />
              </span>
            )}
          </span>
        </button>
      </TiltCard>
    </motion.div>
  );
};

/**
 * Coverflow-style 3D carousel: the active card faces the viewer, neighbours swing away on
 * rotateY, shrink and sink back in Z. Every visible card stays mounted and springs between
 * poses, so stepping feels like the whole ring turning. Swipe, arrow keys or click a side
 * card to move; clicking the active card opens it.
 */
export const ProjectCarousel = ({
  projects,
  index,
  onSelect,
  onPrev,
  onNext,
  onOpen,
}: ProjectCarouselProps) => {
  const reduce = !!useReducedMotion();
  // Set once a pan starts, so releasing the pointer doesn't also count as a click.
  const panned = useRef(false);
  const n = projects.length;

  const onPanEnd = (_: unknown, { offset, velocity }: PanInfo) => {
    const swipe = offset.x + velocity.x * SWIPE_VELOCITY_WEIGHT;
    if (swipe < -SWIPE_THRESHOLD) onNext();
    else if (swipe > SWIPE_THRESHOLD) onPrev();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      onPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      onNext();
    }
  };

  return (
    <motion.div
      role="region"
      aria-roledescription="carousel"
      aria-label="Projects"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDownCapture={() => {
        panned.current = false;
      }}
      onPanStart={() => {
        panned.current = true;
      }}
      onPanEnd={onPanEnd}
      className="relative flex aspect-[16/11] w-full touch-pan-y select-none items-center justify-center rounded-3xl outline-none [perspective:1600px] focus-visible:ring-2 focus-visible:ring-pf-glow3/50 sm:aspect-[2/1]"
    >
      {/* halo + orbital ring behind the cards */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(var(--glow3),0.38),transparent)] blur-2xl"
      />
      <span
        aria-hidden="true"
        className="orbit"
        style={vars({ "--w": "112%", "--x": "50%", "--y": "58%", "--tilt": "-8deg", "--t": "22s" })}
      >
        <span className="orbit-ring" />
      </span>

      {projects.map((p, k) => {
        const o = offsetOf(k, index, n);
        if (Math.abs(o) > WINDOW) return null;
        return (
          <Slide
            key={p.name}
            project={p}
            offset={o}
            reduce={reduce}
            onClick={(e) => {
              if (panned.current) return;
              if (o === 0) onOpen(e.currentTarget);
              else onSelect(k);
            }}
          />
        );
      })}

      <GlassCube className="absolute right-[6%] top-[2%] z-20" size="26px" />
      <GlassCube className="absolute bottom-[4%] left-[10%] z-20" size="18px" delay="-3s" />
    </motion.div>
  );
};
