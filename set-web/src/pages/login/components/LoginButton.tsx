import React, { FC } from "react";
import { FiChevronRight } from "react-icons/fi";
import "./LoginButton.scss";

interface LoginButtonProps {
  onClick: () => void;
  text: string;
  color: string;
  image: string;
}

const LoginButton: FC<LoginButtonProps> = ({ color, image, text, onClick }) => {
  return (
    <button className="login-button" style={{ backgroundColor: color }}>
      <img src={image} alt={text} />
      <span className="login-button-text">{text}</span>
      <FiChevronRight />
      <span className="login-button-overlay"></span>
    </button>
  );
};

export default LoginButton;
