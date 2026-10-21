import Image from "next/image";
import { memo } from "react";
import type { CSSProperties, ReactNode } from "react";
import { MASCOT_PARTS, type MascotPartName } from "@/lib/mascot-parts";
import { childrenOf, relativeBox } from "@/lib/mascot-rig";
import "./MascotPart.css";

/** What a part carries: `face` is flattened into its picture, `attach` keeps its own 3D. */
export type PartSlot = { face?: ReactNode; attach?: ReactNode };
export type PartSlots = Partial<Record<MascotPartName, PartSlot>>;

/** Silhouettes stacked behind each slice, front to back, so it shows a solid edge as it turns. */
const EDGE_LAYERS = ["rim", "side", "side", "side", "side", "side", "side"] as const;

const url = (src: string) => `url(${src})`;

type MascotPartProps = { name: MascotPartName; slots: PartSlots };

/**
 * One slice of the rig, with the slices hanging from it nested inside. The outer box sits at its
 * depth, the next layer turns around the joint for the pose, the next one dances in idle, and
 * that one carries the slice's thickness, its back and its children.
 */
export const MascotPart = memo(({ name, slots }: MascotPartProps) => {
  const { src, back, skins, depth, origin } = MASCOT_PARTS[name];
  const box = relativeBox(name);
  const slot = slots[name];
  return (
    <div
      className={`mascot-part mascot-part--${name}`}
      style={
        {
          left: `${box.left}%`,
          top: `${box.top}%`,
          width: `${box.width}%`,
          height: `${box.height}%`,
          "--depth": depth,
        } as CSSProperties
      }
    >
      <div
        className="mascot-part-move"
        style={{ transformOrigin: `${origin.x}% ${origin.y}%` }}
      >
        <div
          className="mascot-part-dance"
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
          {/* Its real back, facing the other way: what shows as the mascot turns round. */}
          <span className="mascot-back" style={{ backgroundImage: url(back) }} />
          <div className="mascot-face">
            <Image
              src={src}
              alt=""
              fill
              unoptimized
              draggable={false}
              className="select-none object-fill"
            />
            {slot?.face}
          </div>
          {/* Darkens the face as it turns away from the viewer. */}
          <span
            className="mascot-shade"
            style={{ backgroundImage: url(skins.side) }}
          />
          {slot?.attach}
          {childrenOf(name).map((child) => (
            <MascotPart key={child} name={child} slots={slots} />
          ))}
        </div>
      </div>
    </div>
  );
});

MascotPart.displayName = "MascotPart";
