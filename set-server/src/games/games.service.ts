import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { JoinGameDto } from "./dtos/join-game.dto";
import { Game, GameStatus } from "./entities/Game.entity";

@Injectable()
export class GamesService {
  constructor(@InjectRepository(Game) private gameRepo: Repository<Game>) {}

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
    // Find a game where the user is a player
    const game = await this.gameRepo.findOne({
      where: { players: { id: user.id } },
      relations: {
        host: true,
        players: true,
      },
    });

    if (!game) throw new NotFoundException("Game not found");

    return game;
  }

  async join(user: User, joinDto: JoinGameDto) {
    if (!joinDto.code && !joinDto.gameId) throw new BadRequestException("Game code or game id required");

    // searhc for game with either the code or the id
    const game = await this.gameRepo.findOne({
      where: [{ code: joinDto.code }, { id: joinDto.gameId }],
      relations: {
        host: true,
        players: true,
      },
    });

    if (!game) throw new NotFoundException("Game not found");

    // check if the game is full
    if (game.players.length >= game.limit) {
      throw new NotFoundException("Game is full");
    }

    // join user to game
    game.players.push(user);

    // save game
    return this.gameRepo.save(game);
  }
}
