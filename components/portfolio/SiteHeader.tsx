"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  Check,
  Cpu,
  FileText,
  Globe,
  Monitor,
  Moon,
  Rocket,
  Share2,
  Sun,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { siteConfig } from "@/lib/config";
import { NAV } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";
import { MobileTabBar, type TabItem } from "./MobileTabBar";
import "./SiteHeader.css";

const NAV_ICONS: Record<string, React.ElementType> = {
  top: Rocket,
  stack: Cpu,
  about: Globe,
  projects: Monitor,
  contact: FileText,
};

const TAB_ITEMS: TabItem[] = NAV.map((n) => ({ ...n, Icon: NAV_ICONS[n.id] }));

/** After a nav click, ignore scroll-spy updates for this long (or until the target is reached). */
const NAV_LOCK_MS = 1500;

const PROGRESS_STYLE = {
  background: "linear-gradient(90deg,var(--g1),var(--g2) 50%,var(--g3))",
  boxShadow: "0 0 10px rgba(143,147,255,0.8)",
};

const iconButtonClass =
  "glass-btn relative grid h-9 w-9 cursor-pointer place-items-center rounded-full text-pf-t3 hover:text-pf-text";

// Glossy lens that slides between nav items (shared layoutId per nav).
const ACTIVE_PILL_TRANSITION = {
  type: "spring",
  stiffness: 420,
  damping: 34,
} as const;

const tooltipContentClass =
  "border border-pf-ink/10 bg-pf-base/90 font-medium text-pf-text shadow-[0_8px_30px_-8px_rgba(var(--glow3),0.5)] backdrop-blur-md";

const LogoPaths = () => (
  <>
    <path d="M3 6H15" pathLength={1} />
    <path d="M8 6V27" pathLength={1} />
    <path d="M12.5 10V24H16A7 7 0 0 0 16 10H12.5" pathLength={1} />
    <path d="M16 6A11 11 0 0 1 16 28" pathLength={1} />
  </>
);

export const Logo = ({ size = 30 }: { size?: number }) => {
  // Logo renders twice (mobile + desktop), so each instance needs its own gradient id.
  const gradientId = `logo-grad-${useId().replace(/[^\w-]/g, "")}`;

  return (
    <a
      href="#top"
      aria-label="Đào Tài — home"
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
        <g stroke={`url(#${gradientId})`} className="logo-draw">
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

const ShareButton = () => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleShare = async () => {
    const data = {
      title: siteConfig.title,
      text: siteConfig.shortDescription,
      url: siteConfig.url,
    };

    // Native share sheet where the device offers one (mobile, some desktops).
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(data);
      } catch (err) {
        // The user dismissing the sheet throws AbortError — not an error to us.
        if ((err as Error)?.name !== "AbortError") console.error(err);
      }
      return;
    }

    // Fallback: copy the link and flash a confirmation.
    try {
      await navigator.clipboard.writeText(data.url);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const label = copied ? "Link copied!" : "Share this site";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={handleShare}
          aria-label={label}
          className={iconButtonClass}
        >
          <Share2
            aria-hidden="true"
            size={15}
            className={cn(
              "absolute [transition:transform_.3s,opacity_.2s]",
              copied && "scale-50 opacity-0",
            )}
          />
          <Check
            aria-hidden="true"
            size={15}
            className={cn(
              "absolute text-pf-text [transition:transform_.3s,opacity_.2s]",
              !copied && "scale-50 opacity-0",
            )}
          />
        </button>
      </TooltipTrigger>
      <TooltipContent className={tooltipContentClass}>{label}</TooltipContent>
    </Tooltip>
  );
};

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleTheme = () =>
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  // resolvedTheme is undefined until mounted; default to the dark-mode label.
  const label = resolvedTheme === "light" ? "Switch to dark" : "Switch to light";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={label}
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
      </TooltipTrigger>
      <TooltipContent className={tooltipContentClass}>{label}</TooltipContent>
    </Tooltip>
  );
};

export default function SiteHeader() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(NAV[0].id);
  const progressRef = useRef(0);
  // A clicked target, held while the smooth scroll passes the sections in between.
  const navLock = useRef<{ id: string; until: number } | null>(null);

  const navigate = useCallback((id: string) => {
    navLock.current = { id, until: performance.now() + NAV_LOCK_MS };
    setActive(id);
  }, []);

  // Nothing here reads layout on scroll (which would force a reflow every frame): the page
  // height is cached from a ResizeObserver, and the active section comes from an
  // IntersectionObserver watching a thin band 35% down the viewport.
  useEffect(() => {
    const se = document.scrollingElement || document.documentElement;
    let docHeight = 0; // set by the ResizeObserver, which also fires on observe()
    let sectionActive = NAV[0].id;
    const crossing = new Set<string>();
    const desktop = window.matchMedia("(min-width: 768px)"); // Tailwind `md`
    let raf = 0;

    const update = () => {
      raf = 0;
      const max = docHeight - window.innerHeight;
      // The progress bar only renders on desktop; skip the work (and re-renders) on mobile.
      if (desktop.matches) {
        const progress =
          max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        if (Math.abs(progress - progressRef.current) > 0.001) {
          progressRef.current = progress;
          setProgress(progress);
        }
      }
      const next =
        max > 0 && window.scrollY >= max - 2
          ? NAV[NAV.length - 1].id
          : sectionActive;
      const lock = navLock.current;
      if (lock) {
        if (next !== lock.id && performance.now() < lock.until) return;
        navLock.current = null;
      }
      setActive(next);
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

  return (
    <TooltipProvider delayDuration={300}>
      <header className="fixed left-0 right-0 top-0 z-50">
        {/* ── Mobile: full-width bar ── */}
        <div className="relative md:hidden">
          <div className="flex items-center justify-between border-b border-pf-ink/[0.06] bg-pf-base/[0.62] px-4 py-2.5 backdrop-blur-[18px] backdrop-saturate-150">
            <Logo />

            {/* Actions */}
            <div className="flex items-center gap-2">
              <ShareButton />

              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* ── Desktop: centered floating pill ── */}
        <div className="hidden justify-center px-3 pt-3 md:flex">
          <div className="glass-surface flex items-center gap-1 overflow-hidden rounded-full py-2 pl-2.5 pr-3 backdrop-blur-[18px] backdrop-saturate-150">
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
                    onClick={() => navigate(n.id)}
                    aria-current={on ? "location" : undefined}
                    className={cn(
                      "relative flex items-center gap-2 rounded-full px-3.5 py-2 text-sm [transition:color_.2s,background_.2s]",
                      on
                        ? "font-semibold text-pf-text [text-shadow:0_0_18px_rgba(143,147,255,0.9)]"
                        : "font-medium text-pf-t5 hover:bg-pf-ink/[0.05] hover:text-pf-text",
                    )}
                  >
                    {on && (
                      <motion.span
                        layoutId="nav-active-desktop"
                        aria-hidden="true"
                        className="glass-active absolute inset-0 rounded-full"
                        transition={ACTIVE_PILL_TRANSITION}
                      />
                    )}
                    {Icon && (
                      <Icon
                        size={14}
                        aria-hidden="true"
                        className={cn(
                          "relative shrink-0 [transition:opacity_.2s]",
                          on
                            ? "opacity-100 drop-shadow-[0_0_6px_rgba(143,147,255,0.9)]"
                            : "opacity-60",
                        )}
                      />
                    )}
                    <span className="relative">{n.label}</span>
                  </a>
                );
              })}
            </nav>

            <span className="mx-1 h-5 w-px bg-pf-ink/10" />

            <ShareButton />

            <ThemeToggle />

            <ProgressBar progress={progress} />
          </div>
        </div>
      </header>

      <MobileTabBar items={TAB_ITEMS} active={active} onNavigate={navigate} />
    </TooltipProvider>
  );
}
