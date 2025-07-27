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
      <main className="text-slate-800  dark:text-white">
        <Header />
        <div className="container mt-8 space-y-12 py-h-header">
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
