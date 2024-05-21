import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  MinLength,
  IsDateString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(parseInt(process.env.PASSWORD_MIN_LENGTH))
  password: string;

  @IsDateString()
  dateOfBirth: Date;

  @IsBoolean()
  isProfessional: boolean;
}
