import { FC } from "react";
import { IconType } from "react-icons";
import { NavLink } from "react-router-dom";
import { colors, ColorType } from "../../types/Color";
import "./SideMenuLink.scss";

interface SideMenuLinkProps {
  icon: IconType;
  text: string;
  iconColor: ColorType;
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
        <Icon color={colors[iconColor]} />
      </div>
      <span className="side-menu-link-ripple" />
      <div className="side-menu-link-text">{text}</div>
    </NavLink>
  );
};

export default SideMenuLink;
