"use client";

import { useChat } from "@ai-sdk/react";
import { isTextUIPart, type UIMessage } from "ai";
import { ArrowUp, Mail, RotateCcw, Square, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { memo, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { pickPreviews } from "@/lib/chat/link-previews";
import { MAX_USER_CHARS } from "@/lib/chat/limits";
import { linkify } from "@/lib/chat/linkify";
import { siteConfig } from "@/lib/config";
import { gmailComposeUrl } from "@/lib/contact";
import { LinkPreview, PREVIEW_TARGETS } from "./LinkPreview";

const STARTERS = [
  "What has Tai built in Web3?",
  "Is Tai open to freelance work?",
  "Which projects use NestJS?",
  "How can I contact Tai?",
];

const textOf = (message: UIMessage) =>
  message.parts
    .filter(isTextUIPart)
    .map((part) => part.text)
    .join("");

// Memoized: the whole list re-renders on every streamed token, but only the last message changes.
const Bubble = memo(
  ({ role, text }: { role: UIMessage["role"]; text: string }) => {
    const segments = linkify(text);
    const previews =
      role === "assistant" ? pickPreviews(segments, PREVIEW_TARGETS) : [];

    return (
      <div
        className={
          role === "user"
            ? "flex max-w-[85%] flex-col gap-2 self-end"
            : "flex max-w-[90%] flex-col gap-2 self-start"
        }
      >
        <div
          className={
            role === "user"
              ? "whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-pf-text px-3.5 py-2.5 text-sm leading-relaxed text-pf-bg"
              : "whitespace-pre-wrap break-words rounded-2xl rounded-bl-md border border-pf-ink/[0.08] bg-pf-bg3 px-3.5 py-2.5 text-sm leading-relaxed text-pf-text2"
          }
        >
          {segments.map((segment, i) =>
            segment.type === "link" ? (
              <a
                key={i}
                href={segment.href}
                {...(segment.href.startsWith("mailto:")
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
                className="underline underline-offset-2 transition-opacity hover:opacity-75"
              >
                {segment.text}
              </a>
            ) : (
              segment.text
            ),
          )}
        </div>
        {previews.map((preview) => (
          <LinkPreview key={preview.kind} preview={preview} />
        ))}
      </div>
    );
  },
);
Bubble.displayName = "Bubble";

const TypingDots = () => (
  <div
    role="status"
    aria-label="Assistant is typing"
    className="flex gap-1 self-start rounded-2xl rounded-bl-md border border-pf-ink/[0.08] bg-pf-bg3 px-3.5 py-3.5"
  >
    {[0, 150, 300].map((delay) => (
      <span
        key={delay}
        className="size-1.5 animate-bounce rounded-full bg-pf-t6 motion-reduce:animate-none"
        style={{ animationDelay: `${delay}ms` }}
      />
    ))}
  </div>
);

const actionClass =
  "inline-flex items-center gap-1.5 rounded-full border border-pf-ink/15 px-3 py-1.5 text-[13px] font-medium text-pf-text transition-colors hover:border-pf-g3";

const BusyNotice = ({ onRetry }: { onRetry: () => void }) => (
  <div
    role="alert"
    className="rounded-2xl border border-pf-ink/10 bg-pf-bg3 p-3.5 text-[13px] leading-relaxed text-pf-t4"
  >
    The assistant is busy right now. You can email Tai at {siteConfig.email}.
    <div className="mt-2.5 flex gap-2">
      <button type="button" onClick={onRetry} className={actionClass}>
        <RotateCcw aria-hidden="true" size={14} /> Retry
      </button>
      <a
        href={gmailComposeUrl({ subject: "Hello from your portfolio" })}
        target="_blank"
        rel="noopener noreferrer"
        className={actionClass}
      >
        <Mail aria-hidden="true" size={14} /> Email
      </a>
    </div>
  </div>
);

type ChatPanelProps = { open: boolean; onClose: () => void };

const ChatPanel = ({ open, onClose }: ChatPanelProps) => {
  const reduce = useReducedMotion();
  const { messages, sendMessage, status, error, stop, regenerate } = useChat();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // Whether the list sits at the bottom, so streaming text doesn't yank a reader scrolled up.
  const pinnedRef = useRef(true);
  const stoppedRef = useRef(false);

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

  // Keep the newest text in view while the answer streams in, unless the reader scrolled up.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (pinnedRef.current || last?.role === "user") {
      list.scrollTop = list.scrollHeight;
      pinnedRef.current = true;
    }
  }, [messages, status, open, last?.role]);

  const onListScroll = () => {
    const list = listRef.current;
    if (list) {
      pinnedRef.current =
        list.scrollHeight - list.scrollTop - list.clientHeight < 80;
    }
  };

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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="chat-panel"
          role="dialog"
          aria-label="Ask about Tai"
          initial={reduce ? false : { opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="fixed inset-x-4 bottom-20 z-40 flex h-[min(560px,calc(100dvh-11rem))] origin-bottom-right flex-col overflow-hidden rounded-3xl border border-pf-ink/10 bg-pf-bg2 shadow-[0_24px_80px_-20px_rgba(var(--glow3),0.45)] sm:inset-x-auto sm:bottom-[88px] sm:right-6 sm:w-[380px]"
        >
          <div className="flex items-center justify-between border-b border-pf-ink/10 px-5 py-4">
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
              className="grid size-9 place-items-center rounded-full text-pf-t6 transition-colors hover:bg-pf-ink/10 hover:text-pf-text"
            >
              <X aria-hidden="true" size={18} />
            </button>
          </div>

          <div
            ref={listRef}
            onScroll={onListScroll}
            aria-live="polite"
            aria-busy={busy}
            className="flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-5 py-4"
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
                    className="rounded-full border border-pf-ink/15 px-3 py-1.5 text-left text-[13px] text-pf-t3 transition-colors hover:border-pf-g3 hover:text-pf-text"
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
            className="border-t border-pf-ink/10 px-4 pb-3 pt-3"
          >
            <div className="flex items-center gap-2 rounded-full border border-pf-ink/15 bg-pf-base/40 py-1.5 pl-4 pr-1.5 focus-within:border-pf-g3">
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
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-pf-text text-pf-bg"
                >
                  <Square aria-hidden="true" size={13} fill="currentColor" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="Send question"
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-pf-text text-pf-bg transition-opacity disabled:opacity-40"
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
