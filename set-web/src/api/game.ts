import { GameType } from "../types/Game.type";
import { httpRequest } from "./server";

export const createGameRequest = (data: { limit: number; public: boolean }) => {
  return httpRequest<GameType>("/games/", "post", { data, useToken: true });
};

export const getGameById = (id: string) => {
  return httpRequest<GameType>(`/games/${id}`, "get", { useToken: true });
};
