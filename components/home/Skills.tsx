import Image from "next/image";
import React from "react";
import DownloadResumeButton from "../common/DownloadResumeButton";
import { techStack } from "@/lib/init";

const Skills = () => {
  return (
    <div id="skills" className="scroll-mt-20">
      <h1 className="title-section-gradient">My skills</h1>
      <div className="grid grid-cols-1 items-start gap-4 gap-y-10 md:grid-cols-2 ">
        {/* Summary skills */}
        <div className="static space-y-4 md:sticky md:top-16">
          <p className=" rounded-3xl bg-black/20 p-2 px-4 text-left text-3xl leading-10 backdrop-blur-2xl sm:text-justify">
            I have knowleges about Javascript and OOP. Additionally, I have more
            2 years of experience working with frameworks and libraries in
            NodeJS platform to build web apps.
          </p>
          <DownloadResumeButton className="mx-auto md:mx-0" />
        </div>

        {/* Tech stack */}
        <div className="grid  grid-cols-3 gap-2 gap-y-6 lg:grid-cols-4">
          {techStack.map(({ imageUri, name }, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 border border-transparent p-1 text-center transition-all duration-300 ease-in-out hover:scale-105 hover:border-violet-500"
            >
              <Image
                unoptimized
                src={imageUri}
                alt="icon"
                width={80}
                height={80}
                className="aspect-square size-16 rounded-full border bg-white object-cover p-1 shadow-2xl drop-shadow-2xl sm:size-28 "
              />
              <div className="rounded-full border bg-black/10 px-4 py-1 backdrop-blur-3xl">
                <b className="text-gradient text-sm font-bold uppercase sm:text-base">
                  {name}
                </b>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
