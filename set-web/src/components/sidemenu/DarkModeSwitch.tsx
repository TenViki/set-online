import React from "react";
import { DarkModeContext } from "../../App";
import { FiMoon, FiSun } from "react-icons/fi";
import "./DarkModeSwitch.scss";

const DarkModeSwitch = () => {
  const { darkMode, setDarkMode } = React.useContext(DarkModeContext);

  return (
    <button
      className="dark-mode"
      onClick={() => setDarkMode((current) => !current)}
    >
      <div className="dark-mode-icon">
        <FiSun className="dark-mode-sun" />
        <FiMoon className="dark-mode-moon" />
      </div>

      <div className="dark-mode-text">
        <span className="dark-mode-dark">Toggle dark mode</span>
        <span className="dark-mode-light">Toggle light mode</span>
      </div>
    </button>
  );
};

export default DarkModeSwitch;
