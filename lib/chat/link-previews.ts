/** Preview cards for the links the assistant knows about. No network: matched against site config. */
import type { Segment } from "./linkify";

export type PreviewKind = "linkedin" | "email" | "github" | "resume" | "website";

export type PreviewTarget = {
  kind: PreviewKind;
  href: string;
  title: string;
  subtitle: string;
};

type PreviewProfile = {
  name: string;
  email: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
  websiteUrl: string;
};

const MAX_PREVIEWS = 2;

/** Compares links loosely: case, `www.`, trailing slash, query and hash don't matter. */
const normalize = (href: string) => {
  if (href.toLowerCase().startsWith("mailto:")) return href.toLowerCase();
  try {
    const url = new URL(href);
    const host = url.host.toLowerCase().replace(/^www\./, "");
    return `${host}${url.pathname.replace(/\/+$/, "")}`;
  } catch {
    return href;
  }
};

const hostOf = (href: string) => {
  try {
    return new URL(href).host.replace(/^www\./, "");
  } catch {
    return href;
  }
};

/** Ordered by priority: LinkedIn leads, as the preferred way to get in touch. */
export const buildPreviewTargets = (profile: PreviewProfile): PreviewTarget[] => [
  {
    kind: "linkedin",
    href: profile.linkedin,
    title: "LinkedIn",
    subtitle: `${profile.name} · Connect or message`,
  },
  {
    kind: "email",
    href: `mailto:${profile.email}`,
    title: "Email",
    subtitle: profile.email,
  },
  {
    kind: "github",
    href: profile.github,
    title: "GitHub",
    subtitle: `@${new URL(profile.github).pathname.replace(/^\/|\/$/g, "")}`,
  },
  {
    kind: "resume",
    href: profile.resumeUrl,
    title: "Resume",
    subtitle: `PDF · ${profile.name}`,
  },
  {
    kind: "website",
    href: profile.websiteUrl,
    title: "Portfolio",
    subtitle: hostOf(profile.websiteUrl),
  },
];

/** The known links in a message, in priority order, without duplicates. */
export const pickPreviews = (
  segments: Segment[],
  targets: PreviewTarget[],
): PreviewTarget[] => {
  const linked = new Set(
    segments.flatMap((segment) =>
      segment.type === "link" ? [normalize(segment.href)] : [],
    ),
  );
  return targets
    .filter((target) => linked.has(normalize(target.href)))
    .slice(0, MAX_PREVIEWS);
};
