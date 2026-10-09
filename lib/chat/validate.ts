import type { UIMessage } from "ai";
import { z } from "zod";
import { MAX_ASSISTANT_CHARS, MAX_MESSAGES, MAX_USER_CHARS } from "./limits.ts";

const userMessage = z.object({
  id: z.string(),
  role: z.literal("user"),
  parts: z
    .array(
      z.object({
        type: z.literal("text"),
        text: z.string().trim().min(1).max(MAX_USER_CHARS),
      }),
    )
    .length(1),
});

// Assistant messages come back from the client as streamed: step-start, reasoning and text parts.
const assistantMessage = z.object({
  id: z.string(),
  role: z.literal("assistant"),
  parts: z.array(z.looseObject({ type: z.string() })).max(50),
});

const chatRequest = z.object({
  messages: z
    .array(z.discriminatedUnion("role", [userMessage, assistantMessage]))
    .min(1)
    .max(MAX_MESSAGES),
});

const textOf = (parts: ReadonlyArray<{ type: string; text?: unknown }>) =>
  parts
    .flatMap((part) =>
      part.type === "text" && typeof part.text === "string" ? [part.text] : [],
    )
    .join("");

/**
 * Checks a /api/chat body and returns the conversation reduced to plain text, or null if it's
 * invalid. The client controls this history, so only user/assistant text ever reaches the model.
 */
export const parseChatRequest = (body: unknown): UIMessage[] | null => {
  const parsed = chatRequest.safeParse(body);
  if (!parsed.success) return null;

  const { messages } = parsed.data;
  if (messages[messages.length - 1].role !== "user") return null;

  return messages.flatMap((message): UIMessage[] => {
    const text =
      message.role === "user"
        ? message.parts[0].text
        : textOf(message.parts).slice(0, MAX_ASSISTANT_CHARS);
    if (!text) return [];
    return [{ id: message.id, role: message.role, parts: [{ type: "text", text }] }];
  });
};
