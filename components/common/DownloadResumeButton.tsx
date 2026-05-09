"use client";
import { Download, Check } from "lucide-react";
import Link from "next/link";
import { memo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const DownloadResumeButton = ({
  className,
}: {
  className?: string;
}) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleClick = () => {
    if (downloaded) return;
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <Link
      href="/resume.pdf"
      download
      target="_blank"
      title="resume.pdf"
      onClick={handleClick}
      className={`group relative flex w-fit items-center gap-3 overflow-hidden rounded-full px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-shadow duration-300 hover:shadow-violet-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 ${className ?? ""}`}
    >
      {/* Gradient background */}
      <span className="absolute inset-0 bg-gradient" />

      {/* Shimmer sweep on hover */}
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />

      {/* Icon */}
      <span className="relative flex size-5 shrink-0 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {downloaded ? (
            <motion.span
              key="check"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute"
            >
              <Check size={18} strokeWidth={2.5} />
            </motion.span>
          ) : (
            <motion.span
              key="download"
              initial={{ scale: 0, y: -8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute"
            >
              <motion.span
                animate={{ y: [0, 2, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                className="block"
              >
                <Download size={18} strokeWidth={2} />
              </motion.span>
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      {/* Label */}
      <span className="relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {downloaded ? (
            <motion.span
              key="done"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="block"
            >
              Downloaded!
            </motion.span>
          ) : (
            <motion.span
              key="get"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="block"
            >
              Get Resume
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </Link>
  );
};

export default memo(DownloadResumeButton);
