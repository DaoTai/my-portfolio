"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, Copy, X } from "lucide-react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from "motion/react";
import type { Variants } from "motion/react";
import { createPortal } from "react-dom";

import { EASE_OUT } from "@/components/common/Reveal";
import { CoffeeCup } from "./CoffeeCup";

type CoffeeDialogProps = {
  onClose: () => void;
};

const BANK = "Techcombank";
const ACCOUNT = "19072814226011";
const ACCOUNT_DISPLAY = "1907 2814 2260 11";

const PANEL: Variants = {
  hidden: { opacity: 0, y: 48, scale: 0.94, rotateX: 14 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 26,
      staggerChildren: 0.07,
      delayChildren: 0.12,
    },
  },
  exit: {
    opacity: 0,
    y: 24,
    scale: 0.96,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const ITEM: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

// The QR "prints" top-down, like a receipt sliding out of the till.
const RECEIPT: Variants = {
  hidden: { opacity: 0, y: -10, clipPath: "inset(0% 0% 100% 0% round 18px)" },
  show: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0% 0% 0% 0% round 18px)",
    transition: { duration: 0.8, ease: EASE_OUT },
  },
};

export const CoffeeDialog = ({ onClose }: CoffeeDialogProps) => {
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const copyTimer = useRef<number | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  // Lock body scroll while open.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      window.clearTimeout(copyTimer.current);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(ACCOUNT);
    } catch {
      return;
    }
    setCopied(true);
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  // Portal to <body> so the fixed overlay escapes the TiltCard's 3D stacking context.
  return createPortal(
    <MotionConfig reducedMotion="user">
      <motion.div
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.25, delay: 0.05 } }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-[rgba(3,4,9,0.78)] backdrop-blur-[12px]"
      >
        <div className="flex min-h-full items-center justify-center p-4 sm:p-8">
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="coffee-title"
            onClick={(e) => e.stopPropagation()}
            variants={PANEL}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{ transformPerspective: 1200 }}
            className="relative flex w-full max-w-[400px] flex-col gap-5 overflow-hidden rounded-3xl border border-[rgba(160,170,255,0.25)] p-5 shadow-[0_50px_120px_-40px_rgba(110,116,255,0.55)] [background:radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(143,147,255,0.18),transparent_70%),var(--bg3)] sm:p-6"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-pf-ink/[0.14] bg-pf-ink/[0.03] text-pf-text2 transition-colors hover:border-pf-g2 hover:text-pf-text"
            >
              <X size={14} strokeWidth={2.4} aria-hidden="true" />
            </button>

            <motion.div variants={ITEM} className="flex items-center gap-4 pr-10">
              <span className="h-14 w-14 flex-none rounded-2xl bg-[linear-gradient(135deg,var(--g1),var(--g2)_50%,var(--g3))] p-[1.5px] shadow-[0_0_30px_rgba(var(--pop-glow),0.4)]">
                <span className="grid h-full w-full place-items-center rounded-[14.5px] bg-pf-tilebg text-pf-text">
                  <CoffeeCup />
                </span>
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="flex items-center gap-2.5 text-xs font-semibold text-pf-t7">
                  <span className="h-px w-[18px] bg-pf-g2" />
                  Buy me a coffee
                </span>
                <h3
                  id="coffee-title"
                  className="m-0 font-display text-[22px] font-semibold leading-tight tracking-[-0.02em] text-pf-text"
                >
                  Fuel the next commit
                </h3>
              </div>
            </motion.div>

            <motion.p
              variants={ITEM}
              className="m-0 text-pretty text-sm leading-[1.6] text-pf-t4"
            >
              If something here helped you, a coffee keeps the late-night
              builds going. Scan with any banking app. Thank you!
            </motion.p>

            <motion.div
              variants={RECEIPT}
              className="relative mx-auto w-full max-w-[280px] overflow-hidden rounded-[18px] bg-white p-2 shadow-[0_24px_60px_-24px_rgba(var(--glow3),0.7)]"
            >
              <Image
                src="/author/qr-bank.webp"
                alt={`${BANK} VietQR code for Dao Duc Tai, account ${ACCOUNT_DISPLAY}`}
                width={929}
                height={1280}
                sizes="280px"
                priority
                className="block h-auto w-full rounded-xl"
              />
              {!reduce && (
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-2 top-0 h-16 bg-[linear-gradient(180deg,transparent,rgba(var(--glow3),0.22)_70%,rgba(var(--glow3),0.65))] mix-blend-multiply"
                  initial={{ top: "-15%", opacity: 0 }}
                  animate={{ top: ["-15%", "100%"], opacity: [0, 1, 1, 0] }}
                  transition={{
                    duration: 1.8,
                    delay: 1,
                    repeat: Infinity,
                    repeatDelay: 2.6,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.div>

            <motion.button
              variants={ITEM}
              type="button"
              onClick={copyAccount}
              aria-label={`Copy ${BANK} account number`}
              className="group flex items-center justify-between gap-3 rounded-xl border border-pf-ink/[0.1] bg-pf-ink/[0.025] px-4 py-3 text-left transition-colors hover:border-pf-g2"
            >
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-xs text-pf-t7">{BANK}</span>
                <span className="truncate font-display text-[15px] font-semibold tracking-[0.04em] text-pf-text">
                  {ACCOUNT_DISPLAY}
                </span>
              </span>
              <span
                aria-live="polite"
                className="relative flex h-8 min-w-[76px] items-center justify-end text-xs font-semibold text-pf-t6 group-hover:text-pf-text"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={copied ? "copied" : "copy"}
                    initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                    transition={{ duration: 0.22 }}
                    className={`flex items-center gap-1.5 ${copied ? "text-pf-g2" : ""}`}
                  >
                    {copied ? (
                      <Check size={14} strokeWidth={2.6} aria-hidden="true" />
                    ) : (
                      <Copy size={14} strokeWidth={2.2} aria-hidden="true" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </MotionConfig>,
    document.body,
  );
};
