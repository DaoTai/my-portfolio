/**
 * Image optimization utilities
 * Helpers for optimized image usage throughout the portfolio
 */

import Image from "next/image";

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  fill?: boolean;
  sizes?: string;
}

/**
 * Common image sizes for responsive design
 */
export const imageSizes = {
  thumbnail: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  medium: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  large: "(max-width: 1024px) 100vw, 50vw",
  full: "100vw",
};

/**
 * Placeholder configurations for different image types
 */
export const placeholders = {
  blur: "data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmM2Y0ZjYiLz4KPC9zdmc+",
  solid:
    "data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlZWUiLz4KPC9zdmc+",
};

/**
 * Helper function to get responsive image sizes
 */
export function getResponsiveSizes(
  containerWidth: number,
  breakpoints = {
    mobile: 640,
    tablet: 1024,
    desktop: 1280,
  },
): string {
  return `(max-width: ${breakpoints.mobile}px) 100vw, (max-width: ${breakpoints.tablet}px) 50vw, ${Math.min(containerWidth, breakpoints.desktop)}px`;
}

/**
 * Quality settings for different image types
 */
export const imageQuality = {
  thumbnail: 60,
  card: 75,
  hero: 85,
  social: 80,
};
