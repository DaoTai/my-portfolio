"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Tech } from "@/lib/portfolio-data";

export type TechDetail = Tech & {
  group: string;
  code: string;
  desc: string;
};

type TechModalProps = {
  tech: TechDetail;
  onClose: () => void;
};

export default function TechModal({ tech, onClose }: TechModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Lock page scroll while open, close on Escape, focus the close button.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] grid animate-[dcFade_.2s_ease-out] place-items-center bg-[rgba(3,4,9,0.72)] p-6 backdrop-blur-[10px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={tech.name}
        className="relative w-full max-w-[420px] animate-[dcPop_.28s_cubic-bezier(.2,.8,.2,1)] overflow-hidden rounded-[20px] border border-[rgba(160,170,255,0.25)] bg-pf-bg3 shadow-[0_40px_100px_-30px_rgba(110,116,255,0.5)]"
      >
        <div
          className="relative h-[132px] border-b border-pf-ink/[0.06]"
          style={{
            background:
              "radial-gradient(circle at 100% -20%, rgba(160,180,255,0.32) 0%, rgba(60,70,140,0.2) 35%, transparent 60%), radial-gradient(ellipse 60% 80% at 0% 100%, rgba(125,211,252,0.1), transparent 70%), var(--bg4)",
          }}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3.5 top-3.5 grid size-[34px] cursor-pointer place-items-center rounded-full border border-pf-ink/[0.14] bg-pf-base/60 text-pf-text2 hover:border-pf-g2 hover:text-pf-text"
          >
            <X size={14} strokeWidth={2.4} aria-hidden="true" />
          </button>
          <span className="absolute left-[18px] top-4 flex items-center gap-2.5 text-xs font-semibold text-pf-t7">
            <span className="h-px w-[18px] bg-pf-g2" />
            Tech Stack
          </span>
          <div className="absolute bottom-[-46px] left-1/2 size-24 -translate-x-1/2 rounded-full bg-[linear-gradient(135deg,var(--g1),var(--g2)_50%,var(--g3))] p-0.5 shadow-[0_0_40px_rgba(var(--pop-glow),0.45)]">
            <div className="grid size-full place-items-center rounded-full border-4 border-pf-bg3 bg-pf-tilebg">
              <Image
                src={tech.img}
                alt=""
                width={46}
                height={46}
                className="size-[46px] rounded-md object-contain"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3.5 px-[30px] pb-[30px] pt-[62px] text-center">
          <span className="font-display text-[22px] font-semibold tracking-[-0.02em] text-pf-text">
            {tech.name}
          </span>
          <div className="flex items-center gap-2">
            <span className="grid size-[26px] place-items-center rounded-lg border border-[rgba(143,147,255,0.3)] bg-[rgba(143,147,255,0.14)] font-display text-[10px] font-bold text-pf-tile">
              {tech.code}
            </span>
            <span className="rounded-full border border-[rgba(143,147,255,0.3)] bg-[rgba(143,147,255,0.08)] px-3 py-[5px] text-xs font-semibold text-pf-chip">
              {tech.group}
            </span>
          </div>
          <p className="mt-1 text-[15px] leading-[1.65] text-pf-t4 [text-wrap:pretty]">
            {tech.desc}
          </p>
        </div>
      </div>
    </div>
  );
}
