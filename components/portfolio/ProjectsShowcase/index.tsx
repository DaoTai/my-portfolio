"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import dynamic from "next/dynamic";
import { MotionConfig, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { AnimatedNumber, TWO_DIGITS } from "@/components/common/AnimatedNumber";
import { Reveal } from "@/components/common/Reveal";
import { PROJECTS } from "@/lib/portfolio-data";
import { CosmicBackground } from "./CosmicBackground";
import { ProjectsBackground } from "./ProjectsBackground";
import { ProjectCarousel } from "./ProjectCarousel";
import { ProjectDetail } from "./ProjectDetail";
import "./ProjectsShowcase.css";

// Only fetched once a project is opened, keeping the modal and lightbox out of the first load.
const ProjectModal = dynamic(() => import("@/components/portfolio/ProjectModal"));

type ProjectsShowcaseProps = {
  autoplay?: boolean;
};

// The View Transitions API isn't in the DOM lib types yet; narrow to just what we call.
type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

const HERO_VT_NAME = "project-hero";
const AUTOPLAY_MS = 5000;

const NAV_BUTTON =
  "grid h-11 w-11 flex-none select-none place-items-center rounded-full border border-pf-ink/[0.18] bg-pf-ink/[0.04] text-pf-text2 backdrop-blur-md transition-[border-color,color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-pf-g2 hover:text-pf-text hover:shadow-[0_10px_30px_-10px_rgba(var(--glow3),0.9)]";

const ProjectsShowcase = ({ autoplay = false }: ProjectsShowcaseProps) => {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  // The detail panel's preview image: the default morph source/target for the modal hero.
  const heroRef = useRef<HTMLButtonElement>(null);
  // Element the modal was opened from (and for which project), so closing can morph back to it.
  const morphFrom = useRef<{ el: HTMLElement; k: number } | null>(null);

  const n = PROJECTS.length;
  const cur = PROJECTS[i];
  const nextP = PROJECTS[(i + 1) % n];

  const go = useCallback(
    (d: number) => {
      setDir(d);
      setI((s) => (s + d + n) % n);
    },
    [n],
  );
  const goPrev = useCallback(() => go(-1), [go]);
  const goNext = useCallback(() => go(1), [go]);
  const goTo = useCallback(
    (k: number) => {
      setDir(k >= i ? 1 : -1);
      setI(k);
    },
    [i],
  );

  // Grow the clicked image into the modal hero (and shrink it back on close) when the
  // browser supports view transitions and the viewer hasn't asked for reduced motion.
  // The modal hero always carries the name (`.vt-project-hero`), so only one side may hold it
  // per snapshot: opening names the card in the old state and frees it once the modal mounts;
  // closing names the card only in the new state, after the modal (and its hero) is gone.
  const withHeroMorph = useCallback(
    (el: HTMLElement | null, apply: () => void, closing = false) => {
      const doc = document as ViewTransitionDocument;
      if (reduce || !el || !doc.startViewTransition) {
        apply();
        return;
      }
      if (!closing) el.style.setProperty("view-transition-name", HERO_VT_NAME);
      const transition = doc.startViewTransition(() => {
        flushSync(apply);
        if (closing) el.style.setProperty("view-transition-name", HERO_VT_NAME);
        else el.style.removeProperty("view-transition-name");
      });
      transition.finished.finally(() => {
        el.style.removeProperty("view-transition-name");
      });
    },
    [reduce],
  );

  const openCur = useCallback(
    (source?: HTMLElement) => {
      const el = source ?? heroRef.current;
      morphFrom.current = el ? { el, k: i } : null;
      withHeroMorph(el, () => setModalIndex(i));
    },
    [i, withHeroMorph],
  );
  const openFromDetail = useCallback(() => openCur(), [openCur]);

  const closeModal = useCallback(() => {
    const from = morphFrom.current;
    // Morph back into the card it came from if it still shows that project, else the preview.
    const el = from && from.k === modalIndex && from.el.isConnected ? from.el : heroRef.current;
    withHeroMorph(el, () => setModalIndex(null), true);
  }, [modalIndex, withHeroMorph]);

  // Keep the carousel on the project the modal is showing, so the close morph and the
  // counter land on the right card.
  const navigateModal = useCallback(
    (k: number) => {
      goTo(k);
      setModalIndex(k);
    },
    [goTo],
  );

  useEffect(() => {
    if (!autoplay || modalIndex !== null) return;
    const t = setInterval(goNext, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [autoplay, goNext, modalIndex]);

  return (
    <section
      id="projects"
      data-screen-label="Projects"
      className="relative overflow-hidden border-t border-pf-ink/[0.06] bg-pf-bg2"
    >
      <ProjectsBackground />
      <CosmicBackground />

      <MotionConfig reducedMotion="user">
        <div className="relative mx-auto flex max-w-[1240px] flex-col px-5 pt-[88px] sm:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-4">
            <Reveal className="relative z-20 flex flex-col gap-5">
              <span className="flex items-center gap-2.5 text-xs font-semibold text-pf-t7">
                <span className="h-1.5 w-1.5 rounded-full bg-pf-g2 shadow-[0_0_10px_2px_rgba(var(--glow3),0.9)]" />
                My Work
              </span>
              <h2 className="m-0 font-display text-[clamp(36px,4.4vw,54px)] font-semibold leading-[1.02] tracking-[-0.03em] text-pf-text">
                Featured{" "}
                <span className="bg-[linear-gradient(100deg,var(--g1)_0%,var(--g2)_45%,var(--g3)_100%)] bg-clip-text text-transparent">
                  Projects
                </span>
              </h2>
              <p className="m-0 max-w-[400px] text-[15px] leading-[1.65] text-pf-t6">
                Real-time trading platforms, Web3 marketplaces and booking systems
                I’ve shipped end to end, from responsive frontends to backend APIs
                and on-chain integrations.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button type="button" onClick={goPrev} aria-label="Previous project" className={NAV_BUTTON}>
                  <ArrowLeft size={17} aria-hidden="true" />
                </button>
                <button type="button" onClick={goNext} aria-label="Next project" className={NAV_BUTTON}>
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
                <span className="ml-1 flex-none font-display text-[13px] text-pf-t7">
                  <AnimatedNumber value={i + 1} format={TWO_DIGITS} className="text-pf-text" /> /{" "}
                  <AnimatedNumber value={n} format={TWO_DIGITS} />
                </span>
                <div role="group" aria-label="Choose a project" className="flex min-w-0 flex-1 items-center gap-[3px]">
                  {PROJECTS.map((p, k) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => goTo(k)}
                      aria-label={p.name}
                      aria-current={k === i ? "true" : undefined}
                      className="group relative h-6 min-w-0 flex-1"
                    >
                      <span
                        className={`absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full transition-[background-color,box-shadow] duration-300 ${
                          k === i
                            ? "bg-[linear-gradient(90deg,var(--g3),var(--g2))] shadow-[0_0_10px_rgba(var(--glow3),0.9)]"
                            : k < i
                              ? "bg-pf-ink/[0.32] group-hover:bg-pf-ink/[0.5]"
                              : "bg-pf-ink/[0.12] group-hover:bg-pf-ink/[0.35]"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <ProjectCarousel
                projects={PROJECTS}
                index={i}
                onSelect={goTo}
                onPrev={goPrev}
                onNext={goNext}
                onOpen={openCur}
              />
            </Reveal>
          </div>
        </div>

        {/* The detail panel breaks out of the 1240px column to near full width (light side gutters). */}
        <div className="relative mx-auto mt-12 hidden max-w-[1680px] md:block px-3 pb-24 sm:px-5 lg:mt-14 lg:px-8">
          <Reveal delay={0.15}>
            <ProjectDetail
              project={cur}
              dir={dir}
              nextName={nextP.name}
              heroRef={heroRef}
              onOpen={openFromDetail}
              onNext={goNext}
            />
          </Reveal>
        </div>
      </MotionConfig>

      {modalIndex !== null && (
        <ProjectModal index={modalIndex} onClose={closeModal} onNavigate={navigateModal} />
      )}
    </section>
  );
};

export default ProjectsShowcase;
