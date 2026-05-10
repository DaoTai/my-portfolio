"use client";
import { techStack } from "@/lib/init";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useState } from "react";

type Category = "all" | "frontend" | "backend" | "tools";

const tabs: { label: string; value: Category }[] = [
  { label: "All", value: "all" },
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Tools", value: "tools" },
];

const categoryDot: Record<string, string> = {
  frontend: "bg-cyan-400",
  backend: "bg-emerald-400",
  tools: "bg-amber-400",
};

const Skills = () => {
  const [active, setActive] = useState<Category>("all");

  const filtered =
    active === "all"
      ? techStack
      : techStack.filter((t) => t.category === active);

  return (
    <section id="skills" className="scroll-mt-20">
      <div className="mb-10 flex flex-col items-center justify-center">
        <h2 className="mb-3 text-center text-4xl font-bold md:text-5xl">
          <span className="bg-[linear-gradient(90deg,#06b6d4,#22d3ee)] bg-clip-text text-transparent">
            Tech
          </span>{" "}
          <span className="bg-[linear-gradient(90deg,#a78bfa,#8b5cf6)] bg-clip-text text-transparent">
            Stack
          </span>
        </h2>
        <p className="max-w-lg text-center text-muted-foreground">
          Technologies and tools I work with to build modern web applications
        </p>
      </div>

      {/* Tab switcher */}
      <div className="mb-8 flex justify-center">
        <div className="relative flex gap-1 rounded-full border border-white/10 bg-background/50 p-1 backdrop-blur-sm">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActive(tab.value)}
              className="relative z-10 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200"
            >
              {active === tab.value && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-full bg-gradient"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 ${active === tab.value ? "text-white" : "text-muted-foreground"}`}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <motion.div
        layout
        className="-mx-8 grid grid-cols-4 gap-1 gap-y-1 sm:mx-0 sm:gap-4 sm:gap-y-5 lg:grid-cols-5 xl:grid-cols-6"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map(({ imageUri, name, category }, i) => (
            <motion.div
              key={name}
              layout
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{
                duration: 0.35,
                delay: i * 0.04,
                ease: "easeOut",
              }}
              drag
              dragElastic={0.4}
              dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
              whileTap={{ scale: 1.04 }}
              whileHover={{
                scale: 1.08,
                rotate: [0, 2, -2, 2, 0],
                transition: { duration: 0.4 },
              }}
              className="
        md: group relative flex cursor-grab flex-col
        items-center gap-2 rounded-xl border-none border-white/10 bg-background/40
        bg-transparent px-2 py-2.5 text-center
        backdrop-blur-sm transition-all
        duration-300 hover:border-violet-500/60
        hover:bg-background/60
        hover:shadow-[0_0_30px_rgba(139,92,246,0.25)]
        active:cursor-grabbing
        sm:gap-3

        sm:rounded-2xl
        sm:p-4
        md:border
  "
            >
              {/* Category indicator dot */}
              {category && (
                <span
                  className={`absolute right-2 top-2 hidden size-2 rounded-full opacity-70 sm:block ${categoryDot[category]}`}
                />
              )}

              {/* Icon */}
              <div className="relative">
                {/* glow only desktop */}
                <div className="absolute inset-0 hidden rounded-full bg-gradient opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-60 sm:block" />

                {/* Gradient border */}
                <div className="relative rounded-full bg-gradient p-[1.5px] shadow-lg transition-transform duration-300 group-hover:scale-105 sm:p-[2px]">
                  <div className="flex size-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm sm:size-14">
                    <Image
                      unoptimized
                      src={imageUri}
                      alt={name}
                      placeholder="blur"
                      blurDataURL="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRm4zBvW3pMXoaLmy2JX2LsUWSPVqC7GsrKU8MrzgUMQ&s"
                      width={72}
                      height={72}
                      className="size-6 rounded-full object-cover sm:size-10"
                    />
                  </div>
                </div>
              </div>

              {/* Name */}
              <span
                className="
      text-[9px] font-semibold uppercase tracking-wide
      text-foreground/75 transition-colors duration-200
      group-hover:text-white

      sm:text-xs
      sm:tracking-wider
    "
              >
                {name}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default Skills;
