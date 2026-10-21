"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Mascot } from "@/components/portfolio/Chat/Mascot";
import { buildTimeline } from "@/lib/mascot-choreo";
import { POSES, type MascotMode } from "@/lib/mascot-poses";
import "@/components/portfolio/Chat/Mascot.css";

const MODES = Object.keys(POSES) as MascotMode[];

/** Dev-only bench for the mascot rig: poses, turns and a whole flight sequence in place. */
export const MascotLab = () => {
  const [mode, setMode] = useState<MascotMode>("idle");
  const [roll, setRoll] = useState(0);
  const [heading, setHeading] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [overlay, setOverlay] = useState(false);
  const timers = useRef<number[]>([]);

  const stop = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const play = () => {
    stop();
    const timeline = buildTimeline(7500);
    for (const cue of timeline) {
      timers.current.push(window.setTimeout(() => setMode(cue.mode), cue.at));
    }
    const end = timeline.at(-1)!;
    timers.current.push(window.setTimeout(() => setMode("idle"), end.at + end.ms));
  };

  useEffect(() => stop, []);

  return (
    <main className="min-h-screen bg-pf-base p-6 text-pf-text">
      <div className="mb-4 flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            data-mode-button={m}
            onClick={() => {
              stop();
              setMode(m);
            }}
            className={`rounded px-3 py-1 text-sm ${m === mode ? "bg-pf-text text-pf-base" : "bg-pf-base2"}`}
          >
            {m}
          </button>
        ))}
        <button type="button" data-play onClick={play} className="rounded bg-violet-600 px-3 py-1 text-sm text-white">
          play
        </button>
      </div>
      <div className="mb-6 flex flex-wrap gap-6 text-sm">
        {(
          [
            ["roll", roll, setRoll, 0, 360],
            ["heading", heading, setHeading, -90, 90],
            ["pitch", pitch, setPitch, -45, 45],
          ] as const
        ).map(([label, value, set, min, max]) => (
          <label key={label} className="flex items-center gap-2">
            {label}
            <input
              type="range"
              name={label}
              min={min}
              max={max}
              value={value}
              onChange={(e) => set(Number(e.target.value))}
            />
            <span className="w-10 tabular-nums">{value}</span>
          </label>
        ))}
        <label className="flex items-center gap-2">
          <input type="checkbox" name="overlay" checked={overlay} onChange={(e) => setOverlay(e.target.checked)} />
          original overlay
        </label>
      </div>
      <div
        data-lab-stage
        className="relative"
        style={
          {
            width: 320,
            "--mascot-w": "320px",
            "--beat": "0.62s",
            "--heading": heading,
            "--roll": roll,
            "--pitch": pitch,
          } as CSSProperties
        }
      >
        <Mascot mode={mode} />
        {overlay && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/mascot.png" alt="" className="pointer-events-none absolute inset-0 h-full w-full opacity-40" />
        )}
      </div>
    </main>
  );
};
