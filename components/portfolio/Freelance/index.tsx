import { LinkedinIcon, TelegramIcon } from "@/components/common/BrandIcons";
import { Reveal } from "@/components/common/Reveal";
import { TiltCard } from "@/components/common/TiltCard";
import { siteConfig } from "@/lib/config";
import { gmailComposeUrl } from "@/lib/contact";
import {
  ArrowRight,
  Clock,
  Globe2,
  LayoutDashboard,
  Rocket,
  Smartphone,
  Wallet,
} from "lucide-react";
import type { ElementType } from "react";
import "./Freelance.css";

const SECTION_BG = {
  background:
    "radial-gradient(ellipse 55% 70% at 85% 30%, rgba(var(--glow3),0.12), transparent 70%), radial-gradient(ellipse 40% 50% at 5% 90%, rgba(52,211,153,0.07), transparent 70%), var(--bg)",
};

const SERVICES: { icon: ElementType; title: string; desc: string }[] = [
  {
    icon: Rocket,
    title: "MVP & Startup apps",
    desc: "From idea to a launch-ready product in weeks, built to scale past v1.",
  },
  {
    icon: Smartphone,
    title: "Web apps & PWAs",
    desc: "Fast, responsive Next.js apps that feel native on every device.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboards & CMS",
    desc: "Admin panels, booking engines and internal tools with clean APIs.",
  },
  {
    icon: Wallet,
    title: "Web3 & real-time",
    desc: "Wallet login, on-chain flows, live trading data and chat.",
  },
];

const STEPS = ["Discuss", "Plan & quote", "Build & demo", "Launch & support"];

const PROJECT_BRIEF_HREF = gmailComposeUrl({
  subject: "Freelance project inquiry",
  body: [
    "Hi Tai,",
    "",
    "I'd like to build an app with you.",
    "",
    "• What it does: ",
    "• Platform (web / mobile / Web3): ",
    "• Timeline: ",
    "• Budget range: ",
    "",
    "Thanks!",
  ].join("\n"),
});

const QUICK_CONTACTS = [
  {
    href: siteConfig.links.telegram,
    label: "Telegram",
    icon: <TelegramIcon size={15} />,
  },
  {
    href: siteConfig.links.linkedin,
    label: "LinkedIn",
    icon: <LinkedinIcon size={15} />,
  },
];

const Freelance = () => {
  return (
    <section
      id="hire"
      data-screen-label="Freelance"
      style={SECTION_BG}
      className="relative overflow-hidden border-t border-pf-ink/[0.06]"
    >
      <div className="relative mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-10 px-8 pb-20 pt-[88px]">
        <Reveal className="flex flex-col gap-5">
          <span className="freelance-badge flex items-center gap-2.5 self-start rounded-full border border-[rgba(52,211,153,0.35)] bg-[rgba(52,211,153,0.08)] px-3.5 py-1.5 text-xs font-semibold text-pf-text">
            <span className="freelance-dot" aria-hidden="true" />
            Available for freelance
          </span>

          <h2 className="m-0 max-w-[520px] font-display text-[clamp(30px,3.6vw,44px)] font-semibold leading-[1.15] tracking-[-0.025em] text-pf-text">
            Got an app idea?{" "}
            <span className="bg-[linear-gradient(100deg,var(--g1)_0%,var(--g2)_45%,var(--g3)_100%)] bg-clip-text text-transparent">
              Let’s build it together.
            </span>
          </h2>

          <p className="m-0 max-w-[480px] text-[15px] leading-[1.65] text-pf-t6 [text-wrap:pretty]">
            I take on freelance and contract projects end to end: product
            scoping, UI, API, deployment and handover. You get one engineer who
            owns the whole stack and ships on schedule.
          </p>

          <ol className="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-2 p-0 text-xs font-semibold text-pf-t5">
            {STEPS.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span className="grid size-5 place-items-center rounded-full border border-pf-ink/[0.14] text-[10px] text-pf-g2">
                  {i + 1}
                </span>
                {step}
                {i < STEPS.length - 1 && (
                  <span aria-hidden="true" className="h-px w-4 bg-pf-ink/15" />
                )}
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href={PROJECT_BRIEF_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 rounded-[10px] bg-pf-text px-6 py-3 text-sm font-bold text-pf-bg [transition:background-color_.3s,box-shadow_.3s] hover:bg-pf-invhover hover:text-pf-bg hover:shadow-[0_14px_40px_-10px_rgba(var(--glow3),0.8)]"
            >
              Start a project
              <ArrowRight
                aria-hidden="true"
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
            {QUICK_CONTACTS.map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-[10px] border border-pf-ink/[0.14] px-4 py-3 text-sm font-semibold text-pf-text2 [transition:border-color_.2s,color_.2s,background-color_.2s] hover:border-pf-g2 hover:bg-pf-ink/[0.04] hover:text-pf-text"
              >
                {icon}
                {label}
              </a>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-pf-t7">
            <span className="flex items-center gap-1.5">
              <Clock aria-hidden="true" size={13} /> Replies within 24h
            </span>
            <span className="flex items-center gap-1.5">
              <Globe2 aria-hidden="true" size={13} /> Remote · GMT+7
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <TiltCard
            max={5}
            className="grid grid-cols-1 gap-3 rounded-[18px] border border-pf-ink/10 bg-pf-ink/[0.025] p-4 shadow-[0_30px_70px_-34px_rgba(var(--glow3),0.5)] sm:grid-cols-2 sm:p-5"
          >
            {SERVICES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-col gap-2.5 rounded-xl border border-pf-ink/[0.07] bg-[linear-gradient(180deg,rgba(var(--ink),0.045),rgba(var(--ink),0.012))] p-4 [transform:translateZ(24px)] [transition:border-color_.25s] hover:border-[rgba(143,147,255,0.4)]"
              >
                <span className="grid size-9 place-items-center rounded-[10px] border border-[rgba(143,147,255,0.3)] bg-[rgba(143,147,255,0.08)] text-pf-chip">
                  <Icon aria-hidden="true" size={17} />
                </span>
                <span className="font-display text-[15px] font-semibold text-pf-text">
                  {title}
                </span>
                <p className="m-0 text-[13px] leading-[1.55] text-pf-t6">
                  {desc}
                </p>
              </div>
            ))}
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
};

export default Freelance;
