import { IsEnum, IsString, IsBoolean, IsOptional } from "class-validator";
import { LoginType } from "../types/login.type";

export class LoginDto {
  @IsEnum(LoginType)
  loginType: LoginType;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;
}
