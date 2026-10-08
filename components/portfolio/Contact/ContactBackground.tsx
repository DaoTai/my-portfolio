"use client";

import { useInView } from "motion/react";
import { Fragment, useRef } from "react";
import type { CSSProperties } from "react";

/** Seconds per radar sweep revolution; contact pings are phased against it. */
const SWEEP_SECONDS = 9;

/** Globe radius in px; the CSS sizes the sphere to match (2 × this). */
const GLOBE_R = 200;

/** Dish size in px (matches .contact-radar); the link viewBox spans -100…100 across it. */
const DISH_PX = 960;

/** Arc planes are 600px squares (.contact-arc) over a -150…150 viewBox. */
const ARC_PX = 600;
const ARC_SCALE = ARC_PX / 300;

const rad = (deg: number) => (deg * Math.PI) / 180;

/** Rounded so the server and client markup match exactly. */
const round = (n: number) => Math.round(n * 100) / 100;

/** Dish rings (diameter, % of the dish). The outermost is drawn dashed. */
const RINGS = [20, 40, 60, 80, 100] as const;

const SPOKES = [0, 45, 90, 135] as const;

/** Pulse waves leaving the dish center, staggered across one 6s cycle. */
const PULSES = [0, -2, -4] as const;

/**
 * Radar contacts: radius (% of the dish radius), angle clockwise from the far edge (deg) and
 * mast height (px). Kept on the far half so they rise into the section instead of being cut
 * off by its bottom edge.
 */
const BLIPS = [
  [36, 296, 56],
  [64, 326, 40],
  [48, 22, 66],
  [80, 54, 32],
  [90, 288, 46],
  [28, 78, 28],
] as const;

const BLIP_POINTS = BLIPS.map(([r, deg, h], i) => {
  const x = round(r * Math.sin(rad(deg)));
  const y = round(-r * Math.cos(rad(deg)));
  return {
    key: `${r}-${deg}`,
    x,
    y,
    h,
    /** The beam's leading edge reaches `deg` this far into each revolution. */
    delay: round((deg / 360 - 1) * SWEEP_SECONDS),
    /** Packets leave the center one after another. */
    linkDelay: round(-i * 1.1),
    /** The link line in dish px, for the HTML packet that rides it. */
    len: round(r * (DISH_PX / 200)),
    angle: round(deg - 90),
  };
});

/** Wireframe globe: meridian planes and latitude circles (deg). */
const MERIDIANS = [0, 30, 60, 90, 120, 150] as const;
const LATITUDES = [-60, -30, 0, 30, 60] as const;

/** Connection arcs: plane rotateY, plane rotateX, from/to angle on the circle, packet delay. */
const ARCS = [
  [0, 18, 200, 290, 0],
  [62, -24, 150, 236, -1.7],
  [-48, 40, 250, 330, -3.4],
] as const;

/** Arc height above the sphere, in viewBox units where the radius is 100. */
const ARC_PEAK = 132;

const point = (deg: number, r: number) =>
  [round(r * Math.cos(rad(deg))), round(r * Math.sin(rad(deg)))] as const;

/**
 * Circular arc between two points on the sphere's outline, bowing out to ARC_PEAK at its middle.
 * A circle rather than a Bézier so the packet can ride it by rotating about the circle's centre:
 * a compositor-only animation (offset-path would tick on the main thread every frame).
 */
const arcGeometry = (from: number, to: number) => {
  const half = (to - from) / 2;
  const mid = from + half;
  const cos = Math.cos(rad(half));
  // The centre sits on the mid-angle ray, `dist` out, equally far from both ends and the peak.
  const dist = (ARC_PEAK ** 2 - 100 ** 2) / (2 * ARC_PEAK - 200 * cos);
  const radius = ARC_PEAK - dist;
  // Angle at the centre between the peak and either end.
  const spread = (Math.atan2(100 * Math.sin(rad(half)), 100 * cos - dist) * 180) / Math.PI;
  const a = point(from, 100);
  const b = point(to, 100);
  const c = point(mid, dist);
  const r = round(radius);
  const px = (u: number) => round(u * ARC_SCALE + ARC_PX / 2);
  return {
    a,
    b,
    d: `M${a[0]} ${a[1]} A${r} ${r} 0 ${spread > 90 ? 1 : 0} 1 ${b[0]} ${b[1]}`,
    /** Packet orbit in the plane's px: centre, radius and the start / end rotation. */
    orbit: {
      left: px(c[0]),
      top: px(c[1]),
      "--r": `${round(radius * ARC_SCALE)}px`,
      "--a0": `${round(mid - spread)}deg`,
      "--a1": `${round(mid + spread)}deg`,
    },
  };
};

const ARC_SHAPES = ARCS.map(([ry, rx, from, to, delay]) => ({
  key: `${ry}-${rx}`,
  ry,
  rx,
  delay,
  ...arcGeometry(from, to),
}));

const vars = (v: Record<string, string | number>) => v as CSSProperties;

const RadarDish = () => (
  <div className="contact-radar">
    <div className="contact-dish">
      <span className="contact-dish-glow" />
      {RINGS.map((d) => (
        <span
          key={d}
          className={
            d === 100 ? "contact-ring contact-ring--outer" : "contact-ring"
          }
          style={vars({ "--d": `${d}%` })}
        />
      ))}
      {SPOKES.map((a) => (
        <span
          key={a}
          className="contact-spoke"
          style={vars({ "--a": `${a}deg` })}
        />
      ))}

      {/* Signal lines from the beacon out to each contact (static, painted once)... */}
      <svg className="contact-links" viewBox="-100 -100 200 200">
        {BLIP_POINTS.map((p) => (
          <path key={p.key} className="contact-link" d={`M0 0L${p.x} ${p.y}`} />
        ))}
      </svg>
      {/* ...and a packet riding each one, moved by translate on its own layer. */}
      {BLIP_POINTS.map((p) => (
        <span
          key={p.key}
          className="contact-packet"
          style={vars({
            "--len": `${p.len}px`,
            "--a": `${p.angle}deg`,
            "--pd": `${p.linkDelay}s`,
          })}
        />
      ))}

      <span className="contact-sweep" />
      {PULSES.map((d) => (
        <span
          key={d}
          className="contact-pulse"
          style={vars({ "--pd": `${d}s`, "--ps": 0.3 - d * 0.16 })}
        />
      ))}

      {BLIP_POINTS.map((p) => (
        <span
          key={p.key}
          className="contact-blip"
          style={vars({
            left: `${50 + p.x / 2}%`,
            top: `${50 + p.y / 2}%`,
            "--pd": `${p.delay}s`,
          })}
        />
      ))}
      {BLIP_POINTS.map((p) => (
        <span
          key={p.key}
          className="contact-pin"
          style={vars({
            left: `${50 + p.x / 2}%`,
            top: `${50 + p.y / 2}%`,
            "--h": `${p.h}px`,
            "--pd": `${p.delay}s`,
          })}
        />
      ))}
      <span className="contact-beacon" />
      <span className="contact-pin contact-pin--mast" />
    </div>
  </div>
);

const Globe = () => (
  <div className="contact-globe">
    <span className="contact-globe-halo" />
    <div className="contact-globe-tilt">
      <div className="contact-globe-spin">
        {MERIDIANS.map((a) => (
          <span
            key={a}
            className="contact-meridian"
            style={vars({ "--a": `${a}deg` })}
          />
        ))}
        {LATITUDES.map((lat) => (
          <span
            key={lat}
            className={
              lat === 0
                ? "contact-latitude contact-latitude--equator"
                : "contact-latitude"
            }
            style={vars({
              "--d": `${round(2 * GLOBE_R * Math.cos(rad(lat)))}px`,
              "--y": `${round(-GLOBE_R * Math.sin(rad(lat)))}px`,
            })}
          />
        ))}
        {ARC_SHAPES.map((arc, i) => {
          const plane = vars({ "--ry": `${arc.ry}deg`, "--rx": `${arc.rx}deg` });
          const extra = i > 0 ? " contact-arc--extra" : "";
          return (
            <Fragment key={arc.key}>
              {/* Static track: rasterised once, then only turned by the spin. */}
              <svg
                className={`contact-arc${extra}`}
                viewBox="-150 -150 300 300"
                style={plane}
              >
                <path className="contact-arc-track" d={arc.d} />
                <circle className="contact-arc-node" cx={arc.a[0]} cy={arc.a[1]} r="2.4" />
                <circle className="contact-arc-node" cx={arc.b[0]} cy={arc.b[1]} r="2.4" />
              </svg>
              {/* The packet orbits the arc's centre in a matching plane, so the track never re-rasters. */}
              <div className={`contact-arc contact-arc-plane${extra}`} style={plane}>
                <span
                  className="contact-arc-packet"
                  style={vars({ ...arc.orbit, "--pd": `${arc.delay}s` })}
                />
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
    <span className="contact-globe-rim" />
  </div>
);

/**
 * Decorative "signal" scene behind the contact section: a radar dish lying in perspective
 * sends pulses and packets out to its contacts, and a wireframe globe turning at the right
 * edge carries them along arcs. Animations pause while the section is off-screen.
 */
export const ContactBackground = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "160px 0px" });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`contact-bg pointer-events-none absolute inset-0${inView ? "" : " contact-bg--paused"}`}
    >
      <RadarDish />
      <Globe />
    </div>
  );
};
