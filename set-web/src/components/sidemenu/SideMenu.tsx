import { FiHome, FiSettings } from "react-icons/fi";
import SideMenuLink from "./SideMenuLink";
import "./SideMenu.scss";

const SideMenu = () => {
  return (
    <div className="side-menu">
      <div className="side-menu-links">
        <SideMenuLink icon={FiHome} iconColor="main" text="Home" to="/" />
        <SideMenuLink
          icon={FiSettings}
          iconColor="main"
          text="Settings"
          to="/settings"
        />
      </div>
    </div>
  );
};

export default SideMenu;
