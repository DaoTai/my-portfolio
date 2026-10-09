import assert from "node:assert/strict";
import { test } from "node:test";
import { linkify } from "./linkify.ts";

test("plain text stays a single text segment", () => {
  assert.deepEqual(linkify("Hello there"), [
    { type: "text", text: "Hello there" },
  ]);
});

test("bare URLs become links, without trailing punctuation", () => {
  assert.deepEqual(linkify("See https://github.com/tai."), [
    { type: "text", text: "See " },
    { type: "link", text: "https://github.com/tai", href: "https://github.com/tai" },
    { type: "text", text: "." },
  ]);
});

test("an unmatched closing paren is left outside the link", () => {
  assert.deepEqual(linkify("(resume: https://x.dev/cv.pdf)"), [
    { type: "text", text: "(resume: " },
    { type: "link", text: "https://x.dev/cv.pdf", href: "https://x.dev/cv.pdf" },
    { type: "text", text: ")" },
  ]);
});

test("balanced parens inside a URL are kept", () => {
  const url = "https://en.wikipedia.org/wiki/Next.js_(framework)";
  assert.deepEqual(linkify(url), [{ type: "link", text: url, href: url }]);
});

test("markdown links use their label", () => {
  assert.deepEqual(linkify("My [LinkedIn](https://linkedin.com/in/tai) page"), [
    { type: "text", text: "My " },
    { type: "link", text: "LinkedIn", href: "https://linkedin.com/in/tai" },
    { type: "text", text: " page" },
  ]);
});

test("emails become mailto links", () => {
  assert.deepEqual(linkify("Email daotai.work@gmail.com."), [
    { type: "text", text: "Email " },
    {
      type: "link",
      text: "daotai.work@gmail.com",
      href: "mailto:daotai.work@gmail.com",
    },
    { type: "text", text: "." },
  ]);
});

test("non-http schemes are not linked", () => {
  assert.deepEqual(linkify("javascript:alert(1)"), [
    { type: "text", text: "javascript:alert(1)" },
  ]);
});
