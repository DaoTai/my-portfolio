import { listExperience } from "@/lib/init";
import React from "react";
import ExperienceCard from "../experience/ExperienceCard";

const Experiences = () => {
  return (
    <div id="experiences" className="scroll-mt-20">
      <h1 className="title-section-gradient">My experiences</h1>
      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
        {listExperience.map((exp, i) => (
          <ExperienceCard key={i} data={exp} />
        ))}
      </div>
    </div>
  );
};

export default Experiences;
