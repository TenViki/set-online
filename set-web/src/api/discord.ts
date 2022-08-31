import { httpRequest } from "./server";

interface DiscordUrlResponse {
  url: string;
  state: string;
}

export const getDiscordLogin = () => {
  return httpRequest<DiscordUrlResponse>("/auth/login/discord", "get");
};
