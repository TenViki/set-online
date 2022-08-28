import React from "react";
import { NavLink } from "react-router-dom";
import SideMenuLink from "./SideMenuLink";
import { FiHome, FiSettings } from "react-icons/fi";

const SideMenu = () => {
  return (
    <div className="side-menu">
      <SideMenuLink icon={FiHome} iconColor="red" text="Home" to="/" />
      <SideMenuLink
        icon={FiSettings}
        iconColor="red"
        text="Settings"
        to="/settings"
      />
    </div>
  );
};

export default SideMenu;
