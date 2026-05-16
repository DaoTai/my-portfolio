import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dao Tai - Full-Stack Web Developer",
    short_name: "Dao Tai",
    description:
      "Full-stack web developer specializing in React, Next.js, and modern web technologies",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["business", "productivity"],
    screenshots: [
      {
        src: "/og-image.jpg",
        sizes: "1200x630",
        type: "image/jpeg",
        form_factor: "wide",
      },
    ],
  };
}
