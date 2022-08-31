import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";

@WebSocketGateway({ namespace: "auth", cors: true })
export class AuthGateway {
  private clients = new Map<string, Socket>();

  @SubscribeMessage("discord-login-listen")
  listen(@MessageBody("state") state: string, @ConnectedSocket() client: Socket) {
    this.clients.set(state, client);
    console.log(state);
  }
}