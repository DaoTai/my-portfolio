import React from "react";
import DownloadResumeButton from "../common/DownloadResumeButton";

const Resume = () => {
  return (
    <div id="resume" className="relative">
      <DownloadResumeButton className="mx-auto border border-solid border-sky-500 bg-gradient hover:text-white dark:border-violet-500" />
    </div>
  );
};

export default Resume;
