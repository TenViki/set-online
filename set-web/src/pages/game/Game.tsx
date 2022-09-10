import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { GameStatus } from "../../types/Game.type";
import { useGame } from "../../utils/useGame";
import { useUser } from "../../utils/useUser";
import NotStarted from "./state/NotStarted";

const Game = () => {
  const game = useGame();
  const user = useUser();

  const navigate = useNavigate();

  const handleKick = (id: string) => {
    console.log("kick handled");
    game.setGame((prevGame) => {
      if (prevGame) {
        return {
          ...prevGame,
          players: prevGame.players.filter((player) => player.id !== id),
        };
      }
      return null;
    });

    if (user.isLoggedIn && user.id === id) {
      game.remove();
      toast.info("You have been kicked from the game");
      navigate("/");
    }
  };

  useEffect(() => {
    if (!game.game || !user.isLoggedIn) return;
    console.log("Game socket:", game.socket?.id);
    game.socket?.on("kick", handleKick);

    return () => {
      game.socket?.off("kick", handleKick);
    };
  }, [game.socket, user]);

  if (game.game?.status === GameStatus.NOT_STARTED) return <NotStarted game={game.game} />;

  return <div>Game</div>;
};

export default Game;
