/**
 * Single source of truth for site-wide metadata (SEO, Open Graph, JSON-LD, manifest).
 *
 * Set NEXT_PUBLIC_SITE_URL to the canonical production origin (no trailing slash),
 * e.g. https://dao-tai.vercel.app or a custom domain. It drives metadataBase,
 * canonical URLs, the sitemap and robots.txt.
 */
const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dao-tai.vercel.app";

export const siteConfig = {
  name: "Dao Tai",
  fullName: "Dao Duc Tai",
  url: rawSiteUrl.replace(/\/+$/, ""),
  locale: "en_US",
  language: "en",
  themeColor: "#05070d",
  /** Square-ish portrait used as the Person image in structured data. */
  avatar: "/avatar-professional.webp",
  title: "Dao Duc Tai | Software Engineering",
  description:
    "Software Engineering with 4+ years of experience building real-time systems, Web3 platforms, and modern web applications. Specializing in React, Next.js, Node.js, NestJS, and blockchain integrations across Solana, BNB Chain, and EVM ecosystems.",
  shortDescription:
    "Software Engineering building real-time systems, Web3 platforms, and modern web apps with React, Next.js, Node.js and NestJS.",
  jobTitle: "Software Engineering",
  email: "daotai.work@gmail.com",
  resume: "/resume.pdf",
  links: {
    github: "https://github.com/youngcrizzal",
    linkedin: "https://www.linkedin.com/in/dao-tai-61757325a/",
  },
  keywords: [
    "Dao Duc Tai",
    "Dao Tai",
    "Software Engineering",
    "web developer",
    "React developer",
    "Next.js developer",
    "Node.js developer",
    "NestJS developer",
    "TypeScript",
    "Web3 developer",
    "blockchain developer",
    "Solana developer",
    "real-time systems",
    "WebSocket",
    "performance optimization",
    "portfolio",
    "frontend developer",
    "backend developer",
  ],
};

/** Hostname for display, e.g. "dao-tai.vercel.app". */
export const siteHost = new URL(siteConfig.url).host;

/** Resolve a site-relative path to an absolute URL on the canonical origin. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, `${siteConfig.url}/`).toString();
}
