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

export const leaveGameRequest = () => {
  return httpRequest("/games", "delete", { useToken: true });
};

export const kickPlayerRequest = (id: string) => {
  return httpRequest(`/games/user/${id}`, "delete", { useToken: true });
};

export const invitePlayerRequest = (id: string) => {
  return httpRequest(`/games/invite/${id}`, "post", { useToken: true });
};

export const startGameRequest = () => {
  return httpRequest("/games/start", "post", { useToken: true });
};

export const voteForNoSet = () => {
  return httpRequest("/games/vote", "post", { useToken: true });
};
