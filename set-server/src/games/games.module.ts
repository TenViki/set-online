import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Game } from "./entities/Game.entity";
import { GamesController } from "./games.controller";
import { GamesService } from "./games.service";

@Module({
  controllers: [GamesController],
  providers: [GamesService],
  imports: [TypeOrmModule.forFeature([Game])],
})
export class GamesModule {}
