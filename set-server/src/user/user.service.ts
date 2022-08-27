import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { FindOptionsRelations, Repository } from "typeorm";
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
}
