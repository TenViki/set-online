import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Inject } from "@nestjs/common/decorators";
import { forwardRef } from "@nestjs/common/utils";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { JoinGameDto } from "./dtos/join-game.dto";
import { Game, GameStatus } from "./entities/Game.entity";
import { GamesGateway } from "./games.gateway";

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private gameRepo: Repository<Game>,
    @Inject(forwardRef(() => GamesGateway)) private gamesGateway: GamesGateway,
  ) {}

  async getUniqueCode() {
    let code: number;

    do {
      code = Math.floor(Math.random() * 10000);
    } while (await this.gameRepo.findOne({ where: { code: code.toString() } }));

    return code;
  }

  async create(user: User, limit: number, isPublic: boolean) {
    const code = await this.getUniqueCode();

    const game = this.gameRepo.create({
      code: code.toString(),
      limit,
      host: user,
      players: [user],
      status: GameStatus.NOT_STARTED,
      public: isPublic,
      winner: null,
    });

    return this.gameRepo.save(game);
  }

  async getGameByUser(user: User) {
    // Find a game where the user is a player with all the players
    const gameObject = await this.gameRepo.findOne({
      where: { players: { id: user.id } },
    });

    if (!gameObject) throw new NotFoundException("Game not found");

    const game = await this.gameRepo.findOne({
      where: { id: gameObject.id },
      relations: ["players", "host"],
    });

    return game;
  }

  async join(user: User, joinDto: JoinGameDto) {
    if (!joinDto.code && !joinDto.gameId) throw new BadRequestException("Game code or game id required");

    // searhc for game with either the code or the id
    const game = await this.gameRepo.findOne({
      where: [{ code: joinDto.code }, { id: joinDto.gameId }],
      relations: ["players", "host"],
    });

    if (!game) throw new NotFoundException("Game not found");

    // check if the game is full
    if (game.players.length >= game.limit) {
      throw new NotFoundException("Game is full");
    }

    // join user to game
    game.players.push(user);

    this.gamesGateway.sendToGame(game.id, "join", user);

    // save game
    return this.gameRepo.save(game);
  }

  async leave(user: User) {
    const game = await this.getGameByUser(user);

    if (!game) throw new NotFoundException("User not in game");

    // remove user from game
    game.players = game.players.filter((player) => player.id !== user.id);

    if (user.id === game.host.id) {
      this.gameRepo.delete(game.id);
      return;
    }

    // save game
    this.gameRepo.save(game);

    this.gamesGateway.sendToGame(game.id, "leave", user.id);
  }

  async kick(user: User, id: string) {
    const game = await this.getGameByUser(user);

    if (!game) throw new NotFoundException("User not in game");
    if (user.id !== game.host.id) throw new BadRequestException("Only host can kick");

    // remove user from game
    game.players = game.players.filter((player) => player.id !== id);

    // save game
    this.gameRepo.save(game);

    this.gamesGateway.sendToGame(game.id, "kick", id);
  }
}
