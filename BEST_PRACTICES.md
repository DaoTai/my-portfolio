# Next.js Portfolio - SEO & Performance Best Practices

## 🖼️ Image Best Practices

### ✅ DO

```tsx
import Image from 'next/image';

// For hero/LCP images
<Image
  src="/hero.jpg"
  alt="Hero section"
  width={1200}
  height={630}
  priority={true}
  quality={85}
/>

// For below-the-fold images
<Image
  src="/portfolio-item.jpg"
  alt="Portfolio item"
  width={400}
  height={300}
  loading="lazy"
/>
```

### ❌ DON'T

```tsx
// Don't use HTML img tag
<img src="/image.jpg" alt="description" />

// Don't use images without dimensions
<Image src="/image.jpg" alt="description" />

// Don't load all images with priority
<Image src="/image.jpg" priority />
```

---

## 🔤 Font Best Practices

### ✅ DO

```tsx
// Use Google Fonts with next/font
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap", // Shows fallback while loading
  variable: "--font-body",
});

// Use CSS custom properties
<div className={jakarta.variable}>{/* Content */}</div>;
```

### ❌ DON'T

```tsx
// Don't import from Google CDN directly
@import url('https://fonts.googleapis.com/...');

// Don't use preload: false (degrades performance)
const font = Plus_Jakarta_Sans({ preload: false });

// Don't load too many weights
// Stick to: 400, 500, 600, 700
```

---

## 📋 Metadata Best Practices

### ✅ DO

```tsx
export const metadata: Metadata = {
  title: "Descriptive Title - Dao Tai",
  description: "Clear, compelling description under 160 chars",
  keywords: ["relevant", "keywords"],
  openGraph: {
    title: "Open Graph Title",
    description: "Description for sharing",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};
```

### ❌ DON'T

```tsx
// Don't use vague titles
export const metadata = {
  title: "Home",
};

// Don't duplicate content
description: "Lorem ipsum dolor sit amet consectetur...";

// Don't forget OG images
// Don't include special characters
title: "Home | @#$% | Portfolio";
```

---

## ⚡ Performance Best Practices

### 1. Code Splitting

```tsx
// ✅ Load heavy components only when needed
import dynamic from "next/dynamic";

const HeavyAnimation = dynamic(() => import("./HeavyAnimation"), {
  loading: () => <div>Loading...</div>,
});

export default function Page() {
  return <HeavyAnimation />;
}
```

### 2. Lazy Loading

```tsx
// ✅ For below-the-fold content
<Image loading="lazy" src="..." alt="..." />;

// ✅ For components
const Component = dynamic(() => import("./Component"), {
  loading: () => <Skeleton />,
  ssr: false, // If only needed on client
});
```

### 3. Optimize Dependencies

```bash
# ✅ Check bundle size
npm install --save-dev @next/bundle-analyzer
ANALYZE=true npm run build

# ✅ Identify unused dependencies
npm list --depth=0

# ✅ Remove unused packages
npm uninstall unused-package
```

### 4. Route Caching

```typescript
// ✅ Cache static routes
export const revalidate = 3600; // 1 hour

// ✅ Or use ISR
export const revalidate = 60; // Regenerate every 60s
```

---

## 🔐 Security Best Practices

### ✅ DO

```tsx
// Use environment variables for sensitive data
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Enable strict CSP headers
// Already configured in next.config.mjs

// Use HTTPS for all external resources
<script src="https://..." />;

// Sanitize user input
const sanitized = DOMPurify.sanitize(userInput);
```

### ❌ DON'T

```tsx
// Don't expose secrets in NEXT_PUBLIC_* vars
NEXT_PUBLIC_SECRET_KEY=... // ❌

// Don't disable security headers
headers: [] // ❌

// Don't load scripts from untrusted sources
<script src="http://unknown-site.com/script.js" /> // ❌

// Don't use dangerouslySetInnerHTML without sanitization
<div dangerouslySetInnerHTML={{ __html: userInput }} /> // ❌
```

---

## 🎯 SEO Best Practices

### 1. Structured Data

```tsx
// ✅ Always include JSON-LD for rich snippets
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(schemaData),
  }}
/>
```

### 2. Meta Tags

```tsx
// ✅ Include essential meta tags
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="theme-color" content="#000000" />
<meta name="description" content="..." />

// ✅ Include canonical URLs
<link rel="canonical" href="https://yourdomain.com" />
```

### 3. Heading Hierarchy

```tsx
// ✅ Use proper heading hierarchy
<h1>Main page title</h1>
<h2>Section heading</h2>
<h3>Subsection</h3>

// ❌ Don't skip heading levels
<h1>Title</h1>
<h3>Subsection</h3> // ❌ Missing h2
```

### 4. Links

```tsx
// ✅ Use descriptive link text
<a href="/projects">View my projects</a>

// ❌ Avoid generic link text
<a href="/projects">Click here</a> // ❌

// ✅ Use relative links for internal routes
<Link href="/about">About</Link>

// ❌ Don't use external links for internal pages
<a href="https://domain.com/about">About</a> // ❌
```

---

## 📱 Mobile Best Practices

### ✅ DO

```tsx
// Use responsive images
<Image
  sizes="(max-width: 640px) 100vw, 50vw"
  src="..."
/>

// Use mobile-first CSS
@media (min-width: 768px) {
  /* tablet styles */
}

// Use touch-friendly sizes
// Minimum 44x44px for interactive elements
<button className="w-11 h-11">Click</button>
```

### ❌ DON'T

```tsx
// Don't use fixed widths
<div style={{ width: '960px' }}>

// Don't forget viewport meta
// Already in layout.tsx ✅

// Don't use hover-only interactions
<div onHover={...}>
```

---

## 🧪 Testing Best Practices

### Performance Testing

```bash
# Local testing
npm run build
npm run start

# Test Core Web Vitals
# - Use Chrome DevTools Lighthouse
# - Use https://pagespeed.web.dev/
# - Use https://gtmetrix.com/
```

### SEO Testing

```bash
# Validate markup
# - https://validator.w3.org/
# - https://search.google.com/test/rich-results

# Check robots.txt
# - https://yourdomain.com/robots.txt

# Check sitemap
# - https://yourdomain.com/sitemap.xml

# Monitor with Search Console
# - https://search.google.com/search-console
```

---

## 🚀 Deployment Best Practices

### Pre-deployment Checklist

- [ ] Run `npm run build` locally
- [ ] Test with `npm run start`
- [ ] Run Lighthouse audit (score >= 90)
- [ ] Test with PageSpeed Insights
- [ ] Verify robots.txt and sitemap
- [ ] Update NEXT_PUBLIC_SITE_URL
- [ ] Add OpenGraph images
- [ ] Check for console errors
- [ ] Test on mobile device
- [ ] Test on slow 3G connection

### Post-deployment

- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Monitor Core Web Vitals
- [ ] Set up error tracking (Sentry)
- [ ] Monitor analytics (Google Analytics)
- [ ] Check Search Console for issues

---

## 🎓 Common Mistakes to Avoid

| Mistake                     | Impact                  | Solution                          |
| --------------------------- | ----------------------- | --------------------------------- |
| Missing `alt` on images     | Poor accessibility, SEO | Always add descriptive `alt` text |
| Using HTML `<img>`          | Poor performance        | Use Next.js `<Image>` component   |
| Heavy above-the-fold JS     | Poor LCP                | Code split and lazy load          |
| No responsive images        | Poor mobile experience  | Use `sizes` prop                  |
| Missing metadata            | Poor SEO                | Add comprehensive metadata        |
| Unused fonts                | Slower load time        | Use only necessary weights        |
| No caching headers          | Poor repeat visits      | Configure cache headers           |
| Disabled image optimization | 2x+ larger images       | Keep optimization enabled         |

---

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Web.dev Performance](https://web.dev/performance/)
- [Lighthouse Scoring](https://developers.google.com/web/tools/lighthouse/v3/scoring)
- [SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Core Web Vitals](https://web.dev/vitals/)

---

**Last Updated**: May 2026  
**Next Review**: When major framework updates available or performance regression detected
