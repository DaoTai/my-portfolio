import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { GitHubLogoIcon, Link1Icon, VideoIcon } from "@radix-ui/react-icons";
import CarouselImages from "./CarouselImages";

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
    features,
    videoDemo,
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

          {/* Uri */}
          <Link
            href={uri}
            target="_blank"
            className="group flex items-center gap-2 text-xl text-blue-400 underline decoration-current"
          >
            <Link1Icon className="size-6 text-blue-600" />
            <span className="tracking-wider group-hover:opacity-90">{uri}</span>
          </Link>
          {/* Demo video */}
          {videoDemo && (
            <Link
              href={videoDemo}
              target="_blank"
              className="group flex items-center gap-2 text-xl text-blue-400 underline decoration-current"
            >
              <VideoIcon className="size-6 text-rose-600" />
              <span className="tracking-wider group-hover:opacity-90">
                {videoDemo}
              </span>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {previewImages.length > 0 && (
          <CarouselImages previewImages={previewImages} uri={uri} />
        )}
      </CardContent>
      <CardFooter className="block space-y-2 text-justify">
        <p className="text-xl">{summary}</p>

        {features.length > 0 && (
          <Accordion
            type="single"
            collapsible
            className="rounded-md border px-2"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl no-underline hover:no-underline">
                Features
              </AccordionTrigger>
              <AccordionContent>
                <ul>
                  {features.map((feature, i) => (
                    <li key={i} className="list-inside list-disc text-xl">
                      {feature}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {githubUri && (
          <div className="space-x-2">
            <GitHubLogoIcon />
            <span>{githubUri}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
