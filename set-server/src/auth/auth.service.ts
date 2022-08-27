import { Injectable } from "@nestjs/common";
import { SignupDto } from "./dto/signup.dto";
import { BadRequestException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { PasswordLoginService } from "./login/passwordLogin.service";
import { User } from "src/user/user.entity";
import { SessionService } from "./session.service";
import { LoginType } from "./types/login.type";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private passwordLoginService: PasswordLoginService,
    private sessionService: SessionService,
  ) {}
  async signup(signupDto: SignupDto, ip: string, userAgent: string) {
    if (await this.userService.getUser({ username: signupDto.username }))
      throw new BadRequestException("Username already exists");

    let user: User;

    if (!signupDto.password || !signupDto.email) {
      throw new BadRequestException("Password and email are required");
    }

    if (await this.userService.getUser({ email: signupDto.email }))
      throw new BadRequestException("Email already exists");

    const passwordLogin = await this.passwordLoginService.create(
      signupDto.email,
      signupDto.password,
    );
    user = await this.userService.createUser({
      passwordLogin,
      username: signupDto.username,
    });

    const session = await this.sessionService.createSession(
      user,
      LoginType.PASSWORD,
      userAgent,
      ip,
      signupDto.rememberMe,
    );

    const token = this.sessionService.createToken(session);

    return {
      token,
      user,
    };
  }
}
