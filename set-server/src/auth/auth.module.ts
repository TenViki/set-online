import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PasswordLogin } from "./login/passwordLogin.entity";
import { PasswordLoginService } from "./login/passwordLogin.service";
import { CurrentUserMiddleware } from "./middleware/current-user.middleware";
import { Session } from "./session.entity";
import { SessionService } from "./session.service";
import { MiddlewareConsumer } from "@nestjs/common";
import { RecoveryService } from "./recovery.service";
import { Recovery } from "./recovery.entity";
import { DiscordLoginController } from "./login/discordLogin/discordLogin.controller";
import { DiscordLoginGateway } from "./login/discordLogin/discordLogin.gateway";

@Module({
  controllers: [AuthController, DiscordLoginController],
  imports: [UserModule, TypeOrmModule.forFeature([PasswordLogin, Session, Recovery])],
  providers: [AuthService, PasswordLoginService, SessionService, RecoveryService, DiscordLoginGateway],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes("*");
  }
}
