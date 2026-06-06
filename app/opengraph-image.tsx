import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config";

export const runtime = "edge";
export const alt = `${siteConfig.fullName} - ${siteConfig.jobTitle}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a1e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          padding: "60px 80px",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "5px",
            background: "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)",
          }}
        />

        {/* Subtle grid pattern via radial gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139,92,246,0.08) 0%, transparent 40%)",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "28px",
            zIndex: 1,
          }}
        >
          {/* Name */}
          <div
            style={{
              fontSize: "80px",
              fontWeight: "700",
              color: "#ffffff",
              letterSpacing: "-3px",
              textAlign: "center",
              lineHeight: 1,
            }}
          >
            {siteConfig.fullName}
          </div>

          {/* Job title */}
          <div
            style={{
              fontSize: "30px",
              fontWeight: "400",
              color: "#a78bfa",
              textAlign: "center",
              letterSpacing: "0.5px",
            }}
          >
            {siteConfig.jobTitle}
          </div>

          {/* Divider */}
          <div
            style={{
              width: "60px",
              height: "2px",
              background: "linear-gradient(90deg, #6366f1, #ec4899)",
              borderRadius: "2px",
            }}
          />

          {/* Tech tags */}
          <div
            style={{
              display: "flex",
              gap: "14px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {["React", "Next.js", "Node.js", "TypeScript", "Web3"].map((tech) => (
              <div
                key={tech}
                style={{
                  padding: "10px 22px",
                  background: "rgba(99, 102, 241, 0.12)",
                  border: "1px solid rgba(99, 102, 241, 0.35)",
                  borderRadius: "100px",
                  color: "#c4b5fd",
                  fontSize: "22px",
                }}
              >
                {tech}
              </div>
            ))}
          </div>

          {/* Site URL */}
          <div
            style={{
              fontSize: "22px",
              color: "#4b5563",
              marginTop: "8px",
              letterSpacing: "1px",
            }}
          >
            daotai.dev
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
