import { memo } from "react";
import type { CSSProperties } from "react";
import { MASCOT_PARTS } from "@/lib/mascot-parts";
import { POSES, type MascotMode, type Pose } from "@/lib/mascot-poses";
import { rootDrop } from "@/lib/mascot-rig";
import { Comets, Sparkle } from "./MascotEffects";
import { MascotPart, type PartSlots } from "./MascotPart";
import { MascotRocket } from "./MascotRocket";
import { MascotTablet } from "./MascotTablet";

export type { MascotMode };

type Anchor = { readonly x: number; readonly y: number };

/** Places an overlay on a point of its part, nudged by (dx, dy) percent of the part. */
const at = (a: Anchor, dx = 0, dy = 0): CSSProperties => ({
  left: `${a.x + dx}%`,
  top: `${a.y + dy}%`,
});

const { head, bubble, torso } = MASCOT_PARTS;
const visor = head.ellipses.visor;

/** The pose as the CSS properties the rig's joints read (see MascotPart.css). */
const poseVars = (pose: Pose) =>
  ({
    "--shoulder-l": `${pose.shoulderL}deg`,
    "--elbow-l": `${pose.elbowL}deg`,
    "--shoulder-r": `${pose.shoulderR}deg`,
    "--elbow-r": `${pose.elbowR}deg`,
    "--hip-l": `${pose.hipL}deg`,
    "--knee-l": `${pose.kneeL}deg`,
    "--hip-r": `${pose.hipR}deg`,
    "--knee-r": `${pose.kneeR}deg`,
    // rootDrop is in % of the canvas; the torso translates in % of its own height.
    "--drop": `${(rootDrop(pose) / torso.box.height) * 100}%`,
    "--tablet": pose.tablet,
    "--rockets": pose.rockets,
    "--throttle": pose.throttle,
    "--dance": pose.dance,
    "--pose-ms": `${pose.ms}ms`,
  }) as CSSProperties;

/** Overlays and props each slice carries; built once, they never change. */
const SLOTS: PartSlots = {
  head: {
    face: (
      <>
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
      </>
    ),
  },
  forearmL: { attach: <MascotTablet /> },
  thighL: { attach: <MascotRocket side="L" /> },
  thighR: { attach: <MascotRocket side="R" /> },
  bubble: {
    face: (
      <>
        <span className="mascot-dot" style={at(bubble.anchors.dot1)} />
        <span className="mascot-dot" style={at(bubble.anchors.dot2)} />
        <span className="mascot-dot" style={at(bubble.anchors.dot3)} />
      </>
    ),
  },
};

/**
 * The mascot cut into nested slices (see scripts/slice-mascot.mjs) and rigged in CSS. Each mode
 * is a pose from lib/mascot-poses.ts that the joints blend into. Slices sit at different depths
 * and carry their real backs, so it turns like a 2.5D figure rather than a flat sticker. In
 * flight, MascotFlyer turns the whole figure through --heading, --roll and --pitch.
 */
export const Mascot = memo(({ mode }: { mode: MascotMode }) => (
  <div
    className="mascot-rig"
    data-mode={mode}
    style={poseVars(POSES[mode])}
    aria-hidden="true"
  >
    <div className="mascot-shadow" />
    <div className="mascot-aura" />
    <Comets />

    <div className="mascot-stage">
      <div className="mascot-orient">
        <div className="mascot-sway">
          <div className="mascot-dance">
            <MascotPart name="torso" slots={SLOTS} />
            <MascotPart name="bubble" slots={SLOTS} />
          </div>
        </div>
      </div>
    </div>
  </div>
));

Mascot.displayName = "Mascot";
