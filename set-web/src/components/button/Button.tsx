import React, { FC } from "react";
import { IconType } from "react-icons";
import { ColorType } from "../../types/color";
import Loading from "../loading/Loading";
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
  loading?: boolean;
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
  loading,
}) => {
  return (
    <button
      className={`button ${color ? color : "main"} ${disabled ? "disabled" : ""} ${
        variant ? `variant-${variant}` : "variant-contained"
      } ${LeftIcon && !RightIcon && !text ? "button-left-icon" : ""} ${
        RightIcon && !LeftIcon && !text ? "button-right-icon" : ""
      } ${text ? "text-btn" : ""} ${fullwidth ? "fullwidth" : ""} ${loading ? "loading" : ""}`}
      disabled={disabled || loading ? true : undefined}
      onClick={onClick}
      type={submit ? "submit" : "button"}
    >
      {LeftIcon && <LeftIcon className="button-left-icon-svg" />}
      {text && <span className="button-text">{text}</span>}
      {!loading && RightIcon && <RightIcon className="button-right-icon-svg" />}
      {loading && <Loading size={1.5} colorA="#fff" colorB="#fff" colorC="#fff" colorD="#fff" />}

      <span className="button-overlay" />
    </button>
  );
};

export default Button;
