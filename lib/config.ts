export const siteConfig = {
  name: "Dao Tai",
  fullName: "Dao Duc Tai",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://dao-tai.vercel.app",
  ogImage: "/og-image.jpg",
  avatar: "/avatar.jpg",
  description:
    "Full-stack JavaScript developer with 4+ years of experience building real-time systems, Web3 platforms, and modern web applications. Specializing in React, Next.js, Node.js, NestJS, and blockchain integrations across Solana, BNB Chain, and EVM ecosystems.",
  jobTitle: "Full-Stack JavaScript Developer",
  links: {
    github: "https://github.com/youngcrizzal",
    linkedin: "https://www.linkedin.com/in/dao-tai-61757325a/",
  },
  keywords: [
    "full-stack JavaScript developer",
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

export const metadataConfig = {
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
  },
};
