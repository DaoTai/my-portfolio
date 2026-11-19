"use client";

import type { PointerEvent, Ref } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRight, ChevronRight, Star } from "lucide-react";

import type { Project } from "@/lib/portfolio-data";
import { DetailHighlights, DetailMetrics } from "./DetailAside";
import { DetailPreview } from "./DetailPreview";
import { itemVariants, listVariants, panelVariants } from "./detailMotion";
import { vars } from "./GlassCube";

type ProjectDetailProps = {
  project: Project;
  /** Direction of the last step (1 next, -1 previous); the panel slides with it. */
  dir: number;
  nextName: string;
  /** The preview image, used as the morph target for the modal hero. */
  heroRef: Ref<HTMLButtonElement>;
  onOpen: () => void;
  onNext: () => void;
};

const SPOT = 560; // spotlight diameter, px
const SPOT_SPRING = { stiffness: 160, damping: 24, mass: 0.6 };

/** Last word gets the gradient ("SiloPay" style); single words are all gradient. */
const splitName = (name: string) => {
  const cut = name.lastIndexOf(" ");
  return cut === -1 ? ["", name] : [name.slice(0, cut + 1), name.slice(cut + 1)];
};

/** Badge, name, blurb, tech chips and CTAs: the scannable middle column. */
const DetailBody = ({
  project,
  nextName,
  onOpen,
  onNext,
}: Pick<ProjectDetailProps, "project" | "nextName" | "onOpen" | "onNext">) => {
  const [head, tail] = splitName(project.name);
  return (
    <motion.div variants={listVariants} className="flex min-w-0 flex-col gap-4">
      <motion.span
        variants={itemVariants}
        className="pf-chip inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-pf-text2"
      >
        <Star size={12} className="fill-current text-pf-g2" aria-hidden="true" />
        Featured Project
      </motion.span>

      <motion.div variants={itemVariants} className="flex flex-col gap-2">
        <h3 className="m-0 font-display text-[clamp(28px,3vw,44px)] font-semibold leading-[1.05] tracking-[-0.03em] text-pf-text">
          {head}
          <span className="pf-shimmer">{tail}</span>
        </h3>
        <p className="m-0 line-clamp-3 text-pretty text-[15px] leading-[1.55] text-pf-text2">
          {project.blurb}
        </p>
      </motion.div>

      <motion.ul
        variants={listVariants}
        aria-label="Tech stack"
        className="m-0 flex list-none flex-wrap gap-1.5 p-0"
      >
        {project.tags.map((tag) => (
          <motion.li
            key={tag}
            variants={itemVariants}
            className="pf-chip rounded-full px-3 py-1 text-[11.5px] font-semibold text-pf-chip"
          >
            {tag}
          </motion.li>
        ))}
      </motion.ul>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-1.5 pt-1">
        <motion.button
          type="button"
          onClick={onOpen}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="pf-cta group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
        >
          View Project
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </motion.button>
        <button
          type="button"
          onClick={onNext}
          className="group inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-full px-4 py-3 text-sm font-semibold text-pf-text2 transition-colors hover:text-pf-text"
        >
          <span className="truncate">Next: {nextName}</span>
          <ChevronRight
            size={16}
            className="flex-none transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </button>
      </motion.div>
    </motion.div>
  );
};

/**
 * The selected project in one wide frosted panel: floating preview | name, blurb, stack and
 * CTAs | stats and highlights. A light beam runs round the rim, a sheen sweeps across now and
 * then, and a soft spotlight follows the pointer. Switching projects slides the old content
 * out and staggers the new in, following the carousel's direction; the stats stay mounted so
 * their numbers roll.
 */
export const ProjectDetail = ({
  project,
  dir,
  nextName,
  heroRef,
  onOpen,
  onNext,
}: ProjectDetailProps) => {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, SPOT_SPRING);
  const sy = useSpring(py, SPOT_SPRING);
  const spotX = useTransform(sx, (v) => v - SPOT / 2);
  const spotY = useTransform(sy, (v) => v - SPOT / 2);
  const spotOpacity = useSpring(0, { stiffness: 120, damping: 26 });

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(e.clientX - r.left);
    py.set(e.clientY - r.top);
    spotOpacity.set(1);
  };

  return (
    <div
      onPointerMove={onPointerMove}
      onPointerLeave={() => spotOpacity.set(0)}
      className="pf-panel grid gap-6 rounded-[28px] p-4 sm:p-6 lg:p-7 xl:grid-cols-[minmax(0,1fr)_minmax(270px,330px)] xl:gap-7"
    >
      <span aria-hidden="true" className="pf-fx">
        <motion.span
          className="absolute left-0 top-0 rounded-full bg-[radial-gradient(closest-side,rgba(var(--glow3),0.22),rgba(var(--glow3),0.06)_60%,transparent)]"
          style={{ width: SPOT, height: SPOT, x: spotX, y: spotY, opacity: spotOpacity }}
        />
        <span className="pf-sweep" style={vars({ "--t": "10s", "--d": "2s" })} />
      </span>
      <span aria-hidden="true" className="pf-rim">
        <span className="pf-rim-beam" />
        <span className="pf-rim-beam" style={vars({ "--d": "-3.5s" })} />
      </span>

      <AnimatePresence mode="wait" initial={false} custom={dir}>
        <motion.div
          key={project.name}
          custom={dir}
          variants={panelVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          className="grid min-w-0 items-center gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-8"
        >
          <DetailPreview project={project} heroRef={heroRef} onOpen={onOpen} />
          <DetailBody project={project} nextName={nextName} onOpen={onOpen} onNext={onNext} />
        </motion.div>
      </AnimatePresence>

      <aside
        aria-label="Project at a glance"
        className="flex min-w-0 flex-col justify-center gap-2.5 lg:grid lg:grid-cols-[minmax(0,250px)_minmax(0,1fr)] lg:items-center lg:gap-3 xl:flex xl:flex-col xl:items-stretch"
      >
        <DetailMetrics project={project} />
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={project.name}
            custom={dir}
            variants={panelVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="min-w-0"
          >
            <DetailHighlights project={project} />
          </motion.div>
        </AnimatePresence>
      </aside>
    </div>
  );
};
