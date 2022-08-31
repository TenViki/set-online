import React from "react";
import ProfileSideMenuLink from "./ProfileSideMenuLink";
import { FiGrid, FiLogOut, FiMonitor, FiSettings } from "react-icons/fi";
import "./ProfileSideMenu.scss";

const ProfileSideMenu = () => {
  return (
    <div className="profile-side-menu">
      <div className="profile-side-menu-upper">
        <ProfileSideMenuLink to="/profile" icon={FiGrid} text="Overview" />
        <ProfileSideMenuLink to="/profile/settings" icon={FiSettings} text="User settings" />
        <ProfileSideMenuLink to="/profile/devices" icon={FiMonitor} text="Devices" />
      </div>

      <ProfileSideMenuLink onClick={() => alert("logout")} icon={FiLogOut} text="Logout" />
    </div>
  );
};

export default ProfileSideMenu;
