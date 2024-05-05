import React from "react";
import Logo from "./Logo";
import Navigations from "./Navigations";
import ToggleMode from "./ToggleMode";
import ToggleBar from "./ToggleBar";

const Header = () => {
  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-[--height-header] w-full overflow-hidden border-b  bg-black/50 sm:bg-black/50">
      <div className="flex items-center  justify-between px-4  py-2 md:container  ">
        <Logo />
        <div className=" hidden items-center gap-6 lg:flex">
          <Navigations />
        </div>
        <div className="ml-auto flex items-stretch gap-4">
          <ToggleMode />
          <ToggleBar />
        </div>
      </div>
    </div>
  );
};

export default Header;
