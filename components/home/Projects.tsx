import ProjectCarousel from "../project/ProjectCarousel";

const Projects = () => {
  return (
    <div id="projects" className="scroll-mt-28">
      <div className="mb-8 flex flex-col items-center justify-center md:mb-10">
        <h2 className="text-center text-4xl font-bold md:text-5xl">
          <span className="bg-[linear-gradient(90deg,#06b6d4,#22d3ee)] bg-clip-text text-transparent">
            Featured
          </span>{" "}
          <span className="bg-[linear-gradient(90deg,#a78bfa,#8b5cf6)] bg-clip-text text-transparent">
            Projects
          </span>
        </h2>

        <p className="mt-3 text-center text-sm leading-relaxed text-muted-foreground md:text-base">
          A selection of projects I've built that showcase my skills and
          creativity
        </p>
      </div>

      <ProjectCarousel />
    </div>
  );
};

export default Projects;
