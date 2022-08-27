import { IsEnum, IsOptional, IsString, IsEmail } from "class-validator";
import { LoginType } from "../types/login.type";

export class SignupDto {
  @IsEnum(LoginType)
  loginType: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  username: string;
}
