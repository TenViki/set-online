import { CanActivate, ExecutionContext, ForbiddenException, Inject } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { SocketAuthService } from "src/socket/socket-auth.service";

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    // When this function returns truhy value, the request will go through
    const requestType = context.getType();

    if (requestType === "http") {
      const request = context.switchToHttp().getRequest();

      if (!request.user) throw new ForbiddenException(request.sessionError);
      return request.user;
    } else if (requestType === "ws") {
      const socket = context.switchToWs().getClient<Socket>();

      const user = socket.data.user;

      if (!user) throw new WsException("Not logged in");
      return user;
    }
  }
}
