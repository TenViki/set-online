import { Body, Controller, Post, Request } from "@nestjs/common";
import { Request as Req } from "express";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login/signup")
  async loginSignup(@Body() signupDto: SignupDto, @Request() req: Req) {
    return this.authService.signup(
      signupDto,
      req.ip,
      req.headers["user-agent"],
    );
  }
}
