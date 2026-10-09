"use client";

import Image from "next/image";
import { MoveRight } from "lucide-react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { EASE_OUT } from "@/components/common/Reveal";
import { HeroTyping } from "./HeroTyping";

type HeroVisualProps = {
  /** Smoothed cursor position over the hero, each in [-0.5, 0.5]. */
  mx: MotionValue<number>;
  my: MotionValue<number>;
  showAvailable: boolean;
  /** Hero is off-screen: stop the typing loop. */
  paused: boolean;
};

const Orbit = ({ variant }: { variant: "a" | "b" }) => (
  <div className={`hero-orbit hero-orbit--${variant}`} aria-hidden="true">
    <div className="hero-orbit-spin">
      <span className="hero-orbit-dot" />
    </div>
  </div>
);

export const HeroVisual = ({
  mx,
  my,
  showAvailable,
  paused,
}: HeroVisualProps) => {
  const rotateY = useTransform(mx, [-0.5, 0.5], [-16, 16]);
  const rotateX = useTransform(my, [-0.5, 0.5], [12, -12]);

  return (
    <motion.div
      className="hero-visual relative h-[360px] sm:h-[480px] [@container_(max-width:1031px)]:order-first"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.25, ease: EASE_OUT }}
    >
      <motion.div
        className="hero-stage absolute inset-0 top-3"
        style={{ rotateX, rotateY, transformPerspective: 1100 }}
      >
        <div className="hero-core">
          <div className="hero-halo" aria-hidden="true" />
          <div className="hero-ring" aria-hidden="true" />
          <div className="hero-ring-sweep" aria-hidden="true" />
          <Orbit variant="a" />
          <Orbit variant="b" />

          <div className="hero-avatar">
            <div className="hero-avatar-float relative overflow-hidden rounded-full border-[6px] border-[#080a0b] bg-[#0d1424]">
              <Image
                src="/avatar-professional.webp"
                alt="Dao Tai"
                fill
                priority
                sizes="340px"
                className="object-cover object-[50%_18%]"
              />
            </div>
          </div>

          {showAvailable && (
            <div className="hero-chip hero-chip--available flex items-center gap-2.5 whitespace-nowrap rounded-full bg-pf-base/90 px-[18px] py-2.5 text-sm font-semibold text-pf-text">
              <span className="h-[9px] w-[9px] animate-pulse rounded-full bg-[#34d399] shadow-[0_0_10px_#34d399]" />
              Available
            </div>
          )}

          <div className="hero-chip hero-chip--role flex items-center gap-3 whitespace-nowrap rounded-full bg-pf-base/[0.92] px-[22px] py-3.5 text-[15px] font-semibold text-pf-text">
            <span className="font-[monospace] text-pf-link">&lt;/&gt;</span>
            Software Engineer
            <span className="text-pf-link">
              {" "}
              <MoveRight
                aria-hidden="true"
                size={22}
                strokeWidth={1.75}
                className="hero-nudge text-pf-t6"
              />
            </span>
          </div>
        </div>

        <div className="hero-card w-[150px] flex-col gap-5 rounded-2xl border border-pf-ink/[0.12] bg-pf-base/80 p-4 shadow-[0_20px_50px_-20px_rgba(var(--glow3),0.6)]">
          <HeroTyping paused={paused} />
          <MoveRight
            aria-hidden="true"
            size={22}
            strokeWidth={1.75}
            className="hero-nudge text-pf-t6"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};
