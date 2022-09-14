import { BadRequestException } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { SessionService } from "src/auth/session.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { DiscordTokenResponse, DiscordUserResponse } from "src/utils/types/discord.types";
import { Repository } from "typeorm";
import { DiscordLogin } from "./discordLogin.entity";
import { URLSearchParams } from "url";
import * as fs from "fs/promises";
import { v4 } from "uuid";

@Injectable()
export class DiscordLoginService {
  constructor(
    private userService: UserService,
    private sessionService: SessionService,
    @InjectRepository(DiscordLogin) private discordLoginRepo: Repository<DiscordLogin>,
  ) {}

  async exchangeCodeForToken(code: string) {
    try {
      const response = await axios.post<DiscordTokenResponse>(
        `https://discordapp.com/api/oauth2/token`,
        new URLSearchParams({
          client_id: process.env.DISCORD_CLIENT_ID,
          client_secret: process.env.DISCORD_CLIENT_SECRET,
          grant_type: "authorization_code",
          code,
          redirect_uri: process.env.DISCORD_REDIRECT_URI,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.response.data.error_description);
    }
  }

  async refreshToken(discordLogin: DiscordLogin) {
    if (discordLogin.expiresAt > new Date()) return;
    try {
      const response = await axios.post<DiscordTokenResponse>(
        `https://discordapp.com/api/oauth2/token`,
        new URLSearchParams({
          client_id: process.env.DISCORD_CLIENT_ID,
          client_secret: process.env.DISCORD_CLIENT_SECRET,
          grant_type: "refresh_token",
          refresh_token: discordLogin.refreshToken,
          redirect_uri: process.env.DISCORD_REDIRECT_URI,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      discordLogin.accessToken = response.data.access_token;
      this.discordLoginRepo.save(discordLogin);
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.response.data.error_description);
    }
  }

  async getUser(discordLogin: DiscordLogin | string) {
    if (typeof discordLogin !== "string") await this.refreshToken(discordLogin);

    try {
      const response = await axios.get<DiscordUserResponse>(`https://discordapp.com/api/users/@me`, {
        headers: {
          Authorization: `Bearer ${typeof discordLogin === "string" ? discordLogin : discordLogin.accessToken}`,
        },
      });

      return response.data;
    } catch (error) {}
  }

  async completeLogin(username: string, identifier: string) {
    const discordLogin = await this.discordLoginRepo.findOne({ where: { id: identifier }, relations: ["user"] });
    if (!discordLogin) throw new BadRequestException("Invalid identifier");

    let user = await this.userService.getUser({ username });
    if (user || discordLogin.user) throw new BadRequestException("Username already taken");

    const discordUser = await this.getUser(discordLogin);

    let avatarId: string;

    try {
      if (discordUser.avatar) avatarId = await this.downloadAvatar(discordUser.avatar, discordUser.id);
    } catch {}

    user = await this.userService.createUser({ username, discordLogin, email: discordUser.email, avatar: avatarId });
    return user;
  }

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
    const tokenResponse = await this.exchangeCodeForToken(code);
    const discordUser = await this.getUser(tokenResponse.access_token);

    if (!discordUser.verified) throw new BadRequestException("You don't have verified email on your discord account");

    const discordLogin = await this.discordLoginRepo.findOne({ where: { discordId: discordUser.id } });
    if (discordLogin) {
      discordLogin.accessToken = tokenResponse.access_token;
      discordLogin.refreshToken = tokenResponse.refresh_token;
      discordLogin.expiresAt = new Date(Date.now() + tokenResponse.expires_in * 1000);
      this.discordLoginRepo.save(discordLogin);

      const user = await this.userService.getUser({ discordLogin });
      if (!user) {
        const user = await this.userService.getUser({ email: discordUser.email });
        if (user) {
          user.discordLogin = discordLogin;
          this.userService.saveUser(user);
          return {
            success: true,
            user,
          };
        } else {
          return {
            success: false,
            message: "Username required",
            identifier: discordLogin.id,
            suggestedUsername: discordUser.username,
          };
        }
      }

      return {
        success: true,
        user,
      };
    } else {
      const newDiscordLogin = this.discordLoginRepo.create({
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000),
        discordId: discordUser.id,
        user: null,
      });

      const savedDiscordLogin = await this.discordLoginRepo.save(newDiscordLogin);

      const user = await this.userService.getUser({ email: discordUser.email });
      if (user) {
        user.discordLogin = savedDiscordLogin;
        await this.userService.saveUser(user);
        return { success: true, user };
      }

      return {
        success: false,
        message: "Username required",
        identifier: savedDiscordLogin.id,
        suggestedUsername: discordUser.username,
      };
    }
  }

  async downloadAvatar(avatarId: string, userId: string) {
    if (!avatarId) return;

    const response = await axios.get(`https://cdn.discordapp.com/avatars/${userId}/${avatarId}.png`, {
      responseType: "arraybuffer",
    });

    const filename = v4();

    const avatarPath = `files/avatars/${filename}.png`;
    await fs.writeFile(avatarPath, response.data);

    return filename;
  }
}
