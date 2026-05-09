"use client";
import { navigations } from "@/lib/init";
import { motion } from "motion/react";
import Link from "next/link";

const MotionLink = motion.create(Link);

const Navigations = () => {
  return (
    <>
      {navigations.map(({ name, href, icon: Icon }, i) => (
        <MotionLink
          key={i}
          href={href}
          initial={{ opacity: 0, y: -14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: 0.25 + i * 0.08,
            type: "spring",
            stiffness: 220,
            damping: 22,
          }}
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.94 }}
          className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm dark:text-white/80"
        >
          {/* Gradient fill on hover */}
          <span className="absolute inset-0 rounded-full bg-gradient opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          {/* Shimmer sweep */}
          <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-[200%]" />
          <Icon
            size={15}
            className="relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-all ease-in-out duration-200 group-hover:text-white"
          />
          <span className="relative z-10 transition-colors duration-200 group-hover:text-white">
            {name}
          </span>
        </MotionLink>
      ))}
    </>
  );
};

export default Navigations;
