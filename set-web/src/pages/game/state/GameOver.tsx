import React from "react";
import { useNavigate } from "react-router";
import Button from "../../../components/button/Button";
import { useGame } from "../../../utils/useGame";
import PlayerInGame from "../components/PlayerInGame";
import "./GameOver.scss";

const GameOver = () => {
  const { game, remove } = useGame();

  const navigate = useNavigate();

  return (
    <div className="game-over">
      <h1 className="text">Game Over</h1>

      <div className="game-podium">
        {game?.points
          .sort((a, b) => b.points - a.points)
          .map((point, index) => (
            <div className="game-podium-item" key={point.user.id}>
              <div className="game-podium-item-place">{index + 1}</div>
              <PlayerInGame user={point.user} isHost={false} isMe={false} score={point.points} />
            </div>
          ))}
      </div>

      <Button
        text="Go to main menu"
        onClick={() => {
          // go to main page and reload
          remove();

          navigate("/");
        }}
      />
    </div>
  );
};

export default GameOver;
