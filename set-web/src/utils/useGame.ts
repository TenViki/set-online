import { useContext } from "react";
import { useQuery } from "react-query";
import { getGameById } from "../api/game";
import { GameContext } from "../App";
import { ApiError } from "../types/Api.type";

export const useGame = (id?: string) => {
  const game = useContext(GameContext);

  const fetchedGame = useQuery(["game", id], () => getGameById(id!), {
    enabled: !!id && !game.game,
  });

  return {
    loading: game.game ? false : fetchedGame.isLoading,
    game: game.game || fetchedGame.data,
    error: fetchedGame.error as ApiError,
  };
};
