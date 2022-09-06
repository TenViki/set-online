import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { Game, GameStatus } from "./entities/Game.entity";

@Injectable()
export class GamesService {
  constructor(@InjectRepository(Game) private gameRepo: Repository<Game>) {}

  async getUniqueCode() {
    let code: number;

    do {
      code = Math.floor(Math.random() * 10000);
    } while (await this.gameRepo.findOne({ where: { code } }));

    return code;
  }

  async create(user: User, limit: number, isPublic: boolean) {
    const code = await this.getUniqueCode();

    const game = this.gameRepo.create({
      code,
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
}
