import { IsOptional, IsString, MinLength, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  surname: string;

  @IsString()
  @MinLength(parseInt(process.env.PASSWORD_MIN_LENGTH))
  @IsOptional()
  password: string;

  @IsBoolean()
  @IsOptional()
  isProfessional: boolean;
}
