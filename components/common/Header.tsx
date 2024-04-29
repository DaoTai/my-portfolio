import React from "react";
import Logo from "./Logo";
import Navigations from "./Navigations";
import ToggleMode from "./ToggleMode";

const Header = () => {
  return (
    <div className="scrollmt-4 fixed inset-0 z-50 h-[--height-header] overflow-hidden border-b bg-black/35">
      <div className="container flex  items-center justify-between  px-4 py-2  ">
        <Logo />
        <div className=" hidden items-center gap-6 lg:flex">
          <Navigations />
        </div>
        <ToggleMode />
      </div>
    </div>
  );
};

export default Header;
