import React, { useEffect, useState } from "react";
import SideMenu from "./components/sidemenu/SideMenu";
import Router from "./Router";
import { CardProps } from "./types/CardType";
import { getDefaultDarkmodeSetting } from "./utils/darkomode.util";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserType } from "./types/User.type";
import { TokenManager } from "./utils/tokenManager";
import { useQuery } from "react-query";
import { getUser } from "./api/auth";
import { GameType } from "./types/Game.type";

export const DarkModeContext = React.createContext<{
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  darkMode: false,
  setDarkMode: () => {},
});

export const UserContext = React.createContext<{
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}>({
  user: null,
  setUser: () => {},
});

export const GameContext = React.createContext<{
  game: GameType | null;
  setGame: React.Dispatch<React.SetStateAction<GameType | null>>;
}>({
  game: null,
  setGame: () => {},
});

function App() {
  const userQuery = useQuery(["user"], getUser, {
    enabled: false,
    retry: false,
    onSuccess: (data) => {
      setUser(data);
    },
  });

  const [darkMode, setDarkMode] = useState(getDefaultDarkmodeSetting());
  const [user, setUser] = useState<UserType | null>(null);
  const [game, setGame] = useState<GameType | null>(null);

  useEffect(() => {
    localStorage.setItem("color-setting", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    TokenManager.loadToken();
    if (TokenManager.getToken()) {
      userQuery.refetch();
    }
  }, []);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      <UserContext.Provider value={{ user, setUser }}>
        <GameContext.Provider value={{ game, setGame }}>
          <div className={`app ${darkMode ? "dark" : ""}`}>
            <SideMenu />
            <main>
              <Router />
            </main>
            <ToastContainer theme={darkMode ? "dark" : "light"} />
          </div>
        </GameContext.Provider>
      </UserContext.Provider>
    </DarkModeContext.Provider>
  );
}

export default App;
