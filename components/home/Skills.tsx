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
      <div className="flex flex-col items-center justify-center mb-10">
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
        className="grid grid-cols-2 gap-4 gap-y-5 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6"
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
              whileTap={{ scale: 1.05 }}
              whileHover={{
                scale: 1.1,
                rotate: [0, 2, -2, 2, 0],
                transition: { duration: 0.4 },
              }}
              className="group relative flex cursor-grab flex-col items-center gap-3 rounded-2xl border border-white/10 bg-background/40 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:border-violet-500/60 hover:bg-background/60 hover:shadow-[0_0_30px_rgba(139,92,246,0.25)] active:cursor-grabbing"
            >
              {/* Category indicator dot */}
              {category && (
                <span
                  className={`absolute right-2.5 top-2.5 size-2 rounded-full opacity-70 ${categoryDot[category]}`}
                />
              )}

              {/* Icon with gradient border + glow on hover */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-60" />
                {/* Gradient border ring */}
                <div className="relative rounded-full bg-gradient p-[2px] shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <div className="flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm size-12 sm:size-14">
                    <Image
                      unoptimized
                      src={imageUri}
                      alt={name}
                      placeholder="blur"
                      blurDataURL="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRm4zBvW3pMXoaLmy2JX2LsUWSPVqC7GsrKU8MrzgUMQ&s"
                      width={72}
                      height={72}
                      className="size-8 object-cover rounded-full sm:size-10"
                    />
                  </div>
                </div>
              </div>

              {/* Name */}
              <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/75 transition-colors duration-200 group-hover:text-white sm:text-xs">
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
