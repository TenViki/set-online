import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import { User } from "src/user/user.entity";
import { Session } from "../session.entity";
import { SessionService } from "../session.service";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      session?: Session;
      sessionError?: string;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private sessionService: SessionService, private configService: ConfigService) {}

  async use(req: Request, res: Response, next: () => void) {
    const { authorization: token } = req.headers;
    if (!token) return next();

    const sessionId = await this.sessionService.verifyToken(token);
    if (!sessionId) {
      req.sessionError = "Invalid token";
      return next();
    }

    const session = await this.sessionService.getSession(sessionId);

    if (!session) {
      req.sessionError = "Session not found";
      return next();
    }

    if (session.expiresAt && session.expiresAt < new Date()) {
      req.sessionError = "Session expired";
      return next();
    }

    // Check user agent
    if (session.userAgent !== req.headers["user-agent"]) {
      req.sessionError = "User agent mismatch";
      return next();
    }

    req.user = session.user;

    session.lastUsed = new Date();
    if (session.expiresAt) session.expiresAt = new Date(Date.now() + +this.configService.get("JWT_SESSION_TIME") * 1000);
    await this.sessionService.updateSession(session);

    req.session = session;
    next();
  }
}
