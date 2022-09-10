import { Injectable } from "@nestjs/common";
import { SignupDto } from "./dto/signup.dto";
import { BadRequestException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { PasswordLoginService } from "./login/passwordLogin.service";
import { User } from "src/user/user.entity";
import { SessionService } from "./session.service";
import { LoginType } from "./types/login.type";
import { LoginDto } from "./dto/login.dto";
import { DiscordLoginService } from "./login/discordLogin/discordLogin.service";
import { AuthGateway } from "./auth.gateway";
import { GoogleLoginService } from "./login/googleLogin/googleLogin.service";
import { NotImplementedException } from "@nestjs/common/exceptions";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private passwordLoginService: PasswordLoginService,
    private sessionService: SessionService,
    private discordLoginService: DiscordLoginService,
    private googleLoginService: GoogleLoginService,
    private authGateway: AuthGateway,
  ) {}
  async signup(signupDto: SignupDto, ip: string, userAgent: string) {
    if (await this.userService.getUser({ username: signupDto.username }))
      throw new BadRequestException("Username already exists");

    let user: User;

    if (!signupDto.password || !signupDto.email) {
      throw new BadRequestException("Password and email are required");
    }

    if (await this.userService.getUser({ email: signupDto.email })) throw new BadRequestException("Email already exists");

    const passwordLogin = await this.passwordLoginService.create(signupDto.email, signupDto.password);
    user = await this.userService.createUser({
      passwordLogin,
      username: signupDto.username,
      email: signupDto.email,
    });

    const session = await this.sessionService.createSession(user, LoginType.PASSWORD, userAgent, ip, signupDto.rememberMe);

    const token = this.sessionService.createToken(session);

    return {
      token,
      user,
      success: true,
    };
  }

  async login(loginDto: LoginDto, ip: string, userAgent: string) {
    let user: User;
    switch (loginDto.loginType) {
      // Login with password
      case LoginType.PASSWORD:
        if (!loginDto.username || !loginDto.password || loginDto.rememberMe === undefined)
          throw new BadRequestException("Username, password and rememberMe are required");

        user = await this.userService.getUser({ email: loginDto.username });
        if (!user) user = await this.userService.getUser({ username: loginDto.username });
        if (!user) throw new BadRequestException("User witch such username or email doesn't exist");

        const isPasswordValid = await this.passwordLoginService.verify(user, loginDto.password);
        if (!isPasswordValid) throw new BadRequestException("Invalid password");
        break;

      // Login with discord
      case LoginType.DISCORD:
        if (!loginDto.code) throw new BadRequestException("Code is required");

        const discordLoginResult = await this.discordLoginService.login(loginDto.code);
        if (!discordLoginResult.success) return discordLoginResult;

        user = discordLoginResult.user;
        break;

      // Complete discord login
      case LoginType.DISCORD_COMPLETE:
        if (!loginDto.username || !loginDto.identifier) throw new BadRequestException("Username and email are required");

        user = await this.discordLoginService.completeLogin(loginDto.username, loginDto.identifier);
        break;

      // Login with google
      case LoginType.GOOGLE:
        if (!loginDto.code) throw new BadRequestException("Code is required");

        const googleLoginResult = await this.googleLoginService.login(loginDto.code);
        if (!googleLoginResult.success) return googleLoginResult;

        user = googleLoginResult.user;
        break;

      // Complete google logina
      case LoginType.GOOGLE_COMPLETE:
        if (!loginDto.username || !loginDto.identifier) throw new BadRequestException("Username and email are required");

        user = await this.googleLoginService.completeLogin(loginDto.username, loginDto.identifier);
        break;
    }

    const session = await this.sessionService.createSession(user, loginDto.loginType, userAgent, ip, loginDto.rememberMe);
    const token = this.sessionService.createToken(session);

    this.authGateway.sendLoginSuccess(loginDto.state, user);

    return {
      token,
      user,
      success: true,
    };
  }

  async verifyToken(token: string) {
    const sessionId = this.sessionService.verifyToken(token);
    console.log(sessionId);
    if (!sessionId) return null;

    const session = await this.sessionService.getSession(sessionId);
    if (!session) return null;

    if (session.expiresAt && session.expiresAt < new Date()) return null;

    return session.user;
  }
}
