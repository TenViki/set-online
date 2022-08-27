import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ValidationPipeCheck } from "./utils/validation.pipe";
import { APP_PIPE } from "@nestjs/core";
import { Session } from "./auth/session.entity";

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
        synchronize: process.env.NODE_ENV === "development",
        logging: true,
        entities: [__dirname + "/**/*.entity{.ts,.js}", Session],
      }),
    }),
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
  ],
})
export class AppModule {}
