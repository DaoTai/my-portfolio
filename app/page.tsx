import Header from "@/components/common/Header";
import About from "@/components/home/About";
import Experiences from "@/components/home/Experiences";
import Projects from "@/components/home/Projects";
import Resume from "@/components/home/Resume";
import Skills from "@/components/home/Skills";

export default function Home() {
  return (
    <main className="container text-white">
      <Header />
      <div className="mt-h-header space-y-8 py-h-header ">
        <About />
        <Skills />
        <Projects />
        <Experiences />
        <Resume />
      </div>
    </main>
  );
}
