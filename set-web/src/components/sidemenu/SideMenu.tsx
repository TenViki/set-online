import { FiHome, FiLogIn, FiSettings, FiUser } from "react-icons/fi";
import { IoGameControllerOutline } from "react-icons/io5";
import { useLocation } from "react-router";
import { useGame } from "../../utils/useGame";
import { useUser } from "../../utils/useUser";
import DarkModeSwitch from "./DarkModeSwitch";
import "./SideMenu.scss";
import SideMenuLink from "./SideMenuLink";

const SideMenu = () => {
  const user = useUser();
  const game = useGame();

  const blacklistedPages = ["/auth/redirect"];

  const location = useLocation();
  const isBlacklisted = blacklistedPages.some((page) => location.pathname.includes(page));

  if (isBlacklisted) return null;

  return (
    <div className="side-menu">
      <div className="side-menu-links">
        <SideMenuLink icon={FiHome} iconColor="main" text="Home" to="/" />
        {game.game ? (
          <SideMenuLink icon={IoGameControllerOutline} iconColor="success" text="Current game" to="/game" />
        ) : (
          <SideMenuLink icon={IoGameControllerOutline} iconColor="success" text="Play!" to="/play" />
        )}
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
