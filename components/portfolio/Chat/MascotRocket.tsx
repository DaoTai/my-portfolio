import { useId } from "react";
import { MASCOT_PARTS } from "@/lib/mascot-parts";
import "./MascotRocket.css";

type Side = "L" | "R";

/** One plane of the pod; two of them crossed make it look round from any side. */
const Plane = ({ cross }: { cross?: boolean }) => {
  // Unique per plane: with a shared id, every pod's fill points at the first one's gradient.
  const body = useId();
  return (
    <svg
      viewBox="0 0 40 120"
      className={`mascot-rocket-plane${cross ? " mascot-rocket-plane--cross" : ""}`}
    >
      <defs>
        <linearGradient id={body} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0b0a2a" />
          <stop offset="0.4" stopColor="#4c1d95" />
          <stop offset="0.65" stopColor="#1e1b4b" />
          <stop offset="1" stopColor="#07061c" />
        </linearGradient>
      </defs>
      {/* Nose cone, body, fins and nozzle ring. */}
      <path
        d="M20 2 C 30 12 33 24 33 34 L 33 96 L 7 96 L 7 34 C 7 24 10 12 20 2 Z"
        fill={`url(#${body})`}
      />
      <path
        d="M7 76 L 0 100 L 7 94 Z M33 76 L 40 100 L 33 94 Z"
        fill="#312e81"
      />
      <path d="M12 30 L 12 88" className="mascot-rocket-piping" />
      <rect x="9" y="96" width="22" height="10" rx="2" fill="#94a3b8" />
      <rect
        x="11"
        y="104"
        width="18"
        height="4"
        rx="2"
        fill="#67e8f9"
        className="mascot-rocket-glow"
      />
    </svg>
  );
};

/**
 * A rocket pod strapped to the outer side of a thigh. It fades in for take-off (--rockets) and
 * its flame grows with --throttle; the trail canvas emits sparks from `.mascot-flame-tip`.
 */
export const MascotRocket = ({ side }: { side: Side }) => {
  const anchor = MASCOT_PARTS[`thigh${side}`].anchors.rocket;
  return (
    <div
      className={`mascot-rocket mascot-rocket--${side}`}
      style={{ left: `${anchor.x}%`, top: `${anchor.y}%` }}
    >
      <div className="mascot-rocket-pod">
        <Plane />
        <Plane cross />
        <span className="mascot-flame">
          <span className="mascot-flame-outer" />
          <span className="mascot-flame-mid" />
          <span className="mascot-flame-core" />
          <span className="mascot-flame-tip" />
        </span>
      </div>
    </div>
  );
};
