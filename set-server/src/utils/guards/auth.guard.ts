import { CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    // When this function returns truhy value, the request will go through
    const request = context.switchToHttp().getRequest();

    if (!request.user) throw new ForbiddenException(request.sessionError);

    return request.user;
  }
}
