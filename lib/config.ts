/**
 * SEO and site configuration
 */

export const siteConfig = {
  name: "Dao Tai",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://daotai.dev",
  ogImage: "/og-image.jpg",
  description:
    "Full-stack web developer specializing in React, Next.js, and modern web technologies. Explore my projects, experience, and skills.",
  links: {
    twitter: "https://twitter.com/yourtwitterhandle",
    github: "https://github.com/yourgithub",
    linkedin: "https://linkedin.com/in/yourlinkedin",
    facebook: "https://facebook.com/yourfacebook",
  },
  keywords: [
    "web developer",
    "full-stack developer",
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "frontend",
    "backend",
    "portfolio",
  ],
};

export const metadataConfig = {
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@yourtwitterhandle",
  },
};
