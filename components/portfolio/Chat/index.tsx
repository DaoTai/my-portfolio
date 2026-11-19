"use client";

import { MessageCircle, X } from "lucide-react";
import { useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMascotSound } from "@/lib/hooks/useMascotSound";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { MascotSoundToggle } from "./MascotSoundToggle";
import "./Chat.css";

// The panel, and the AI SDK it pulls in, load on first open so they stay off the initial page load.
const loadPanel = () => import("./ChatPanel");
const ChatPanel = dynamic(loadPanel, { ssr: false });

// Desktop-only decoration: its own chunk, never fetched on phones.
const MascotFlyer = dynamic(
  () => import("./MascotFlyer").then((m) => m.MascotFlyer),
  { ssr: false },
);

/** Tailwind's `sm` and up, where the mascot appears. */
const DESKTOP_QUERY = "(min-width: 640px)";

const ChatLauncher = () => {
  const [open, setOpen] = useState(false);
  // Stays true after the first open so the conversation survives closing the panel.
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const {
    enabled: soundOn,
    ready: soundReady,
    toggle: toggleSound,
    controls: sound,
  } = useMascotSound();
  // Reduced motion means no flights, so there is never a sound to mute.
  const reduce = useReducedMotion();
  // False on the server and during hydration, so the mascot only mounts after it, on desktop.
  const isDesktop = useMediaQuery(DESKTOP_QUERY);

  const openPanel = useCallback(() => {
    setMounted(true);
    setOpen(true);
  }, []);

  const closePanel = useCallback(() => setOpen(false), []);

  // The launcher is hidden under the mobile sheet, so focus can only return after it renders again.
  useEffect(() => {
    if (mounted && !open) buttonRef.current?.focus();
  }, [mounted, open]);

  return (
    <>
      {mounted && <ChatPanel open={open} onClose={closePanel} />}
      {/* No mascot on phones: unmounted so its flights and sounds never run there. */}
      {isDesktop && <MascotFlyer hidden={open} onOpen={openPanel} sound={sound} />}
      {/* Shown once the stored choice is known, so its icon never flips on load. */}
      {isDesktop && !open && !reduce && soundReady && (
        <MascotSoundToggle enabled={soundOn} onToggle={toggleSound} />
      )}
      <button
        ref={buttonRef}
        type="button"
        onClick={open ? closePanel : openPanel}
        onPointerEnter={loadPanel}
        onFocus={loadPanel}
        data-open={open}
        aria-expanded={open}
        aria-controls={open ? "chat-panel" : undefined}
        aria-label={open ? "Close chat" : "Ask about me"}
        className="chat-launcher fixed bottom-[calc(1.25rem+var(--tabbar-lift,0px))] right-5 z-40 flex h-12 items-center gap-2 rounded-full bg-pf-base2/90 px-4 text-sm font-semibold text-pf-text backdrop-blur transition-transform duration-300 hover:-translate-y-0.5 active:scale-95 max-sm:data-[open=true]:hidden sm:bottom-[calc(1.5rem+var(--tabbar-lift,0px))] sm:right-6"
      >
        <span className="chat-launcher-icons">
          <MessageCircle
            aria-hidden="true"
            size={18}
            className="chat-icon-open"
          />
          <X aria-hidden="true" size={18} className="chat-icon-close" />
        </span>
        <span className="hidden sm:inline">
          {open ? "Close" : "Ask about me"}
        </span>
      </button>
    </>
  );
};

export default ChatLauncher;
