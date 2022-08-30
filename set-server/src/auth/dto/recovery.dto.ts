import { IsEmail, IsString } from "class-validator";

export class RecoveryDto {
  @IsEmail()
  email: string;
}

export class RecoverAccountDto {
  @IsString()
  token: string;

  @IsString()
  password: string;
}
