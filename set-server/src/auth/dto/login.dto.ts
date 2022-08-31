import { IsEnum, IsString, IsBoolean, IsOptional } from "class-validator";
import { LoginType } from "../types/login.type";

export class LoginDto {
  @IsEnum(LoginType)
  loginType: LoginType;

  // Password login fields

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;

  // Discord login fields
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  identifier?: string;
}
