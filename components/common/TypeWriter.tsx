"use client";

import { useInView } from "motion/react";
import { useRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import "./TypeWriter.css";

interface TypewriterTextProps {
  text: string;
  className?: string;
  delayPerChar?: number;
}

/**
 * Reveals the text one character at a time the first time it scrolls into view.
 *
 * Plain spans with a staggered CSS animation (compositor: opacity + transform). This used to be
 * one motion component per character with `staggerChildren`, which for a ~200 character
 * paragraph meant hundreds of JS animations plus a sibling sort per child during hydration —
 * the single biggest main-thread cost on phones.
 */
export const TypewriterText = ({
  text,
  className,
  delayPerChar = 0.05,
}: TypewriterTextProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <span
      ref={ref}
      className={cn(
        "typewriter inline-block whitespace-pre-wrap",
        inView && "typewriter--play",
        className,
      )}
      style={{ "--tw-step": `${delayPerChar}s` } as CSSProperties}
    >
      {text.split("").map((char, index) => (
        <span
          key={index}
          className="typewriter-char"
          style={{ "--tw-i": index } as CSSProperties}
        >
          {char}
        </span>
      ))}
    </span>
  );
};
