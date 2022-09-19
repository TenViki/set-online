import { Expose, Transform, Type } from "class-transformer";
import { UserLowDto } from "src/user/dtos/user-low.dto";

export class PointsDto {
  @Expose()
  @Transform(({ obj }) => obj.user.id)
  user: string;

  @Expose()
  points: number;
}

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
  @Type(() => UserLowDto)
  players: UserLowDto[];

  @Expose()
  @Type(() => UserLowDto)
  host: UserLowDto;

  @Expose()
  limit: number;

  @Expose()
  public: boolean;

  @Expose()
  @Transform(({ value }) => (value ? value.split(",") : null))
  laidOut: string[] | null;

  @Expose()
  @Transform(({ value }) => (value ? value.split(",") : null))
  noSetVotes: string[] | null;

  @Expose()
  @Type(() => PointsDto)
  points: PointsDto[];
}
