import { UseGuards, UseInterceptors } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { SocketAuthService } from "src/socket/socket-auth.service";
import { AuthGuard } from "src/utils/guards/auth.guard";
@WebSocketGateway({ namespace: "games", cors: true })
export class GamesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private socketAuthService: SocketAuthService) {}

  handleConnection(client: Socket) {
    console.log("Client connected", client.id);
    this.socketAuthService.registerSocket(client, client.handshake.auth.token);
  }

  handleDisconnect(client: Socket) {
    console.log("Client disconnected", client.id);
    this.socketAuthService.unregisterSocket(client);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage("message")
  handleMessage() {
    console.log("Went through!");
  }
}
