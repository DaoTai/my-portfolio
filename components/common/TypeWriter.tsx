import { cn } from "@/lib/utils";
import * as motion from "motion/react-client";

interface TypewriterTextProps {
  text: string;
  className?: string;
  delayPerChar?: number;
}

const container = (delayPerChar: number) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: delayPerChar,
    },
  },
});

const charAnimation = {
  hidden: { opacity: 0, y: "0.25em" },
  visible: {
    opacity: 1,
    y: "0em",
    transition: {
      ease: "easeOut",
    },
  },
};

export function TypewriterText({
  text,
  className,
  delayPerChar = 0.05,
}: TypewriterTextProps) {
  return (
    <motion.span
      className={cn("inline-block whitespace-pre-wrap", className)}
      variants={container(delayPerChar)}
      initial="hidden"
      animate="visible"
    >
      {text.split("").map((char, index) => (
        <motion.span key={index} variants={charAnimation as any}>
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}
