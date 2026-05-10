"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

// ── 3D curve constants ────────────────────────────────────────
const IMG_W = 360;
const X_STEP = [0, 200, 340] as const;
const SCALE = [1, 0.72, 0.52] as const;
const ROT_Y = [0, 52, 72] as const;
const Z_DEPTH = [0, -140, -280] as const;
const OPACITY = [1, 0.52, 0.18] as const;
const Z_IDX = [10, 6, 3] as const;

function circOff(i: number, active: number, total: number) {
  let d = i - active;
  if (d > total / 2) d -= total;
  if (d < -total / 2) d += total;
  return d;
}

// ── Fullscreen viewer ─────────────────────────────────────────
function FullscreenViewer({
  src,
  total,
  current,
  onNav,
  onClose,
}: {
  src: string;
  total: number;
  current: number;
  onNav: (dir: 1 | -1) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose, onNav]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95 backdrop-blur-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      {/* image */}
      <motion.div
        className="relative"
        initial={{ scale: 0.84, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            key={src}
            src={src}
            alt={`image ${current + 1}`}
            className="max-h-[500px] max-w-[88vw] rounded-2xl object-contain shadow-2xl"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.22 }}
          />
        </AnimatePresence>

        {/* close */}
        <button
          onClick={onClose}
          className="absolute -right-4 -top-4 rounded-full border border-white/20 bg-black/80 p-2 text-white backdrop-blur-sm transition hover:bg-white/10"
        >
          <X size={15} />
        </button>
      </motion.div>

      {/* nav + counter */}
      {total > 1 && (
        <div
          className="mt-5 flex items-center gap-6"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onNav(-1)}
            className="rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-xs text-white/50">
            {current + 1} / {total}
          </span>
          <button
            onClick={() => onNav(1)}
            className="rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function ImageCarousel3D({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const [fsOpen, setFsOpen] = useState(false);
  const total = images.length;

  function navigate(dir: 1 | -1) {
    setActive((a) => (a + dir + total) % total);
  }

  if (total === 0) return null;

  // single image — show flat with zoom
  if (total === 1) {
    return (
      <>
        <div
          className="group relative h-[300px] w-full cursor-zoom-in overflow-hidden rounded-xl border border-white/10 bg-black/70"
          onClick={() => setFsOpen(true)}
        >
          <Image
            unoptimized
            src={images[0]}
            alt="preview"
            fill
            className="object-cover object-top"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <div className="rounded-full bg-black/55 p-3 backdrop-blur-sm">
              <ZoomIn size={22} className="text-white" />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {fsOpen && (
            <FullscreenViewer
              src={images[0]}
              total={1}
              current={0}
              onNav={() => {}}
              onClose={() => setFsOpen(false)}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      {/* ── 3D coverflow track ────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-xl bg-black/40">
        <motion.div
          className="relative h-[280px] cursor-grab select-none"
          style={{ perspective: "1000px" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.08}
          dragMomentum={false}
          whileDrag={{ cursor: "grabbing" }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50 || info.velocity.x < -400) navigate(1);
            else if (info.offset.x > 50 || info.velocity.x > 400) navigate(-1);
          }}
        >
          <div
            className="relative flex h-full items-start justify-center pt-2"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className="relative"
              style={{
                width: IMG_W,
                transformStyle: "preserve-3d",
              }}
            >
              {images.map((img, i) => {
                const off = circOff(i, active, total);
                const abs = Math.abs(off);

                if (abs > 2) return null;

                const sign = Math.sign(off);
                const isActive = off === 0;

                return (
                  <motion.div
                    key={i}
                    animate={{
                      x: sign * X_STEP[abs],
                      rotateY: -sign * ROT_Y[abs],
                      scale: SCALE[abs],
                      z: Z_DEPTH[abs],
                      opacity: OPACITY[abs],
                      zIndex: Z_IDX[abs],
                    }}
                    transition={{
                      duration: 0.46,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      position: "absolute",
                      width: IMG_W,
                      transformStyle: "preserve-3d",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (isActive) setFsOpen(true);
                      else setActive(i);
                    }}
                    className="overflow-hidden rounded-xl border border-white/15"
                  >
                    <div className="group relative h-[268px] bg-black/70">
                      <Image
                        unoptimized
                        src={img}
                        alt={`preview ${i + 1}`}
                        fill
                        className="object-cover object-top"
                      />

                      {/* dim for non-active */}
                      {!isActive && (
                        <div className="absolute inset-0 bg-background/55" />
                      )}

                      {/* shimmer on active */}
                      {isActive && (
                        <motion.div
                          className="pointer-events-none absolute inset-0"
                          animate={{ x: ["-110%", "210%"] }}
                          transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            repeatDelay: 4,
                            ease: "easeInOut",
                          }}
                          style={{
                            background:
                              "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.07) 50%, transparent 65%)",
                          }}
                        />
                      )}

                      {/* zoom hint on active */}
                      {isActive && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <div className="rounded-full bg-black/60 p-2.5 backdrop-blur-sm">
                            <ZoomIn size={20} className="text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* counter pill */}
        <div className="absolute bottom-2.5 right-3 z-20 rounded-full bg-black/65 px-2.5 py-0.5 text-[11px] text-white/65 backdrop-blur-sm">
          {active + 1} / {total}
        </div>

        {/* drag hint */}
        <div className="absolute bottom-2.5 left-3 z-20 select-none text-[10px] text-white/30">
          drag or tap sides
        </div>
      </div>

      {/* dot strip */}
      <div className="mt-4 flex justify-center gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Image ${i + 1}`}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === active
                ? "w-5 bg-gradient"
                : "w-7 bg-foreground/20 hover:bg-foreground/40"
            }`}
          />
        ))}
      </div>

      {/* fullscreen viewer */}
      <AnimatePresence>
        {fsOpen && (
          <FullscreenViewer
            src={images[active]}
            total={total}
            current={active}
            onNav={(dir) => setActive((a) => (a + dir + total) % total)}
            onClose={() => setFsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
