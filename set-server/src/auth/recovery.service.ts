import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { Recovery } from "./recovery.entity";
import { randomBytes } from "crypto";
import * as bc from "bcrypt";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class RecoveryService {
  constructor(
    @InjectRepository(Recovery) private recoveryRepo: Repository<Recovery>,
    private userService: UserService,
    private mailerService: MailerService,
  ) {}

  async createRecovery(email: string) {
    const user = await this.userService.getUser({ email });
    if (!user) throw new NotFoundException("User with such email doesn't exist");

    const selector = await this.generateSelector();
    const token = await this.generateToken();

    const link = `${process.env.FRONTEND_URL}/recovery?selector=${selector}&token=${token.toString("hex")}`;
    const expires = new Date(Date.now() + +process.env.RECOVERY_EXPIRE_TIME * 1000);

    const hashedToken = await bc.hash(Buffer.from(token), await bc.genSalt(10));

    await this.recoveryRepo.delete({ user });

    const recovery = this.recoveryRepo.create({
      user,
      token: hashedToken,
      selector,
      expiresAt: expires,
    });

    await this.recoveryRepo.save(recovery);
    return this.mailerService.sendMail({
      to: email,
      subject: "Password recovery",
      template: "recovery",
      context: {
        link,
        expires: expires.toLocaleDateString() + " " + expires.toLocaleTimeString(),
      },
    });
  }

  async generateSelector() {
    let selector;
    do {
      selector = randomBytes(8).toString("hex");
    } while (await this.recoveryRepo.findOne({ where: { selector } }));

    return selector;
  }

  async generateToken() {
    return randomBytes(32);
  }
}
