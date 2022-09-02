import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { User } from "src/user/user.entity";
import { CurrentUser } from "src/utils/decorators/current-user.decorator";
import { AuthGuard } from "src/utils/guards/auth.guard";
import { Serialize } from "src/utils/interceptors/serialize.interceptor";
import { GameDto } from "./dtos/game.dto";
import { NewGameDto } from "./dtos/new-game.dto";
import { GamesService } from "./games.service";

@Controller("games")
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post("/")
  @Serialize(GameDto)
  @UseGuards(AuthGuard)
  async create(@Body() body: NewGameDto, @CurrentUser() user: User) {
    return this.gamesService.create(user, body.limit, body.public);
  }
}
