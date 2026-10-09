"use client";

import { useChat } from "@ai-sdk/react";
import { isTextUIPart, type UIMessage } from "ai";
import { ArrowUp, Square, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useDragControls,
  useReducedMotion,
} from "motion/react";
import type { PanInfo } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent, PointerEvent } from "react";
import { MAX_USER_CHARS } from "@/lib/chat/limits";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { Bubble, BusyNotice, TypingDots } from "./ChatMessages";

const STARTERS = [
  "What has Tai built in Web3?",
  "Is Tai open to freelance work?",
  "Which projects use NestJS?",
  "How can I contact Tai?",
];

// Below Tailwind's `sm`, the panel is a full-screen sheet instead of a corner panel.
const MOBILE_QUERY = "(max-width: 639.98px)";

// How far / how fast a downward drag has to go before the sheet dismisses.
const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 500;

const textOf = (message: UIMessage) =>
  message.parts
    .filter(isTextUIPart)
    .map((part) => part.text)
    .join("");

type ChatPanelProps = { open: boolean; onClose: () => void };

const ChatPanel = ({ open, onClose }: ChatPanelProps) => {
  const reduce = useReducedMotion();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const dragControls = useDragControls();
  const { messages, sendMessage, status, error, stop, regenerate } = useChat();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // Whether the list sits at the bottom, so streaming text doesn't yank a reader scrolled up.
  const pinnedRef = useRef(true);
  const stoppedRef = useRef(false);
  const scrollRafRef = useRef(0);

  const busy = status === "submitted" || status === "streaming";
  const last = messages[messages.length - 1];
  // Reasoning models stream nothing visible at first, so keep the dots up until text arrives.
  const thinking =
    busy && (!last || last.role === "user" || textOf(last) === "");
  // A finished turn with no visible reply (and no Stop press) is treated like an error.
  const emptyReply =
    status === "ready" &&
    !error &&
    !stoppedRef.current &&
    !!last &&
    (last.role === "user" || textOf(last) === "") &&
    messages.some((message) => message.role === "user");
  const showBusy = !!error || emptyReply;

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // The mobile sheet covers the viewport, so the page behind it must not scroll.
  useEffect(() => {
    if (!open || !isMobile) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open, isMobile]);

  // Keep the newest text in view while the answer streams in, unless the reader scrolled up.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (pinnedRef.current || last?.role === "user") {
      list.scrollTop = list.scrollHeight;
      pinnedRef.current = true;
    }
  }, [messages, status, open, last?.role]);

  useEffect(() => () => cancelAnimationFrame(scrollRafRef.current), []);

  // Reading scrollHeight/clientHeight forces layout, so coalesce it to one read per frame.
  const onListScroll = useCallback(() => {
    if (scrollRafRef.current) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = 0;
      const list = listRef.current;
      if (list) {
        pinnedRef.current =
          list.scrollHeight - list.scrollTop - list.clientHeight < 80;
      }
    });
  }, []);

  const retry = () => {
    stoppedRef.current = false;
    void regenerate();
  };

  const stopAnswer = () => {
    stoppedRef.current = true;
    void stop();
  };

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    stoppedRef.current = false;
    void sendMessage({ text: trimmed });
    setInput("");
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    send(input);
  };

  // Drag starts from the handle only; starting it on the panel would fight the list's scroll.
  const startDrag = (e: PointerEvent) => dragControls.start(e);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > DISMISS_DISTANCE || info.velocity.y > DISMISS_VELOCITY) {
      onClose();
    }
  };

  const sheet = isMobile
    ? {
        initial: { y: "100%" },
        animate: { y: 0 },
        exit: { y: "100%" },
        transition: { type: "spring" as const, stiffness: 400, damping: 38 },
      }
    : {
        initial: { opacity: 0, y: 24, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 16, scale: 0.97 },
        transition: { type: "spring" as const, stiffness: 320, damping: 28 },
      };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="chat-panel"
          role="dialog"
          aria-modal={isMobile ? true : undefined}
          aria-label="Ask about Tai"
          initial={reduce ? false : sheet.initial}
          animate={reduce ? { opacity: 1, y: 0, scale: 1 } : sheet.animate}
          exit={reduce ? { opacity: 0 } : sheet.exit}
          transition={reduce ? { duration: 0.15 } : sheet.transition}
          drag={isMobile && !reduce ? "y" : false}
          dragControls={dragControls}
          dragListener={false}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.5, left: 0, right: 0 }}
          onDragEnd={onDragEnd}
          className="chat-panel fixed inset-0 z-50 flex h-[100dvh] flex-col overflow-hidden border-pf-ink/10 bg-pf-bg2 sm:inset-auto sm:bottom-[88px] sm:right-6 sm:h-[min(560px,calc(100dvh-11rem))] sm:w-[380px] sm:origin-bottom-right sm:rounded-3xl sm:border sm:shadow-[0_24px_80px_-20px_rgba(var(--glow3),0.45)]"
        >
          {/* Grab handle: the sheet's drag region, and the only one — mobile only. */}
          <div
            onPointerDown={startDrag}
            aria-hidden="true"
            className="chat-handle grid shrink-0 place-items-center pb-1 pt-[max(0.625rem,env(safe-area-inset-top))] sm:hidden"
          >
            <span className="h-1 w-10 rounded-full bg-pf-ink/20" />
          </div>

          <div className="flex shrink-0 items-center justify-between border-b border-pf-ink/10 px-5 py-4 sm:pt-4">
            <div>
              <p className="m-0 font-display text-base font-semibold text-pf-text">
                Ask about Tai
              </p>
              <p className="m-0 text-xs text-pf-t7">
                Answers from my portfolio data
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close chat"
              className="grid size-9 place-items-center rounded-full text-pf-t6 transition-colors hover:bg-pf-ink/10 hover:text-pf-text active:scale-95"
            >
              <X aria-hidden="true" size={18} />
            </button>
          </div>

          <div
            ref={listRef}
            onScroll={onListScroll}
            aria-live="polite"
            aria-busy={busy}
            className="chat-list flex flex-1 touch-pan-y flex-col gap-3 overflow-y-auto overscroll-contain px-5 py-4"
          >
            <Bubble
              role="assistant"
              text="Hi! Ask me about Tai’s experience, projects or tech stack."
            />

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {STARTERS.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => send(question)}
                    className="chat-chip rounded-full border border-pf-ink/15 px-3 py-1.5 text-left text-[13px] text-pf-t3 transition-colors hover:border-pf-g3 hover:text-pf-text active:scale-95"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {messages.map((message) => {
              const text = textOf(message);
              return text ? (
                <Bubble key={message.id} role={message.role} text={text} />
              ) : null;
            })}

            {thinking && <TypingDots />}

            {showBusy && <BusyNotice onRetry={retry} />}
          </div>

          <form
            onSubmit={onSubmit}
            className="shrink-0 border-t border-pf-ink/10 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:pb-3"
          >
            <div className="flex items-center gap-2 rounded-full border border-pf-ink/15 bg-pf-base/40 py-1.5 pl-4 pr-1.5 transition-colors focus-within:border-pf-g3">
              {/* 16px on mobile so iOS Safari doesn't zoom in on focus. */}
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={MAX_USER_CHARS}
                placeholder="Type a question…"
                aria-label="Your question"
                className="min-w-0 flex-1 bg-transparent text-base text-pf-text outline-none placeholder:text-pf-t7 sm:text-sm"
              />
              {busy ? (
                <button
                  type="button"
                  onClick={stopAnswer}
                  aria-label="Stop answer"
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-pf-text text-pf-bg transition-transform active:scale-90"
                >
                  <Square aria-hidden="true" size={13} fill="currentColor" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="Send question"
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-pf-text text-pf-bg transition-[opacity,transform] active:scale-90 disabled:opacity-40 disabled:active:scale-100"
                >
                  <ArrowUp aria-hidden="true" size={16} />
                </button>
              )}
            </div>
            <p className="m-0 mt-2 text-center text-[11px] text-pf-t7">
              AI-generated · may be imperfect
            </p>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatPanel;
