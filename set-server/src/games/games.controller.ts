import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { User } from "src/user/user.entity";
import { CurrentUser } from "src/utils/decorators/current-user.decorator";
import { AuthGuard } from "src/utils/guards/auth.guard";
import { Serialize } from "src/utils/interceptors/serialize.interceptor";
import { GameDto } from "./dtos/game.dto";
import { JoinGameDto } from "./dtos/join-game.dto";
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

  @Get("/")
  @Serialize(GameDto)
  @UseGuards(AuthGuard)
  async get(@CurrentUser() user: User) {
    return this.gamesService.getGameByUser(user);
  }

  @Post("/join")
  @Serialize(GameDto)
  @UseGuards(AuthGuard)
  async join(@Body() body: JoinGameDto, @CurrentUser() user: User) {
    return this.gamesService.join(user, body);
  }

  @Delete("/")
  @UseGuards(AuthGuard)
  async leave(@CurrentUser() user: User) {
    return this.gamesService.leave(user);
  }

  @Delete("/user/:id")
  @UseGuards(AuthGuard)
  async kick(@CurrentUser() user: User, @Param("id") id: string) {
    return this.gamesService.kick(user, id);
  }

  @Post("/invite/:id")
  @UseGuards(AuthGuard)
  async invite(@CurrentUser() user: User, @Param("id") id: string) {
    return this.gamesService.invite(user, id);
  }

  @Post("/start")
  @UseGuards(AuthGuard)
  async start(@CurrentUser() user: User) {
    return this.gamesService.start(user);
  }
}
