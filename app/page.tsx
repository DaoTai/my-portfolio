import { type Metadata } from "next";
import Contact from "@/components/portfolio/Contact";
import ChatLauncher from "@/components/portfolio/Chat";
import Expertise from "@/components/portfolio/Expertise";
import Hero from "@/components/portfolio/Hero";
import ProjectsShowcase from "@/components/portfolio/ProjectsShowcase";
import SiteHeader from "@/components/portfolio/SiteHeader";
import TechStack from "@/components/portfolio/TechStack";

// Title, description, Open Graph and Twitter come from app/layout.tsx.
// Only page-specific values belong here: a page-level openGraph object would
// shallow-replace the layout's (dropping siteName/locale/images).
export const metadata: Metadata = {
  alternates: {
    canonical: "/",
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
      <ChatLauncher />
    </div>
  );
}
