import type { CSSProperties } from "react";

/** Inline custom properties (`--size`, `--d`…) for the CSS in ProjectsShowcase.css. */
export const vars = (v: Record<string, string | number>) => v as CSSProperties;

const FACES = ["front", "back", "right", "left", "top", "bottom"] as const;

type GlassCubeProps = {
  className?: string;
  /** Edge length, e.g. "28px". */
  size?: string;
  /** Animation offset, e.g. "-3s", so neighbouring cubes don't move in step. */
  delay?: string;
};

/** A small frosted CSS-3D cube that slowly tumbles and bobs. Purely decorative. */
export const GlassCube = ({ className = "", size = "28px", delay = "0s" }: GlassCubeProps) => (
  <span
    aria-hidden="true"
    className={`gcube pointer-events-none ${className}`}
    style={vars({ "--size": size, "--d": delay })}
  >
    <span className="gcube-spin">
      {FACES.map((f) => (
        <i key={f} className={`gcube-face gcube-face--${f}`} />
      ))}
    </span>
  </span>
);
