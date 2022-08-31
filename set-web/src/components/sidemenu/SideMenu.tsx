import { FiHome, FiLogIn, FiSettings, FiUser } from "react-icons/fi";
import { IoGameControllerOutline } from "react-icons/io5";
import { useUser } from "../../utils/useUser";
import DarkModeSwitch from "./DarkModeSwitch";
import "./SideMenu.scss";
import SideMenuLink from "./SideMenuLink";

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
        {user.isLoggedIn ? (
          <SideMenuLink icon={FiUser} iconColor="gray" text={user.username} to="/profile" />
        ) : (
          <SideMenuLink icon={FiLogIn} iconColor="gray" text="Login" to="/login" />
        )}

        <DarkModeSwitch />
      </div>
    </div>
  );
};

export default SideMenu;
