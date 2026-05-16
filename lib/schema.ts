/**
 * Utility functions for generating structured data (JSON-LD)
 */

interface PersonSchema {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  jobTitle: string;
  description: string;
  sameAs: string[];
}

interface ProjectSchema {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}

interface BreadcrumbSchema {
  "@context": string;
  "@type": string;
  itemListElement: Array<{
    "@type": string;
    position: number;
    name: string;
    item?: string;
  }>;
}

export function generatePersonSchema(data: {
  name: string;
  title: string;
  description: string;
  siteUrl: string;
  socialLinks: Record<string, string>;
}): PersonSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.name,
    url: data.siteUrl,
    jobTitle: data.title,
    description: data.description,
    sameAs: Object.values(data.socialLinks).filter(Boolean),
  };
}

export function generateProjectSchema(data: {
  name: string;
  description: string;
  siteUrl: string;
  projectSlug: string;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
}): ProjectSchema {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: data.name,
    description: data.description,
    url: `${data.siteUrl}/projects/${data.projectSlug}`,
    ...(data.imageUrl && { image: data.imageUrl }),
    ...(data.datePublished && { datePublished: data.datePublished }),
    ...(data.dateModified && { dateModified: data.dateModified }),
  };
}

export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url?: string }>,
): BreadcrumbSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      ...(breadcrumb.url && { item: breadcrumb.url }),
    })),
  };
}
