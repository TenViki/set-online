import { Controller, Post } from "@nestjs/common";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";

@Controller("auth")
export class AuthController {
  constructor(private userService: UserService) {}

  @Post("login/signup")
  async loginSignup() {
    this.userService.createUser();
    return "login/signup";
  }
}
