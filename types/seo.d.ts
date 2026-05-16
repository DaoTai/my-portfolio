/**
 * Type definitions for SEO and configuration
 */

export interface SiteConfig {
  name: string;
  url: string;
  ogImage: string;
  description: string;
  links: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    email?: string;
  };
  keywords: string[];
}

export interface MetadataConfig {
  openGraph: {
    type: "website" | "article" | "profile";
    locale: string;
    url: string;
    siteName: string;
  };
  twitter: {
    card: "summary" | "summary_large_image" | "app" | "player";
    creator: string;
  };
}

export interface StructuredData {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: any;
}

export interface OptimizationMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
}

export interface ImageOptimizationConfig {
  formats: ("image/avif" | "image/webp" | "image/jpeg" | "image/png")[];
  deviceSizes: number[];
  imageSizes: number[];
  quality: number;
  preload: boolean;
}

export interface SecurityHeaders {
  [key: string]: string;
}

export interface CacheConfig {
  default: string; // Cache-Control header default
  static: string; // For static assets
  dynamic: string; // For dynamic content
}
