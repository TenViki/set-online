import { IsEnum, IsOptional, IsString } from "class-validator";
import { LoginType } from "../types/login";

export class SignupDto {
  @IsEnum(LoginType)
  loginType: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  email?: string;
}
