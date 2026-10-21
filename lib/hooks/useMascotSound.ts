"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRocketSound, type RocketSound, type RocketSoundControls } from "@/lib/mascot-sound";
import { readSoundPref, writeSoundPref } from "@/lib/mascot-sound-curves";

/** `window.localStorage` itself can throw when site data is blocked. */
const storage = () => {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
};

/**
 * The mascot's rocket sounds and the visitor's on/off choice. Sounds stay silent until the
 * visitor has interacted with the page (browsers block audio before that) and while it is off.
 */
export const useMascotSound = () => {
  const [enabled, setEnabled] = useState(true);
  const enabledRef = useRef(true);
  const gestured = useRef(false);
  const engine = useRef<RocketSound | null>(null);

  // Read after mount so the server render and the first client render agree.
  useEffect(() => {
    const on = readSoundPref(storage()) === "on";
    enabledRef.current = on;
    setEnabled(on);
  }, []);

  // Fallback for browsers without navigator.userActivation.
  useEffect(() => {
    const mark = () => {
      gestured.current = true;
    };
    window.addEventListener("pointerdown", mark, { once: true, capture: true });
    window.addEventListener("keydown", mark, { once: true, capture: true });
    return () => {
      window.removeEventListener("pointerdown", mark, { capture: true });
      window.removeEventListener("keydown", mark, { capture: true });
    };
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) engine.current?.suspend();
      else engine.current?.resume();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      engine.current?.dispose();
      engine.current = null;
    };
  }, []);

  const toggle = useCallback(() => {
    const on = !enabledRef.current;
    enabledRef.current = on;
    setEnabled(on);
    writeSoundPref(storage(), on ? "on" : "off");
    if (!on) engine.current?.stop();
  }, []);

  const controls = useMemo<RocketSoundControls>(() => {
    const live = () => {
      const active = navigator.userActivation?.hasBeenActive ?? gestured.current;
      if (!enabledRef.current || !active) return null;
      engine.current ??= createRocketSound();
      return engine.current;
    };
    return {
      ignite: () => live()?.ignite(),
      cruise: (curves, seconds) => live()?.cruise(curves, seconds),
      throttleDown: (ms) => live()?.throttleDown(ms),
      touchdown: () => live()?.touchdown(),
      // Stopping never needs a gesture, and must not create an AudioContext.
      stop: () => engine.current?.stop(),
    };
  }, []);

  return { enabled, toggle, controls };
};
