"use client";

import { useInView } from "motion/react";
import { useRef, type CSSProperties } from "react";

/*
 * Decorative 3D backdrop for the Expertise section:
 *  - a faint constellation of nodes with pulses travelling along its edges (SVG),
 *  - an isometric stack of three translucent layers (interface / services / chain) in CSS 3D,
 *  - a slowly turning wireframe globe for the Web3 side.
 * Every position is a constant so server and client markup match.
 */

type Point = readonly [number, number];
type Edge = readonly [number, number];
/** [edge index, duration s, delay s] */
type Pulse = readonly [number, number, number];

type NetworkData = {
  /** Drawing size in units; the CSS scales it to cover the section like `slice`. */
  size: Point;
  nodes: readonly Point[];
  edges: readonly Edge[];
  pulses: readonly Pulse[];
};

const DESKTOP_NET: NetworkData = {
  size: [1440, 760],
  nodes: [
    [48, 96],
    [150, 40],
    [92, 250],
    [36, 420],
    [118, 560],
    [60, 700],
    [300, 690],
    [520, 735],
    [610, 330],
    [470, 52],
    [760, 360],
    [880, 700],
    [1110, 735],
    [1290, 650],
    [1400, 520],
    [1360, 330],
    [1410, 150],
    [1250, 40],
    [1010, 330],
    [690, 640],
  ],
  edges: [
    [0, 1],
    [0, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [4, 6],
    [6, 7],
    [7, 19],
    [19, 11],
    [11, 12],
    [12, 13],
    [13, 14],
    [14, 15],
    [15, 16],
    [16, 17],
    [3, 8],
    [8, 10],
    [10, 18],
    [18, 15],
    [19, 10],
    [1, 9],
  ],
  pulses: [
    [1, 4.2, -1],
    [3, 5, -2.5],
    [7, 6, -4],
    [12, 4.8, -0.8],
    [14, 5.6, -3.2],
    [17, 6.4, -1.7],
    [19, 5.2, -2.2],
  ],
};

const MOBILE_NET: NetworkData = {
  size: [390, 1200],
  nodes: [
    [30, 80],
    [150, 30],
    [340, 120],
    [370, 300],
    [20, 420],
    [60, 640],
    [350, 700],
    [200, 880],
    [30, 1000],
    [360, 1060],
    [180, 1170],
  ],
  edges: [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 4],
    [4, 5],
    [3, 6],
    [5, 7],
    [6, 7],
    [7, 8],
    [7, 9],
    [9, 10],
    [8, 10],
  ],
  pulses: [
    [2, 5, -1.5],
    [8, 6, -3],
  ],
};

const vars = (v: Record<string, string>) => v as CSSProperties;

/** Rounded so the server and client markup match exactly. */
const r2 = (n: number) => Math.round(n * 100) / 100;

/** Every fourth node's halo twinkles. */
const twinkles = (i: number) => i % 4 === 0;

/**
 * Edges and nodes are a static SVG, so it paints once. Pulses and twinkling halos are HTML on
 * top, positioned in drawing units (`--k` px per unit, set in CSS) and animated with translate /
 * opacity only, so they run on the compositor instead of repainting the SVG every frame.
 */
const Network = ({
  data,
  className,
}: {
  data: NetworkData;
  className: string;
}) => {
  const { nodes, edges, pulses, size } = data;
  const d = ([a, b]: Edge) =>
    `M${nodes[a][0]} ${nodes[a][1]}L${nodes[b][0]} ${nodes[b][1]}`;

  return (
    <div
      className={`exp-net ${className}`}
      style={vars({ "--nw": `${size[0]}`, "--nh": `${size[1]}` })}
    >
      <svg viewBox={`0 0 ${size[0]} ${size[1]}`} fill="none">
        {edges.map((e, i) => (
          <path
            key={`e${e[0]}-${e[1]}`}
            d={d(e)}
            className={i % 3 === 2 ? "exp-edge exp-edge--dash" : "exp-edge"}
          />
        ))}
        {nodes.map(([x, y], i) => (
          <g key={`n${x}-${y}`}>
            {!twinkles(i) && (
              <circle cx={x} cy={y} r={7} className="exp-halo" />
            )}
            <circle cx={x} cy={y} r={2} className="exp-node" />
          </g>
        ))}
      </svg>
      {nodes.map(
        ([x, y], i) =>
          twinkles(i) && (
            <span
              key={`h${x}-${y}`}
              className="exp-twinkle"
              style={vars({
                "--x": `${x}`,
                "--y": `${y}`,
                "--tdl": `${r2(-i * 0.7)}s`,
              })}
            />
          ),
      )}
      {pulses.map(([edge, dur, delay]) => {
        const [a, b] = edges[edge];
        const [x, y] = nodes[a];
        const dx = nodes[b][0] - x;
        const dy = nodes[b][1] - y;
        return (
          <span
            key={`p${edge}`}
            className="exp-pulse"
            style={vars({
              "--x": `${x}`,
              "--y": `${y}`,
              "--dx": `${dx}`,
              "--dy": `${dy}`,
              /* The old dash was 8% of its edge. */
              "--len": `${r2(Math.hypot(dx, dy) * 0.08)}`,
              "--ang": `${r2((Math.atan2(dy, dx) * 180) / Math.PI)}deg`,
              "--pd": `${dur}s`,
              "--pdl": `${delay}s`,
            })}
          />
        );
      })}
    </div>
  );
};

/** Flat-top hexagon; multiplications only, so the strings are identical on server and client. */
const hexPoints = (cx: number, cy: number, r: number) => {
  const h = r * 0.866;
  return [
    [cx - r, cy],
    [cx - r / 2, cy - h],
    [cx + r / 2, cy - h],
    [cx + r, cy],
    [cx + r / 2, cy + h],
    [cx - r / 2, cy + h],
  ]
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
};

const HEX_X = [34, 78, 122, 166];

const PlaneFrontend = () => (
  <svg viewBox="0 0 200 200" className="exp-art">
    <rect x="18" y="20" width="164" height="150" rx="10" />
    <path d="M18 40H182" />
    <circle cx="30" cy="30" r="2.5" className="exp-fill" />
    <circle cx="40" cy="30" r="2.5" className="exp-fill" />
    <circle cx="50" cy="30" r="2.5" className="exp-fill" />
    <rect x="30" y="54" width="72" height="8" rx="4" className="exp-fill-strong" />
    <rect x="30" y="70" width="112" height="4" rx="2" className="exp-fill" />
    <rect x="30" y="88" width="40" height="36" rx="6" />
    <rect x="80" y="88" width="40" height="36" rx="6" className="exp-fill" />
    <rect x="130" y="88" width="40" height="36" rx="6" />
    <rect x="30" y="136" width="140" height="22" rx="6" />
    <text x="18" y="190" className="exp-label">
      FE · INTERFACE
    </text>
  </svg>
);

const PlaneBackend = () => (
  <svg viewBox="0 0 200 200" className="exp-art">
    <rect
      x="22"
      y="22"
      width="156"
      height="156"
      rx="14"
      className="exp-dashed"
    />
    <path d="M100 100L44 48M100 100L156 48M100 100L44 152M100 100L156 152M44 48H156M44 152H156" />
    <rect x="82" y="82" width="36" height="36" rx="9" className="exp-fill" />
    <path d="M92 95H108M92 100H108M92 105H102" />
    {[
      [44, 48],
      [156, 48],
      [44, 152],
      [156, 152],
    ].map(([cx, cy]) => (
      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="8" className="exp-fill" />
    ))}
    <text x="18" y="196" className="exp-label">
      BE · SERVICES
    </text>
  </svg>
);

/** The block being mined; its outline blinks. */
const LIVE_HEX = 2;

const PlaneChain = () => (
  <>
    <svg viewBox="0 0 200 200" className="exp-art">
      {HEX_X.slice(1).map((x) => (
        <path key={x} d={`M${x - 27} 89H${x - 17}M${x - 27} 95H${x - 17}`} />
      ))}
      {HEX_X.map((x) => (
        <g key={x}>
          <polygon points={hexPoints(x, 92, 17)} className="exp-hex" />
          <polygon points={hexPoints(x, 92, 7)} className="exp-fill" />
          <path d={`M${x} 108V140`} className="exp-dashed" />
          <circle cx={x} cy="140" r="2.5" className="exp-fill-strong" />
        </g>
      ))}
      <path d="M24 140H176" />
      <text x="18" y="190" className="exp-label">
        W3 · CHAIN
      </text>
    </svg>
    {/* Its own <svg> so the blink is a composited opacity change, not a repaint of the plane. */}
    <svg viewBox="0 0 200 200" className="exp-art exp-hex-live">
      <polygon points={hexPoints(HEX_X[LIVE_HEX], 92, 17)} />
    </svg>
  </>
);

const PLANES = [
  { key: "w3", z: "0px", fd: "0s", Art: PlaneChain },
  { key: "be", z: "56px", fd: "-2.4s", Art: PlaneBackend },
  { key: "fe", z: "112px", fd: "-4.8s", Art: PlaneFrontend },
] as const;

/** Plane-space corners the pillars rise from (180px plane). */
const CORNERS = [
  [12, 12],
  [168, 12],
  [12, 168],
  [168, 168],
] as const;

const LayerStack = () => (
  <div className="exp-stack-wrap">
    <div className="exp-stack-float">
      <div className="exp-stack">
        <div className="exp-stack-glow" />
        {CORNERS.map(([x, y]) => (
          <span
            key={`pl${x}-${y}`}
            className="exp-pillar"
            style={vars({ "--x": `${x}px`, "--y": `${y}px` })}
          />
        ))}
        {PLANES.map(({ key, z, fd, Art }) => (
          <div
            key={key}
            className={`exp-plane exp-plane--${key}`}
            style={vars({ "--z": z, "--fd": fd })}
          >
            <Art />
          </div>
        ))}
        <span
          className="exp-packet"
          style={vars({ "--x": "168px", "--y": "168px", "--pkd": "0s" })}
        />
        <span
          className="exp-packet exp-packet--down"
          style={vars({ "--x": "12px", "--y": "12px", "--pkd": "-2.6s" })}
        />
      </div>
    </div>
  </div>
);

const MERIDIANS = [0, 30, 60, 90, 120, 150];
/** Latitude rings as fractions of the radius: d = cos(lat), y = sin(lat). */
const LATITUDES = [
  { d: 0.5, y: -0.866 },
  { d: 0.866, y: -0.5 },
  { d: 1, y: 0 },
  { d: 0.866, y: 0.5 },
  { d: 0.5, y: 0.866 },
];
/** [longitude, latitude] in degrees. */
const GLOBE_NODES = [
  [20, 18],
  [95, -32],
  [160, 8],
  [235, 40],
  [290, -12],
  [330, -48],
] as const;

const Globe = () => (
  <div className="exp-globe-wrap">
    <div className="exp-globe-core" />
    <div className="exp-globe">
      <div className="exp-globe-spin">
        {MERIDIANS.map((a) => (
          <span
            key={`m${a}`}
            className="exp-globe-ring"
            style={vars({ "--a": `${a}deg` })}
          />
        ))}
        {LATITUDES.map(({ d, y }) => (
          <span
            key={`l${y}`}
            className={
              y === 0 ? "exp-globe-lat exp-globe-lat--eq" : "exp-globe-lat"
            }
            style={vars({ "--d": `${d}`, "--y": `${y}` })}
          />
        ))}
        {GLOBE_NODES.map(([lon, lat]) => (
          <span
            key={`g${lon}`}
            className="exp-globe-node"
            style={vars({ "--lon": `${lon}deg`, "--lat": `${lat}deg` })}
          />
        ))}
      </div>
      <div className="exp-globe-orbit">
        <div className="exp-globe-orbit-spin">
          <span className="exp-globe-sat" />
        </div>
      </div>
    </div>
  </div>
);

export const ExpertiseBackground = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "160px 0px" });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`exp-bg pointer-events-none absolute inset-0${inView ? "" : " exp-bg--paused"}`}
    >
      <Network data={DESKTOP_NET} className="hidden md:block" />
      <Network data={MOBILE_NET} className="md:hidden" />
      <Globe />
      <LayerStack />
    </div>
  );
};
