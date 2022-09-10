import { useContext, useEffect } from "react";
import { useQuery } from "react-query";
import { getGameByUser } from "../api/game";
import { GameContext, UserContext } from "../App";
import { ApiError } from "../types/Api.type";
import { useUser } from "./useUser";

export const useGame = () => {
  const game = useContext(GameContext);
  const user = useUser();

  const fetchedGame = useQuery("game", getGameByUser, {
    enabled: !game.game && user.isLoggedIn,
  });

  useEffect(() => {
    if (!game.game && fetchedGame.data) {
      game.setGame(fetchedGame.data);
    }
  }, [game, fetchedGame]);

  return {
    loading: game.game ? false : fetchedGame.isLoading,
    game: game.game || fetchedGame.data,
    error: fetchedGame.error as ApiError,
    socket: game.socket,
    setGame: game.setGame,
  };
};
