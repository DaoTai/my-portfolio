"use client";

import { useAnimate, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { buildFlightPath } from "@/lib/mascot-flight";
import { Mascot, type MascotMode } from "./Mascot";
import { MascotTrail } from "./MascotTrail";
import "./Mascot.css";

/** It dances this long after appearing before the first flight. */
const FIRST_FLIGHT_MS = 10_000;
/** Dancing time between later flights. */
const FLIGHT_GAP_MS = 18000;
const LAUNCH_MS = 380;
const FLIGHT_S = 7.5;
const LAND_MS = 650;
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
};

/**
 * The mascot's home is just above the chat launcher. It dances there, and every so often fires
 * its rocket boots and loops around the screen before landing back home.
 */
export const MascotFlyer = ({ hidden, onOpen }: MascotFlyerProps) => {
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

    let timer = 0;
    let flight: ReturnType<typeof animate>[] = [];
    let cancelled = false;

    const schedule = (ms: number) => {
      timer = window.setTimeout(launch, ms);
    };

    const land = () => {
      if (cancelled) return;
      flight = [];
      animate(orient, SQUARE, { duration: 0 });
      animate(ground, { opacity: 0 }, { duration: 0.3 });
      setMode("land");
      timer = window.setTimeout(() => {
        setMode("idle");
        schedule(FLIGHT_GAP_MS);
      }, LAND_MS);
    };

    const fly = () => {
      // Home rect: everything left of and above it is open sky.
      const home = el.getBoundingClientRect();
      const path = buildFlightPath(
        Math.max(0, home.left - EDGE_PX),
        Math.max(0, home.top - HEADER_PX),
      );
      const timing = {
        duration: FLIGHT_S,
        ease: "linear",
        times: path.times,
      } as const;
      // The ground shadow stretches out under the body as it lies flat, and fades with height.
      const stretch = path.rotate.map(
        (r) => 1 + 0.6 * Math.abs(Math.sin((r * Math.PI) / 180)),
      );
      setMode("fly");
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
      flight[0].then(land);
    };

    const launch = () => {
      // A background tab would fly unseen; try again shortly.
      if (document.hidden) return schedule(3000);
      setMode("launch");
      timer = window.setTimeout(fly, LAUNCH_MS);
    };

    schedule(FIRST_FLIGHT_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (flight.length) {
        flight.forEach((a) => a.stop());
        animate(el, { x: 0, y: 0, scale: 1 }, { duration: 0 });
        animate(orient, SQUARE, { duration: 0 });
        animate(ground, { x: 0, opacity: 0 }, { duration: 0 });
      }
      setMode("idle");
    };
  }, [reduce, hidden, animate, scope]);

  return (
    <>
      <div
        ref={groundRef}
        aria-hidden="true"
        className={`mascot-ground ${HOME} z-[38]`}
      />
      <MascotTrail active={mode === "fly"} sourceRef={scope} />
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
