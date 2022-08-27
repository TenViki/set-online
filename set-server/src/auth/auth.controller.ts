import { Body, Controller, Post } from "@nestjs/common";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login/signup")
  async loginSignup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }
}
