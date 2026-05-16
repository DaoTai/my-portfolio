import { type Metadata } from "next";
import Header from "@/components/common/Header";
import About from "@/components/home/About";
import Experiences from "@/components/home/Experiences";
import Projects from "@/components/home/Projects";
import Resume from "@/components/home/Resume";
import Skills from "@/components/home/Skills";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Dao Tai | Full-Stack Web Developer",
  description:
    "Full-stack web developer specializing in React, Next.js, and modern web technologies. Explore my projects, experience, and skills.",
  openGraph: {
    title: "Dao Tai | Full-Stack Web Developer",
    description:
      "Full-stack web developer specializing in React, Next.js, and modern web technologies.",
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
