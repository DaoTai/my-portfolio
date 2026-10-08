"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";

const CUP = "M7 13h15v7a6 6 0 0 1-6 6h-3a6 6 0 0 1-6-6z";
const STEAM = [
  "M11 10.5c-1.2-1.6 1.2-2.6 0-4.5",
  "M14.5 10.5c-1.2-1.6 1.2-2.6 0-4.5",
  "M18 10.5c-1.2-1.6 1.2-2.6 0-4.5",
];

/** A cup that fills on mount, then keeps steaming. */
export const CoffeeCup = ({ size = 30 }: { size?: number }) => {
  const reduce = useReducedMotion();
  const clipId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={CUP} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <motion.rect
          x={7}
          y={15}
          width={15}
          height={11}
          stroke="none"
          style={{ fill: "var(--g2)" }}
          initial={reduce ? false : { y: 11 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        />
      </g>
      <path d={CUP} />
      <path d="M22 15h1.5a3 3 0 0 1 0 6H22" />
      <path d="M5 28.5h20" />
      {STEAM.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          strokeWidth={1.3}
          initial={{ opacity: 0, y: 2 }}
          animate={
            reduce
              ? { opacity: 0.7, y: 0 }
              : { opacity: [0, 0.9, 0], y: [2, -3] }
          }
          transition={
            reduce
              ? { duration: 0.3 }
              : {
                  duration: 2.4,
                  delay: 0.9 + i * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        />
      ))}
    </svg>
  );
};
