import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ValidationPipeCheck } from "./utils/validation.pipe";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { Session } from "./auth/session.entity";
import { HttpExceptionFilter } from "./utils/filters/http-exception.filter";
import { MailerModule } from "@nestjs-modules/mailer";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";
import { GamesModule } from "./games/games.module";
import { GamesGateway } from "./games/games.gateway";
import { SocketAuthService } from "./socket/socket-auth.service";
import { SocketModule } from "./socket/socket.module";

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    UserModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: "postgres",
        host: config.get("DB_HOST"),
        port: config.get("DB_PORT"),
        username: config.get("DB_USER"),
        password: config.get("DB_PASS"),
        database: config.get("DB_NAME"),
        synchronize: process.env.NODE_ENV === "dev",
        entities: [__dirname + "/**/*.entity{.ts,.js}", Session],
      }),
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get("EMAIL_HOST"),
          port: config.get("EMAIL_PORT"),
          secure: true,
          auth: {
            user: config.get("EMAIL_USER"),
            pass: config.get("EMAIL_PASS"),
          },
        },
        defaults: {
          from: config.get("EMAIL_FROM"),
        },
        template: {
          dir: __dirname + "/../templates",
          adapter: new EjsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    GamesModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipeCheck({
        whitelist: true,
        stopAtFirstError: true,
      }),
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
