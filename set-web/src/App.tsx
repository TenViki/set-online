import { useState } from "react";
import { Routes } from "react-router";
import CardRenderer from "./components/card-renderer/CardRenderer";
import SideMenu from "./components/sidemenu/SideMenu";
import Router from "./Router";
import { CardProps } from "./types/CardType";
import { createDeck } from "./utils/deck.util";

function App() {
  const [cardProps, setCardProps] = useState<CardProps>({
    color: 1,
    shape: 1,
    count: 1,
    fill: 1,
  });

  const [deck, setDEck] = useState<CardProps[]>(createDeck());

  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <SideMenu />
      <Router />
    </div>
  );
}

export default App;
