import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/lib/config";

// The site is a single page (section anchors like /#projects are not separate
// URLs to crawlers), plus the downloadable resume.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl(siteConfig.resume),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
