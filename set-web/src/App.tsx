import React, { useEffect, useState } from "react";
import SideMenu from "./components/sidemenu/SideMenu";
import Router from "./Router";
import { CardProps } from "./types/CardType";
import { getDefaultDarkmodeSetting } from "./utils/darkomode.util";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserType } from "./types/User.type";
import { TokenManager } from "./utils/tokenManager";
import { useQuery, useQueryClient } from "react-query";
import { getUser } from "./api/auth";
import { GameType } from "./types/Game.type";
import { io, Socket } from "socket.io-client";
import InvitePopup from "./components/invite-popup/InvitePopup";
import { serverUrl } from "./api/server";

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
  socket: Socket | null;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
}>({
  game: null,
  setGame: () => {},
  socket: null,
  setSocket: () => {},
});

function App() {
  const [gamesSocket, setGamesSocket] = useState<Socket | null>(null);

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

  useEffect(() => {
    if (!user) return;

    console.log("Trying to connect to games socket");

    const socket = io(serverUrl + "games", {
      auth: {
        token: TokenManager.getToken(),
      },
    });

    socket.on("connect", () => {
      console.log("games socket connected");
      setGamesSocket(socket);
    });

    socket.on("error", (err) => {
      console.log("games socket error", err);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const handleCnnectSuccess = () => {
    console.log("Registering game socket to game", game?.id);
    gamesSocket?.emit("listen", game?.id);
  };

  useEffect(() => {
    if (!gamesSocket || !game) return;

    gamesSocket.on("connect-success", handleCnnectSuccess);

    gamesSocket.emit("listen", game.id);

    return () => {
      gamesSocket.off("connect-success", handleCnnectSuccess);
    };
  }, [gamesSocket, game]);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      <UserContext.Provider value={{ user, setUser }}>
        <GameContext.Provider value={{ game, setGame, socket: gamesSocket, setSocket: setGamesSocket }}>
          <div className={`app ${darkMode ? "dark" : ""}`}>
            <SideMenu />
            <main>
              <Router />
            </main>
            <ToastContainer theme={darkMode ? "dark" : "light"} />
            <InvitePopup />
          </div>
        </GameContext.Provider>
      </UserContext.Provider>
    </DarkModeContext.Provider>
  );
}

export default App;
