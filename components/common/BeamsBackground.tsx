"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface BeamsBackgroundProps {
  className?: string;
  intensity?: "subtle" | "medium" | "strong";
}

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  hue: number;
  pulse: number;
  pulseSpeed: number;
}

function createBeam(width: number, height: number): Beam {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    width: 80 + Math.random() * 120,
    length: height * 2,
    angle: -35 + Math.random() * 10,
    speed: 0.4 + Math.random() * 0.8,
    opacity: 0.12 + Math.random() * 0.12,
    hue: 190 + Math.random() * 60,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.01 + Math.random() * 0.02,
  };
}

export function BeamsBackground({
  className,
  intensity = "strong",
}: BeamsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const beamsRef = useRef<Beam[]>([]);
  const { resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(true); // Default to dark mode

  const opacityMap = {
    subtle: 0.5,
    medium: 0.75,
    strong: 1,
  };

  // Update isDark based on resolvedTheme or document class
  useEffect(() => {
    if (resolvedTheme) {
      setIsDark(resolvedTheme === "dark");
    } else {
      // Check if dark class is present on html element
      setIsDark(document.documentElement.classList.contains("dark"));
    }
  }, [resolvedTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const BEAM_COUNT = window.innerWidth < 768 ? 10 : 16;
    const FRAME_INTERVAL = 1000 / 24; // cap at 24fps
    let lastFrameTime = 0;
    let resizeTimer: ReturnType<typeof setTimeout>;

    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1;

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      beamsRef.current = Array.from({ length: BEAM_COUNT }, () =>
        createBeam(window.innerWidth, window.innerHeight),
      );
    };

    const debouncedSetup = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setupCanvas, 300);
    };

    setupCanvas();

    window.addEventListener("resize", debouncedSetup);

    const animate = (timestamp: number) => {
      animationRef.current = requestAnimationFrame(animate);

      const elapsed = timestamp - lastFrameTime;
      if (elapsed < FRAME_INTERVAL) return;
      lastFrameTime = timestamp - (elapsed % FRAME_INTERVAL);

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.filter = "blur(40px)";

      beamsRef.current.forEach((beam) => {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;

        if (beam.y + beam.length < -200) {
          beam.y = window.innerHeight + 200;
          beam.x = Math.random() * window.innerWidth;
        }

        ctx.save();

        ctx.translate(beam.x, beam.y);
        ctx.rotate((beam.angle * Math.PI) / 180);

        const pulsingOpacity =
          beam.opacity *
          (0.75 + Math.sin(beam.pulse) * 0.25) *
          opacityMap[intensity];

        const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);

        const beamColor = isDark
          ? `hsla(${beam.hue}, 100%, 70%,`
          : `hsla(${beam.hue}, 90%, 60%,`;

        gradient.addColorStop(0, `${beamColor} 0)`);
        gradient.addColorStop(0.2, `${beamColor} ${pulsingOpacity * 0.5})`);
        gradient.addColorStop(0.5, `${beamColor} ${pulsingOpacity})`);
        gradient.addColorStop(0.8, `${beamColor} ${pulsingOpacity * 0.5})`);
        gradient.addColorStop(1, `${beamColor} 0)`);

        ctx.fillStyle = gradient;

        ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);

        ctx.restore();
      });
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", debouncedSetup);
      clearTimeout(resizeTimer);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDark, intensity]);

  return (
    <>
      {/* Base background */}
      <div
        className={cn(
          "fixed inset-0 -z-50 transition-colors duration-500",
          isDark ? "bg-[#050816]" : "bg-light",
          className,
        )}
      />

      {/* Canvas beams */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 -z-40 h-full w-full"
      />

      {/* Overlay */}
      <div
        className={cn(
          "pointer-events-none fixed inset-0 -z-30",
          isDark ? "bg-black/25" : "bg-white/35",
        )}
      />
    </>
  );
}
