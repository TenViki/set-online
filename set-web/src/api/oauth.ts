import { httpRequest } from "./server";

interface DiscordUrlResponse {
  url: string;
  state: string;
}

export const getOauthLink = (service: string) => {
  return httpRequest<DiscordUrlResponse>(`/auth/login/${service}`, "get");
};
