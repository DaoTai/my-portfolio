"use client";

import { useCallback, useRef, useState } from "react";
import { Coffee } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { CoffeeDialog } from "./CoffeeDialog";

export const CoffeeButton = () => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  return (
    <>
      <motion.button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        initial="rest"
        whileHover="hover"
        whileTap={{ scale: 0.97 }}
        style={{ z: 30 }}
        className="flex items-center gap-2.5 rounded-[10px] border border-pf-ink/[0.14] px-5 py-3 text-sm font-bold text-pf-text2 [transition:border-color_.3s,color_.3s,box-shadow_.3s] hover:border-pf-g2 hover:text-pf-text hover:shadow-[0_14px_40px_-14px_rgba(var(--glow3),0.6)]"
      >
        {/* Tips toward you like a sip on hover. */}
        <motion.span
          variants={{
            rest: { rotate: 0, y: 0 },
            hover: { rotate: -14, y: -1 },
          }}
          transition={{ type: "spring", stiffness: 400, damping: 14 }}
          className="grid place-items-center"
        >
          <Coffee size={16} strokeWidth={2.2} aria-hidden="true" />
        </motion.span>
        Buy me a coffee
      </motion.button>

      <AnimatePresence>{open && <CoffeeDialog onClose={close} />}</AnimatePresence>
    </>
  );
};
