import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { BeamsBackground } from "@/components/common/BeamsBackground";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://daotai.dev";
const siteName = "Dao Tai Portfolio";
const description =
  "Full-stack web developer specializing in React, Next.js, and modern web technologies. Explore my projects and experience.";

export const metadata: Metadata = {
  title: {
    default: "Dao Tai | Full-Stack Web Developer",
    template: "%s | Dao Tai",
  },
  description,
  keywords: [
    "web developer",
    "full-stack developer",
    "React",
    "Next.js",
    "TypeScript",
    "portfolio",
  ],
  authors: [{ name: "Dao Duc Tai" }],
  creator: "Dao Duc Tai",
  publisher: "Dao Tai",
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
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: "Dao Tai | Full-Stack Web Developer",
    description,
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Dao Tai Portfolio",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dao Tai | Full-Stack Web Developer",
    description,
    images: [`${siteUrl}/og-image.jpg`],
    creator: "@yourtwitterhandle",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  formatDetection: {
    email: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://daotai.dev";

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Dao Duc Tai",
    url: siteUrl,
    jobTitle: "Full-Stack Web Developer",
    description:
      "Full-stack web developer specializing in React, Next.js, and modern web technologies",
    sameAs: [
      "https://github.com/yourgithub",
      "https://linkedin.com/in/yourlinkedin",
      "https://facebook.com/yourfacebook",
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Dao Tai" />

        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Canonical URL */}
        <link rel="canonical" href={siteUrl} />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${jakarta.variable} ${grotesk.variable} bg-light bg-cover bg-center bg-repeat-y`}
      >
        <ThemeProvider>
          <BeamsBackground intensity="strong" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
