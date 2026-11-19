"use client";

import { memo, useEffect, useId, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
} from "motion/react";
import { hopStops, nearestSlot, notchedBarPath, slotCenter } from "@/lib/tab-notch";
import { cn } from "@/lib/utils";
import "./MobileTabBar.css";

export type TabItem = { id: string; label: string; Icon?: React.ElementType };

type MobileTabBarProps = {
  items: TabItem[];
  active: string;
  onNavigate: (id: string) => void;
};

const BAR_H = 62;
const RADIUS = 22;
/** Inner side padding: keeps the end notches clear of the rounded corners. */
const PAD = 18;
const NOTCH_HALF = 37;
const NOTCH_DEPTH = 29;
/** The notch flattens to this fraction of its depth while the marble is airborne. */
const NOTCH_AIR = 0.35;
const MARBLE = 46;
/** Marble centre sits this far above the bar's top edge when resting in the notch. */
const MARBLE_RISE = 3;
const HOP_H = 16;

/**
 * Mobile navigation: a frosted bar along the bottom with a notch bitten out of its top edge.
 * A glassy marble rides in the notch over the active tab; switching tabs makes it hop across
 * every tab in between, the notch following underneath and flattening while it's in the air.
 */
export const MobileTabBar = ({ items, active, onNavigate }: MobileTabBarProps) => {
  const reduce = useReducedMotion();
  const count = items.length;
  const index = Math.max(0, items.findIndex((t) => t.id === active));
  const rimId = `tab-rim-${useId().replace(/[^\w-]/g, "")}`;

  const barRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const widthMV = useMotionValue(0);
  const x = useMotionValue(0);
  const lift = useMotionValue(0); // 0 resting, -HOP_H at the top of a hop
  const squash = useMotionValue(1);
  const anims = useRef<AnimationPlaybackControls[]>([]);
  const placedWidth = useRef(0);
  // The tab under the marble right now (changes mid-hop), for the marble's icon.
  const [under, setUnder] = useState(index);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      widthMV.set(e.contentRect.width);
      setWidth(e.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [widthMV]);

  useEffect(() => {
    if (!width) return;
    anims.current.forEach((a) => a.stop());
    const target = slotCenter(index, count, width, PAD);
    const stops = hopStops(x.get(), index, count, width, PAD);
    const hops = stops.length - 1;

    // First measure, a resize, or reduced motion: just be there.
    if (placedWidth.current !== width || reduce || hops === 0) {
      placedWidth.current = width;
      x.set(target);
      lift.set(0);
      squash.set(1);
      setUnder(index);
      return;
    }

    const duration = Math.min(0.95, 0.3 + 0.17 * (hops - 1));
    const even = (k: number) => Array.from({ length: k + 1 }, (_, i) => i / k);
    const liftKeys = [lift.get()];
    const liftEase: ("easeOut" | "easeIn")[] = [];
    for (let i = 0; i < hops; i++) {
      liftKeys.push(-HOP_H, 0);
      liftEase.push("easeOut", "easeIn");
    }

    const hop = animate(lift, liftKeys, { duration, times: even(hops * 2), ease: liftEase });
    anims.current = [
      animate(x, stops, {
        duration,
        times: even(hops),
        ease: Array(hops).fill("easeInOut"),
      }),
      hop,
    ];
    hop.then(() => {
      if (anims.current[1] !== hop) return; // interrupted by a newer hop
      // A little squash on the final landing.
      anims.current.push(
        animate(squash, [0.84, 1], { type: "spring", stiffness: 520, damping: 14 }),
      );
    });
  }, [index, width, count, reduce, x, lift, squash]);

  useMotionValueEvent(x, "change", (v) => {
    if (width) setUnder(nearestSlot(v, count, width, PAD));
  });

  const depth = useTransform(lift, (l) => {
    const air = Math.min(1, Math.max(0, -l / HOP_H));
    return NOTCH_DEPTH * (1 - (1 - NOTCH_AIR) * air);
  });
  const d = useTransform(() =>
    widthMV.get()
      ? notchedBarPath({
          width: widthMV.get(),
          height: BAR_H,
          radius: RADIUS,
          cx: x.get(),
          half: NOTCH_HALF,
          depth: depth.get(),
        })
      : "",
  );
  const clipPath = useTransform(d, (p) => (p ? `path("${p}")` : "none"));
  const marbleX = useTransform(x, (v) => v - MARBLE / 2);
  const marbleY = useTransform(lift, (l) => l - MARBLE / 2 - MARBLE_RISE);
  const scaleX = useTransform(squash, (s) => 2 - s);

  const Current = items[under]?.Icon;

  return (
    <nav
      aria-label="Sections"
      className="tabbar fixed inset-x-3 z-[45] md:hidden"
      style={{ height: BAR_H }}
    >
      <div
        ref={barRef}
        className={cn("relative h-full", !width && "opacity-0")}
      >
        <motion.div className="tabbar-glass absolute inset-0" style={{ clipPath }}>
          <svg
            className="absolute inset-0 h-full w-full overflow-visible"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={rimId} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(var(--ink),0.4)" />
                <stop offset="45%" stopColor="rgba(var(--ink),0.08)" />
                <stop offset="100%" stopColor="rgba(var(--glow3),0.55)" />
              </linearGradient>
            </defs>
            <motion.path d={d} fill="none" stroke={`url(#${rimId})`} strokeWidth={2} />
          </svg>
        </motion.div>

        <ul
          className="relative grid h-full"
          style={{ gridTemplateColumns: `repeat(${count}, 1fr)`, paddingInline: PAD }}
        >
          {items.map((item, i) => (
            <TabLink
              key={item.id}
              item={item}
              on={i === index}
              covered={i === under}
              onNavigate={onNavigate}
            />
          ))}
        </ul>

        <motion.div
          aria-hidden="true"
          className="tabbar-marble pointer-events-none absolute left-0 top-0 grid place-items-center rounded-full"
          style={{
            width: MARBLE,
            height: MARBLE,
            x: marbleX,
            y: marbleY,
            scaleX,
            scaleY: squash,
          }}
        >
          {Current && (
            <motion.span
              key={under}
              className="grid place-items-center text-pf-text"
              initial={reduce ? false : { scale: 0.4, opacity: 0, rotate: -40 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 600, damping: 22 }}
            >
              <Current size={19} className="drop-shadow-[0_0_6px_rgba(143,147,255,0.9)]" />
            </motion.span>
          )}
        </motion.div>
      </div>
    </nav>
  );
};

type TabLinkProps = {
  item: TabItem;
  on: boolean;
  /** The marble is over this tab, so its own icon steps aside. */
  covered: boolean;
  onNavigate: (id: string) => void;
};

const TabLink = memo(({ item, on, covered, onNavigate }: TabLinkProps) => {
  const { Icon } = item;
  return (
    <li className="min-w-0">
      <a
        href={`#${item.id}`}
        onClick={() => onNavigate(item.id)}
        aria-current={on ? "location" : undefined}
        className="flex h-full flex-col items-center justify-end gap-1 pb-2.5 [-webkit-tap-highlight-color:transparent]"
      >
        {Icon && (
          <Icon
            size={19}
            aria-hidden="true"
            className={cn(
              "text-pf-t4 [transition:transform_.3s,opacity_.2s]",
              covered && "-translate-y-3 scale-50 opacity-0",
            )}
          />
        )}
        <span
          className={cn(
            "max-w-full truncate px-0.5 text-[10.5px] leading-none [transition:color_.25s]",
            on ? "tabbar-label-on font-semibold" : "font-medium text-pf-t5",
          )}
        >
          {item.label}
        </span>
      </a>
    </li>
  );
});
TabLink.displayName = "TabLink";
