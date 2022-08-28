import { FiHome, FiSettings } from "react-icons/fi";
import { IoGameControllerOutline } from "react-icons/io5";
import SideMenuLink from "./SideMenuLink";
import "./SideMenu.scss";

const SideMenu = () => {
  return (
    <div className="side-menu">
      <div className="side-menu-links">
        <SideMenuLink icon={FiHome} iconColor="main" text="Home" to="/" />
        <SideMenuLink
          icon={IoGameControllerOutline}
          iconColor="success"
          text="Play!"
          to="/play"
        />
        <SideMenuLink
          icon={FiSettings}
          iconColor="danger"
          text="Settings"
          to="/settings"
        />
      </div>
    </div>
  );
};

export default SideMenu;
