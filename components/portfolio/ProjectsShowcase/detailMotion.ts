import type { Variants } from "motion/react";

import { EASE_OUT } from "@/components/common/Reveal";

/** Slides with the carousel's direction (`custom` = 1 next, -1 previous), staggering children in. */
export const panelVariants: Variants = {
  hidden: (d: number) => ({ opacity: 0, x: d * 48 }),
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: EASE_OUT, staggerChildren: 0.06, delayChildren: 0.05 },
  },
  exit: (d: number) => ({
    opacity: 0,
    x: d * -48,
    transition: { duration: 0.22, ease: "easeIn" },
  }),
};

export const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};
