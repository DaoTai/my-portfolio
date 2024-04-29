import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import {
  GitHubLogoIcon,
  Link1Icon,
  TriangleRightIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";

const ProjectCard = ({ index, data }: { index: number; data: IProject }) => {
  const {
    endTime,
    name,
    previewImages,
    startTime,
    summary,
    teckStack,
    uri,
    githubUri,
  } = data;

  return (
    <Card className="h-full ">
      <CardHeader>
        <CardTitle className="mb-2 flex gap-2 text-3xl">
          <span className="flex size-8 items-center justify-center rounded-full bg-gradient text-white">
            {index}
          </span>
          {name}
        </CardTitle>
        <div className="my-2 space-y-3">
          {/* Start - end time */}
          <div className="flex justify-between gap-2 text-base capitalize">
            <div className="rounded-full border border-sky-500 p-1 px-4">
              {startTime}
            </div>
            <div className="rounded-full border border-sky-500 p-1 px-4">
              {endTime}
            </div>
          </div>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2">
            {teckStack.map((tech, i) => (
              <span
                key={i}
                className="rounded-full border border-violet-400 p-2 py-1"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-justify">
        <p className="text-xl">{summary}</p>
        <Link
          href={uri}
          target="_blank"
          className="group flex items-center gap-2 text-xl text-blue-400 underline decoration-current"
        >
          <Link1Icon className="size-6 text-slate-600" />
          <span className="tracking-wider group-hover:opacity-90">{uri}</span>
        </Link>
        {githubUri && (
          <div className="space-x-2">
            <GitHubLogoIcon />
            <span>{githubUri}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {previewImages.length > 0 && (
          <Carousel>
            <CarouselContent>
              {previewImages.map((image, i) => (
                <CarouselItem className="relative" key={i}>
                  <Link
                    href={uri}
                    title={uri}
                    target="_blank"
                    className="absolute left-1/2 top-1/2 w-fit -translate-x-1/2 -translate-y-1/2 rounded-full border-slate-100 bg-gradient  shadow-2xl hover:border-sky-200"
                  >
                    <TriangleRightIcon className="size-12 text-white" />
                    <span className="absolute inset-0  h-full w-full animate-ping rounded-full bg-gradient opacity-75"></span>
                  </Link>
                  <Image
                    unoptimized
                    alt="preview"
                    src={image}
                    width={200}
                    height={200}
                    className="h-full max-h-[90vh] w-full rounded-lg border object-cover object-top"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 size-10" />
            <CarouselNext className="right-2 size-10" />
          </Carousel>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
