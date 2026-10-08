import {
  Atom,
  Blocks,
  Cloud,
  Database,
  Layers,
  Server,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";

type Category = { icon: LucideIcon; rgb: string };

/** Icon and hue (RGB triplet) for each tech group / expertise code. */
const CATEGORIES: Record<string, Category> = {
  FE: { icon: Layers, rgb: "45, 212, 191" },
  BE: { icon: Server, rgb: "74, 222, 128" },
  DB: { icon: Database, rgb: "96, 165, 250" },
  ST: { icon: Atom, rgb: "167, 139, 250" },
  OP: { icon: Cloud, rgb: "251, 191, 36" },
  TL: { icon: Wrench, rgb: "251, 146, 60" },
  W3: { icon: Blocks, rgb: "192, 132, 252" },
};

const FALLBACK: Category = { icon: Layers, rgb: "159, 176, 255" };

export const categoryRgb = (code: string) => (CATEGORIES[code] ?? FALLBACK).rgb;

type CategoryIconProps = {
  code: string;
  className?: string;
  style?: CSSProperties;
};

export const CategoryIcon = ({
  code,
  className = "",
  style,
}: CategoryIconProps) => {
  const { icon: Icon, rgb } = CATEGORIES[code] ?? FALLBACK;

  return (
    <span
      aria-hidden="true"
      className={`grid size-[36px] flex-none place-items-center rounded-[11px] border ${className}`}
      style={{
        color: `rgb(${rgb})`,
        borderColor: `rgba(${rgb}, 0.35)`,
        background: `linear-gradient(160deg, rgba(${rgb}, 0.22), rgba(${rgb}, 0.06))`,
        boxShadow: `0 8px 24px -10px rgba(${rgb}, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08)`,
        ...style,
      }}
    >
      <Icon size={17} strokeWidth={2} />
    </span>
  );
};
