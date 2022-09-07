import { GameType } from "../types/Game.type";
import { httpRequest } from "./server";

export const createGameRequest = (data: { limit: number; public: boolean }) => {
  return httpRequest<GameType>("/games/", "post", { data, useToken: true });
};

export const getGameByUser = () => {
  return httpRequest<GameType>(`/games/`, "get", { useToken: true });
};

export const joinGameRequest = (data: { code?: string; gameId?: string }) => {
  return httpRequest<GameType>("/games/join", "post", { data, useToken: true });
};
