import Image from "next/image";

import type { Project } from "@/lib/portfolio-data";

type ProjectLogoProps = {
  project: Project;
  /** Badge edge in px. */
  size?: number;
};

/** The project's logo on a frosted-glass tile, or its initial when it has none. */
export const ProjectLogo = ({ project, size = 28 }: ProjectLogoProps) => {
  const inner = Math.round(size * 0.64);
  return (
    <span
      className="grid flex-none place-items-center overflow-hidden rounded-[30%] border border-white/20 bg-white/10 font-display font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_0_18px_-4px_rgba(110,116,255,0.6)] backdrop-blur-md"
      style={{ width: size, height: size, fontSize: size * 0.44 }}
    >
      {project.logo ? (
        <Image
          src={project.logo}
          alt=""
          width={inner}
          height={inner}
          className="object-contain"
          style={{ width: inner, height: inner }}
        />
      ) : (
        project.name[0]
      )}
    </span>
  );
};
