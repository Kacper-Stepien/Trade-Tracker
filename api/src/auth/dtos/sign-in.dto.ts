import { IsString, IsEmail, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(parseInt(process.env.PASSWORD_MIN_LENGTH))
  password: string;
}
