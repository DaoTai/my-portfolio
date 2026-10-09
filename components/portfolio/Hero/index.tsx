"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRight, Hand, Mail } from "lucide-react";
import { useEffect, useRef } from "react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { AnimatedNumber } from "@/components/common/AnimatedNumber";
import { GithubIcon, LinkedinIcon } from "@/components/common/BrandIcons";
import { EASE_OUT } from "@/components/common/Reveal";
import { siteConfig } from "@/lib/config";
import { HeroVisual } from "./HeroVisual";
import "./Hero.css";

const STATS = [
  { value: 4, label: "YEARS EXPERIENCE" },
  { value: 9, label: "PROJECTS SHIPPED" },
  { value: 22, label: "TECHNOLOGIES" },
];

/** Fixed positions (%, px size, s duration, s delay) so server and client markup match. */
const STARS = [
  [8, 18, 2, 3.4, 0],
  [22, 64, 1.5, 4.2, 1.1],
  [37, 12, 1.5, 5, 2.3],
  [48, 82, 2, 3.8, 0.6],
  [58, 30, 2.5, 4.6, 1.8],
  [66, 8, 1.5, 3.2, 2.9],
  [74, 58, 2, 5.4, 0.3],
  [86, 22, 2.5, 4, 1.4],
  [92, 70, 1.5, 3.6, 2.1],
  [80, 88, 2, 4.8, 0.9],
] as const;

const SPRING = { stiffness: 60, damping: 18, mass: 0.8 };

/** Icons paint with the moving gradient defined once in <FlowGradient />. */
const FLOW = "url(#hero-flow)";

const SOCIALS: { href: string; label: string; icon: ReactNode }[] = [
  {
    href: `mailto:${siteConfig.email}`,
    label: "Email",
    icon: <Mail aria-hidden="true" size={18} strokeWidth={2} color={FLOW} />,
  },
  {
    href: siteConfig.links.github,
    label: "GitHub",
    icon: <GithubIcon fill={FLOW} />,
  },
  {
    href: siteConfig.links.linkedin,
    label: "LinkedIn",
    icon: <LinkedinIcon size={16} fill={FLOW} />,
  },
];

/**
 * White → cyan → purple, sliding sideways while the hero is on screen. userSpaceOnUse in the
 * icons' 24-unit viewBox, so every icon shows the full sweep regardless of its shape.
 */
const FlowGradient = ({ paused }: { paused: boolean }) => {
  const ref = useRef<SVGSVGElement>(null);

  // SMIL ignores animation-play-state; every icon using the gradient repaints while it runs.
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    if (paused) svg.pauseAnimations();
    else svg.unpauseAnimations();
  }, [paused]);

  return (
    <svg ref={ref} aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        <linearGradient
          id="hero-flow"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="24"
          y2="0"
          spreadMethod="repeat"
        >
          <stop offset="0" style={{ stopColor: "var(--flow-1)" }} />
          <stop offset="0.33" style={{ stopColor: "var(--flow-2)" }} />
          <stop offset="0.66" style={{ stopColor: "var(--flow-3)" }} />
          <stop offset="1" style={{ stopColor: "var(--flow-1)" }} />
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            from="0 0"
            to="24 0"
            dur="4s"
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
    </svg>
  );
};

const socialClass =
  "grid h-11 w-11 place-items-center rounded-full border border-pf-ink/[0.18] bg-pf-base/40 text-pf-text2 transition-[transform,border-color,color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[color:var(--icon-hover)] hover:shadow-[0_10px_30px_-8px_rgba(var(--glow3),0.7)]";

const Hero = ({ showAvailable = true }: { showAvailable?: boolean }) => {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  /** Off-screen, every loop in the hero holds still instead of repainting unseen. */
  const inView = useInView(sectionRef, { margin: "120px 0px" });
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const mx = useSpring(pointerX, SPRING);
  const my = useSpring(pointerY, SPRING);
  const bgX = useTransform(mx, (v) => v * -36);
  const bgY = useTransform(my, (v) => v * -24);

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - r.left) / r.width - 0.5);
    pointerY.set((e.clientY - r.top) / r.height - 0.5);
  };

  const onPointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  /** `blur: false` where a filter would isolate a mix-blend-mode child (the gradient stats). */
  const rise = (step: number, blur = true) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 26, ...(blur && { filter: "blur(8px)" }) },
          animate: { opacity: 1, y: 0, ...(blur && { filter: "blur(0px)" }) },
          transition: {
            duration: 0.9,
            delay: 0.1 + step * 0.09,
            ease: EASE_OUT,
          },
        };

  return (
    <section
      ref={sectionRef}
      id="top"
      data-screen-label="Hero"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`relative overflow-hidden bg-pf-bg [container-type:inline-size]${inView ? "" : " hero--paused"}`}
    >
      {/* Space art drifts against the cursor for depth. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-[-4%] bg-[image:var(--hero-img)] bg-cover bg-[position:center_right] bg-no-repeat [@container_(max-width:1031px)]:bg-[length:auto_56%] [@container_(max-width:1031px)]:bg-[position:right_bottom]"
        style={{ x: bgX, y: bgY }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(var(--base),0.85)_0%,rgba(var(--base),0.35)_45%,rgba(var(--base),0)_70%)] [@container_(max-width:1031px)]:bg-[linear-gradient(180deg,var(--bg)_0%,var(--bg)_44%,rgba(var(--base),0)_58%)]"
      />
      <FlowGradient paused={!inView} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {STARS.map(([left, top, size, dur, delay]) => (
          <span
            key={`${left}-${top}`}
            className="hero-star"
            style={
              {
                left: `${left}%`,
                top: `${top}%`,
                width: size,
                height: size,
                "--tw": `${dur}s`,
                "--td": `${delay}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="relative mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-center gap-12 px-8 pb-[104px] pt-10 sm:pt-24">
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-3.5">
            <motion.span
              {...rise(0)}
              className="text-md font-semibold tracking-[0.28em] text-pf-t6"
            >
              HELLO, WORLD{" "}
              {/* CSS wave (compositor) rather than a JS loop ticking every frame. */}
              <span className="hero-wave">
                <Hand
                  aria-hidden="true"
                  size={22}
                  strokeWidth={2}
                  color={FLOW}
                />
              </span>
            </motion.span>
            <h1 className="m-0 font-display text-[clamp(48px,6.4vw,80px)] font-semibold leading-none tracking-[-0.03em] text-pf-text">
              <motion.span {...rise(1)} className="inline-block">
                I’m
              </motion.span>{" "}
              <motion.span
                className="hero-shine inline-block bg-clip-text pb-[0.08em] text-transparent [filter:drop-shadow(0_0_28px_rgba(var(--glow3),0.35))]"
                initial={reduce ? false : { opacity: 0, rotateX: -90, y: 20 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                transition={{ duration: 1.1, delay: 0.3, ease: EASE_OUT }}
                style={{
                  transformPerspective: 700,
                  transformOrigin: "50% 100%",
                }}
              >
                Kendrick
              </motion.span>
            </h1>
            <motion.p
              {...rise(3)}
              className="m-0 font-display text-[clamp(20px,2vw,26px)] font-medium tracking-[-0.005em] text-pf-text"
            >
              Full-Stack Software Engineer
            </motion.p>
          </div>

          <motion.p
            {...rise(4)}
            className="m-0 max-w-[520px] text-pretty border-l-2 border-pf-g2 pl-4 text-base leading-[1.65] text-pf-t4"
          >
            4+ years shipping production{" "}
            <span className="text-pf-text">real-time trading platforms</span>,{" "}
            <span className="text-pf-text">Web3 products</span> and full-stack
            web apps. I own features end to end with React, Next.js, Node.js and
            NestJS, from fast UIs to APIs and on-chain integrations.
          </motion.p>

          <motion.div {...rise(5, false)} className="flex">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={
                  i === 0
                    ? "flex min-w-0 flex-col gap-1 pr-4 sm:gap-1.5 sm:pr-8"
                    : "flex min-w-0 flex-col gap-1 border-l border-pf-ink/10 px-4 sm:gap-1.5 sm:px-8"
                }
              >
                <AnimatedNumber
                  value={s.value}
                  suffix="+"
                  countUp
                  delay={0.5 + i * 0.15}
                  className="font-display text-[24px] font-semibold tracking-[-0.02em] sm:text-[36px]"
                />
                <span className="text-[9.5px] leading-snug tracking-[0.08em] text-pf-t7 sm:text-[11px] sm:tracking-[0.12em]">
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.div {...rise(6)} className="flex gap-3">
            {SOCIALS.map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                {...(href.startsWith("mailto:")
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
                aria-label={label}
                className={socialClass}
              >
                {icon}
              </a>
            ))}
          </motion.div>

          <motion.a
            {...rise(7)}
            href="#projects"
            className="hero-flow-border group flex items-center gap-3 self-start whitespace-nowrap rounded-full px-[30px] py-[15px] text-[15px] font-semibold text-pf-text transition-[background-color,color,box-shadow] duration-300 hover:bg-pf-text hover:text-pf-bg hover:shadow-[0_14px_40px_-10px_rgba(var(--glow3),0.8)]"
          >
            View My Work{" "}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight size={18} strokeWidth={1.75} />
            </span>
          </motion.a>
        </div>

        <HeroVisual
          mx={mx}
          my={my}
          showAvailable={showAvailable}
          paused={!inView}
        />
      </div>
    </section>
  );
};

export default Hero;
