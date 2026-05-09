import * as motion from "motion/react-client";
import { CheckCircle2, Zap, UserRound } from "lucide-react";
import CarouselImages from "./CarouselImages";

type RoleStyle = {
  badge: string;
  border: string;
  glow: string;
  dot: string;
  section: string;
};

const roleStyleMap: Record<string, RoleStyle> = {
  "Frontend Developer": {
    badge: "bg-sky-500/15 text-sky-400 border-sky-500/40",
    border: "border-sky-500/25",
    glow: "hover:shadow-[0_8px_48px_rgba(14,165,233,0.18)]",
    dot: "bg-sky-400",
    section: "text-sky-400",
  },
  "Backend Developer": {
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
    border: "border-emerald-500/25",
    glow: "hover:shadow-[0_8px_48px_rgba(16,185,129,0.18)]",
    dot: "bg-emerald-400",
    section: "text-emerald-400",
  },
  "Full-stack Developer": {
    badge: "bg-violet-500/15 text-violet-400 border-violet-500/40",
    border: "border-violet-500/25",
    glow: "hover:shadow-[0_8px_48px_rgba(139,92,246,0.18)]",
    dot: "bg-violet-400",
    section: "text-violet-400",
  },
};

const fallbackStyle: RoleStyle = {
  badge: "bg-primary/15 text-primary border-primary/40",
  border: "border-primary/25",
  glow: "hover:shadow-[0_8px_48px_rgba(99,102,241,0.18)]",
  dot: "bg-primary",
  section: "text-primary",
};

const ProjectCard = ({ index, data }: { index: number; data: IProject }) => {
  const { name, role, summary, responsibilities, technicalHighlights, previewImages } = data;
  const s = roleStyleMap[role] ?? fallbackStyle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={`overflow-hidden rounded-2xl border bg-background/60 backdrop-blur-md transition-shadow duration-300 ${s.border} ${s.glow}`}
    >
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center gap-4 border-b border-white/10 px-6 py-5">
        <motion.span
          whileHover={{ scale: 1.1 }}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient text-sm font-bold text-white shadow-lg"
        >
          {index}
        </motion.span>

        <div className="flex flex-1 flex-wrap items-center gap-3">
          <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">{name}</h3>

          {/* Role badge — the main highlight */}
          <span
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${s.badge}`}
          >
            <UserRound size={12} />
            {role}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="grid gap-6 p-6 lg:grid-cols-2">
        {/* Left column — details */}
        <div className="space-y-6">
          {/* Summary */}
          <p className="leading-relaxed text-foreground/80">{summary}</p>

          {/* Responsibilities */}
          <div>
            <h4 className={`mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest ${s.section}`}>
              <CheckCircle2 size={13} />
              My Responsibilities
            </h4>
            <ul className="space-y-2">
              {responsibilities.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.045, duration: 0.35 }}
                  className="flex items-start gap-2.5 text-sm text-foreground/75"
                >
                  <span className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${s.dot}`} />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Technical Highlights */}
          <div>
            <h4 className={`mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest ${s.section}`}>
              <Zap size={13} />
              Technical Highlights
            </h4>
            <div className="flex flex-wrap gap-2">
              {technicalHighlights.map((highlight, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ scale: 1.06 }}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${s.badge}`}
                >
                  {highlight}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — image preview */}
        {previewImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="overflow-hidden rounded-xl border border-white/10"
          >
            <CarouselImages previewImages={previewImages} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;
