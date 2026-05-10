import Header from "@/components/common/Header";
import About from "@/components/home/About";
import Experiences from "@/components/home/Experiences";
import Projects from "@/components/home/Projects";
import Resume from "@/components/home/Resume";
import Skills from "@/components/home/Skills";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Home() {
  return (
    <TooltipProvider>
      <main className="overflow-x-hidden text-foreground">
        <Header />
        <div className="container mt-8 space-y-24 pb-16 pt-[--height-header]">
          <About />
          <Skills />
          <Projects />
          <Experiences />
          <Resume />
        </div>
      </main>
    </TooltipProvider>
  );
}
