import { StarFilledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";

type INavigation = {
  name: string;
  href: string;
};

const navigations: INavigation[] = [
  {
    name: "About me",
    href: "#about",
  },
  {
    name: "Skills",
    href: "#skills",
  },
  {
    name: "Projects",
    href: "#projects",
  },
  {
    name: "Experience",
    href: "#experience",
  },
  {
    name: "Resume",
    href: "#resume",
  },
];

const Navigations = () => {
  return (
    <>
      {navigations.map(({ name, href }, i) => (
        <Link key={i} href={href} className="p-1 text-xl">
          {name}
          <StarFilledIcon />
        </Link>
      ))}
    </>
  );
};

export default Navigations;
