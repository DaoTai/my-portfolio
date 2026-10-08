"use client";

import NumberFlow, { type Format } from "@number-flow/react";
import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

type AnimatedNumberProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  format?: Format;
  className?: string;
  /** Roll up from 0 the first time the number scrolls into view. */
  countUp?: boolean;
  /** Seconds to wait before rolling up (with `countUp`). */
  delay?: number;
};

/** Two-digit counters such as "01 / 06". */
export const TWO_DIGITS: Format = { minimumIntegerDigits: 2 };

/** Every number on the page goes through NumberFlow, so changes roll digit by digit. */
export const AnimatedNumber = ({
  value,
  countUp = false,
  delay = 0,
  className,
  ...flowProps
}: AnimatedNumberProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [rolled, setRolled] = useState(false);

  useEffect(() => {
    if (!countUp || !inView) return;
    const t = setTimeout(() => setRolled(true), delay * 1000);
    return () => clearTimeout(t);
  }, [countUp, inView, delay]);

  return (
    <span ref={ref} className={className}>
      <NumberFlow value={countUp && !rolled ? 0 : value} {...flowProps} />
    </span>
  );
};
