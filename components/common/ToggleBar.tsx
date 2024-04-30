"use client";
import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { navigations } from "@/lib/init";
import Link from "next/link";

const ToggleBar = () => {
  const [toggle, setToggle] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    overlayRef.current!.style.transform = toggle
      ? "translateX(100%)"
      : "translateX(0)";

    setToggle(!toggle);
  };

  return (
    <div className="block lg:hidden">
      <Button size="icon" onClick={handleToggle}>
        <HamburgerMenuIcon />
      </Button>

      <div
        ref={overlayRef}
        className={`fixed inset-0 translate-x-full bg-black/20 transition-all duration-700 ease-in-out`}
        onClick={handleToggle}
      >
        <div
          className="absolute bottom-0 right-0 top-0 flex h-full flex-col rounded-bl-md rounded-tl-md bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          {navigations.map(({ name, href, icon }, i) => {
            const Icon = icon;
            return (
              <Link
                key={i}
                href={href}
                className="relative z-10 flex items-center gap-2 border-b border-slate-200 p-3 pr-16 text-xl text-slate-700 hover:bg-gradient hover:text-white"
                onClick={handleToggle}
              >
                <Icon className="h-5 w-5 " />
                <span>{name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ToggleBar;
