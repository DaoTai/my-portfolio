"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { createPortal } from "react-dom";

import { AnimatedNumber, TWO_DIGITS } from "@/components/common/AnimatedNumber";
import { ImageLightbox } from "@/components/portfolio/ImageLightbox";
import { useSwipe } from "@/lib/hooks/useSwipe";
import { PROJECTS } from "@/lib/portfolio-data";

type ProjectModalProps = {
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

const CHIP =
  "rounded-full border border-[rgba(143,147,255,0.3)] bg-[rgba(143,147,255,0.08)] px-3 py-[5px] text-xs font-semibold text-pf-chip";

const SHOT_ARROW =
  "absolute top-1/2 z-10 grid h-9 w-9 flex-none -translate-y-1/2 place-items-center rounded-full border border-pf-ink/[0.18] bg-pf-base/[0.55] text-lg text-pf-text2 backdrop-blur-[8px] hover:border-pf-g2 hover:text-pf-text sm:top-[42%] sm:h-11 sm:w-11";

const FOOTER_BUTTON =
  "flex min-w-0 flex-[1_1_0] flex-col gap-1 bg-transparent px-5 py-4 hover:bg-pf-ink/[0.03] sm:px-8 sm:py-5";

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <span className="flex items-center gap-2.5 text-xs font-semibold text-pf-t7">
    <span className="h-px w-[18px] bg-pf-g2" />
    {children}
  </span>
);

const ProjectModal = ({ index, onClose, onNavigate }: ProjectModalProps) => {
  const [shot, setShot] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const total = PROJECTS.length;
  const project = PROJECTS[index];
  const imageCount = project.images.length;
  const multi = imageCount > 1;
  const prevName = PROJECTS[(index - 1 + total) % total].name;
  const nextName = PROJECTS[(index + 1) % total].name;

  const stepShot = useCallback(
    (d: number) => {
      setShot((s) => (s + d + imageCount) % imageCount);
    },
    [imageCount],
  );

  const closeZoom = useCallback(() => setZoomed(false), []);

  const swipe = useSwipe({
    onLeft: () => stepShot(1),
    onRight: () => stepShot(-1),
  });

  const stepProject = (d: number) => {
    setShot(0);
    onNavigate((index + d + total) % total);
  };

  // Lock body scroll while the modal is open.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Escape closes the lightbox first, then the modal; arrow keys step through the screenshots.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (zoomed) closeZoom();
        else onClose();
      }
      if (e.key === "ArrowRight") stepShot(1);
      if (e.key === "ArrowLeft") stepShot(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomed, closeZoom, onClose, stepShot]);

  // A new project starts at the top.
  useEffect(() => {
    overlayRef.current?.scrollTo({ top: 0 });
  }, [index]);

  // Keep the active thumbnail centred in the strip. Scrolls the strip only, never the page.
  useEffect(() => {
    const strip = thumbsRef.current;
    const thumb = strip?.children[shot] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    strip.scrollTo({
      left: thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [shot, index]);

  const stop = (e: MouseEvent) => e.stopPropagation();

  // Portal to <body> so the fixed overlay escapes any ancestor stacking context.
  return createPortal(
    <div
      ref={overlayRef}
      onClick={onClose}
      className="fixed inset-0 z-[100] animate-[dcFade_.2s_ease-out] overflow-y-auto overscroll-contain bg-[rgba(3,4,9,0.8)] backdrop-blur-[12px] sm:flex sm:justify-center sm:px-5 sm:py-8"
    >
      <article
        onClick={stop}
        role="dialog"
        aria-modal="true"
        aria-label={project.name}
        className="min-h-full w-full animate-[dcPop_.3s_cubic-bezier(.2,.8,.2,1)] overflow-clip bg-pf-bg3 sm:my-auto sm:min-h-0 sm:max-w-[1120px] sm:rounded-3xl sm:border sm:border-[rgba(160,170,255,0.25)] sm:shadow-[0_50px_120px_-40px_rgba(110,116,255,0.55)]"
      >
        {/* Sticky on mobile so Close stays reachable while reading. */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-pf-ink/[0.06] px-4 pb-2.5 pt-[max(10px,env(safe-area-inset-top))] backdrop-blur-[12px] [background:color-mix(in_srgb,var(--bg2)_85%,transparent)] sm:static sm:border-0 sm:px-6 sm:pb-3.5 sm:pt-[18px] sm:backdrop-blur-none sm:[background:var(--bg2)]">
          <Eyebrow>
            Project <AnimatedNumber value={index + 1} format={TWO_DIGITS} /> /{" "}
            <AnimatedNumber value={total} format={TWO_DIGITS} />
          </Eyebrow>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-10 w-10 place-items-center rounded-full border border-pf-ink/[0.14] bg-pf-ink/[0.03] text-pf-text2 hover:border-pf-g2 hover:text-pf-text sm:h-9 sm:w-9"
          >
            <X size={14} strokeWidth={2.4} aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col gap-3 border-b border-pf-ink/[0.06] px-3 pb-4 pt-3 [background:radial-gradient(ellipse_60%_70%_at_85%_0%,rgba(143,147,255,0.16),transparent_70%),var(--bg2)] sm:gap-3.5 sm:px-5 sm:pb-5 sm:pt-0">
          <div className="relative">
            <div
              {...swipe}
              className="relative aspect-[16/10] touch-pan-y overflow-hidden rounded-xl border border-pf-ink/[0.08] bg-pf-tilebg sm:aspect-[16/8] sm:rounded-2xl"
            >
              <button
                type="button"
                onClick={() => setZoomed(true)}
                aria-label="View image fullscreen"
                className="absolute inset-0 cursor-zoom-in"
              >
                <Image
                  src={project.images[shot]}
                  alt={`${project.name} screenshot`}
                  fill
                  sizes="(max-width: 1160px) 100vw, 1080px"
                  className="object-cover object-top"
                />
              </button>
              <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(180deg,rgba(var(--base2),0)_40%,rgba(var(--base2),0.55)_70%,rgba(var(--base2),0.96)_100%)] sm:block" />
              <span className="pointer-events-none absolute right-2.5 top-2.5 z-10 flex items-center gap-1.5 rounded-full border border-pf-ink/[0.12] bg-pf-base/60 px-2.5 py-1 font-display text-xs text-pf-t3 backdrop-blur-[8px] sm:right-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[13px]">
                <Maximize2 size={12} strokeWidth={2.2} aria-hidden="true" />
                <AnimatedNumber value={shot + 1} format={TWO_DIGITS} /> /{" "}
                <AnimatedNumber value={imageCount} format={TWO_DIGITS} />
              </span>
              {multi && (
                <>
                  <button
                    type="button"
                    onClick={() => stepShot(-1)}
                    aria-label="Previous image"
                    className={`${SHOT_ARROW} left-2.5 sm:left-4`}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => stepShot(1)}
                    aria-label="Next image"
                    className={`${SHOT_ARROW} right-2.5 sm:right-4`}
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Below the image on mobile, overlaid on it from sm up. */}
            <div className="mt-4 flex min-w-0 items-center gap-3 px-1 sm:pointer-events-none sm:absolute sm:inset-x-0 sm:bottom-0 sm:z-10 sm:mt-0 sm:gap-4 sm:px-7 sm:py-6">
              <span className="h-12 w-12 flex-none rounded-[14px] bg-[linear-gradient(135deg,var(--g1),var(--g2)_50%,var(--g3))] p-[1.5px] shadow-[0_0_30px_rgba(var(--pop-glow),0.4)] sm:h-[60px] sm:w-[60px] sm:rounded-2xl">
                <span className="grid h-full w-full place-items-center overflow-hidden rounded-[12.5px] bg-pf-tilebg sm:rounded-[15px]">
                  {project.logo ? (
                    <Image
                      src={project.logo}
                      alt=""
                      width={36}
                      height={36}
                      className="h-7 w-7 object-contain sm:h-9 sm:w-9"
                    />
                  ) : (
                    <span className="font-display text-lg font-bold text-pf-text sm:text-[22px]">
                      {project.name[0]}
                    </span>
                  )}
                </span>
              </span>
              <div className="flex min-w-0 flex-col gap-2">
                <h3 className="m-0 font-display text-[clamp(24px,3.4vw,42px)] font-semibold leading-none tracking-[-0.03em] text-pf-text">
                  {project.name}
                </h3>
                <span className={`self-start ${CHIP}`}>{project.role}</span>
              </div>
            </div>
          </div>

          {multi && (
            <div
              ref={thumbsRef}
              className="scrollbar-none relative -mx-3 flex snap-x gap-2 overflow-x-auto px-3 py-0.5 sm:mx-0 sm:gap-2.5 sm:px-0.5"
            >
              {project.images.map((src, j) => {
                const active = j === shot;
                return (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setShot(j)}
                    aria-label={`Image ${j + 1}`}
                    aria-current={active}
                    className={`relative h-12 w-20 flex-none snap-center overflow-hidden rounded-lg bg-pf-tilebg p-0 transition-[opacity,box-shadow] duration-200 sm:h-16 sm:w-28 sm:rounded-[10px] ${
                      active
                        ? "border-[1.5px] border-pf-g2 opacity-100 shadow-[0_0_16px_rgba(143,147,255,0.45)]"
                        : "border border-pf-ink/[0.1] opacity-50 hover:opacity-80"
                    }`}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="112px"
                      className="block object-cover object-top"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-start gap-7 px-5 pb-8 pt-6 sm:gap-8 sm:px-8 sm:pt-9">
          <div className="flex min-w-0 flex-[1.7_1_440px] flex-col gap-6 sm:gap-7">
            <p className="m-0 text-pretty text-[15.5px] leading-[1.7] text-pf-t3 sm:text-[17px]">
              {project.summary}
            </p>
            <div className="flex flex-col gap-1.5">
              <Eyebrow>My Responsibilities</Eyebrow>
              <ol className="m-0 mt-2.5 flex list-none flex-col p-0">
                {project.responsibilities.map((text, j) => (
                  <li
                    key={j}
                    className="grid grid-cols-[32px_minmax(0,1fr)] gap-2 border-t border-pf-ink/[0.06] py-[13px] sm:grid-cols-[40px_minmax(0,1fr)]"
                  >
                    <span className="pt-0.5 font-display text-xs font-semibold text-pf-g2">
                      <AnimatedNumber value={j + 1} format={TWO_DIGITS} />
                    </span>
                    <span className="text-pretty text-[14.5px] leading-[1.6] text-pf-t4">
                      {text}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="flex min-w-0 flex-[1_1_300px] flex-col gap-4">
            <div className="flex flex-col gap-4 rounded-2xl border border-pf-ink/[0.08] bg-[linear-gradient(180deg,rgba(var(--ink),0.035),rgba(var(--ink),0.01))] p-5 sm:p-[22px]">
              <Eyebrow>At a Glance</Eyebrow>
              <div className="flex justify-between gap-3 text-[13px]">
                <span className="text-pf-t7">Role</span>
                <span className="text-right font-semibold text-pf-text">
                  {project.role}
                </span>
              </div>
              <div className="h-px bg-pf-ink/[0.06]" />
              <div className="flex flex-col gap-2.5">
                <span className="text-[13px] text-pf-t7">Core stack</span>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className={CHIP}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative flex flex-col gap-3.5 overflow-hidden rounded-2xl border border-[rgba(160,170,255,0.25)] p-5 [background:radial-gradient(circle_at_115%_-10%,rgba(160,180,255,0.28)_0%,rgba(60,70,140,0.18)_30%,transparent_55%),var(--bg3)] sm:p-[22px]">
              <Eyebrow>Technical Highlights</Eyebrow>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {project.highlights.map((hl, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2.5 text-[13.5px] leading-[1.5] text-pf-t3"
                  >
                    <span className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-[linear-gradient(135deg,var(--g1),var(--g3))] shadow-[0_0_8px_rgba(var(--pop-glow),0.8)]" />
                    {hl}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <div className="flex border-t border-pf-ink/[0.06] pb-[env(safe-area-inset-bottom)] sm:pb-0">
          <button
            type="button"
            onClick={() => stepProject(-1)}
            className={`${FOOTER_BUTTON} border-r border-pf-ink/[0.06] text-left`}
          >
            <span className="text-[11px] tracking-[0.12em] text-pf-t7">
              ← PREVIOUS
            </span>
            <span className="max-w-full truncate font-display text-[15px] font-semibold text-pf-text sm:text-base">
              {prevName}
            </span>
          </button>
          <button
            type="button"
            onClick={() => stepProject(1)}
            className={`${FOOTER_BUTTON} items-end text-right`}
          >
            <span className="text-[11px] tracking-[0.12em] text-pf-t7">
              NEXT →
            </span>
            <span className="max-w-full truncate font-display text-[15px] font-semibold text-pf-text sm:text-base">
              {nextName}
            </span>
          </button>
        </div>

        {zoomed && (
          <ImageLightbox
            images={project.images}
            index={shot}
            alt={project.name}
            onClose={closeZoom}
            onStep={stepShot}
          />
        )}
      </article>
    </div>,
    document.body,
  );
};

export default ProjectModal;
