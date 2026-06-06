import { type Metadata } from "next";
import Header from "@/components/common/Header";
import About from "@/components/home/About";
import Experiences from "@/components/home/Experiences";
import Projects from "@/components/home/Projects";
import Resume from "@/components/home/Resume";
import Skills from "@/components/home/Skills";
import { TooltipProvider } from "@/components/ui/tooltip";

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
    <TooltipProvider>
      <main className="overflow-x-hidden text-foreground">
        <Header />
        <div className="container mt-16 space-y-12 pb-16 pt-[--height-header] md:space-y-24">
          <About />
          <Skills />
          <Projects />
          {/* <Experiences /> */}
          <Resume />
        </div>
      </main>
    </TooltipProvider>
  );
}
