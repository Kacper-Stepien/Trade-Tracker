import { IsOptional, IsString, MinLength, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsString()
  @MinLength(parseInt(process.env.PASSWORD_MIN_LENGTH) || 8)
  password?: string;

  @IsOptional()
  @IsBoolean()
  isProfessional?: boolean;
}
