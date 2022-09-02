import { IsBoolean, IsNumber, Max } from "class-validator";

export class NewGameDto {
  @IsNumber()
  @Max(64)
  limit: number;

  @IsBoolean()
  public: boolean;
}
