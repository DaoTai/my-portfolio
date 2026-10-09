"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  Cpu,
  FileText,
  Globe,
  Menu,
  Monitor,
  Moon,
  Rocket,
  Sun,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { NAV } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

const NAV_ICONS: Record<string, React.ElementType> = {
  top: Rocket,
  stack: Cpu,
  about: Globe,
  projects: Monitor,
  contact: FileText,
};

const PROGRESS_STYLE = {
  background: "linear-gradient(90deg,var(--g1),var(--g2) 50%,var(--g3))",
  boxShadow: "0 0 10px rgba(143,147,255,0.8)",
};

const iconButtonClass =
  "relative grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-pf-ink/10 bg-pf-ink/[0.04] text-pf-t3 [transition:color_.2s,background_.2s,border-color_.2s] hover:border-pf-ink/20 hover:bg-pf-ink/[0.08] hover:text-pf-text";

const LogoPaths = () => (
  <>
    <path d="M3 6H15" />
    <path d="M8 6V27" />
    <path d="M12.5 10V24H16A7 7 0 0 0 16 10H12.5" />
    <path d="M16 6A11 11 0 0 1 16 28" />
  </>
);

export const Logo = ({ size = 30 }: { size?: number }) => {
  // Logo renders twice (mobile + desktop), so each instance needs its own gradient id.
  const gradientId = `logo-grad-${useId().replace(/[^\w-]/g, "")}`;

  return (
    <a
      href="#top"
      aria-label="Dao Tai — home"
      className="group grid h-9 w-9 shrink-0 place-items-center text-pf-text [transition:filter_.25s,transform_.25s] hover:-translate-y-px hover:drop-shadow-[0_0_10px_rgba(143,147,255,0.7)]"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <defs>
          {/* userSpaceOnUse: straight paths have a zero-width bbox, which breaks objectBoundingBox gradients */}
          <linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            x1="3"
            y1="6"
            x2="27"
            y2="28"
          >
            <stop offset="0%" stopColor="var(--g1)" />
            <stop offset="50%" stopColor="var(--g2)" />
            <stop offset="100%" stopColor="var(--g3)" />
          </linearGradient>
        </defs>
        <g
          stroke="currentColor"
          className="[transition:opacity_.25s] group-hover:opacity-0"
        >
          <LogoPaths />
        </g>
        <g
          stroke={`url(#${gradientId})`}
          className="opacity-0 [transition:opacity_.25s] group-hover:opacity-100"
        >
          <LogoPaths />
        </g>
      </svg>
    </a>
  );
};

const ProgressBar = ({
  progress,
  className,
}: {
  progress: number;
  className?: string;
}) => (
  <div
    className={cn(
      "absolute bottom-[-1px] left-0 right-0 h-0.5 bg-pf-ink/[0.04]",
      className,
    )}
  >
    <div
      className="h-full [transition:width_.1s_linear]"
      style={{ ...PROGRESS_STYLE, width: `${(progress * 100).toFixed(2)}%` }}
    />
  </div>
);

export default function SiteHeader() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(NAV[0].id);
  const [menuOpen, setMenuOpen] = useState(false);
  const progressRef = useRef(0);
  const { resolvedTheme, setTheme } = useTheme();

  // Nothing here reads layout on scroll (which would force a reflow every frame): the page
  // height is cached from a ResizeObserver, and the active section comes from an
  // IntersectionObserver watching a thin band 35% down the viewport.
  useEffect(() => {
    const se = document.scrollingElement || document.documentElement;
    let docHeight = 0; // set by the ResizeObserver, which also fires on observe()
    let sectionActive = NAV[0].id;
    const crossing = new Set<string>();
    let raf = 0;

    const update = () => {
      raf = 0;
      const max = docHeight - window.innerHeight;
      const progress =
        max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (Math.abs(progress - progressRef.current) > 0.001) {
        progressRef.current = progress;
        setProgress(progress);
      }
      setActive(
        max > 0 && window.scrollY >= max - 2
          ? NAV[NAV.length - 1].id
          : sectionActive,
      );
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const sections = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) crossing.add(e.target.id);
          else crossing.delete(e.target.id);
        }
        // Between sections nothing crosses the band; keep the last one.
        sectionActive =
          [...NAV].reverse().find((n) => crossing.has(n.id))?.id ??
          sectionActive;
        schedule();
      },
      { rootMargin: "-35% 0px -64% 0px" },
    );
    for (const n of NAV) {
      const el = document.getElementById(n.id);
      if (el) sections.observe(el);
    }

    // Callbacks run after layout, so reading scrollHeight here is free.
    const resize = new ResizeObserver(() => {
      docHeight = se.scrollHeight;
      schedule();
    });
    resize.observe(document.body);

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      sections.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setMenuOpen(false);
    const desktop = window.matchMedia("(min-width: 768px)");
    const onDesktop = () => desktop.matches && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    return () => {
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [menuOpen]);

  const toggleTheme = () =>
    setTheme(resolvedTheme === "light" ? "dark" : "light");

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      {/* ── Mobile: full-width bar ── */}
      <div className="relative md:hidden">
        <div className="flex items-center justify-between border-b border-pf-ink/[0.06] bg-pf-base/[0.62] px-4 py-2.5 backdrop-blur-[18px] backdrop-saturate-150">
          <Logo />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={iconButtonClass}
            >
              <Moon
                aria-hidden="true"
                size={15}
                className="absolute [transition:transform_.4s,opacity_.3s] [.light_&]:-rotate-90 [.light_&]:scale-50 [.light_&]:opacity-0"
              />
              <Sun
                aria-hidden="true"
                size={15}
                className="absolute rotate-90 scale-50 opacity-0 [transition:transform_.4s,opacity_.3s] [.light_&]:rotate-0 [.light_&]:scale-100 [.light_&]:opacity-100"
              />
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={iconButtonClass}
            >
              <Menu
                aria-hidden="true"
                size={15}
                className={cn(
                  "absolute [transition:transform_.3s,opacity_.2s]",
                  menuOpen && "rotate-90 scale-50 opacity-0",
                )}
              />
              <X
                aria-hidden="true"
                size={15}
                className={cn(
                  "absolute [transition:transform_.3s,opacity_.2s]",
                  !menuOpen && "-rotate-90 scale-50 opacity-0",
                )}
              />
            </button>
          </div>
        </div>

        <ProgressBar progress={progress} />

        {/* Mobile dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.button
                type="button"
                aria-label="Close menu"
                tabIndex={-1}
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 -z-10 cursor-default bg-black/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.nav
                id="mobile-menu"
                aria-label="Mobile"
                className="absolute left-3 right-3 top-full mt-2 flex flex-col gap-1 rounded-2xl border border-pf-ink/10 bg-pf-base/[0.72] p-2 shadow-[0_24px_60px_-20px_rgba(var(--glow3),0.6)] backdrop-blur-[18px] backdrop-saturate-150"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                {NAV.map((n) => {
                  const on = n.id === active;
                  const Icon = NAV_ICONS[n.id];
                  return (
                    <a
                      key={n.id}
                      href={`#${n.id}`}
                      onClick={() => {
                        setActive(n.id);
                        setMenuOpen(false);
                      }}
                      aria-current={on ? "location" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] [transition:color_.2s,background_.2s] hover:bg-pf-ink/[0.05] hover:text-pf-text",
                        on
                          ? "bg-pf-ink/[0.06] font-semibold text-pf-text"
                          : "font-medium text-pf-t4",
                      )}
                    >
                      {Icon && (
                        <Icon
                          size={16}
                          aria-hidden="true"
                          className="shrink-0 opacity-70"
                        />
                      )}
                      <span className="flex-1">{n.label}</span>
                      {on && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[linear-gradient(90deg,var(--g2),var(--g3))] shadow-[0_0_10px_2px_rgba(var(--dot-glow),0.8)]" />
                      )}
                    </a>
                  );
                })}
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* ── Desktop: centered floating pill ── */}
      <div className="hidden justify-center px-3 pt-3 md:flex">
        <div className="relative flex items-center gap-1 overflow-hidden rounded-full border border-pf-ink/10 bg-pf-base/[0.55] py-2 pl-2.5 pr-4 shadow-[0_12px_40px_-16px_rgba(var(--glow3),0.55)] backdrop-blur-[18px] backdrop-saturate-150">
          <Logo size={32} />

          <span className="mx-1 h-5 w-px bg-pf-ink/10" />

          <nav className="flex items-center gap-0.5">
            {NAV.map((n) => {
              const on = n.id === active;
              const Icon = NAV_ICONS[n.id];
              return (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={() => setActive(n.id)}
                  aria-current={on ? "location" : undefined}
                  className={cn(
                    "relative flex items-center gap-2 rounded-full px-3.5 py-2 text-sm [transition:color_.2s,background_.2s]",
                    on
                      ? "bg-pf-ink/[0.08] font-semibold text-pf-text [text-shadow:0_0_18px_rgba(143,147,255,0.9)]"
                      : "font-medium text-pf-t5 hover:bg-pf-ink/[0.05] hover:text-pf-text",
                  )}
                >
                  {Icon && (
                    <Icon
                      size={14}
                      aria-hidden="true"
                      className={cn(
                        "shrink-0 [transition:opacity_.2s]",
                        on
                          ? "opacity-100 drop-shadow-[0_0_6px_rgba(143,147,255,0.9)]"
                          : "opacity-60",
                      )}
                    />
                  )}
                  {n.label}
                </a>
              );
            })}
          </nav>

          <span className="mx-1 h-5 w-px bg-pf-ink/10" />

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={iconButtonClass}
          >
            <Moon
              aria-hidden="true"
              size={15}
              className="absolute [transition:transform_.4s,opacity_.3s] [.light_&]:-rotate-90 [.light_&]:scale-50 [.light_&]:opacity-0"
            />
            <Sun
              aria-hidden="true"
              size={15}
              className="absolute rotate-90 scale-50 opacity-0 [transition:transform_.4s,opacity_.3s] [.light_&]:rotate-0 [.light_&]:scale-100 [.light_&]:opacity-100"
            />
          </button>

          <ProgressBar progress={progress} />
        </div>
      </div>
    </header>
  );
}
