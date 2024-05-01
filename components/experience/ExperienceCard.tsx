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
    <div className="flex flex-wrap gap-2 rounded-xl border-2 border-violet-500 bg-white p-4 text-base text-slate-700 transition-all duration-300 ease-in-out hover:border-sky-500 dark:bg-black/90 dark:text-white sm:flex-nowrap">
      {/* Logo */}
      <div className="basis-full sm:basis-3/12">
        <Image
          unoptimized
          alt="logo-company"
          src={comanyLogo}
          width={80}
          height={80}
          className="h-52 w-full rounded-lg object-cover shadow sm:h-auto"
        />
      </div>

      <div className=" basis-full space-y-2 text-left text-xl sm:basis-9/12 sm:text-justify">
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
              className="rounded-full border border-violet-500 p-1 px-2 text-base"
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
