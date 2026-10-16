import Image from "next/image";
import { memo } from "react";
import type { CSSProperties, ReactNode } from "react";
import { MASCOT_PARTS, type MascotPartName } from "@/lib/mascot-parts";

export type MascotMode = "idle" | "launch" | "fly" | "land";

type Anchor = { readonly x: number; readonly y: number };

/** Places an overlay on a point of its part, nudged by (dx, dy) percent of the part. */
const at = (a: Anchor, dx = 0, dy = 0): CSSProperties => ({
  left: `${a.x + dx}%`,
  top: `${a.y + dy}%`,
});

type PartProps = { name: MascotPartName; children?: ReactNode };

/** Silhouettes stacked behind each slice, front to back, so it shows a solid edge as it turns. */
const EDGE_LAYERS = ["rim", "side", "side", "side", "side", "back"] as const;

const url = (src: string) => `url(${src})`;

/**
 * One slice of the rig: the outer box sits at its depth, the inner one moves around the joint
 * and carries the slice's thickness behind its face.
 */
const Part = ({ name, children }: PartProps) => {
  const { src, skins, box, origin } = MASCOT_PARTS[name];
  return (
    <div
      className={`mascot-part mascot-part--${name}`}
      style={{
        left: `${box.left}%`,
        top: `${box.top}%`,
        width: `${box.width}%`,
        height: `${box.height}%`,
      }}
    >
      <div
        className="mascot-part-move"
        style={{ transformOrigin: `${origin.x}% ${origin.y}%` }}
      >
        {EDGE_LAYERS.map((skin, i) => (
          <span
            key={i}
            className="mascot-edge"
            style={
              {
                backgroundImage: url(skins[skin]),
                "--i": i + 1,
              } as CSSProperties
            }
          />
        ))}
        <div className="mascot-face">
          <Image
            src={src}
            alt=""
            fill
            unoptimized
            draggable={false}
            className="select-none object-fill"
          />
          {children}
        </div>
        {/* Darkens the face as it turns away from the viewer. */}
        <span
          className="mascot-shade"
          style={{ backgroundImage: url(skins.back) }}
        />
      </div>
    </div>
  );
};

const Sparkle = ({ style }: { style: CSSProperties }) => (
  <svg viewBox="0 0 24 24" className="mascot-sparkle" style={style}>
    <path d="M12 0C13 8 16 11 24 12 16 13 13 16 12 24 11 16 8 13 0 12 8 11 11 8 12 0Z" />
  </svg>
);

const Flame = ({ anchor }: { anchor: Anchor }) => (
  <span className="mascot-flame" style={at(anchor)}>
    <span className="mascot-flame-outer" />
    <span className="mascot-flame-mid" />
    <span className="mascot-flame-core" />
    {/* The trail canvas reads this point's position to emit sparks. */}
    <span className="mascot-flame-tip" />
  </span>
);

const { head, tablet, bubble, legL, legR } = MASCOT_PARTS;
const visor = head.ellipses.visor;

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

const Comets = () => (
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

/**
 * The mascot cut into layers (see scripts/slice-mascot.mjs) and rigged in CSS: it dances in
 * place, and in flight its boots fire and comets circle it. Layers sit at different depths, so
 * the sway turns it like a 2.5D figure rather than a flat sticker. In flight, MascotFlyer turns
 * the whole figure in 3D through the --heading, --roll and --pitch variables on `.mascot-orient`.
 */
export const Mascot = memo(({ mode }: { mode: MascotMode }) => (
  <div className="mascot-rig" data-mode={mode} aria-hidden="true">
    <div className="mascot-shadow" />
    <div className="mascot-aura" />
    <Comets />

    <div className="mascot-stage">
      <div className="mascot-orient">
        <div className="mascot-sway">
          <div className="mascot-dance">
            <Part name="legL">
              <Flame anchor={legL.anchors.flame} />
            </Part>
            <Part name="legR">
              <Flame anchor={legR.anchors.flame} />
            </Part>
            <Part name="body" />
            <Part name="head">
              <div
                className="mascot-visor"
                style={{
                  left: `${visor.x - visor.rx}%`,
                  top: `${visor.y - visor.ry}%`,
                  width: `${visor.rx * 2}%`,
                  height: `${visor.ry * 2}%`,
                }}
              >
                <span className="mascot-visor-shine" />
              </div>
              <span className="mascot-eye-glow" style={at(head.anchors.eyeL)} />
              <span
                className="mascot-eye-glow mascot-eye-glow--r"
                style={at(head.anchors.eyeR)}
              />
              <Sparkle style={at(head.anchors.eyeL, -7, -9)} />
              <Sparkle style={at(head.anchors.eyeR, 8, -8)} />
              <Sparkle style={at(head.anchors.mouth, 9, 2)} />
            </Part>
            <Part name="tablet">
              <div
                className="mascot-holo"
                style={{ clipPath: tablet.clips.screen }}
              >
                <span className="mascot-holo-scan" />
                <span className="mascot-holo-sweep" />
              </div>
              <span
                className="mascot-bit"
                style={{ left: "28%", top: "12%" }}
              />
              <span className="mascot-bit" style={{ left: "52%", top: "8%" }} />
              <span className="mascot-bit" style={{ left: "74%", top: "6%" }} />
            </Part>
            <Part name="arm" />
            <Part name="bubble">
              <span className="mascot-dot" style={at(bubble.anchors.dot1)} />
              <span className="mascot-dot" style={at(bubble.anchors.dot2)} />
              <span className="mascot-dot" style={at(bubble.anchors.dot3)} />
            </Part>
          </div>
        </div>
      </div>
    </div>
  </div>
));

Mascot.displayName = "Mascot";
