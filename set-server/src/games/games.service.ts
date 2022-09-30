import { BadRequestException, ConsoleLogger, Injectable, NotFoundException } from "@nestjs/common";
import { Inject } from "@nestjs/common/decorators";
import { forwardRef } from "@nestjs/common/utils";
import { InjectRepository } from "@nestjs/typeorm";
import { WsException } from "@nestjs/websockets/errors";
import { plainToClass, plainToInstance } from "class-transformer";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { generateDeck, isSet, shuffleDeck, wait } from "src/utils/cards.utils";
import { QueryBuilder, Repository } from "typeorm";
import { PointsDto } from "./dtos/game.dto";
import { JoinGameDto } from "./dtos/join-game.dto";
import { Game, GameStatus } from "./entities/Game.entity";
import { Points } from "./entities/Points.entity";
import { GamesGateway } from "./games.gateway";

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private gameRepo: Repository<Game>,
    @InjectRepository(Points) private pointsRepo: Repository<Points>,
    @Inject(forwardRef(() => GamesGateway)) private gamesGateway: GamesGateway,
    private usersService: UserService,
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

    const gameDb = await this.gameRepo.save(game);

    const points = this.pointsRepo.create({
      game: gameDb,
      user,
      points: 0,
    });

    await this.pointsRepo.save(points);

    gameDb.points = [points];

    return gameDb;
  }

  async getGameByUser(user: User) {
    // Find a game where the user is a player with all the players
    const gameObject = await this.gameRepo.findOne({
      where: { players: { id: user.id } },
    });

    if (!gameObject) throw new NotFoundException("Game not found");

    const game = await this.gameRepo.findOne({
      where: { id: gameObject.id },
      relations: ["players", "host", "points", "points.user"],
    });

    return game;
  }

  async join(user: User, joinDto: JoinGameDto) {
    if (!joinDto.code && !joinDto.gameId) throw new BadRequestException("Game code or game id required");

    // searhc for game with either the code or the id
    const game = await this.gameRepo.findOne({
      where: [{ code: joinDto.code }, { id: joinDto.gameId }],
      relations: ["players", "host", "points", "points.user"],
    });

    if (!game) throw new NotFoundException("Game not found");

    if (game.players.some((player) => player.id === user.id)) throw new BadRequestException("User already in game");

    // check if the game is full
    if (game.players.length >= game.limit) {
      throw new NotFoundException("Game is full");
    }

    try {
      // Check if the user is already in a game
      const userGame = await this.getGameByUser(user);

      if (userGame) {
        await this.leave(user);
      }
    } catch {}

    // join user to game
    game.players.push(user);

    // create points object for user
    const points = this.pointsRepo.create({
      game,
      user,
      points: 0,
    });

    await this.pointsRepo.save(points);

    this.gamesGateway.sendToGame(game.id, "join", user);

    game.points.push(points);

    // save game
    return this.gameRepo.save(game);
  }

  async leave(user: User) {
    const game = await this.getGameByUser(user);

    if (!game) throw new NotFoundException("User not in game");

    // remove user from game
    game.players = game.players.filter((player) => player.id !== user.id);
    await this.pointsRepo.delete({ game, user });

    if (user.id === game.host.id) {
      this.gameRepo.delete(game.id);
      this.gamesGateway.sendToGame(game.id, "deleted");
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
    await this.pointsRepo.delete({ game, user });

    // save game
    this.gameRepo.save(game);

    this.gamesGateway.sendToGame(game.id, "kick", id);
  }

  async invite(user: User, id: string) {
    const game = await this.getGameByUser(user);

    if (!game) throw new NotFoundException("User not in game");
    if (user.id !== game.host.id) throw new BadRequestException("Only host can invite");

    this.gamesGateway.sendToUser(id, "invite", {
      game,
      user: {
        username: user.username,
      },
    });
  }

  async start(user: User) {
    const game = await this.getGameByUser(user);

    if (!game) throw new NotFoundException("User not in game");
    if (user.id !== game.host.id) throw new BadRequestException("Only host can start");
    if (game.players.length < 2) throw new BadRequestException("Not enough players");

    game.status = GameStatus.IN_PROGRESS;

    const deck = shuffleDeck(generateDeck());

    const laidOut = deck.splice(0, 12);

    game.deck = deck.join(",");
    game.laidOut = laidOut.join(",");

    this.gameRepo.save(game);

    this.gamesGateway.sendToGame(game.id, "start", {
      laidOut: laidOut,
    });
  }

  async handleSet(user: User, set: string[], timeout: boolean) {
    const game = await this.getGameByUser(user);

    if (!game || game.status !== GameStatus.IN_PROGRESS || !(set?.length === 3 || timeout)) {
      return;
    }

    const points = await this.pointsRepo.findOne({
      where: {
        game: {
          id: game.id,
        },
        user,
      },
      relations: ["game", "user"],
    });

    if (timeout) {
      points.points -= 1;

      this.gamesGateway.sendToGame(game.id, "set-error", {
        user: user.id,
        points: points.points,
      });

      return this.pointsRepo.save(points);
    }

    // check if cards are laid out
    if (!set.every((card) => game.laidOut.includes(card))) {
      return;
    }

    // check if really a set
    if (!isSet(set)) {
      points.points -= 1;

      this.gamesGateway.sendToGame(game.id, "set-error", {
        user: user.id,
        points: points.points,
      });

      return this.pointsRepo.save(points);
    }

    // remove set from laid out cards
    const laidOut = game.laidOut.split(",").filter((card) => !set.includes(card));

    game.laidOut = laidOut.join(",");

    await this.gameRepo.save(game);

    points.points += 1;

    await this.pointsRepo.save(points);

    this.gamesGateway.sendToGame(game.id, "set-success", {
      laidOut: laidOut,
      set: set,
      user: user.id,
      points: points.points,
    });

    if (laidOut.length < 12) {
      await wait(1300);
      this.drawCards(game);
    }
  }

  async voteForNoSet(user: User) {
    const game = await this.getGameByUser(user);

    if (!game || game.status !== GameStatus.IN_PROGRESS) {
      throw new NotFoundException("Game not found");
    }

    if (game.laidOut.split(",").length >= 21) {
      throw new BadRequestException("Max cards laid out");
    }

    if (!game.noSetVotes) game.noSetVotes = "";

    // check if user already voted
    if (game.noSetVotes.includes(user.id)) {
      // Remvoe vote

      game.noSetVotes = game.noSetVotes
        .split(",")
        .filter((id) => id !== user.id)
        .join(",");
    } else {
      game.noSetVotes = [...(game.noSetVotes.split(",")[0] ? game.noSetVotes.split(",") : []), user.id].join(",");
    }

    this.gamesGateway.sendToGame(game.id, "no-set-vote", {
      voted: game.noSetVotes.split(",").filter((id) => id !== ""),
      treshold: 0.8,
    });

    if (game.noSetVotes.split(",").length / game.players.length >= 0.8) {
      if (!(await this.drawCards(game))) {
        // game over
        game.status = GameStatus.FINISHED;
        const points = await this.pointsRepo.find({
          where: {
            game: {
              id: game.id,
            },
          },
          relations: ["game", "user"],
        });

        this.gamesGateway.sendToGame(game.id, "game-over", {
          // transform points with class transformer
          points: plainToInstance(PointsDto, points),
        });

        game.winner = points.sort((a, b) => b.points - a.points)[0].user;
        await this.gameRepo.save(game);

        await this.usersService.getRepository().update(
          {
            game: game,
          },
          {
            game: null,
          },
        );

        return;
      }

      this.gamesGateway.sendToGame(game.id, "no-set-vote", {
        voted: [],
        treshold: 0.8,
      });
    }

    await this.gameRepo.save(game);
  }

  async drawCards(game: Game) {
    const deck = game.deck.split(",");
    const laidOut = game.laidOut.split(",");

    if (deck.length < 3) {
      await this.gameRepo.save(game);
      return false;
    }
    const newCards = deck.splice(0, 3);

    game.deck = deck.join(",");
    game.noSetVotes = "";
    game.laidOut = [...laidOut, ...newCards].join(",");

    this.gamesGateway.sendToGame(game.id, "new-cards", {
      laidOut: game.laidOut.split(","),
      newCards: newCards,
      remaining: deck.length,
    });

    await this.gameRepo.save(game);
    return true;
  }
}
