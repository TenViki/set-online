import React from "react";
import { DarkModeContext } from "../../App";
import { FiMoon, FiSun } from "react-icons/fi";

const DarkModeSwitch = () => {
  const { darkMode, setDarkMode } = React.useContext(DarkModeContext);

  return (
    <button
      className="dark-mode"
      onClick={() => setDarkMode((current) => !current)}
    >
      <div className="dark-mode-icon">
        <FiSun size={24} color={darkMode ? "white" : "black"} />
      </div>

      <div className="dark-mode-text">
        <span>{darkMode ? "Light" : "Dark"}</span>
      </div>
    </button>
  );
};

export default DarkModeSwitch;
