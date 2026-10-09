/** Splits chat text into plain runs and links. No imports, so the client bundle stays small. */
export type Segment =
  | { type: "text"; text: string }
  | { type: "link"; text: string; href: string };

// [label](url) the model sometimes writes despite "plain text only", a bare URL, or an email.
const LINK =
  /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<>]+)|([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

// Sentence punctuation right after a URL ("see https://x.dev.") isn't part of it.
const TRAILING = /[.,;:!?'"]+$/;

const trimUrl = (url: string) => {
  let trimmed = url.replace(TRAILING, "");
  // Drop an unmatched closing paren, e.g. "(see https://x.dev)".
  while (
    trimmed.endsWith(")") &&
    (trimmed.match(/\(/g)?.length ?? 0) < (trimmed.match(/\)/g)?.length ?? 0)
  ) {
    trimmed = trimmed.slice(0, -1).replace(TRAILING, "");
  }
  return trimmed;
};

export const linkify = (text: string): Segment[] => {
  const segments: Segment[] = [];
  let cursor = 0;
  const pushText = (end: number) => {
    if (end > cursor) segments.push({ type: "text", text: text.slice(cursor, end) });
  };

  for (const match of text.matchAll(LINK)) {
    const [whole, label, labelUrl, bareUrl, email] = match;
    const start = match.index;
    pushText(start);

    if (label && labelUrl) {
      segments.push({ type: "link", text: label, href: labelUrl });
      cursor = start + whole.length;
    } else if (bareUrl) {
      const url = trimUrl(bareUrl);
      segments.push({ type: "link", text: url, href: url });
      cursor = start + url.length;
    } else {
      segments.push({ type: "link", text: email, href: `mailto:${email}` });
      cursor = start + whole.length;
    }
  }

  pushText(text.length);
  return segments;
};
