import {
  Component1Icon,
  DesktopIcon,
  LoopIcon,
  ResumeIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes } from "react";

type INavigation = {
  name: string;
  href: string;
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
};

const navigations: INavigation[] = [
  {
    name: "About me",
    href: "#about",
    icon: RocketIcon,
  },
  {
    name: "Skills",
    href: "#skills",
    icon: Component1Icon,
  },
  {
    name: "Projects",
    href: "#projects",
    icon: DesktopIcon,
  },
  {
    name: "Experiences",
    href: "#experience",
    icon: LoopIcon,
  },
  {
    name: "Resume",
    href: "#resume",
    icon: ResumeIcon,
  },
];

const Navigations = () => {
  return (
    <>
      {navigations.map(({ name, href, icon }, i) => {
        const Icon = icon;
        return (
          <Link
            key={i}
            href={href}
            className="group relative z-10 flex items-center gap-2 rounded-full border border-slate-300 px-4 py-1.5 text-xl text-white shadow-inner backdrop-blur-3xl hover:bg-gradient"
            style={{ textShadow: "0 1px 6px #000" }}
          >
            <Icon className="h-5 w-5 group-hover:scale-105" />
            <span>{name}</span>
          </Link>
        );
      })}
    </>
  );
};

export default Navigations;
