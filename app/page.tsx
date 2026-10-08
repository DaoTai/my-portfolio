import { type Metadata } from "next";
import Contact from "@/components/portfolio/Contact";
import Expertise from "@/components/portfolio/Expertise";
import Hero from "@/components/portfolio/Hero";
import ProjectsShowcase from "@/components/portfolio/ProjectsShowcase";
import SiteHeader from "@/components/portfolio/SiteHeader";
import TechStack from "@/components/portfolio/TechStack";

export const metadata: Metadata = {
  title: "Dao Duc Tai | Full-Stack JavaScript Developer",
  description:
    "Full-stack JavaScript developer with 4+ years of experience building real-time systems, Web3 platforms, and modern web applications. Specializing in React, Next.js, Node.js, NestJS, and blockchain integrations across Solana, BNB Chain, and EVM ecosystems.",
  openGraph: {
    title: "Dao Duc Tai | Full-Stack JavaScript Developer",
    description:
      "Full-stack JavaScript developer with 4+ years of experience building real-time systems, Web3 platforms, and modern web applications. Specializing in React, Next.js, Node.js, NestJS, and blockchain integrations.",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-clip bg-pf-bg text-pf-text2 transition-colors duration-300">
      <SiteHeader />
      <main>
        <Hero />
        <TechStack />
        <Expertise />
        <ProjectsShowcase />
        <Contact />
      </main>
    </div>
  );
}
