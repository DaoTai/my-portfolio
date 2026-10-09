import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { absoluteUrl, siteConfig } from "@/lib/config";
import { TECH_GROUPS } from "@/lib/portfolio-data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: siteConfig.themeColor,
  colorScheme: "dark light",
};

// Icons come from the file conventions app/favicon.ico, app/icon1.svg, app/icon2.png and
// app/apple-icon.png; OG/Twitter images from app/opengraph-image.tsx and
// app/twitter-image.tsx. Don't duplicate them here.
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.fullName}`,
  },
  description: siteConfig.description,
  applicationName: `${siteConfig.name} Portfolio`,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.fullName, url: siteConfig.url }],
  creator: siteConfig.fullName,
  publisher: siteConfig.fullName,
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: `${siteConfig.fullName} Portfolio`,
    title: siteConfig.title,
    description: siteConfig.shortDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.shortDescription,
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

const knowsAbout = Array.from(
  new Set([
    "JavaScript",
    "TypeScript",
    ...TECH_GROUPS.flatMap((group) => group.items.map((tech) => tech.name)),
    "WebSocket",
    "Web3",
    "Blockchain",
    "Solana",
  ]),
);

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      url: absoluteUrl("/"),
      name: `${siteConfig.fullName} Portfolio`,
      alternateName: siteConfig.name,
      description: siteConfig.description,
      inLanguage: siteConfig.language,
      publisher: { "@id": absoluteUrl("/#person") },
    },
    {
      "@type": "ProfilePage",
      "@id": absoluteUrl("/#profilepage"),
      url: absoluteUrl("/"),
      name: siteConfig.title,
      inLanguage: siteConfig.language,
      isPartOf: { "@id": absoluteUrl("/#website") },
      about: { "@id": absoluteUrl("/#person") },
      mainEntity: { "@id": absoluteUrl("/#person") },
    },
    {
      "@type": "Person",
      "@id": absoluteUrl("/#person"),
      name: siteConfig.fullName,
      alternateName: siteConfig.name,
      url: absoluteUrl("/"),
      image: absoluteUrl(siteConfig.avatar),
      email: `mailto:${siteConfig.email}`,
      jobTitle: siteConfig.jobTitle,
      description: siteConfig.description,
      knowsAbout,
      sameAs: Object.values(siteConfig.links).filter(Boolean),
    },
  ],
};

// Escape "<" so content can never close the <script> tag early.
const jsonLdHtml = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={siteConfig.language} suppressHydrationWarning>
      <head>
        {/* The hero art is the LCP, but as a CSS-variable background it is only found after
            the stylesheet applies. Dark is the default theme, so fetch its version first. */}
        <link
          rel="preload"
          as="image"
          href="/bg/hero-dark.webp"
          type="image/webp"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdHtml }}
        />
      </head>
      <body className={`${inter.variable} ${interTight.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
