import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Socket } from "socket.io";

export const CurrentUser = createParamDecorator((_: never, context: ExecutionContext) => {
  const type = context.getType();

  if (type === "http") {
    const request = context.switchToHttp().getRequest();
    return request.user;
  }

  if (type === "ws") {
    const client = context.switchToWs().getClient() as Socket;
    return client.data.user;
  }
});
