import { Controller, Get } from "@nestjs/common";
import { randomBytes } from "crypto";
import { GoogleLoginService } from "./googleLogin.service";

@Controller("/auth/login/google")
export class GoogleLoginController {
  constructor(private googleLoginSerice: GoogleLoginService) {}

  @Get("/")
  getDiscordLogin() {
    const state = randomBytes(32).toString("base64url");
    return {
      url: this.googleLoginSerice.getAuthUrl(state),
      state,
    };
  }
}
