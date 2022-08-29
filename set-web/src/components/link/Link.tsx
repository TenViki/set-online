import React, { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import { ColorType } from "../../types/color";
import "./Link.scss";

interface LinkProps {
  to?: string;
  onClick?: () => void;
  text?: string;
  color?: ColorType;
}

const Link: FC<LinkProps> = ({ color, onClick, text, to }) => {
  return to ? (
    <RouterLink to={to} className={`link ${color ? color : "main"}`}>
      {text}
    </RouterLink>
  ) : (
    <button type="button" className={`link ${color ? color : "main"}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Link;
