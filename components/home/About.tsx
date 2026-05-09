"use client";
import { Mail, ArrowDown, Hand, Sparkle, ArrowRight } from "lucide-react";
import Github from "../icons/Github";
import Linkedin from "../icons/Linkedin";
import { motion, useInView, useScroll, useTransform, useMotionValue, animate, type Variants } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import DownloadResumeButton from "../common/DownloadResumeButton";
import { TypewriterText } from "../common/TypeWriter";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { stats } from "@/lib/init";

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(motionValue, target, { duration: 1.8, ease: "easeOut" });
    return controls.stop;
  }, [isInView, target, motionValue]);

  return (
    <span ref={ref}>
      <motion.span >{rounded}</motion.span>
      {suffix}
    </span>
  );
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeLeftVariants: Variants = {
  hidden: { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

/* Floating background orb */
function Orb({ className }: { className: string }) {
  return (
    <motion.div
      className={`pointer-events-none absolute rounded-full blur-3xl opacity-20 ${className}`}
      animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const avatarY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const socials = [
    { href: "mailto:daotai.work@gmail.com", label: "Email", icon: Mail },
    { href: "https://github.com/DaoTai", label: "GitHub", icon: Github },
    { href: "https://www.linkedin.com/in/dao-tai-61757325a", label: "LinkedIn", icon: Linkedin },
  ];

  return (
    <section ref={sectionRef} id="about" className="relative scroll-mt-20">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-spotlight-hero opacity-60" />
      <Orb className="size-96 bg-violet-500 -top-20 -left-20" />
      <Orb className="size-72 bg-cyan-400 top-1/2 -right-16" />
      <Orb className="size-48 bg-indigo-500 bottom-10 left-1/4" />

      <div className="relative grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
        {/* Left — Text */}
        <motion.div
          className="order-2 space-y-8 md:order-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Greeting + name + role */}
          <div className="space-y-3">
            <motion.p
              variants={fadeUpVariants}
              className="text-sm flex items-center gap-2 font-semibold uppercase tracking-widest text-violet-500 dark:text-violet-400"
            >
              Hello world
              {/* Waving hand */}
              <motion.span
                animate={{ rotate: [0, 20, -10, 20, -5, 15, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
                style={{ display: "inline-block", transformOrigin: "70% 80%" }}
              >
                <Hand size={22} />
              </motion.span>
            </motion.p>

            <motion.div variants={fadeUpVariants}>
              <TypewriterText
                text="I'm Kendrick"
                className="font-display block text-5xl font-bold leading-tight text-gradient sm:text-6xl lg:text-7xl"
              />
            </motion.div>

            <motion.div variants={fadeUpVariants}>
              <TypewriterText
                text="Fullstack Developer"
                delayPerChar={0.06}
                className="inline-block rounded-full bg-gradient px-5 py-2 text-xl font-semibold text-white sm:text-2xl"
              />
            </motion.div>
          </div>

          {/* Bio */}
          <motion.p
            variants={fadeLeftVariants}
            className="relative text-xl leading-7 text-foreground/70 dark:text-foreground/75 pl-5 before:absolute before:left-0 before:top-1 before:bottom-1 before:w-0.5 before:rounded-full before:bg-gradient"
          >
          Full-stack Developer {" "}
            <span className="font-semibold text-foreground/90">scalable web experiences</span>{" "}
            with modern technologies, focused on{" "}
            <span className="font-semibold text-foreground/90">performance</span>,{" "}
            clean architecture, and intuitive user experiences.
          </motion.p>

          {/* Stats */}
          <motion.div
            variants={fadeUpVariants}
            className="grid grid-cols-3 gap-3"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.07, y: -5 }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
                className="group relative cursor-default overflow-hidden rounded-2xl border border-white/15 bg-white/5 dark:bg-white/5 p-4 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] backdrop-blur-md"
              >
                {/* Glass shine */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient opacity-0 group-hover:opacity-[0.08] transition-opacity duration-300" />
                {/* Bottom border glow */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <p className="font-display text-2xl font-bold text-gradient sm:text-4xl tabular-nums">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Socials */}
          <motion.div variants={fadeUpVariants} className="flex flex-wrap items-center gap-3">
            {socials.map((item, i) => (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.12, type: "spring", stiffness: 260, damping: 18 }}
                    whileHover={{ scale: 1.2, y: -3, rotate: 8 }}
                    whileTap={{ scale: 0.92 }}
                  >
                    <Link
                      href={item.href}
                      target="_blank"
                      className="flex size-11 items-center justify-center rounded-full bg-gradient text-white shadow-lg hover:shadow-violet-500/40 transition-shadow duration-300"
                    >
                      <item.icon size={20} />
                    </Link>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </motion.div>

          <motion.div variants={fadeUpVariants} className="flex flex-wrap items-center gap-3">
            <DownloadResumeButton className="border-violet-500/50 bg-gradient text-white hover:text-white" />
            <motion.button
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="group relative backdrop-blur-md flex items-center gap-2 overflow-hidden rounded-full border border-violet-500/40 bg-transparent px-7 py-3.5 text-base font-semibold text-violet-500 dark:text-violet-400 transition-colors duration-300 hover:border-violet-500 hover:text-violet-600 dark:hover:text-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            >
              {/* Subtle fill on hover */}
              <span className="absolute inset-0 rounded-full bg-violet-500/0 transition-colors duration-300 group-hover:bg-violet-500/8" />
              <span className="relative">View My Work</span>
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
               <ArrowRight size={20}/>
              </motion.span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right — Avatar */}
        <div className="order-1 flex justify-center md:order-2">
          <motion.div
            style={{ y: avatarY }}
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Pulsing outer glow rings */}
            {[1, 1.12, 1.22].map((scale, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full bg-gradient opacity-20"
                animate={{ scale: [scale, scale + 0.06, scale], opacity: [0.2, 0.08, 0.2] }}
                transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              />
            ))}

            {/* Orbiting dot */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 size-4 rounded-full bg-gradient shadow-lg shadow-violet-500/50" />
            </motion.div>

            {/* Counter-orbiting dot */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 size-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
            </motion.div>

            {/* Floating avatar */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Gradient ring */}
              <div className="rounded-full p-[3px] bg-gradient shadow-2xl shadow-violet-500/30">
                <Image
                  unoptimized
                  src="/avatar.png"
                  width={340}
                  height={340}
                  alt="avatar"
                  className="size-64 object-top rounded-full border-4 border-background object-cover drop-shadow-2xl sm:size-72 lg:size-80"
                />
              </div>

              {/* Role badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1.1, type: "spring", stiffness: 220, damping: 16 }}
                whileHover={{ scale: 1.05 }}
                className="absolute -bottom-3 flex items-center gap-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient px-4 py-2 text-xs font-bold text-white shadow-lg shadow-violet-500/30 cursor-default"
              >
                <Sparkle size={12} className="text-yellow-400 fill-yellow-500 animate-bounce" /> 
                Fullstack Developer
                 <Sparkle size={12} className="text-yellow-400 fill-yellow-500 animate-bounce" />
              </motion.div>

              {/* Status indicator */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="absolute top-4 -right-2 flex items-center gap-1.5 rounded-full border border-white/10 bg-background/80 px-3 py-1.5 text-xs font-medium backdrop-blur-sm shadow-md"
              >
                <motion.span
                  className="size-2 rounded-full bg-emerald-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                Available
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

    </section>
  );
};

export default About;
