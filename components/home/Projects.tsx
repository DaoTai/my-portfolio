import React from "react";
import ProjectCard from "../project/ProjectCard";

const listProjects: IProject[] = [
  {
    name: "EST Edu",
    summary:
      "Build a web app for users to learn programming online with videos, exercises. Users can not only comment on lessons but also chat and video call by Socket and WebRTC. Moreover, they can predict suitable career by AI feature",
    endTime: "now",
    startTime: "9-2023",
    uri: "https://est-edu.vercel.app",
    teckStack: [
      "NextJS",
      "MUI",
      "ExpressJS",
      "MongoDB",
      "Socket.io",
      "Simple - peer",
      "JWT",
      "Keras",
      "FlaskAPI",
    ],
    previewImages: ["/project-images/est-edu-1.jpg", "/bg-main.jpg"],
  },
];

const Projects = () => {
  return (
    <div
      id="projects"
      className="grid scroll-mt-20 grid-cols-1 gap-2 sm:grid-cols-2"
    >
      {listProjects.map((project, i) => (
        <ProjectCard key={i} data={project} />
      ))}
    </div>
  );
};

export default Projects;
