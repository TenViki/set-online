import { useState } from "react";
import CardRenderer from "./components/card-renderer/CardRenderer";
import { CardProps } from "./types/CardType";

function App() {
  const [cardProps, setCardProps] = useState<CardProps>({
    color: 1,
    shape: 1,
    count: 1,
    fill: 1,
  });

  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <div className="card-renderer">
        <CardRenderer props={cardProps} />
      </div>
      Color:{" "}
      <input
        type="range"
        min="1"
        max="3"
        step="1"
        value={cardProps.color}
        onChange={(e) =>
          setCardProps({ ...cardProps, color: Number(e.target.value) })
        }
      />
      <br />
      Shape:{" "}
      <input
        type="range"
        min="1"
        max="3"
        step="1"
        value={cardProps.shape}
        onChange={(e) =>
          setCardProps({ ...cardProps, shape: Number(e.target.value) })
        }
      />
      <br />
      Count:{" "}
      <input
        type="range"
        min="1"
        max="3"
        step="1"
        value={cardProps.count}
        onChange={(e) =>
          setCardProps({ ...cardProps, count: Number(e.target.value) })
        }
      />
      <br />
      Fill:{" "}
      <input
        type="range"
        min="1"
        max="3"
        step="1"
        value={cardProps.fill}
        onChange={(e) =>
          setCardProps({ ...cardProps, fill: Number(e.target.value) })
        }
      />
      <br />
      <button onClick={() => setDarkMode(!darkMode)}>
        Toggle dark mode: {darkMode ? "dark" : "light"}
      </button>
    </div>
  );
}

export default App;
