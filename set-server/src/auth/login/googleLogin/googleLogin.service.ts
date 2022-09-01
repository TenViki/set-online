import { Injectable } from "@nestjs/common";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { GoogleLogin } from "./googleLogin.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class GoogleLoginService {
  private googleAuth: OAuth2Client;

  constructor(@InjectRepository(GoogleLogin) private googleLoginRepo: Repository<GoogleLogin>) {
    this.googleAuth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );
  }

  getAuthUrl(state: string) {
    return this.googleAuth.generateAuthUrl({
      access_type: "online",
      scope: ["profile", "email"],
      state,
    });
  }

  async getUser(googleLogin: GoogleLogin) {
    this.googleAuth.setCredentials({
      access_token: googleLogin.accessToken,
      refresh_token: googleLogin.refreshToken,
    });
    const { data } = await this.googleAuth.request({
      url: "https://www.googleapis.com/oauth2/v1/userinfo",
    });
    this.googleAuth.setCredentials(null);
    return data;
  }

  async login(code: string) {
    const { tokens } = await this.googleAuth.getToken(code);
    this.googleAuth.setCredentials(tokens);
    const { data } = await this.googleAuth.request({
      url: "https://www.googleapis.com/oauth2/v1/userinfo",
    });

    console.log(data);

    return data;
  }
}
