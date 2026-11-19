"use client";

import type { Ref } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { TiltCard } from "@/components/common/TiltCard";
import type { Project } from "@/lib/portfolio-data";
import { itemVariants } from "./detailMotion";
import { GlassCube, vars } from "./GlassCube";
import { ProjectLogo } from "./ProjectLogo";

type DetailPreviewProps = {
  project: Project;
  /** The screenshot button: the morph source/target for the modal hero. */
  heroRef: Ref<HTMLButtonElement>;
  onOpen: () => void;
};

/** Browser-framed screenshot floating over two offset glass plates, with a glow pooling beneath. */
export const DetailPreview = ({ project, heroRef, onOpen }: DetailPreviewProps) => {
  const reduce = useReducedMotion();
  return (
    <motion.div variants={itemVariants} className="relative px-2 pb-4 pt-2 sm:px-3">
      <span aria-hidden="true" className="pf-pool" />
      <motion.div
        className="relative"
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <span
          aria-hidden="true"
          className="glass absolute inset-0 -translate-x-[5%] translate-y-[5%] -rotate-[4deg] scale-[0.92] rounded-2xl opacity-70"
        />
        <span
          aria-hidden="true"
          className="glass absolute inset-0 -translate-x-[2.5%] translate-y-[2.5%] -rotate-2 scale-[0.96] rounded-2xl opacity-90"
        />
        <TiltCard max={5} className="rounded-2xl">
          <div className="overflow-hidden rounded-2xl border border-[rgba(170,180,255,0.42)] bg-pf-bg3 shadow-[0_40px_90px_-30px_rgba(110,116,255,0.8),inset_0_1px_0_rgba(255,255,255,0.12)]">
            <div className="flex items-center gap-3 border-b border-pf-ink/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent)] px-3.5 py-2">
              <span className="flex w-[46px] flex-none gap-1.5" aria-hidden="true">
                <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </span>
              <span className="mx-auto flex min-w-0 items-center gap-2 rounded-full bg-pf-ink/[0.05] px-3 py-1 text-[11px] text-pf-t6">
                <ProjectLogo project={project} size={14} />
                <span className="truncate">{project.name}</span>
              </span>
              <span className="w-[46px] flex-none" />
            </div>
            <button
              ref={heroRef}
              type="button"
              onClick={onOpen}
              aria-label={`Open ${project.name}`}
              className="group relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden bg-pf-tilebg"
            >
              <Image
                src={project.images[0]}
                alt={project.name}
                fill
                draggable={false}
                sizes="(max-width: 1024px) 100vw, 680px"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,rgba(255,255,255,0.14),transparent_32%)]" />
              <span
                aria-hidden="true"
                className="pf-sweep"
                style={vars({ "--a": "0.1", "--a2": "0.22", "--t": "8s", "--d": "3s" })}
              />
            </button>
          </div>
        </TiltCard>
        <GlassCube className="absolute -bottom-5 -left-3 z-10" size="34px" />
        <GlassCube className="absolute -right-2 -top-4 z-10" size="20px" delay="-2s" />
      </motion.div>
    </motion.div>
  );
};
