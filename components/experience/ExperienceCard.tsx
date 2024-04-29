import Image from "next/image";
import React from "react";

const ExperienceCard = ({ data }: { data: IExperience }) => {
  const {
    comanyLogo,
    companyName,
    endTime,
    positionWork,
    startTime,
    summary,
    tags,
  } = data;
  return (
    <div className="flex gap-2 rounded-xl  border-2 border-violet-500 bg-white p-4 text-base text-slate-700 dark:bg-black/90 dark:text-white">
      {/* Logo */}
      <div className="basis-3/12">
        <Image
          unoptimized
          alt="logo-company"
          src={comanyLogo}
          width={80}
          height={80}
          className="w-full rounded-lg shadow"
        />
      </div>

      <div className="basis-9/12 space-y-2 text-justify text-xl">
        <strong className="text-2xl">{companyName}</strong>
        <b className="block">{positionWork}</b>
        <div className="flex gap-2">
          <span>{startTime}</span>
          <span>-</span>
          <span>{endTime}</span>
        </div>
        <p>{summary}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="rounded-full border border-violet-500 p-1 px-2"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
