import { Controller, Get } from "@nestjs/common";
import { randomBytes } from "crypto";

@Controller("auth/login/discord")
export class DiscordLoginController {
  @Get("/")
  getDiscordLogin() {
    return {
      url: process.env.DISCORD_URL,
      state: randomBytes(32).toString("base64url"),
    };
  }
}
