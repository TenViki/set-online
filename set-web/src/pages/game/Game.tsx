import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { GameStatus, UserLowType } from "../../types/Game.type";
import { useGame } from "../../utils/useGame";
import { useUser } from "../../utils/useUser";
import GameOver from "./state/GameOver";
import InProgress from "./state/InProgress";
import NotStarted from "./state/NotStarted";

const Game = () => {
  const game = useGame();
  const user = useUser();

  const navigate = useNavigate();

  const handleKick = (id: string) => {
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

  const handleDeleted = () => {
    toast.info("Game has been deleted");
    game.remove();
    navigate("/");
  };

  const handleJoin = (user: UserLowType) => {
    game.setGame((prevGame) => {
      if (prevGame) {
        return {
          ...prevGame,
          players: [...prevGame.players, user],
        };
      }
      return null;
    });
  };

  const handleStart = (data: { laidOut: string[] }) => {
    game.setGame((prevGame) => {
      if (prevGame) {
        return {
          ...prevGame,
          laidOut: data.laidOut,
          status: GameStatus.IN_PROGRESS,
        };
      }
      return null;
    });

    toast.info("Game has started");
    console.log(data.laidOut);
  };

  const handleGameOver = (data: { points: { user: UserLowType; points: number }[] }) => {
    game.setGame((prevGame) => {
      if (prevGame) {
        return {
          ...prevGame,
          status: GameStatus.FINISHED,
          points: data.points,
        };
      }
      return null;
    });
  };

  useEffect(() => {
    if (!game.game || !user.isLoggedIn) return;
    game.socket?.on("kick", handleKick);
    game.socket?.on("join", handleJoin);
    game.socket?.on("leave", handleKick);
    game.socket?.on("deleted", handleDeleted);
    game.socket?.on("start", handleStart);
    game.socket?.on("game-over", handleGameOver);

    return () => {
      game.socket?.off("kick", handleKick);
      game.socket?.off("join", handleJoin);
      game.socket?.off("leave", handleKick);
      game.socket?.off("deleted", handleDeleted);
      game.socket?.off("start", handleStart);
      game.socket?.off("game-over", handleGameOver);
    };
  }, [game.socket, user]);

  if (game.game?.status === GameStatus.NOT_STARTED) return <NotStarted game={game.game} />;
  if (game.game?.status === GameStatus.IN_PROGRESS) return <InProgress />;
  if (game.game?.status === GameStatus.FINISHED) return <GameOver />;

  return <div>Game</div>;
};

export default Game;
