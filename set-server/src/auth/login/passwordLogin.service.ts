import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PasswordLogin } from "./passwordLogin.entity";

export class PasswordLoginService {
  constructor(
    @InjectRepository(PasswordLogin)
    private passwordLoginRepository: Repository<PasswordLogin>,
  ) {}
}
