import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { SocketAuthService } from "src/socket/socket-auth.service";
import { SocketModule } from "src/socket/socket.module";
import { AuthGuard } from "src/utils/guards/auth.guard";
import { Game } from "./entities/Game.entity";
import { GamesController } from "./games.controller";
import { GamesGateway } from "./games.gateway";
import { GamesService } from "./games.service";

@Module({
  controllers: [GamesController],
  providers: [GamesService, GamesGateway],
  imports: [TypeOrmModule.forFeature([Game]), SocketModule],
})
export class GamesModule {}
