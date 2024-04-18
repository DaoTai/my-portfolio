import React from "react";
import Logo from "./Logo";
import Navigations from "./Navigations";
import ToggleMode from "./ToggleMode";

const Header = () => {
  return (
    <div className="fixed inset-0 h-[--height-header] px-4 py-2 box-content shadow-md overflow-hidden flex justify-between items-center">
      <Logo />
      <div className="flex gap-4 items-center">
        <Navigations />
      </div>
      <ToggleMode />
    </div>
  );
};

export default Header;
