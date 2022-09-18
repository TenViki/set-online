import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PasswordLogin } from "./passwordLogin.entity";
import { BadRequestException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { User } from "src/user/user.entity";

export class PasswordLoginService {
  constructor(
    @InjectRepository(PasswordLogin)
    private passwordLoginRepository: Repository<PasswordLogin>,
  ) {}

  async create(email: string, password: string) {
    if (await this.passwordLoginRepository.findOne({ where: { email } })) {
      throw new BadRequestException("Email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const passwordLogin = this.passwordLoginRepository.create({
      email,
      password: hashedPassword,
    });

    return this.passwordLoginRepository.save(passwordLogin);
  }

  async verify(user: User, password: string) {
    const passwordLogin = await this.passwordLoginRepository.findOne({
      where: { user },
    });

    if (!passwordLogin) return false;

    return bcrypt.compare(password, passwordLogin.password);
  }

  async update(user: User, password: string) {
    const passwordLogin = await this.passwordLoginRepository.findOne({
      where: { user },
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (!passwordLogin) {
      const passwordLogin = this.passwordLoginRepository.create({
        user,
        password: hashedPassword,
        email: user.email,
      });

      return this.passwordLoginRepository.save(passwordLogin);
    } else {
      passwordLogin.password = hashedPassword;
      return this.passwordLoginRepository.save(passwordLogin);
    }
  }
}
