import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, streamText } from "ai";
import { CHAT_INSTRUCTIONS } from "@/lib/chat/context";
import { createRateLimiter } from "@/lib/chat/rate-limit";
import { parseChatRequest } from "@/lib/chat/validate";

export const maxDuration = 30;

const DEFAULT_MODEL = "google/gemma-4-31b-it:free";
// If the primary free model is rate-limited or down, OpenRouter tries these in order.
// Not "openrouter/free": its pool includes a content-safety classifier.
const FALLBACK_MODELS = [
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
];

const allow = createRateLimiter({ limit: 10, windowMs: 60_000 });

const jsonError = (error: string, status: number) =>
  Response.json({ error }, { status });

// Browsers always send Origin on cross-site POSTs; a mismatch means another site is using our quota.
const isForeignOrigin = (req: Request) => {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host !== req.headers.get("host");
  } catch {
    return true;
  }
};

export const POST = async (req: Request) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("[chat] OPENROUTER_API_KEY is not set");
    return jsonError("Chat is not configured.", 500);
  }

  if (isForeignOrigin(req)) return jsonError("Forbidden.", 403);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!allow(ip)) return jsonError("Too many messages. Try again in a minute.", 429);

  const messages = parseChatRequest(await req.json().catch(() => null));
  if (!messages) return jsonError("Invalid chat request.", 400);

  const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
  const openrouter = createOpenRouter({ apiKey });

  const result = streamText({
    model: openrouter(model),
    instructions: CHAT_INSTRUCTIONS,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 600,
    temperature: 0.3,
    providerOptions: {
      openrouter: { models: Array.from(new Set([model, ...FALLBACK_MODELS])) },
    },
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: false,
    onError: (error) => {
      console.error("[chat] stream failed", error);
      return "The assistant is busy right now.";
    },
  });
};
