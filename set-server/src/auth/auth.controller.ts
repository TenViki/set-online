import { Body, Controller, Post, Request, Get, UseGuards } from "@nestjs/common";
import { Request as Req } from "express";
import { User } from "src/user/user.entity";
import { CurrentUser } from "src/utils/decorators/current-user.decorator";
import { AuthGuard } from "src/utils/guards/auth.guard";
import { Serialize } from "src/utils/interceptors/serialize.interceptor";
import { AuthService } from "./auth.service";
import { AuthDto, UserDto } from "./dto/auth.dto";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";
import { RecoveryService } from "./recovery.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService, private recoveryService: RecoveryService) {}

  @Post("login/signup")
  @Serialize(AuthDto)
  async loginSignup(@Body() signupDto: SignupDto, @Request() req: Req) {
    return this.authService.signup(signupDto, req.ip, req.headers["user-agent"]);
  }

  @Post("login")
  @Serialize(AuthDto)
  async login(@Body() loginDto: LoginDto, @Request() req: Req) {
    return this.authService.login(loginDto, req.ip, req.headers["user-agent"]);
  }

  @Get("me")
  @Serialize(UserDto)
  @UseGuards(AuthGuard)
  async getUserInfo(@CurrentUser() user: User) {
    return user;
  }

  @Post("/recovery")
  @Serialize(AuthDto)
  async recoverAccount(@Body() recoveryDto: AuthDto) {
    return this.recoveryService.recoverAccount(recoveryDto);
  }
}
