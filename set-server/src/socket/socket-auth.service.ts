import { AuthService } from "src/auth/auth.service";
import { Socket } from "socket.io";
import { User } from "src/user/user.entity";
import { WsException } from "@nestjs/websockets";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SocketAuthService {
  constructor(private authService: AuthService) {}

  private socketToUser = new Map<string, User>();

  async registerSocket(socket: Socket, token: string) {
    const user = await this.authService.verifyToken(token);

    if (!user) throw new WsException("Invalid token");

    this.socketToUser.set(socket.id, user);
    socket.data.user = user;
    socket.join(`user:${user.id}`);

    return user;
  }

  unregisterSocket(socket: Socket) {
    this.socketToUser.delete(socket.id);
  }

  getUser(socket: Socket) {
    return this.socketToUser.get(socket.id);
  }
}
