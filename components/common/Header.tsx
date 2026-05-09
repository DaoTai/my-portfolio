"use client";
import { motion, useScroll, useSpring } from "motion/react";
import Navigations from "./Navigations";
import ToggleBar from "./ToggleBar";
import ToggleMode from "./ToggleMode";

const Header = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <motion.header
       initial={{ y: -100, opacity: 0, scale: 0.92, x: "-50%" }}
      animate={{ y: 0, opacity: 1, scale: 1, x: "-50%" }}
      transition={{ type: "spring", stiffness: 130, damping: 18, delay: 0.05 }}
      className="fixed top-4 z-50 w-[calc(100%-2rem)] left-1/2  max-w-4xl  overflow-hidden rounded-full border border-white/20 bg-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.05),0_4px_16px_rgba(99,102,241,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-black/40 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04),0_4px_16px_rgba(99,102,241,0.2)]"
    >

      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="hidden items-center gap-2 lg:flex">
          <Navigations />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <ToggleMode />
          <ToggleBar />
        </div>
      </div>

      {/* Scroll progress indicator */}
      <motion.div
        style={{ scaleX }}
        className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-gradient"
      />
    </motion.header>
  );
};

export default Header;
