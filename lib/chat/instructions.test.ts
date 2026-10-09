import assert from "node:assert/strict";
import { test } from "node:test";
import { buildChatInstructions, type ChatKnowledge } from "./instructions.ts";

const knowledge: ChatKnowledge = {
  profile: {
    fullName: "Dao Duc Tai",
    name: "Dao Tai",
    englishName: "Kendrick",
    jobTitle: "Software Engineering",
    description: "Builds real-time systems.",
    email: "me@example.com",
    github: "https://github.com/example",
    linkedin: "https://linkedin.com/in/example",
    resumeUrl: "https://example.com/resume.pdf",
    websiteUrl: "https://example.com",
    availability: "Open to freelance and contract projects.",
  },
  experience: [
    {
      companyName: "Twendee",
      positionWork: "Junior Software Engineering",
      startTime: "June 2024",
      endTime: "Present",
      summary: "Web3 platforms.",
    },
  ],
  techGroups: [
    { title: "Backend", desc: "APIs.", items: [{ name: "NestJS" }, { name: "Redis" }] },
  ],
  techDescriptions: { NestJS: "Node.js framework." },
  projects: [
    {
      name: "Bullbit",
      role: "Software Engineering",
      tags: ["Next.js", "WebSocket"],
      summary: "Crypto exchange.",
      responsibilities: ["Built the trading UI."],
      highlights: ["Real-time market data"],
    },
  ],
};

const prompt = buildChatInstructions(knowledge);

test("puts the rules before the data", () => {
  assert.ok(prompt.indexOf("Rules:") >= 0);
  assert.ok(prompt.indexOf("Rules:") < prompt.indexOf("PORTFOLIO DATA"));
});

test("grounds answers and names the fallback contact", () => {
  assert.match(prompt, /Answer only from the PORTFOLIO DATA/);
  assert.match(
    prompt,
    /suggest asking on LinkedIn \(https:\/\/linkedin\.com\/in\/example\) or emailing me@example\.com/,
  );
});

test("includes every profile fact", () => {
  for (const fact of [
    "Dao Duc Tai",
    "Kendrick",
    "Builds real-time systems.",
    "https://github.com/example",
    "https://linkedin.com/in/example",
    "https://example.com/resume.pdf",
    "Open to freelance and contract projects.",
  ]) {
    assert.ok(prompt.includes(fact), `missing ${fact}`);
  }
});

test("includes experience, tech and projects", () => {
  for (const fact of [
    "- Junior Software Engineering at Twendee (June 2024 – Present): Web3 platforms.",
    "Backend (APIs.)",
    "  - NestJS: Node.js framework.",
    "  - Redis",
    "### Bullbit — Software Engineering",
    "Tags: Next.js, WebSocket",
    "  - Built the trading UI.",
    "  - Real-time market data",
  ]) {
    assert.ok(prompt.includes(fact), `missing ${fact}`);
  }
});

test("points contact questions to LinkedIn first, email second", () => {
  assert.match(
    prompt,
    /how to contact or hire Dao Tai, lead with LinkedIn \(https:\/\/linkedin\.com\/in\/example\), then offer me@example\.com/,
  );
});

test("introduces the author with the Vietnamese and English names", () => {
  assert.match(
    prompt,
    /Name: Dao Duc Tai \(Vietnamese name: Dao Tai, English name: Kendrick\)/,
  );
  assert.match(
    prompt,
    /When asked who the author is or who Dao Tai is, introduce him as Dao Duc Tai and mention both his Vietnamese name "Dao Tai" and his English name "Kendrick"\./,
  );
});
