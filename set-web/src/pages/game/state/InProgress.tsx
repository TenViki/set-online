import React, { CSSProperties } from "react";
import CardRenderer from "../../../components/card-renderer/CardRenderer";
import { idToCard } from "../../../utils/deck.util";
import { useGame } from "../../../utils/useGame";
import "./InProgress.scss";

const InProgress = () => {
  const { game } = useGame();

  if (!game) return null;

  console.log(game);

  return (
    <div>
      <div className="game-cards" style={{ "--columns": (game.laidOut?.length || 0) / 3 } as CSSProperties}>
        {game.laidOut?.map((card, i) => (
          <CardRenderer key={i} props={idToCard(card)} />
        ))}
      </div>
    </div>
  );
};

export default InProgress;
