"use client";

import { motion } from "motion/react";
import { Layers, ListChecks, ShieldCheck, Sparkles, Zap } from "lucide-react";

import { AnimatedNumber } from "@/components/common/AnimatedNumber";
import type { Project } from "@/lib/portfolio-data";
import { itemVariants, listVariants } from "./detailMotion";

const HIGHLIGHT_ICONS = [Sparkles, Layers, ShieldCheck];

/** Two stat tiles side by side. Stays mounted across projects so the numbers roll. */
export const DetailMetrics = ({ project }: { project: Project }) => {
  const metrics = [
    { Icon: Zap, value: project.tags.length, label: "Core technologies" },
    { Icon: ListChecks, value: project.responsibilities.length, label: "Key deliverables" },
  ];
  return (
    <dl aria-label="Project stats" className="m-0 grid grid-cols-2 gap-2.5">
      {metrics.map(({ Icon, value, label }) => (
        <div key={label} className="pf-tile flex min-w-0 flex-col gap-1 rounded-2xl px-3.5 py-3">
          <dt className="order-2 text-[11px] leading-snug text-pf-t6">{label}</dt>
          <dd className="order-1 m-0 flex items-center gap-2">
            <AnimatedNumber
              value={value}
              className="font-display text-[28px] font-semibold leading-none tracking-[-0.02em] text-pf-text"
            />
            <Icon
              size={16}
              className="text-pf-g2 drop-shadow-[0_0_8px_rgba(var(--glow3),0.9)]"
              aria-hidden="true"
            />
          </dd>
        </div>
      ))}
    </dl>
  );
};

/** Three highlights as compact glass tiles, each clamped to two lines (full text in the modal). */
export const DetailHighlights = ({ project }: { project: Project }) => (
  <motion.ul
    variants={listVariants}
    aria-label="Highlights"
    className="m-0 grid list-none gap-2.5 p-0 sm:grid-cols-3 xl:grid-cols-1"
  >
    {project.highlights.slice(0, 3).map((h, k) => {
      const Icon = HIGHLIGHT_ICONS[k % HIGHLIGHT_ICONS.length];
      return (
        <motion.li
          key={h}
          variants={itemVariants}
          title={h}
          className="pf-tile flex items-start gap-3 rounded-2xl p-3"
        >
          <span className="pf-well grid h-8 w-8 flex-none place-items-center rounded-xl text-pf-g2">
            <Icon size={15} aria-hidden="true" />
          </span>
          <span className="line-clamp-2 text-[12.5px] leading-[1.5] text-pf-text2">{h}</span>
        </motion.li>
      );
    })}
  </motion.ul>
);
