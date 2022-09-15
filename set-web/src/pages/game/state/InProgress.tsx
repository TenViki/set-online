import React, { CSSProperties } from "react";
import CardRenderer from "../../../components/card-renderer/CardRenderer";
import { idToCard } from "../../../utils/deck.util";
import { useGame } from "../../../utils/useGame";
import { useUser } from "../../../utils/useUser";
import PlayerInGame from "../components/PlayerInGame";
import "./InProgress.scss";

const InProgress = () => {
  const { game } = useGame();
  const user = useUser();

  if (!game || !user.isLoggedIn) return null;

  console.log(game);

  return (
    <div className="game-wrapper">
      <div className="game-cards" style={{ "--columns": (game.laidOut?.length || 0) / 3 } as CSSProperties}>
        {game.laidOut?.map((card, i) => (
          <CardRenderer key={i} props={idToCard(card)} />
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
