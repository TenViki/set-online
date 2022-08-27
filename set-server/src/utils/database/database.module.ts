import { Module } from "@nestjs/common";
import { databaseConfig } from "./database.providers";

@Module({
  providers: [databaseConfig],
  exports: [databaseConfig],
})
export class DatabaseModule {}
