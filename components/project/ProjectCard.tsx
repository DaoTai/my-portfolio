import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import * as motion from "motion/react-client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  ArrowRightIcon,
  GitHubLogoIcon,
  Link1Icon,
  VideoIcon,
} from "@radix-ui/react-icons";
import CarouselImages from "./CarouselImages";
import ArrowRight from "../icons/ArrowRight";

const techContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const techItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

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
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="h-full overflow-hidden">
        <CardHeader>
          <CardTitle className="mb-2 flex flex-wrap gap-2 text-3xl">
            <motion.span
              layout
              whileHover={{ scale: 1.1 }}
              className="flex size-8 items-center justify-center rounded-full bg-gradient text-white"
            >
              {index}
            </motion.span>
            {name}
          </CardTitle>

          <div className="my-2 space-y-4">
            {/* Start - End time */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-1 text-base capitalize"
            >
              <div className="rounded-full border bg-sky-700 p-1 px-4 text-white">
                {startTime}
              </div>
              <ArrowRightIcon />
              <div className="rounded-full border bg-sky-700 p-1 px-4 text-white">
                {endTime}
              </div>
            </motion.div>

            {/* Tech stack */}
            <motion.div
              className="flex flex-wrap gap-2"
              variants={techContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {teckStack.map((tech, i) => (
                <motion.span
                  key={i}
                  variants={techItemVariants as any}
                  whileHover={{
                    scale: 1.08,
                    boxShadow: "0px 4px 10px rgba(100, 100, 255, 0.3)",
                  }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="rounded-full border border-violet-400 bg-violet-500 px-4 py-1 font-bold  text-white transition-colors duration-300"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>

            {/* URI */}
            {uri && (
              <motion.div whileHover={{ scale: 1.02 }}>
                <Link
                  href={uri}
                  target="_blank"
                  className="group flex items-center gap-2 text-xl text-blue-400 underline decoration-current"
                >
                  <Link1Icon className="size-6 text-blue-600" />
                  <span className="truncate tracking-wider group-hover:opacity-90">
                    {uri}
                  </span>
                </Link>
              </motion.div>
            )}

            {/* Demo video */}
            {videoDemo && (
              <motion.div whileHover={{ scale: 1.02 }}>
                <Link
                  href={videoDemo}
                  target="_blank"
                  className="group flex items-center gap-2 text-xl text-blue-400 underline decoration-current"
                >
                  <VideoIcon className="size-6 text-rose-600" />
                  <span className="truncate tracking-wider group-hover:opacity-90">
                    {videoDemo}
                  </span>
                </Link>
              </motion.div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {previewImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <CarouselImages previewImages={previewImages} uri={uri} />
            </motion.div>
          )}
        </CardContent>

        <CardFooter className="block space-y-2 text-justify">
          <motion.p
            className="text-justify text-xl font-semibold sm:text-left"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {summary}
          </motion.p>

          {/* Features */}
          {features.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              whileInView={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.5 }}
            >
              <Accordion
                type="single"
                collapsible
                className="rounded-md border px-2"
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-xl font-bold no-underline hover:no-underline">
                    Features
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul>
                      {features.map((feature, i) => (
                        <motion.li
                          key={i}
                          className="list-inside list-disc text-left text-xl md:text-justify"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          )}

          {githubUri && (
            <motion.div
              className="space-x-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <GitHubLogoIcon />
              <span>{githubUri}</span>
            </motion.div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;
