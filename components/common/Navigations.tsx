import { navigations } from "@/lib/init";
import Link from "next/link";

const Navigations = () => {
  return (
    <>
      {navigations.map(({ name, href, icon }, i) => {
        const Icon = icon;
        return (
          <Link
            key={i}
            href={href}
            className="group relative z-10 flex items-center gap-2 rounded-full border border-sky-500  px-4 py-1.5 text-xl text-white shadow-inner backdrop-blur-3xl hover:bg-gradient dark:border-violet-500"
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
