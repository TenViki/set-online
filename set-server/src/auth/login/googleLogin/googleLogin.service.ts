import { Injectable } from "@nestjs/common";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { GoogleLogin } from "./googleLogin.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/user/user.entity";
import { GoogleUserResponse } from "src/utils/types/google.types";
import { BadRequestException } from "@nestjs/common";
import { UserService } from "src/user/user.service";

@Injectable()
export class GoogleLoginService {
  private googleAuth: OAuth2Client;

  constructor(@InjectRepository(GoogleLogin) private googleLoginRepo: Repository<GoogleLogin>, private userService: UserService) {
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
    const { data } = await this.googleAuth.request<GoogleUserResponse>({
      url: "https://www.googleapis.com/oauth2/v1/userinfo",
    });
    this.googleAuth.setCredentials(null);
    return data;
  }

  completeLogin = async (identifier: string, username: string) => {
    const googleLogin = await this.googleLoginRepo.findOne({ where: { googleId: identifier }, relations: ["user"] });
    if (!googleLogin) throw new BadRequestException("Google login not found");

    const user = await this.userService.getUser({ username });
    if (user || googleLogin.user) throw new BadRequestException("Username already taken");

    const userInfo = await this.getUser(googleLogin);
    const newUser = this.userService.createUser({
      username,
      email: userInfo.email,
    });

    return newUser;
  };

  async login(code: string): Promise<
    | {
        success: false;
        message: string;
        identifier: string;
        suggestedUsername: string;
      }
    | {
        success: true;
        user: User;
      }
  > {
    const { tokens } = await this.googleAuth.getToken(code);
    this.googleAuth.setCredentials(tokens);
    const { data } = await this.googleAuth.request<GoogleUserResponse>({
      url: "https://www.googleapis.com/oauth2/v1/userinfo",
    });
    this.googleAuth.setCredentials(null);

    if (!data.verified_email) throw new BadRequestException("Email is not verified");

    let googleLogin = await this.googleLoginRepo.findOne({ where: { googleId: data.id } });

    // Google login was found
    if (googleLogin) {
      // Update tokens in thae database
      googleLogin.accessToken = tokens.access_token;
      googleLogin.refreshToken = tokens.refresh_token;
      googleLogin.expiresAt = new Date(tokens.expiry_date);
      await this.googleLoginRepo.save(googleLogin);

      // Try to find user with the google login
      let user = await this.userService.getUser({ googleLogin });
      if (!user) {
        // If User is not find, try to find user with the email
        user = await this.userService.getUser({ email: data.email });
        if (user) {
          user.googleLogin = googleLogin;
          await this.userService.saveUser(user);

          // If user is found, return the user
          return { success: true, user };
        }

        // If user is not found, return the suggested username
        return {
          success: false,
          message: "Username required",
          identifier: data.email,
          suggestedUsername: data.name,
        };
      }
      return { success: true, user };
    }

    // Google login was not found; create a new one
    const newGoogleLogin = this.googleLoginRepo.create({
      googleId: data.id,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: new Date(tokens.expiry_date),
      user: null,
    });

    const savedGoogleLogin = await this.googleLoginRepo.save(newGoogleLogin);

    return {
      success: false,
      message: "Username required",
      identifier: savedGoogleLogin.id,
      suggestedUsername: data.name,
    };
  }
}
