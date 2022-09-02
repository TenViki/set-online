import { Expose, Transform } from "class-transformer";
import { UserLowDto } from "src/user/dtos/user-low.dto";

export class GameDto {
  @Expose()
  id: string;

  @Expose()
  code: number;

  @Expose()
  status: string;

  @Expose()
  winner: string | null;

  @Expose()
  created: Date;

  @Expose()
  @Transform(() => UserLowDto)
  players: UserLowDto[];

  @Expose()
  host: string;

  @Expose()
  limit: number;

  @Expose()
  public: boolean;
}
