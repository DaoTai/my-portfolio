"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { navigations } from "@/lib/init";
import Link from "next/link";

const ToggleBar = () => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="block lg:hidden">
      <Button
        size="icon"
        variant="outline"
        className="border-white/20 bg-background/50 backdrop-blur-sm"
        onClick={() => setOpen(true)}
      >
        <Menu size={18} />
      </Button>

      {mounted && createPortal(
        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                onClick={() => setOpen(false)}
              />

              {/* Drawer */}
              <motion.div
                key="drawer"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed bottom-0 right-0 top-0 z-50 flex w-72 flex-col bg-background/95 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <span className="font-display text-lg font-semibold text-gradient">Menu</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => setOpen(false)}
                  >
                    <X size={18} />
                  </Button>
                </div>

                <nav className="flex flex-col gap-1 p-4">
                  {navigations.map(({ name, href, icon: Icon }, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <Link
                        href={href}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all hover:bg-gradient hover:text-white"
                        onClick={() => setOpen(false)}
                      >
                        <Icon size={18} />
                        {name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default ToggleBar;
