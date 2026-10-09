import assert from "node:assert/strict";
import { test } from "node:test";
import { buildPreviewTargets, pickPreviews } from "./link-previews.ts";
import { linkify } from "./linkify.ts";

const targets = buildPreviewTargets({
  name: "Dao Tai",
  email: "me@example.com",
  github: "https://github.com/example",
  linkedin: "https://www.linkedin.com/in/example/",
  resumeUrl: "https://example.com/resume.pdf",
  websiteUrl: "https://example.com",
});

const kindsFor = (text: string) =>
  pickPreviews(linkify(text), targets).map((preview) => preview.kind);

test("no known links, no previews", () => {
  assert.deepEqual(kindsFor("Tai builds Web3 apps. See https://solana.com"), []);
});

test("matches known links regardless of www, case or trailing slash", () => {
  assert.deepEqual(kindsFor("Find him at https://LinkedIn.com/in/example"), [
    "linkedin",
  ]);
  assert.deepEqual(kindsFor("Code: https://github.com/example/"), ["github"]);
});

test("matches markdown links and emails", () => {
  assert.deepEqual(kindsFor("[Resume](https://example.com/resume.pdf)"), ["resume"]);
  assert.deepEqual(kindsFor("Write to me@example.com."), ["email"]);
});

test("LinkedIn comes first, duplicates collapse, at most two cards", () => {
  assert.deepEqual(
    kindsFor(
      "Email me@example.com, GitHub https://github.com/example, " +
        "LinkedIn https://www.linkedin.com/in/example/ or again me@example.com",
    ),
    ["linkedin", "email"],
  );
});

test("a URL still streaming in doesn't match", () => {
  assert.deepEqual(kindsFor("See https://github.com/exam"), []);
});

test("targets carry a display title and the canonical href", () => {
  const github = targets.find((target) => target.kind === "github");
  assert.deepEqual(github, {
    kind: "github",
    href: "https://github.com/example",
    title: "GitHub",
    subtitle: "@example",
  });
  const email = targets.find((target) => target.kind === "email");
  assert.equal(email?.href, "mailto:me@example.com");
});
