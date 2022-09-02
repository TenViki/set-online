import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway({ namespace: "games", cors: true })
export class GamesGateway {
  @SubscribeMessage("message")
  handleMessage() {}
}
