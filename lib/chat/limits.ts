/** Caps shared by the chat route and panel. No imports, so the client bundle stays small. */
/** Messages sent to the model: the most recent window of the conversation. */
export const MAX_MESSAGES = 20;
/** Payload guard: most messages one request may carry (useChat posts the full history each send). */
export const MAX_REQUEST_MESSAGES = 100;
export const MAX_USER_CHARS = 500;
/** Earlier answers are trimmed to this before being sent back to the model. */
export const MAX_ASSISTANT_CHARS = 4000;
