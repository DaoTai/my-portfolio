import type { CSSProperties } from "react";

export const Sparkle = ({ style }: { style: CSSProperties }) => (
  <svg viewBox="0 0 24 24" className="mascot-sparkle" style={style}>
    <path d="M12 0C13 8 16 11 24 12 16 13 13 16 12 24 11 16 8 13 0 12 8 11 11 8 12 0Z" />
  </svg>
);

/** Period (s), radii (% of the rig), tilt, phase and colour of each comet orbiting in flight. */
const COMETS = [
  {
    T: "0.9s",
    rx: "64%",
    ry: "12%",
    tilt: "-14deg",
    phase: "0s",
    c: "#67e8f9",
  },
  {
    T: "1.15s",
    rx: "56%",
    ry: "16%",
    tilt: "22deg",
    phase: "-0.4s",
    c: "#a78bfa",
  },
  {
    T: "1.4s",
    rx: "72%",
    ry: "9%",
    tilt: "4deg",
    phase: "-0.9s",
    c: "#f0abfc",
  },
];
/** Dots per comet: the head, then a fading tail lagging behind it. */
const TAIL = [0, 1, 2, 3, 4, 5];

export const Comets = () => (
  <div className="mascot-comets">
    {COMETS.map((c) => (
      <div
        key={c.c}
        className="mascot-comet"
        style={
          {
            "--T": c.T,
            "--rx": c.rx,
            "--ry": c.ry,
            "--tilt": c.tilt,
            "--phase": c.phase,
            "--c": c.c,
          } as CSSProperties
        }
      >
        {TAIL.map((i) => (
          <span
            key={i}
            className="mascot-comet-x"
            style={
              { "--lag": `${i * 0.03}s`, "--k": 1 - i * 0.15 } as CSSProperties
            }
          >
            <span className="mascot-comet-y">
              <span className="mascot-comet-dot" />
            </span>
          </span>
        ))}
      </div>
    ))}
  </div>
);
