import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useGame } from "../../utils/useGame";

const Game = () => {
  const id = useParams().id;

  const s = useGame(id);
  console.log(s);

  return <div>{s.game?.limit}</div>;
};

export default Game;
