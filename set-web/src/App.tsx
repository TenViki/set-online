import { useState } from "react";
import CardRenderer from "./components/card-renderer/CardRenderer";
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
      <div className="grid">
        {deck.map((cardProps) => (
          <CardRenderer props={cardProps} />
        ))}
      </div>

      <button onClick={() => setDarkMode(!darkMode)}>
        Toggle dark mode: {darkMode ? "dark" : "light"}
      </button>
    </div>
  );
}

export default App;
