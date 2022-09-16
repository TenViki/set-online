import React, { CSSProperties, useEffect, useRef } from "react";
import CardRenderer from "../../../components/card-renderer/CardRenderer";
import { idToCard } from "../../../utils/deck.util";
import { useGame } from "../../../utils/useGame";
import { useUser } from "../../../utils/useUser";
import PlayerInGame from "../components/PlayerInGame";
import "./InProgress.scss";

const InProgress = () => {
  const { game } = useGame();
  const user = useUser();

  const cardWrapperRef = useRef<HTMLDivElement>(null);

  const [selectedCards, setSelectedCards] = React.useState<string[]>([]);

  if (!game || !user.isLoggedIn || !game.laidOut) return null;

  useEffect(() => {
    if (!selectedCards.length) return;

    if (selectedCards.length === 3) setTimeout(() => setSelectedCards([]), 300);
  }, [selectedCards]);

  const rowLength = game.laidOut.length / 3;
  const keyMap: { [s: string]: number | null } = {
    "7": 0,
    "8": 1,
    "9": 2,

    "4": rowLength,
    "5": rowLength + 1,
    "6": rowLength + 2,

    "1": rowLength * 2,
    "2": rowLength * 2 + 1,
    "3": rowLength * 2 + 2,

    Home: rowLength > 3 ? 3 : null,
    ArrowUp: rowLength > 4 ? 4 : null,
    PageUp: rowLength > 5 ? 5 : null,

    ArrowLeft: rowLength > 3 ? rowLength + 3 : null,
    Clear: rowLength > 4 ? rowLength + 4 : null,
    ArrowRight: rowLength > 5 ? rowLength + 5 : null,

    End: rowLength > 3 ? rowLength * 2 + 3 : null,
    ArrowDown: rowLength > 4 ? rowLength * 2 + 4 : null,
    PageDown: rowLength > 5 ? rowLength * 2 + 5 : null,
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // if keypad 1-9 is pressed
      // if (e.key >= "1" && e.key <= "9") {
      if (e.key in keyMap) {
        if (!game.laidOut) return;
        const index = keyMap[e.key];
        if (index === null) return;
        const card = game.laidOut[index];

        if (selectedCards.length >= 3) return;

        if (selectedCards.includes(card)) {
          setSelectedCards((prev) => prev.filter((c) => c !== card));
        } else {
          setSelectedCards((prev) => [...prev, card]);
        }
      } else {
        console.log(e.key);
      }
      // }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCards]);

  return (
    <div className="game-wrapper">
      <div className="game-cards" style={{ "--columns": (game.laidOut?.length || 0) / 3 } as CSSProperties} ref={cardWrapperRef}>
        {game.laidOut?.map((card, i) => (
          <div
            className={`game-card-wrapper ${selectedCards.includes(card) && "active"}`}
            onClick={() => {
              if (selectedCards.includes(card)) return setSelectedCards(selectedCards.filter((c) => c !== card));
              if (selectedCards.length === 3) return;

              setSelectedCards((prev) => [...prev, card]);
            }}
          >
            <CardRenderer key={i} props={idToCard(card)} />
          </div>
        ))}
      </div>

      <div className="game-players">
        {game.players.map((player) => (
          <PlayerInGame user={player} isHost={player.id === game.host.id} isMe={user.id === player.id} score={0} />
        ))}
      </div>
    </div>
  );
};

export default InProgress;
