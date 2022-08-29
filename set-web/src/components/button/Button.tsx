import React, { FC } from "react";
import { IconType } from "react-icons";
import { ColorType } from "../../types/color";
import "./Button.scss";

interface ButtonProps {
  leftIcon?: IconType;
  rightIcon?: IconType;
  text?: string;
  onClick?: () => void;
  disabled?: boolean;
  color?: ColorType;
  variant?: "contained" | "outlined" | "text";
  fullwidth?: boolean;
  submit?: boolean;
}

const Button: FC<ButtonProps> = ({
  color,
  disabled,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onClick,
  text,
  variant,
  fullwidth,
  submit,
}) => {
  return (
    <button
      className={`button ${color ? color : "main"} ${disabled ? "disabled" : ""} ${
        variant ? `variant-${variant}` : "variant-contained"
      } ${LeftIcon && !RightIcon && !text ? "button-left-icon" : ""} ${
        RightIcon && !LeftIcon && !text ? "button-right-icon" : ""
      } ${text ? "text-btn" : ""} ${fullwidth ? "fullwidth" : ""}`}
      disabled={disabled ? true : undefined}
      onClick={onClick}
      type={submit ? "submit" : "button"}
    >
      {LeftIcon && <LeftIcon className="button-left-icon-svg" />}
      {text && <span className="button-text">{text}</span>}
      {RightIcon && <RightIcon className="button-right-icon-svg" />}

      <span className="button-overlay" />
    </button>
  );
};

export default Button;
