import { YEARS_EXPERIENCE } from "./experience";

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
  name: "Đào Tài",
  fullName: "Đào Tài",
  url: rawSiteUrl.replace(/\/+$/, ""),
  locale: "en_US",
  language: "en",
  themeColor: "#05070d",
  /** Square-ish portrait used as the Person image in structured data. */
  avatar: "/avatar-professional.webp",
  title: "Kendrick | Full-Stack Engineer – React, Next.js & Web3",
  description: `Đào Tài is a full-stack software engineer with ${YEARS_EXPERIENCE}+ years of experience building high-performance web apps, creative UI/UX, optimized back-end systems and Web3 products for international clients. Crafts fast, SEO-ready React and Next.js frontends with polished, creative interfaces, scalable Node.js and NestJS APIs, and wallet and on-chain integrations on Solana, BNB Chain, EVM and TON. Open to freelance and contract projects.`,
  shortDescription: `Full-stack engineer with ${YEARS_EXPERIENCE}+ years building high-performance web apps, creative UI/UX, optimized back-end systems and Web3 products with React, Next.js, Node.js and NestJS.`,
  jobTitle: "Full-Stack Software Engineer",
  email: "daotai.work@gmail.com",
  resume: "/resume.pdf",
  /** Shown by the chat assistant; can also be surfaced on the page. */
  availability: "Open to freelance and contract projects.",
  links: {
    // github: "https://github.com/youngcrizzal",
    linkedin: "https://www.linkedin.com/in/dao-tai-61757325a/",
    facebook: "https://www.facebook.com/YC011",
    telegram: "https://t.me/kendrick2dt",
  },
  keywords: [
    // Primary diacritic spelling, with ASCII fallbacks so searches typed
    // without Vietnamese diacritics still resolve.
    "Đào Tài",
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
    "high-performance web apps",
    "performance optimization",
    "UI/UX",
    "creative web design",
    "interactive UI",
    "backend architecture",
    "scalable APIs",
    "system optimization",
    "real-time systems",
    "WebSocket",
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
