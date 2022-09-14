import { Controller, Get, Param, Response, NotFoundException, StreamableFile, Query } from "@nestjs/common";
import { Response as Res } from "express";
import * as fs from "fs/promises";
import { createReadStream } from "fs";
import { UserService } from "./user.service";
import { Serialize } from "src/utils/interceptors/serialize.interceptor";
import { UserLowDto } from "./dtos/user-low.dto";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("/avatars/:id")
  async getAvatar(@Param("id") id: string, @Response({ passthrough: true }) res: Res) {
    const avatarPath = `files/avatars/${id}.png`;

    try {
      await fs.access(avatarPath);
    } catch (error) {
      throw new NotFoundException();
    }

    res.set("Content-Type", "image/png");
    return new StreamableFile(createReadStream(avatarPath));
  }

  @Serialize(UserLowDto)
  @Get("/query")
  async query(@Query("q") q: string) {
    return this.userService.query(q);
  }
}
