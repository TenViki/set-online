import { FiHome, FiSettings } from "react-icons/fi";
import { IoGameControllerOutline } from "react-icons/io5";
import SideMenuLink from "./SideMenuLink";
import "./SideMenu.scss";
import { DarkModeContext } from "../../App";
import React from "react";
import DarkModeSwitch from "./DarkModeSwitch";
import { useUser } from "../../utils/useUser";

const SideMenu = () => {
  const user = useUser();

  return (
    <div className="side-menu">
      <div className="side-menu-links">
        <SideMenuLink icon={FiHome} iconColor="main" text="Home" to="/" />
        <SideMenuLink icon={IoGameControllerOutline} iconColor="success" text="Play!" to="/play" />
        <SideMenuLink icon={FiSettings} iconColor="danger" text="Settings" to="/settings" />
      </div>

      <div className="side-menu-actions">
        Current user state: {user.isLoggedIn ? user.username : "Not logged in"}
        <DarkModeSwitch />
      </div>
    </div>
  );
};

export default SideMenu;
