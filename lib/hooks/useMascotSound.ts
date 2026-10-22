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
 * visitor's first tap, click or key press unlocks them (browsers block audio before that), and
 * while the choice is off.
 */
export const useMascotSound = () => {
  const [enabled, setEnabled] = useState(true);
  /** The stored choice has been read, so `enabled` is the visitor's, not the default. */
  const [ready, setReady] = useState(false);
  const enabledRef = useRef(true);
  const engine = useRef<RocketSound | null>(null);

  /** Starts the audio from inside a gesture: the only moment Safari allows it. */
  const unlock = useCallback(() => {
    if (!enabledRef.current) return;
    engine.current ??= createRocketSound();
    engine.current.unlock();
  }, []);

  // Read after mount so the server render and the first client render agree.
  useEffect(() => {
    const on = readSoundPref(storage()) === "on";
    enabledRef.current = on;
    setEnabled(on);
    setReady(true);
  }, []);

  useEffect(() => {
    const events = ["pointerdown", "keydown", "touchend"] as const;
    const onGesture = () => {
      unlock();
      // Once the context exists, later gestures have nothing left to unlock.
      if (engine.current) events.forEach((e) => window.removeEventListener(e, onGesture, true));
    };
    events.forEach((e) => window.addEventListener(e, onGesture, true));
    return () => events.forEach((e) => window.removeEventListener(e, onGesture, true));
  }, [unlock]);

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
    // The toggle's own click is a gesture: turning sound on unlocks it right here.
    if (on) {
      unlock();
    } else {
      engine.current?.stop();
      engine.current?.rest();
    }
  }, [unlock]);

  const controls = useMemo<RocketSoundControls>(() => {
    // Before the unlock there is no engine; the engine itself stays silent until it runs.
    const live = () => (enabledRef.current ? engine.current : null);
    return {
      ignite: () => live()?.ignite(),
      cruise: (curves, seconds) => live()?.cruise(curves, seconds),
      throttleDown: (ms) => live()?.throttleDown(ms),
      touchdown: () => live()?.touchdown(),
      wake: () => live()?.wake(),
      // Stopping never needs a gesture, and must not create an AudioContext.
      stop: () => engine.current?.stop(),
    };
  }, []);

  return { enabled, ready, toggle, controls };
};
