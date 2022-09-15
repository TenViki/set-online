import React, { CSSProperties, useEffect } from "react";
import CardRenderer from "../../../components/card-renderer/CardRenderer";
import { idToCard } from "../../../utils/deck.util";
import { useGame } from "../../../utils/useGame";
import { useUser } from "../../../utils/useUser";
import PlayerInGame from "../components/PlayerInGame";
import "./InProgress.scss";

const InProgress = () => {
  const { game } = useGame();
  const user = useUser();

  const [selectedCards, setSelectedCards] = React.useState<string[]>([]);

  if (!game || !user.isLoggedIn) return null;

  console.log(game);

  useEffect(() => {
    if (!selectedCards.length) return;

    if (selectedCards.length === 3) setTimeout(() => setSelectedCards([]), 300);
  }, [selectedCards]);

  return (
    <div className="game-wrapper">
      <div className="game-cards" style={{ "--columns": (game.laidOut?.length || 0) / 3 } as CSSProperties}>
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
