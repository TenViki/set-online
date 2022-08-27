import { Injectable } from "@nestjs/common";
import { SignupDto } from "./dto/signup.dto";
import { BadRequestException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { PasswordLoginService } from "./login/passwordLogin.service";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private passwordLoginService: PasswordLoginService,
  ) {}
  async signup(signupDto: SignupDto) {
    if (await this.userService.getUser({ username: signupDto.username }))
      throw new BadRequestException("Username already exists");

    switch (signupDto.loginType) {
      case "password":
        if (!signupDto.password || !signupDto.email) {
          throw new BadRequestException("Password and email are required");
        }

        const passwordLogin = await this.passwordLoginService.create(
          signupDto.email,
          signupDto.password,
        );
        const user = await this.userService.createUser({
          passwordLogin,
          username: signupDto.username,
        });

        return user;
    }
  }
}
