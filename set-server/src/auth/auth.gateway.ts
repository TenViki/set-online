import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { User } from "src/user/user.entity";

@WebSocketGateway({ namespace: "auth", cors: true })
export class AuthGateway {
  private clients = new Map<string, Socket>();

  @SubscribeMessage("login-listen")
  listen(@MessageBody("state") state: string, @ConnectedSocket() client: Socket) {
    this.clients.set(state, client);
  }

  sendLoginSuccess(state: string, user: User) {
    const client = this.clients.get(state);
    if (client) {
      client.emit("login-success", user);
    }
  }
}
