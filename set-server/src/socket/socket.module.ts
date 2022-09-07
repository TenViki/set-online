import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { AuthGuard } from "src/utils/guards/auth.guard";
import { SocketAuthService } from "./socket-auth.service";

@Module({
  imports: [AuthModule],
  providers: [SocketAuthService],
  exports: [SocketAuthService],
})
export class SocketModule {}
