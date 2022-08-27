import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { Session } from "./session.entity";
import { LoginType } from "./types/login.type";

import * as jwt from "jsonwebtoken";

export class SessionService {
  constructor(@InjectRepository(Session) private sessionRepo: Repository<Session>) {}

  async createSession(user: User, loginType: LoginType, userAgent: string, ip: string, rememberMe: boolean) {
    const session = this.sessionRepo.create({
      user,
      userAgent,
      loginType,
      ip,
      expiresAt: rememberMe ? undefined : new Date(Date.now() + +process.env.JWT_SESSION_TIME * 3600),
    });

    return this.sessionRepo.save(session);
  }

  createToken(session: Session) {
    return jwt.sign({ sessionId: session.id }, process.env.JWT_SECRET);
  }

  verifyToken(token: string) {
    try {
      return (jwt.verify(token, process.env.JWT_SECRET) as { sessionId: string }).sessionId;
    } catch (error) {
      return false;
    }
  }

  async getSession(sessionId: string) {
    return this.sessionRepo.findOne({
      where: { id: sessionId },
      relations: {
        user: true,
      },
    });
  }
}
