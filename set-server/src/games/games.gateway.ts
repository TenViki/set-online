import { UseGuards, UseInterceptors } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { SocketAuthService } from "src/socket/socket-auth.service";
import { User } from "src/user/user.entity";
import { CurrentUser } from "src/utils/decorators/current-user.decorator";
import { AuthGuard } from "src/utils/guards/auth.guard";
import { GamesService } from "./games.service";
@WebSocketGateway({ namespace: "games", cors: true })
export class GamesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private socketAuthService: SocketAuthService, private gamesService: GamesService) {}

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
}
