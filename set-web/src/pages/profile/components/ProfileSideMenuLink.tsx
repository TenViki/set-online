import React, { FC } from "react";
import { IconType } from "react-icons";
import { NavLink } from "react-router-dom";

interface ProfileSideMenuLinkProps {
  text: string;
  icon: IconType;
  to?: string;
  onClick?: () => void;
}

const ProfileSideMenuLink: FC<ProfileSideMenuLinkProps> = ({ icon: Icon, text, onClick, to }) => {
  return to ? (
    <NavLink className={({ isActive }) => `profile-side-menu-link ${isActive ? "active" : ""}`} to={to} end>
      <div className="profile-side-menu-link-icon">
        <Icon />
      </div>
      <div className="profile-side-menu-link-text">{text}</div>
      <span className="profile-side-menu-overlay" />
    </NavLink>
  ) : (
    <button className="profile-side-menu-link" onClick={onClick}>
      <div className="profile-side-menu-link-icon">
        <Icon />
      </div>
      <div className="profile-side-menu-link-text">{text}</div>
      <span className="profile-side-menu-overlay" />
    </button>
  );
};

export default ProfileSideMenuLink;
