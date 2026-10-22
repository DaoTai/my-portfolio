"use client";

import { useAnimate, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { buildTimeline, flightWindow, PHASE_MS } from "@/lib/mascot-choreo";
import { buildFlightPath } from "@/lib/mascot-flight";
import type { RocketSoundControls } from "@/lib/mascot-sound";
import { buildSoundCurves } from "@/lib/mascot-sound-curves";
import { Mascot, type MascotMode } from "./Mascot";
import { MascotTrail } from "./MascotTrail";
import "./Mascot.css";

/** It dances this long after appearing before the first flight. */
const FIRST_FLIGHT_MS = 10_000;
/** Dancing time between later flights. */
const FLIGHT_GAP_MS = 18000;
const FLIGHT_MS = 7500;
/** Every phase of one flight, and when the path itself starts and touches down. */
const TIMELINE = buildTimeline(FLIGHT_MS);
const PATH = flightWindow(TIMELINE);
const LAST = TIMELINE[TIMELINE.length - 1];
/** Keeps the flight clear of the screen edge and the sticky header. */
const EDGE_PX = 12;
const HEADER_PX = 88;

/** Where the flyer and its ground shadow sit: just above the chat launcher. */
const HOME = "fixed bottom-[76px] right-2 sm:bottom-[84px] sm:right-5";

/** The flyer's 3D turn, cleared after each flight (a full barrel roll looks the same as none). */
const SQUARE = { "--heading": 0, "--roll": 0, "--pitch": 0 };

type MascotFlyerProps = {
  /** The chat is open: tuck the mascot away and hold the flights. */
  hidden: boolean;
  onOpen: () => void;
  /** Rocket sounds, played on each phase of the flight. */
  sound: RocketSoundControls;
};

/**
 * The mascot's home is just above the chat launcher. It dances there, and every so often puts
 * its tablet away, crouches, fires its rockets and loops around the screen, then lands on bent
 * knees and takes the tablet back out (see lib/mascot-choreo.ts).
 */
export const MascotFlyer = ({ hidden, onOpen, sound }: MascotFlyerProps) => {
  const reduce = useReducedMotion();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [mode, setMode] = useState<MascotMode>("idle");
  const groundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce || hidden) return;
    const el = scope.current;
    const orient = el?.querySelector<HTMLElement>(".mascot-orient");
    const ground = groundRef.current;
    if (!el || !orient || !ground) return;

    let timers: number[] = [];
    let flight: ReturnType<typeof animate>[] = [];

    const later = (ms: number, run: () => void) => {
      timers.push(window.setTimeout(run, ms));
    };

    /** Sounds that go with entering each phase. */
    const cueSound: Partial<Record<MascotMode, () => void>> = {
      // The context sleeps between flights; get it going before the ignition.
      ready: sound.wake,
      launch: sound.ignite,
      approach: () => sound.throttleDown(PHASE_MS.approach),
    };

    const fly = () => {
      // Home rect: everything left of and above it is open sky.
      const home = el.getBoundingClientRect();
      const travelX = Math.max(0, home.left - EDGE_PX);
      const path = buildFlightPath(travelX, Math.max(0, home.top - HEADER_PX));
      const timing = {
        duration: FLIGHT_MS / 1000,
        ease: "linear",
        times: path.times,
      } as const;
      // The ground shadow stretches out under the body as it lies flat, and fades with height.
      const stretch = path.rotate.map(
        (r) => 1 + 0.6 * Math.abs(Math.sin((r * Math.PI) / 180)),
      );
      sound.cruise(buildSoundCurves(path, travelX), FLIGHT_MS / 1000);
      flight = [
        animate(el, { x: path.x, y: path.y, scale: path.scale }, timing),
        animate(
          orient,
          {
            "--heading": path.rotate,
            "--roll": path.roll,
            "--pitch": path.pitch,
          },
          timing,
        ),
        animate(
          ground,
          {
            x: path.x,
            scaleX: path.altitude.map((a, i) => (1 - 0.55 * a) * stretch[i]),
            scaleY: path.altitude.map((a) => 1 - 0.45 * a),
            opacity: path.altitude.map((a) => 1 - 0.7 * a),
          },
          timing,
        ),
      ];
    };

    const touchdown = () => {
      flight = [];
      animate(orient, SQUARE, { duration: 0 });
      animate(ground, { opacity: 0 }, { duration: 0.3 });
      sound.touchdown();
    };

    const start = () => {
      timers = [];
      // A background tab would fly unseen; try again shortly.
      if (document.hidden) return later(3000, start);
      for (const cue of TIMELINE) {
        later(cue.at, () => {
          setMode(cue.mode);
          cueSound[cue.mode]?.();
        });
      }
      later(PATH.start, fly);
      later(PATH.end, touchdown);
      later(LAST.at + LAST.ms, () => {
        setMode("idle");
        later(FLIGHT_GAP_MS, start);
      });
    };

    later(FIRST_FLIGHT_MS, start);

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      sound.stop();
      if (flight.length) {
        flight.forEach((a) => a.stop());
        animate(el, { x: 0, y: 0, scale: 1 }, { duration: 0 });
        animate(orient, SQUARE, { duration: 0 });
        animate(ground, { x: 0, opacity: 0 }, { duration: 0 });
      }
      setMode("idle");
    };
  }, [reduce, hidden, animate, scope, sound]);

  return (
    <>
      <div
        ref={groundRef}
        aria-hidden="true"
        className={`mascot-ground ${HOME} z-[38]`}
      />
      <MascotTrail active={mode === "fly" || mode === "approach"} sourceRef={scope} />
      <div ref={scope} className={`mascot-flyer ${HOME} z-40`}>
        <button
          type="button"
          // The labelled launcher below is the accessible control; this is a mouse/touch shortcut.
          tabIndex={-1}
          aria-hidden="true"
          onClick={onOpen}
          data-hidden={hidden}
          className="mascot-hit block"
        >
          <Mascot mode={mode} />
        </button>
      </div>
    </>
  );
};
