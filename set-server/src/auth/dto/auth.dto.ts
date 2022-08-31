import { Expose, Type } from "class-transformer";

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  username: string;
}

export class AuthDto {
  @Expose()
  token: string;

  @Type(() => UserDto)
  @Expose()
  user: UserDto;

  @Expose()
  success: boolean;

  @Expose()
  message: string;

  @Expose()
  identifier: string;

  @Expose()
  suggestedUsername: string;
}
