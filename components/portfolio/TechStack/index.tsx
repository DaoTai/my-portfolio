"use client";

import Image from "next/image";
import { memo, useCallback, useState, type CSSProperties } from "react";
import { CategoryIcon, categoryRgb } from "@/components/common/CategoryIcon";
import { Reveal } from "@/components/common/Reveal";
import { TiltCard } from "@/components/common/TiltCard";
import TechModal, { type TechDetail } from "@/components/portfolio/TechModal";
import {
  TECH_DESCRIPTIONS,
  TECH_GROUPS,
  type Tech,
  type TechGroup,
} from "@/lib/portfolio-data";
import { TechStackBackground } from "./TechStackBackground";

type TechGroupCardProps = {
  group: TechGroup;
  onOpen: (t: Tech, g: TechGroup) => void;
};

const TechGroupCard = memo(({ group: g, onOpen }: TechGroupCardProps) => (
  <TiltCard
    className="flex h-full w-full flex-col gap-[22px] rounded-2xl border border-pf-ink/[0.08] bg-[linear-gradient(180deg,rgba(var(--ink),0.045),rgba(var(--ink),0.012))] p-[22px] shadow-[0_24px_60px_-30px_rgba(var(--glow2),0.9)] transition-colors duration-300 hover:border-[rgba(var(--cat),0.35)]"
    style={{ "--cat": categoryRgb(g.code) } as CSSProperties}
  >
    <div className="flex items-start gap-3 [transform-style:preserve-3d]">
      <CategoryIcon code={g.code} className="[transform:translateZ(36px)]" />
      <div className="flex flex-col gap-1 [transform:translateZ(18px)]">
        <span className="font-display text-[15px] font-semibold text-pf-text">
          {g.title}
        </span>
        <span className="text-xs leading-normal text-pf-t7">{g.desc}</span>
      </div>
    </div>
    <div className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-x-2 gap-y-4 [transform-style:preserve-3d]">
      {g.items.map((t) => (
        <button
          key={t.name}
          type="button"
          onClick={() => onOpen(t, g)}
          className="group/tile flex cursor-pointer flex-col items-center gap-2 [transform:translateZ(14px)] [transition:transform_.35s_cubic-bezier(.22,1,.36,1)] hover:[transform:translateZ(44px)_translateY(-4px)]"
        >
          <span className="grid size-[46px] place-items-center overflow-hidden rounded-xl border border-pf-ink/[0.08] bg-pf-tilebg shadow-[inset_0_1px_0_rgba(var(--ink),0.06)] transition-[border-color,box-shadow] duration-300 group-hover/tile:border-[rgba(var(--cat),0.5)] group-hover/tile:shadow-[0_12px_28px_-10px_rgba(var(--cat),0.75)]">
            <Image
              src={t.img}
              alt=""
              width={26}
              height={26}
              className="size-[26px] rounded object-contain"
            />
          </span>
          <span className="text-center text-[11px] leading-[1.3] text-pf-t5 transition-colors group-hover/tile:text-pf-text">
            {t.name}
          </span>
        </button>
      ))}
    </div>
  </TiltCard>
));
TechGroupCard.displayName = "TechGroupCard";

const TechStack = () => {
  const [tech, setTech] = useState<TechDetail | null>(null);

  const openTech = useCallback(
    (t: Tech, g: TechGroup) =>
      setTech({
        ...t,
        group: g.title,
        code: g.code,
        desc: TECH_DESCRIPTIONS[t.name] ?? "",
      }),
    [],
  );
  const closeTech = useCallback(() => setTech(null), []);

  return (
    <section
      id="stack"
      data-screen-label="Tech Stack"
      className="relative overflow-hidden border-t border-pf-ink/[0.06] bg-pf-bg2"
    >
      <TechStackBackground />
      <div className="relative mx-auto flex max-w-[1240px] flex-col gap-10 px-8 pb-24 pt-[88px]">
        <Reveal className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-end gap-6">
          <div className="flex flex-col gap-3.5">
            <span className="flex items-center gap-2.5 text-xs font-semibold text-pf-t7">
              <span className="h-px w-[18px] bg-pf-g2" />
              Tech Stack
            </span>
            <h2 className="m-0 font-display text-[length:clamp(34px,4vw,48px)] font-semibold tracking-[-0.025em] text-pf-text">
              I Work{" "}
              <span className="bg-[linear-gradient(100deg,var(--g1)_0%,var(--g2)_45%,var(--g3)_100%)] bg-clip-text text-transparent">
                With
              </span>
            </h2>
          </div>
          <p className="m-0 max-w-[440px] text-[15px] leading-[1.65] text-pf-t6">
            Technologies and tools I use to ship real-time systems, Web3
            platforms and production web apps.
          </p>
        </Reveal>

        <div className="flex flex-wrap gap-4">
          {TECH_GROUPS.map((g, k) => (
            <Reveal
              key={g.code}
              delay={(k % 4) * 0.08}
              className="flex min-w-0 flex-[1_1_260px]"
            >
              <TechGroupCard group={g} onOpen={openTech} />
            </Reveal>
          ))}
          <Reveal delay={0.16} className="flex min-w-0 flex-[1_1_260px]">
            <TiltCard
              max={10}
              className="group flex min-h-[200px] w-full flex-col justify-between gap-10 rounded-2xl border border-[rgba(160,170,255,0.25)] p-[26px] shadow-[0_30px_70px_-30px_rgba(var(--glow3),0.6)]"
              style={{
                background:
                  "radial-gradient(circle at 115% -10%, rgba(var(--glow),0.35) 0%, rgba(var(--glow2),0.25) 30%, transparent 55%), linear-gradient(200deg, rgba(var(--base),0) 30%, rgba(var(--base),0.85) 80%), var(--hero-img) right bottom / cover no-repeat, var(--bg3)",
              }}
            >
              <span
                aria-hidden="true"
                className="grid size-[34px] place-items-center rounded-full border border-pf-ink/20 bg-pf-base/40 text-pf-text [transform:translateZ(40px)] [transition:transform_.35s] group-hover:[transform:translateZ(40px)_translateX(6px)]"
              >
                →
              </span>
              <p className="m-0 font-display text-xl font-semibold leading-[1.35] text-pf-text [transform:translateZ(28px)]">
                Better tools.
                <br />
                Better products.
                <br />
                <span className="text-pf-accent">That’s the goal.</span>
              </p>
            </TiltCard>
          </Reveal>
        </div>
      </div>

      {tech && <TechModal tech={tech} onClose={closeTech} />}
    </section>
  );
};

export default TechStack;
