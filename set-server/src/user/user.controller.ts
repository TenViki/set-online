import { Controller, Get, Param, Response, NotFoundException, StreamableFile } from "@nestjs/common";
import { Response as Res } from "express";
import * as fs from "fs/promises";
import { createReadStream } from "fs";

@Controller("user")
export class UserController {
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
}
