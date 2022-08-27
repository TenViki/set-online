import { Body, Controller, Post, Request } from "@nestjs/common";
import { Request as Req } from "express";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
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

  @Post("login")
  async login(@Body() loginDto: LoginDto, @Request() req: Req) {
    return this.authService.login(loginDto, req.ip, req.headers["user-agent"]);
  }
}
