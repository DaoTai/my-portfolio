"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait once the element scrolls into view. */
  delay?: number;
};

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Rises and tips forward into place the first time it scrolls into view. */
export const Reveal = ({ children, className, delay = 0 }: RevealProps) => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 36, rotateX: 16 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, delay, ease: EASE_OUT }}
      style={{ transformPerspective: 1200, transformOrigin: "50% 100%" }}
    >
      {children}
    </motion.div>
  );
};
