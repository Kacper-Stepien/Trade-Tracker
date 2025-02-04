import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  MinLength,
  IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Kacper', description: 'User first name' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Stępień', description: 'User last name' })
  surname: string;

  @IsEmail()
  @ApiProperty({
    example: 'kacper2007x48@gmail.com',
    description: 'User email',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(parseInt(process.env.PASSWORD_MIN_LENGTH) || 8)
  @ApiProperty({
    example: 'password123',
    description: 'User password, at least 8 characters long',
  })
  password: string;

  @IsDateString()
  @ApiProperty({
    example: '2000-01-01',
    description: 'User date of birth',
  })
  dateOfBirth: Date;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @ApiProperty({
    example: false,
    description:
      'User professional status, if true user is a professional salesman',
  })
  isProfessional: boolean;
}
