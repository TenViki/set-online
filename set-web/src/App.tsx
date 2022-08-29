import React, { useEffect, useState } from "react";
import SideMenu from "./components/sidemenu/SideMenu";
import Router from "./Router";
import { CardProps } from "./types/CardType";
import { getDefaultDarkmodeSetting } from "./utils/darkomode.util";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const DarkModeContext = React.createContext<{
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  darkMode: false,
  setDarkMode: () => {},
});

function App() {
  const [cardProps, setCardProps] = useState<CardProps>({
    color: 1,
    shape: 1,
    count: 1,
    fill: 1,
  });

  const [darkMode, setDarkMode] = useState(getDefaultDarkmodeSetting());

  useEffect(() => {
    localStorage.setItem("color-setting", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      <div className={`app ${darkMode ? "dark" : ""}`}>
        <SideMenu />
        <main>
          <Router />
        </main>
        <ToastContainer theme={darkMode ? "dark" : "light"} />
      </div>
    </DarkModeContext.Provider>
  );
}

export default App;
