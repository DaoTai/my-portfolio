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

import { GitHubLogoIcon, TriangleRightIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";

const ProjectCard = ({ data }: { data: IProject }) => {
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
    <Card className="">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <div className="my-2 space-y-2">
          {/* Start - end time */}
          <div className="flex justify-between gap-2">
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
      <CardContent className="text-justify">
        <p>{summary}</p>
        {githubUri && (
          <div className="space-x-2">
            <GitHubLogoIcon />
            <span>{githubUri}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="block">
        {previewImages.length === 0 && (
          <Link
            href={uri}
            title={uri}
            target="_blank"
            className="relative w-fit rounded-full bg-yellow-100"
          >
            <TriangleRightIcon className="size-12" />
            <span className="absolute inset-0  h-full w-full animate-ping rounded-full bg-yellow-100 opacity-75"></span>
          </Link>
        )}

        {previewImages.length > 0 && (
          <Carousel>
            <CarouselContent>
              {previewImages.map((image, i) => (
                <CarouselItem className="relative" key={i}>
                  <Link
                    href={uri}
                    title={uri}
                    target="_blank"
                    className="absolute left-1/2 top-1/2 w-fit -translate-x-1/2 -translate-y-1/2 rounded-full border bg-yellow-100"
                  >
                    <TriangleRightIcon className="size-12" />
                    <span className="absolute inset-0  h-full w-full animate-ping rounded-full bg-yellow-100 opacity-75"></span>
                  </Link>
                  <Image
                    unoptimized
                    alt="preview"
                    src={image}
                    width={200}
                    height={200}
                    className="h-full max-h-[300px] w-full rounded-lg "
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
