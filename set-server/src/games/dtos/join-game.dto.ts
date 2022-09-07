import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class JoinGameDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  gameId?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  code?: string;
}
