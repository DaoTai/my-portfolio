import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig, siteHost } from "@/lib/config";
import { YEARS_EXPERIENCE } from "@/lib/experience";

export const alt = `${siteConfig.fullName} (Dao Tai) – ${siteConfig.jobTitle} specializing in React, Next.js, Node.js, NestJS & Web3`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Headline split into tokens so keywords can be highlighted (Satori has no inline text runs). */
const HEADLINE: { text: string; highlight?: boolean }[] = [
  { text: "Building" },
  { text: "high-performance", highlight: true },
  { text: "apps" },
  { text: "with" },
  { text: "creative", highlight: true },
  { text: "UI/UX,", highlight: true },
  { text: "optimized" },
  { text: "back-ends", highlight: true },
  { text: "and" },
  { text: "Web3", highlight: true },
  { text: "products." },
];

const TAGS = [
  "Performance",
  "UI/UX",
  "Next.js",
  "Node.js",
  "NestJS",
  "Web3",
  "TypeScript",
];

const loadAvatar = async () => {
  const data = await readFile(join(process.cwd(), "public/avatar-og.jpg"));
  return `data:image/jpeg;base64,${data.toString("base64")}`;
};

const Image = async () => {
  const avatarSrc = await loadAvatar();

  return new ImageResponse(
    <div
      style={{
        background:
          "linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a1e 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "sans-serif",
        position: "relative",
        padding: "56px 72px",
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "6px",
          background: "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)",
        }}
      />

      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 15% 40%, rgba(99,102,241,0.10) 0%, transparent 45%), radial-gradient(circle at 80% 50%, rgba(236,72,153,0.12) 0%, transparent 40%)",
        }}
      />

      {/* Left: text content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "660px",
          gap: "20px",
        }}
      >
        {/* Availability badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            alignSelf: "flex-start",
            padding: "8px 18px",
            background: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.4)",
            borderRadius: "100px",
            color: "#6ee7b7",
            fontSize: "20px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "100px",
              background: "#10b981",
            }}
          />
          Open to freelance & contract work
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: "76px",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-2px",
            lineHeight: 1,
          }}
        >
          {siteConfig.fullName}
        </div>

        {/* Job title */}
        <div
          style={{
            display: "flex",
            fontSize: "32px",
            fontWeight: 600,
            backgroundImage: "linear-gradient(90deg, #a78bfa, #f472b6)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {`${siteConfig.jobTitle} · ${YEARS_EXPERIENCE}+ Years`}
        </div>

        {/* Keyword headline */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            columnGap: "10px",
            rowGap: "4px",
            fontSize: "30px",
            lineHeight: 1.3,
            color: "#cbd5e1",
          }}
        >
          {HEADLINE.map(({ text, highlight }, i) => (
            <span
              key={i}
              style={
                highlight
                  ? { color: "#ffffff", fontWeight: 700, borderBottom: "3px solid #8b5cf6" }
                  : {}
              }
            >
              {text}
            </span>
          ))}
        </div>

        {/* Tech tags */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "6px" }}>
          {TAGS.map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 18px",
                background: "rgba(99, 102, 241, 0.12)",
                border: "1px solid rgba(99, 102, 241, 0.35)",
                borderRadius: "100px",
                color: "#c4b5fd",
                fontSize: "20px",
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Site URL */}
        <div
          style={{
            fontSize: "22px",
            color: "#64748b",
            marginTop: "6px",
            letterSpacing: "1px",
          }}
        >
          {siteHost}
        </div>
      </div>

      {/* Right: circular avatar with gradient ring */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "380px",
          height: "380px",
          borderRadius: "100%",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)",
          boxShadow: "0 0 80px rgba(139, 92, 246, 0.45)",
        }}
      >
        <img
          src={avatarSrc}
          alt=""
          width={364}
          height={364}
          style={{
            borderRadius: "100%",
            border: "6px solid #0a0a14",
            objectFit: "cover",
          }}
        />
      </div>
    </div>,
    { ...size },
  );
};

export default Image;
