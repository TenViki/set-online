import { UserLowType } from "../types/Game.type";
import { httpRequest } from "./server";

export const findUsers = (query: string) => {
  return httpRequest<UserLowType[]>("/user/query", "get", {
    query: {
      q: query,
    },
  });
};
