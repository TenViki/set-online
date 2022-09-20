import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { FindOptionsRelations, Like, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { defaultRelations } from "src/utils/database.config";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async createUser(options: Partial<User> = {}) {
    const user = this.userRepo.create(options);
    return this.userRepo.save(user);
  }

  async getUser(where: Partial<User>, relations?: FindOptionsRelations<User>) {
    return this.userRepo.findOne({
      where,
      relations,
    });
  }

  async updateUser(where: Partial<User>, options: Partial<User>) {
    const user = await this.userRepo.findOne({ where });
    if (!user) throw new Error("User not found");
    Object.assign(user, options);
    return this.userRepo.save(user);
  }

  async saveUser(user: User) {
    return this.userRepo.save(user);
  }

  async query(q: string) {
    if (!q) return [];
    return this.userRepo.find({
      where: {
        username: Like(`%${q}%`),
      },
      order: {
        username: "DESC",
      },
      take: 5,
    });
  }

  getQueryBuilder() {
    return this.userRepo.createQueryBuilder("user");
  }

  getRepository() {
    return this.userRepo;
  }
}
