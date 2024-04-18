import Image from "next/image";
import React from "react";
import DownloadResumeButton from "../common/DownloadResumeButton";

type ITech = {
  imageUri: string;
  name: string;
};

const techStack: ITech[] = [
  {
    imageUri: "/html.png",
    name: "HTML5",
  },
  {
    imageUri: "/css.png",
    name: "CSS3",
  },
  {
    imageUri: "/sass.png",
    name: "SASS",
  },
  {
    imageUri: "/javascript.png",
    name: "JAVASCRIPT",
  },
  {
    imageUri: "/typescript.png",
    name: "TYPESCRIPT",
  },
  {
    imageUri: "/react-js.png",
    name: "REACT JS",
  },
  {
    imageUri: "/next-js.png",
    name: "NEXT JS",
  },
  {
    imageUri: "/node-js.png",
    name: "NODE JS",
  },
  {
    imageUri: "/express-js.png",
    name: "EXPRESS JS",
  },
  {
    imageUri: "/nest-js.png",
    name: "NEST JS",
  },
  {
    imageUri: "/mongo-db.png",
    name: "MongoDB",
  },
  {
    imageUri: "/tailwind-css.png",
    name: "Tailwind CSS",
  },
  {
    imageUri: "/mui.png",
    name: "Material UI",
  },
  {
    imageUri: "/shadcn-ui.png",
    name: "Shadcn UI",
  },
  {
    imageUri: "/git.png",
    name: "Git",
  },
  {
    imageUri: "/socket.png",
    name: "Socket",
  },
  {
    imageUri: "/web-rtc.png",
    name: "WebRTC",
  },
  {
    imageUri: "/docker.png",
    name: "Docker",
  },
];

const Skills = () => {
  return (
    <div id="skills" className="scroll-mt-20">
      <h1 className="title-section-gradient">My skills</h1>
      <div className="grid  grid-cols-1 items-start gap-4 md:grid-cols-2 ">
        {/* Summary skills */}
        <div className="static space-y-4 md:sticky md:top-16">
          <p className=" rounded-3xl bg-black/20 p-2 px-4 text-justify text-3xl leading-10 backdrop-blur-2xl">
            I have knowleges about Javascript and OOP. Additionally, I have more
            2 years of experience working with frameworks and libraries in
            NodeJS platform to build web apps.
          </p>
          <DownloadResumeButton className="mx-auto md:mx-0" />
        </div>

        {/* Tech stack */}
        <div className="grid grid-cols-2 gap-2 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 ">
          {techStack.map(({ imageUri, name }, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 text-center transition-all duration-300 ease-in-out hover:scale-105"
            >
              <Image
                unoptimized
                src={imageUri}
                alt="icon"
                width={80}
                height={80}
                className="aspect-square h-24 w-24 rounded-full border bg-white object-cover p-1 shadow-2xl drop-shadow-2xl "
              />
              <div className="rounded-full border bg-black/10 px-4 py-1 backdrop-blur-3xl">
                <b className="text-gradient font-bold uppercase">{name}</b>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
