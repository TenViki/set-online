import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";

export const databaseConfig = {
  provide: "DATA_SOURCE",
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    return new DataSource({
      type: "postgres",
      host: config.get("DB_HOST"),
      port: config.get("DB_PORT"),
      username: config.get("DB_USER"),
      password: config.get("DB_PASS"),
      database: config.get("DB_NAME"),
      synchronize: process.env.NODE_ENV === "development",
      logging: true,
      entities: [__dirname + "/../**/*.entity{.ts,.js}"],
    });
  },
};
