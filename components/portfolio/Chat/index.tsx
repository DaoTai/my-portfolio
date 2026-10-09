"use client";

import { MessageCircle, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import "./Chat.css";

// The panel, and the AI SDK it pulls in, load on first open so they stay off the initial page load.
const loadPanel = () => import("./ChatPanel");
const ChatPanel = dynamic(loadPanel, { ssr: false });

const ChatLauncher = () => {
  const [open, setOpen] = useState(false);
  // Stays true after the first open so the conversation survives closing the panel.
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const openPanel = () => {
    setMounted(true);
    setOpen(true);
  };

  const closePanel = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  return (
    <>
      {mounted && <ChatPanel open={open} onClose={closePanel} />}
      <button
        ref={buttonRef}
        type="button"
        onClick={open ? closePanel : openPanel}
        onPointerEnter={loadPanel}
        onFocus={loadPanel}
        aria-expanded={open}
        aria-controls={open ? "chat-panel" : undefined}
        aria-label={open ? "Close chat" : "Ask about me"}
        className="chat-launcher fixed bottom-5 right-5 z-40 flex h-12 items-center gap-2 rounded-full bg-pf-base2/90 px-4 text-sm font-semibold text-pf-text backdrop-blur transition-transform duration-300 hover:-translate-y-0.5 sm:bottom-6 sm:right-6"
      >
        {open ? (
          <X aria-hidden="true" size={18} />
        ) : (
          <MessageCircle aria-hidden="true" size={18} />
        )}
        <span className="hidden sm:inline">
          {open ? "Close" : "Ask about me"}
        </span>
      </button>
    </>
  );
};

export default ChatLauncher;
