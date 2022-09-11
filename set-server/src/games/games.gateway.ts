import { UseGuards } from "@nestjs/common";
import { Inject } from "@nestjs/common/decorators";
import { forwardRef } from "@nestjs/common/utils";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { WebSocketServer } from "@nestjs/websockets/decorators";
import { Server, Socket } from "socket.io";
import { SocketAuthService } from "src/socket/socket-auth.service";
import { User } from "src/user/user.entity";
import { CurrentUser } from "src/utils/decorators/current-user.decorator";
import { AuthGuard } from "src/utils/guards/auth.guard";
import { GamesService } from "./games.service";
@WebSocketGateway({ namespace: "games", cors: true })
export class GamesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private socketAuthService: SocketAuthService,
    @Inject(forwardRef(() => GamesService)) private gamesService: GamesService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      await this.socketAuthService.registerSocket(client, client.handshake.auth.token);
    } catch (err) {
      console.error("Error while registering socket", client.id, ":", err);
      client.emit("error", err);
    }
  }

  handleDisconnect(client: Socket) {
    this.socketAuthService.unregisterSocket(client);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage("listen")
  async handleMessage(@ConnectedSocket() socket: Socket, @CurrentUser() user: User) {
    const game = await this.gamesService.getGameByUser(user);

    if (game) {
      socket.join(`game:${game.id}`);
    }
  }

  @SubscribeMessage("ping")
  async handlePing(@ConnectedSocket() socket: Socket, @MessageBody("timestamp") data: number) {
    socket.emit("pong", {
      timestamp: data,
      serverTimestamp: Date.now(),
    });
  }

  sendToGame(gameId: string, event: string, data?: any) {
    this.server.to(`game:${gameId}`).emit(event, data);
  }
}
