import { Expose, Type } from "class-transformer";

class UserDto {
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
}
