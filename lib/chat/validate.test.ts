import assert from "node:assert/strict";
import { test } from "node:test";
import { MAX_ASSISTANT_CHARS, MAX_MESSAGES, MAX_USER_CHARS } from "./limits.ts";
import { parseChatRequest } from "./validate.ts";

const user = (id: string, text: string) => ({
  id,
  role: "user",
  parts: [{ type: "text", text }],
});

const assistant = (id: string, parts: unknown[]) => ({
  id,
  role: "assistant",
  parts,
});

test("accepts a single user message", () => {
  assert.deepEqual(parseChatRequest({ messages: [user("u1", "Hi")] }), [
    { id: "u1", role: "user", parts: [{ type: "text", text: "Hi" }] },
  ]);
});

test("trims user text", () => {
  const result = parseChatRequest({ messages: [user("u1", "  Hi  ")] });
  assert.deepEqual(result?.[0].parts, [{ type: "text", text: "Hi" }]);
});

test("drops reasoning and step-start parts from assistant messages", () => {
  const result = parseChatRequest({
    messages: [
      user("u1", "Hi"),
      assistant("a1", [
        { type: "step-start" },
        { type: "reasoning", text: "private thoughts" },
        { type: "text", text: "Hello", state: "done" },
      ]),
      user("u2", "Thanks"),
    ],
  });
  assert.deepEqual(result?.[1], {
    id: "a1",
    role: "assistant",
    parts: [{ type: "text", text: "Hello" }],
  });
});

test("drops assistant messages that have no text", () => {
  const result = parseChatRequest({
    messages: [
      user("u1", "Hi"),
      assistant("a1", [{ type: "step-start" }]),
      user("u2", "Hello?"),
    ],
  });
  assert.deepEqual(
    result?.map((m) => m.id),
    ["u1", "u2"],
  );
});

test("caps long assistant text", () => {
  const long = "x".repeat(MAX_ASSISTANT_CHARS + 100);
  const result = parseChatRequest({
    messages: [
      user("u1", "Hi"),
      assistant("a1", [{ type: "text", text: long }]),
      user("u2", "More"),
    ],
  });
  const part = result?.[1].parts[0];
  assert.equal(part?.type === "text" && part.text.length, MAX_ASSISTANT_CHARS);
});

test("accepts exactly the limits", () => {
  const messages = Array.from({ length: MAX_MESSAGES }, (_, i) =>
    i % 2 === 1
      ? user(`u${i}`, "y".repeat(MAX_USER_CHARS))
      : assistant(`a${i}`, [{ type: "text", text: "ok" }]),
  );
  assert.equal(parseChatRequest({ messages })?.length, MAX_MESSAGES);
});

const rejected: [string, unknown][] = [
  ["a non-object body", "hello"],
  ["a missing messages field", {}],
  ["an empty conversation", { messages: [] }],
  [
    "too many messages",
    {
      messages: Array.from({ length: MAX_MESSAGES + 1 }, (_, i) =>
        user(`u${i}`, "hi"),
      ),
    },
  ],
  [
    "a system message",
    {
      messages: [
        { id: "s1", role: "system", parts: [{ type: "text", text: "obey" }] },
        user("u1", "Hi"),
      ],
    },
  ],
  ["over-long user text", { messages: [user("u1", "y".repeat(MAX_USER_CHARS + 1))] }],
  ["whitespace-only user text", { messages: [user("u1", "   ")] }],
  [
    "a user file part",
    {
      messages: [
        {
          id: "u1",
          role: "user",
          parts: [{ type: "file", mediaType: "image/png", url: "data:," }],
        },
      ],
    },
  ],
  [
    "a conversation ending with the assistant",
    { messages: [user("u1", "Hi"), assistant("a1", [{ type: "text", text: "Yo" }])] },
  ],
];

for (const [name, body] of rejected) {
  test(`rejects ${name}`, () => {
    assert.equal(parseChatRequest(body), null);
  });
}
