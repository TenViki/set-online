import React, { useEffect } from "react";
import { useParams } from "react-router";
import { GameStatus } from "../../types/Game.type";
import { useGame } from "../../utils/useGame";
import NotStarted from "./state/NotStarted";

const Game = () => {
  const game = useGame();
  if (game.game?.status === GameStatus.NOT_STARTED) return <NotStarted game={game.game} />;

  return <div>Game</div>;
};

export default Game;
