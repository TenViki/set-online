import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Session } from "inspector";
import { UserModule } from "src/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PasswordLogin } from "./login/passwordLogin.entity";
import { PasswordLoginService } from "./login/passwordLogin.service";

@Module({
  controllers: [AuthController],
  imports: [UserModule, TypeOrmModule.forFeature([PasswordLogin, Session])],
  providers: [AuthService, PasswordLoginService],
})
export class AuthModule {}
