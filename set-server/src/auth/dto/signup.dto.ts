import {
  IsEnum,
  IsOptional,
  IsString,
  IsEmail,
  IsBoolean,
} from "class-validator";
import { LoginType } from "../types/login.type";

export class SignupDto {
  @IsEnum(LoginType)
  loginType: LoginType;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  username: string;

  @IsBoolean()
  rememberMe: boolean;
}
