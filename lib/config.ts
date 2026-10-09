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
  title: "Dao Duc Tai | Full-Stack Software Engineer",
  description:
    "Full-stack software engineer with 4+ years of experience shipping real-time trading platforms, Web3 products, booking engines and admin CMSs for international clients. Owns features end to end with React, Next.js, Node.js and NestJS, from performance-tuned UIs and REST/WebSocket APIs to wallet and on-chain integrations on Solana, BNB Chain, EVM and TON.",
  shortDescription:
    "Full-stack software engineer shipping real-time trading platforms, Web3 products and production web apps with React, Next.js, Node.js and NestJS.",
  jobTitle: "Full-Stack Software Engineer",
  email: "daotai.work@gmail.com",
  resume: "/resume.pdf",
  /** Shown by the chat assistant; can also be surfaced on the page. */
  availability: "Open to freelance and contract projects.",
  links: {
    github: "https://github.com/youngcrizzal",
    linkedin: "https://www.linkedin.com/in/dao-tai-61757325a/",
  },
  keywords: [
    "Dao Duc Tai",
    "Dao Tai",
    "Software Engineer",
    "Full-Stack Software Engineer",
    "full-stack developer",
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
