import { Controller, Get } from "@nestjs/common";
import { randomBytes } from "crypto";

@Controller("auth/login/discord")
export class DiscordLoginController {
  @Get("/")
  getDiscordLogin() {
    const state = randomBytes(32).toString("hex");

    return {
      url: process.env.DISCORD_URL + "&state=" + state,
      state,
    };
  }
}
