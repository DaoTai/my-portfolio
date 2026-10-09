import Image from "next/image";
import type { ReactNode } from "react";
import { AnimatedNumber } from "@/components/common/AnimatedNumber";
import { CategoryIcon } from "@/components/common/CategoryIcon";
import { Reveal } from "@/components/common/Reveal";
import { TiltCard } from "@/components/common/TiltCard";
import { TypewriterText } from "@/components/common/TypeWriter";
import { ExpertiseBackground } from "./ExpertiseBackground";
import "./Expertise.css";

const STATS = [
  { value: 4, label: "Years" },
  { value: 9, label: "Projects" },
  { value: 22, label: "Tech" },
];

const AREAS = [
  {
    code: "FE",
    title: "Frontend Engineering",
    desc: "Next.js and React apps built for heavy, fast-changing data: trading terminals, flight booking and admin CMSs kept smooth with virtualization, memoization and React 19 transitions.",
    chips: [
      "React / Next.js",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "TanStack",
    ],
  },
  {
    code: "BE",
    title: "Node.js & Backend",
    desc: "NestJS and Express services: REST APIs, WebSocket gateways, RabbitMQ queues, Redis caching and cron-driven data sync, containerized with Docker.",
    chips: ["NestJS", "Express", "Prisma", "Socket.io", "RabbitMQ", "Redis"],
  },
  {
    code: "W3",
    title: "Web3 & Real-time",
    desc: "Wallet auth, on-chain bidding and multi-chain trading across Solana, EVM and TON, plus live socket streams for markets, chat and video calls.",
    chips: ["Solana", "BNB / EVM", "TON", "viem / Privy", "WebRTC"],
  },
];

const ExpertiseChip = ({ children }: { children: ReactNode }) => (
  <span className="rounded-full border border-[rgba(143,147,255,0.3)] bg-[rgba(143,147,255,0.08)] px-3 py-[5px] text-xs font-semibold text-pf-chip">
    {children}
  </span>
);

const Expertise = () => {
  return (
    <section
      id="about"
      data-screen-label="Expertise"
      className="relative overflow-hidden border-t border-pf-ink/[0.06]"
      style={{
        background:
          "radial-gradient(ellipse 50% 60% at 90% 20%, rgba(110,116,255,0.1), transparent 70%), var(--bg)",
      }}
    >
      <ExpertiseBackground />
      <div className="relative mx-auto flex max-w-[1240px] flex-col gap-10 px-8 pb-24 pt-[88px]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-10">
          <Reveal className="flex flex-col gap-3.5">
            <span className="flex items-center gap-2.5 text-xs font-semibold text-pf-t7">
              <span className="h-px w-[18px] bg-pf-g2" />
              About Me
            </span>
            <h2 className="m-0 font-display text-[length:clamp(34px,4vw,48px)] font-semibold tracking-[-0.025em] text-pf-text">
              My{" "}
              <span className="bg-[linear-gradient(100deg,var(--g1)_0%,var(--g2)_45%,var(--g3)_100%)] bg-clip-text text-transparent">
                Expertise
              </span>
            </h2>
            <p className="m-0 max-w-[440px] text-[15px] leading-[1.65] text-pf-t6 [text-wrap:pretty]">
              4+ years of full-stack TypeScript and JavaScript work across 13
              projects: performance-tuned React frontends, Node.js and NestJS
              backends, and Web3 integrations on Solana, BNB Chain, EVM and TON.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <TiltCard
              max={5}
              className="grid grid-cols-1 gap-7 rounded-2xl border border-[rgba(160,170,255,0.25)] p-[26px] shadow-[0_30px_70px_-30px_rgba(var(--glow3),0.55)] sm:grid-cols-[minmax(0,1fr)_auto]"
              style={{
                background:
                  "radial-gradient(circle at 110% -20%, rgba(160,180,255,0.28) 0%, rgba(60,70,140,0.18) 30%, transparent 55%), var(--bg3)",
              }}
            >
              <div className="flex flex-col gap-3.5 [transform:translateZ(24px)]">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="grid size-[34px] place-items-center rounded-[10px] border border-pf-ink/[0.08] bg-pf-tilebg">
                    <Image
                      src="/node-js.webp"
                      alt=""
                      width={22}
                      height={22}
                      className="size-[22px] object-contain"
                    />
                  </span>
                  <span className="font-display text-base font-semibold text-pf-text">
                    Software Engineer
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ExpertiseChip>Twendee · 2024 – Present</ExpertiseChip>
                  <ExpertiseChip>Full-Stack</ExpertiseChip>
                </div>
                <p className="m-0 text-sm leading-[1.65] text-pf-t4 [text-wrap:pretty]">
                  <TypewriterText
                    text="Building trading platforms, real-time systems, admin CMSs and Web3 products for international clients, owning features from UI and API integration through on-chain flows to Docker-based deployment."
                    delayPerChar={0.01}
                  />
                </p>
              </div>
              <div className="flex flex-row justify-between gap-3 border-t border-pf-ink/[0.08] pt-5 text-center [transform:translateZ(36px)] sm:flex-col sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                {STATS.map((s, i) => (
                  <div key={s.label}>
                    <div className="font-display text-[22px] font-semibold text-pf-text">
                      <AnimatedNumber
                        value={s.value}
                        countUp
                        delay={i * 0.15}
                      />
                      <span className="text-pf-g2">+</span>
                    </div>
                    <div className="text-[11px] text-pf-t7">{s.label}</div>
                  </div>
                ))}
              </div>
            </TiltCard>
          </Reveal>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
          {AREAS.map((a, k) => (
            <Reveal key={a.code} delay={k * 0.08} className="flex">
              <TiltCard className="flex w-full flex-col gap-[18px] rounded-2xl border border-pf-ink/[0.08] bg-[linear-gradient(180deg,rgba(var(--ink),0.045),rgba(var(--ink),0.012))] p-[22px] shadow-[0_24px_60px_-30px_rgba(var(--glow2),0.9)]">
                <div className="flex items-center gap-3 [transform-style:preserve-3d]">
                  <CategoryIcon
                    code={a.code}
                    className="[transform:translateZ(36px)]"
                  />
                  <span className="font-display text-[15px] font-semibold text-pf-text">
                    {a.title}
                  </span>
                </div>
                <p className="m-0 text-sm leading-[1.6] text-pf-t6">{a.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {a.chips.map((c) => (
                    <ExpertiseChip key={c}>{c}</ExpertiseChip>
                  ))}
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Expertise;
