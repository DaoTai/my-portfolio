import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { listProject } from "@/lib/init";
import ProjectCard from "../project/ProjectCard";

const Projects = () => {
  return (
    <div id="projects" className="scroll-mt-20">
      <h1 className="title-section-gradient">Public projects</h1>
      <Carousel className="w-full ">
        <CarouselContent className="-mt-1">
          {listProject.map((project, i) => (
            <CarouselItem key={i}>
              <ProjectCard index={i + 1} data={project} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="!-left-6 size-10 rounded-md border border-sky-400 bg-gradient text-3xl backdrop-blur-3xl hover:text-white sm:left-2  [&_svg]:size-6" />
        <CarouselNext className="!-right-6 size-10 rounded-md border border-sky-400 bg-gradient text-3xl backdrop-blur-3xl hover:text-white sm:right-2  [&_svg]:size-6" />
      </Carousel>
    </div>
  );
};

export default Projects;
