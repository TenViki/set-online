import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useGame } from "../../utils/useGame";

const Game = () => {
  const s = useGame();

  return <div>{s.game?.limit}</div>;
};

export default Game;
