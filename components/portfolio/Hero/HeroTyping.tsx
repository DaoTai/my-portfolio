"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { HERO_TAGLINES } from "@/lib/portfolio-data";

const TYPE_MS = 70;
const DELETE_MS = 30;
const HOLD_MS = 1900;
const NEXT_MS = 400;

type TypingState = { index: number; length: number; deleting: boolean };

/**
 * Types each tagline out one word per line, holds it, erases it, then moves to the next.
 * `paused` (hero off-screen) freezes it mid-phrase so it stops re-rendering every 30–70ms.
 */
export const HeroTyping = ({ paused = false }: { paused?: boolean }) => {
  const reduce = useReducedMotion();
  const [{ index, length, deleting }, setState] = useState<TypingState>({
    index: 0,
    length: 0,
    deleting: false,
  });
  const phrase = HERO_TAGLINES[index];

  useEffect(() => {
    if (reduce || paused) return;
    const done = length === phrase.length;
    const delay = deleting
      ? length === 0
        ? NEXT_MS
        : DELETE_MS
      : done
        ? HOLD_MS
        : TYPE_MS;

    const id = setTimeout(() => {
      setState((s) => {
        if (!s.deleting) {
          return s.length < phrase.length
            ? { ...s, length: s.length + 1 }
            : { ...s, deleting: true };
        }
        return s.length > 0
          ? { ...s, length: s.length - 1 }
          : {
              index: (s.index + 1) % HERO_TAGLINES.length,
              length: 0,
              deleting: false,
            };
      });
    }, delay);
    return () => clearTimeout(id);
  }, [reduce, paused, length, deleting, phrase]);

  const words = (reduce ? phrase : phrase.slice(0, length)).split(" ");

  return (
    <p className="m-0 min-h-[5.4em] font-display text-[15px] font-medium leading-[1.35] text-pf-t3">
      <span className="sr-only">{phrase}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span key={i} className="block">
            {word}
            {i === words.length - 1 && <span className="hero-caret" />}
          </span>
        ))}
      </span>
    </p>
  );
};
