"use client";

import { type UIMessage } from "ai";
import { Mail, RotateCcw } from "lucide-react";
import { memo } from "react";
import { pickPreviews } from "@/lib/chat/link-previews";
import { linkify } from "@/lib/chat/linkify";
import { siteConfig } from "@/lib/config";
import { gmailComposeUrl } from "@/lib/contact";
import { LinkPreview, PREVIEW_TARGETS } from "./LinkPreview";

// Memoized: the whole list re-renders on every streamed token, but only the last message changes.
export const Bubble = memo(
  ({ role, text }: { role: UIMessage["role"]; text: string }) => {
    const segments = linkify(text);
    const previews =
      role === "assistant" ? pickPreviews(segments, PREVIEW_TARGETS) : [];

    return (
      // `chat-bubble` runs the entrance keyframe once, on mount — a CSS animation rather
      // than a motion component so streamed tokens cost no extra JS per message.
      <div
        className={
          role === "user"
            ? "chat-bubble flex max-w-[85%] flex-col gap-2 self-end"
            : "chat-bubble flex max-w-[90%] flex-col gap-2 self-start"
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

export const TypingDots = () => (
  <div
    role="status"
    aria-label="Assistant is typing"
    className="chat-bubble flex gap-1 self-start rounded-2xl rounded-bl-md border border-pf-ink/[0.08] bg-pf-bg3 px-3.5 py-3.5"
  >
    {[0, 1, 2].map((i) => (
      <span key={i} className="chat-dot size-1.5 rounded-full bg-pf-t6" />
    ))}
  </div>
);

const actionClass =
  "inline-flex items-center gap-1.5 rounded-full border border-pf-ink/15 px-3 py-1.5 text-[13px] font-medium text-pf-text transition-colors hover:border-pf-g3 active:scale-95";

export const BusyNotice = ({ onRetry }: { onRetry: () => void }) => (
  <div
    role="alert"
    className="chat-bubble rounded-2xl border border-pf-ink/10 bg-pf-bg3 p-3.5 text-[13px] leading-relaxed text-pf-t4"
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
