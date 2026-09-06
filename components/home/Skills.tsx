"use client";
import { techStack } from "@/lib/init";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import {
  X,
  Layers,
  Server,
  Database,
  Component,
  Boxes,
  Cloud,
  Wrench,
  Code2,
  type LucideIcon,
} from "lucide-react";

type Category = NonNullable<ITech["category"]>;

const CATEGORY_ORDER: Category[] = [
  "frontend",
  "backend",
  "database",
  "state",
  "devops",
  "tools",
];

const CATEGORY_CONFIG: Record<
  Category,
  {
    label: string;
    description: string;
    Icon: LucideIcon;
    text: string;
    bg: string;
    border: string;
  }
> = {
  frontend: {
    label: "Frontend",
    description: "Building responsive and modern user interfaces.",
    Icon: Component,
    text: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/25 hover:border-cyan-500/50",
  },
  state: {
    label: "State Management",
    description: "Efficient state and data fetching solutions.",
    Icon: Boxes,
    text: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/25 hover:border-violet-500/50",
  },
  backend: {
    label: "Backend",
    description: "Building APIs and scalable server-side applications.",
    Icon: Server,
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25 hover:border-emerald-500/50",
  },
  database: {
    label: "Databases",
    description: "Reliable data storage and management.",
    Icon: Database,
    text: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/25 hover:border-blue-500/50",
  },
  devops: {
    label: "DevOps & Infra",
    description: "Deploy, monitor and keep things running.",
    Icon: Cloud,
    text: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/25 hover:border-orange-500/50",
  },
  tools: {
    label: "Tools & Others",
    description: "Productivity and development tools.",
    Icon: Wrench,
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/25 hover:border-amber-500/50",
  },
};

const groupedTech = CATEGORY_ORDER.map((category) => ({
  category,
  items: techStack.filter((t) => t.category === category),
})).filter((g) => g.items.length > 0);

// Tiny gray square used as a blur placeholder before tech icons load
const BLUR_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNkYPhfz0AEYBxVSF+FABJADveecVtRAAAAAElFTkSuQmCC";

const EXPERTISE_DOMAINS = [
  {
    title: "Frontend Engineering",
    Icon: Layers,
    years: 4,
    accent: {
      gradient: "from-cyan-500/10 to-transparent",
      border: "border-cyan-500/25 hover:border-cyan-500/50",
      text: "text-cyan-500",
      badge: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    },
    summary:
      "Deep confidence in React internals and JavaScript fundamentals — building interfaces that are fast, maintainable, and visually refined.",
    highlights: [
      "React Performance & Optimization",
      "Advanced JavaScript Patterns",
      "Next.js SSR · SSG · ISR",
      "TypeScript Type Engineering",
      "Framer Motion & Animations",
      "TanStack Query & Zustand",
      "Complex UI Architecture",
      "Responsive & Accessible UI",
    ],
  },
  {
    title: "Node.js & Backend",
    Icon: Server,
    years: 4,
    featured: true,
    accent: {
      gradient: "from-violet-500/10 to-indigo-500/5",
      border: "border-violet-500/40 hover:border-violet-500/70",
      text: "text-violet-400",
      badge: "bg-violet-500/15 text-violet-400 border-violet-500/25",
    },
    summary:
      "NestJS is my primary backend framework — I know its architecture deeply and apply it to build robust, production-ready server systems.",
    highlights: [
      "NestJS — Primary Framework",
      "Modular & DI Architecture",
      "RESTful API Design",
      "Real-time WebSocket Systems",
      "Microservices & Event-driven",
      "JWT Auth & Security Patterns",
      "Redis Caching & Pub/Sub",
      "RabbitMQ Message Queues",
    ],
  },
  {
    title: "Data & Infrastructure",
    Icon: Database,
    years: 3,
    accent: {
      gradient: "from-emerald-500/10 to-transparent",
      border: "border-emerald-500/25 hover:border-emerald-500/50",
      text: "text-emerald-500",
      badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    summary:
      "Experienced in designing schemas, optimizing queries, and setting up cloud infrastructure that scales with the application.",
    highlights: [
      "PostgreSQL Schema Design",
      "MongoDB Aggregations",
      "Prisma ORM & Migrations",
      "Redis Performance Caching",
      "Docker Containerization",
      "AWS S3 · EC2 · KMS",
      "Real-time Data Pipelines",
      "CI/CD & Deployment Flows",
    ],
  },
];

const Skills = () => {
  const [selectedTech, setSelectedTech] = useState<ITech | null>(null);

  return (
    <section id="skills" className="scroll-mt-28">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12 flex flex-col items-center justify-center"
      >
        <span className="mb-5 rounded-full border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground">
          Tech Stack
        </span>
        <h2 className="mb-3 text-center text-4xl font-bold md:text-5xl">
          <span className="text-foreground">Technologies</span>{" "}
          <span className="bg-[linear-gradient(90deg,#8b5cf6,#06b6d4)] bg-clip-text text-transparent">
            I Work With
          </span>
        </h2>
        <p className="max-w-lg text-center text-muted-foreground">
          Modern technologies and tools I use to build scalable,
          high-performance web applications.
        </p>
        <motion.span
          initial={{ width: 0 }}
          whileInView={{ width: 64 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 h-[3px] rounded-full bg-gradient"
        />
      </motion.div>

      {/* Category grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {groupedTech.map(({ category, items }, ci) => {
          const meta = CATEGORY_CONFIG[category];
          const { Icon } = meta;
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: ci * 0.08 }}
              className={`group relative overflow-hidden rounded-2xl border bg-background/60 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${meta.border}`}
            >
              <div className="mb-4 flex items-center gap-3">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${meta.bg}`}
                >
                  <Icon className={`size-5 ${meta.text}`} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    {meta.label}
                  </h4>
                  <p className="text-xs leading-snug text-muted-foreground">
                    {meta.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {items.map((tech, ti) => (
                  <motion.button
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: ci * 0.08 + ti * 0.04,
                    }}
                    whileHover={{ y: -3, scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTech(tech)}
                    className="flex w-16 flex-col items-center gap-1.5"
                    title={tech.name}
                  >
                    <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-background transition-colors duration-200 hover:border-primary/40">
                      <Image
                        src={tech.imageUri}
                        alt={tech.name}
                        placeholder="blur"
                        blurDataURL={BLUR_URL}
                        width={24}
                        height={24}
                        className="rounded-full object-contain"
                        style={{ width: 24, height: 24 }}
                      />
                    </div>
                    <span className="line-clamp-2 w-full text-center text-[10px] leading-tight text-muted-foreground">
                      {tech.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          );
        })}

        {/* Tagline panel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: groupedTech.length * 0.08 }}
          className="relative flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-background/60 p-6 text-center backdrop-blur-sm sm:col-span-2"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="flex size-11 items-center justify-center rounded-xl bg-violet-500/10"
          >
            <Code2 className="size-5 text-violet-500 dark:text-violet-400" />
          </motion.div>
          <p className="text-base font-semibold leading-snug text-foreground">
            Better tools.
            <br />
            Better products.
            <br />
            <span className="bg-[linear-gradient(90deg,#8b5cf6,#06b6d4)] bg-clip-text text-transparent">
              That&apos;s the goal.
            </span>
          </p>
          <motion.span
            initial={{ width: 0 }}
            whileInView={{ width: 40 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-[2px] rounded-full bg-gradient"
          />
        </motion.div>
      </div>

      {/* ─── Expertise Profile ─────────────────────────────── */}
      <div id="expertise" className="mt-20 scroll-mt-28 space-y-8">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <h3 className="mb-3 text-center text-4xl font-bold md:text-5xl">
            <span className="bg-[linear-gradient(90deg,#a78bfa,#8b5cf6)] bg-clip-text text-transparent">
              My
            </span>{" "}
            <span className="text-foreground">Expertise</span>
          </h3>
          <p className="max-w-md text-center text-base text-muted-foreground">
            4 years of full-stack JavaScript development — specialized in
            Node.js backends and modern React frontends
          </p>
        </motion.div>

        {/* Node.js hero banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-background/95 p-7 backdrop-blur-sm md:p-9"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-indigo-500/5" />
          <div className="pointer-events-none absolute -right-12 -top-12 size-64 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-8 left-1/3 size-48 rounded-full bg-cyan-500/10 blur-2xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10">
              <Image
                src="/node-js.png"
                alt="Node.js"
                width={48}
                height={48}
                className="size-12 object-contain"
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-xl font-bold text-foreground">
                  Node.js Full-Stack Developer
                </h4>
                <span className="rounded-full border border-violet-500/30 bg-violet-500/15 px-3 py-0.5 text-xs font-semibold text-violet-400">
                  4 Years Experience
                </span>
                <span className="rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-0.5 text-xs font-medium text-cyan-500">
                  Full-Stack
                </span>
              </div>
              <p className="text-base leading-relaxed text-muted-foreground">
                Specialized in building production-grade Node.js applications —
                high-performance REST APIs, real-time WebSocket systems, and
                event-driven microservices. Paired with deep React and Next.js
                expertise on the frontend, I deliver complete, scalable
                JavaScript&thinsp;/&thinsp;TypeScript solutions end-to-end.
              </p>
            </div>
            <div className="flex shrink-0 gap-6 sm:flex-col sm:items-end sm:gap-4">
              {[
                { value: "4+", label: "Years" },
                { value: "10+", label: "Projects" },
                { value: "22+", label: "Technologies" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center sm:items-end sm:text-right"
                >
                  <span className="text-2xl font-extrabold text-foreground">
                    {value}
                  </span>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Domain expertise cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {EXPERTISE_DOMAINS.map((domain, di) => {
            const { Icon } = domain;
            return (
              <motion.div
                key={domain.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: di * 0.1 + 0.2 }}
                className={`group relative overflow-hidden rounded-2xl border bg-background/95 p-6 backdrop-blur-sm transition-all duration-300 ${domain.accent.border}`}
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${domain.accent.gradient}`}
                />
                <div className="relative space-y-4">
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex size-11 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110 ${domain.accent.badge}`}
                    >
                      <Icon className={`size-5 ${domain.accent.text}`} />
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${domain.accent.badge}`}
                    >
                      {domain.years} yr{domain.years !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div>
                    <h4 className="mb-1.5 text-base font-bold text-foreground">
                      {domain.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {domain.summary}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {domain.highlights.map((highlight, hi) => (
                      <motion.span
                        key={highlight}
                        initial={{ opacity: 0, y: 6 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.28,
                          delay: di * 0.08 + hi * 0.045 + 0.2,
                        }}
                        className={`rounded-full border px-2.5 py-[5px] text-[11px] font-medium leading-none ${domain.accent.badge}`}
                      >
                        {highlight}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedTech && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 dark:bg-black/75"
            onClick={() => setSelectedTech(null)}
          >
            <div className="absolute inset-0 backdrop-blur-md" />

            <motion.div
              initial={{ scale: 0.82, y: 32, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.82, y: 32, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-background/95 shadow-2xl backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-x-0 top-0 h-36 bg-gradient opacity-10" />

              <button
                onClick={() => setSelectedTech(null)}
                className="absolute right-4 top-4 z-10 flex size-7 items-center justify-center rounded-full border border-border bg-background/60 transition-all hover:bg-background/90"
              >
                <X className="size-3.5" />
              </button>

              <div className="relative px-6 pb-8 pt-8">
                <div className="mb-5 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient opacity-40 blur-2xl" />
                    <div className="relative rounded-full bg-gradient p-[2.5px] shadow-lg">
                      <div className="flex size-24 items-center justify-center rounded-full bg-background">
                        <Image
                          src={selectedTech.imageUri}
                          alt={selectedTech.name}
                          placeholder="blur"
                          blurDataURL={BLUR_URL}
                          width={60}
                          height={60}
                          className="size-14 rounded-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="mb-2 text-center text-xl font-bold text-foreground">
                  {selectedTech.name}
                </h3>

                {selectedTech.category &&
                  CATEGORY_CONFIG[selectedTech.category] && (
                    <div className="mb-5 flex justify-center">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${CATEGORY_CONFIG[selectedTech.category].bg} ${CATEGORY_CONFIG[selectedTech.category].text} ${CATEGORY_CONFIG[selectedTech.category].border}`}
                      >
                        {CATEGORY_CONFIG[selectedTech.category].label}
                      </span>
                    </div>
                  )}

                {selectedTech.description && (
                  <p className="text-center text-base leading-relaxed text-muted-foreground">
                    {selectedTech.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Skills;
