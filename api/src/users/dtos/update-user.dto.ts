import { IsOptional, IsString, MinLength, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Wiktor',
    description: 'User first name',
    required: false,
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Kowalski',
    description: 'User last name',
    required: false,
  })
  surname?: string;

  @IsOptional()
  @IsString()
  @MinLength(parseInt(process.env.PASSWORD_MIN_LENGTH) || 8)
  @ApiProperty({
    example: 'password123',
    description: 'User password, at least 8 characters long',
    required: false,
  })
  password?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    example: false,
    description:
      "User's professional status, if true user is a professional salesman",
    required: false,
  })
  isProfessional?: boolean;
}
