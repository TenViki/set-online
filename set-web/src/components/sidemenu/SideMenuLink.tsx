import React, { FC } from "react";
import { IconType } from "react-icons";
import { NavLink } from "react-router-dom";

interface SideMenuLinkProps {
  icon: IconType;
  text: string;
  iconColor: string;
  to: string;
}

const SideMenuLink: FC<SideMenuLinkProps> = ({
  icon: Icon,
  iconColor,
  text,
  to,
}) => {
  return (
    <NavLink className="side-menu-link" to={to}>
      <div className="side-menu-link-icon">
        <Icon color={iconColor} />
      </div>
      <div className="side-menu-link-text">{text}</div>
    </NavLink>
  );
};

export default SideMenuLink;
