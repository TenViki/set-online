import React, { FC } from "react";
import { FiChevronRight } from "react-icons/fi";
import Loading from "../../../components/loading/Loading";
import "./LoginButton.scss";

interface LoginButtonProps {
  onClick: () => void;
  text: string;
  color: string;
  image: string;
  loading?: boolean;
}

const LoginButton: FC<LoginButtonProps> = ({ color, image, text, onClick, loading }) => {
  return (
    <button
      className={`login-button ${loading ? "loading" : ""}`}
      style={{ background: color }}
      onClick={onClick}
      disabled={loading}
    >
      <img src={image} alt={text} />
      <span className="login-button-text">{text}</span>
      {loading ? <Loading size={1.5} colorA="#fff" colorB="#fff" colorC="#fff" colorD="#fff" /> : <FiChevronRight />}
      <span className="login-button-overlay"></span>
    </button>
  );
};

export default LoginButton;
