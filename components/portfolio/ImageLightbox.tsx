"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

import { AnimatedNumber, TWO_DIGITS } from "@/components/common/AnimatedNumber";
import { useSwipe } from "@/lib/hooks/useSwipe";

type ImageLightboxProps = {
  images: string[];
  index: number;
  alt: string;
  onClose: () => void;
  onStep: (d: number) => void;
};

const ARROW =
  "absolute top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 text-2xl text-white/80 backdrop-blur-[8px] hover:border-white/50 hover:text-white sm:grid";

export const ImageLightbox = ({
  images,
  index,
  alt,
  onClose,
  onStep,
}: ImageLightboxProps) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const multi = images.length > 1;
  const swipe = useSwipe({
    onLeft: () => onStep(1),
    onRight: () => onStep(-1),
    onDown: onClose,
  });

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Portal to <body>: the modal overlay's backdrop-filter would otherwise become
  // the containing block for this fixed layer. Keyboard handling lives in the modal.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} — image ${index + 1} of ${images.length}`}
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[110] flex animate-[dcFade_.2s_ease-out] flex-col bg-[rgb(3,4,9)]"
    >
      <div className="flex items-center justify-between gap-4 px-4 pb-2 pt-[max(12px,env(safe-area-inset-top))] sm:px-6 sm:pt-5">
        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-display text-[13px] text-white/80">
          <AnimatedNumber value={index + 1} format={TWO_DIGITS} /> /{" "}
          <AnimatedNumber value={images.length} format={TWO_DIGITS} />
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close image"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/5 text-white/80 hover:border-white/50 hover:text-white"
        >
          <X size={16} strokeWidth={2.4} aria-hidden="true" />
        </button>
      </div>

      <div
        {...swipe}
        className="relative min-h-0 flex-1 select-none"
      >
        <Image
          key={images[index]}
          src={images[index]}
          alt={`${alt} screenshot ${index + 1}`}
          fill
          sizes="100vw"
          className="animate-[dcFade_.25s_ease-out] object-contain p-2 sm:p-10"
        />
        {multi && (
          <>
            <button
              type="button"
              onClick={() => onStep(-1)}
              aria-label="Previous image"
              className={`${ARROW} left-5`}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => onStep(1)}
              aria-label="Next image"
              className={`${ARROW} right-5`}
            >
              ›
            </button>
          </>
        )}
      </div>

      {multi && (
        <div className="flex justify-center gap-2 px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-3">
          {images.map((src, j) => (
            <button
              key={src}
              type="button"
              onClick={() => onStep(j - index)}
              aria-label={`Image ${j + 1}`}
              className="grid h-6 place-items-center px-0.5"
            >
              <span
                className={`block h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                  j === index ? "w-6 bg-pf-g2" : "w-1.5 bg-white/30"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
};
