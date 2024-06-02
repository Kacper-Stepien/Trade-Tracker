import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  MinLength,
  IsDateString,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Kacper',
    description: 'First name of the user',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Stępień',
    description: 'Surname of the user',
  })
  surname: string;

  @IsEmail()
  @ApiProperty({
    example: 'kacper2007x48@gmail.com',
    description: 'Email address of the user',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(parseInt(process.env.PASSWORD_MIN_LENGTH))
  @ApiProperty({
    example: 'fpto4V.s/AS12/',
    description: 'Password for the user account',
  })
  password: string;

  @IsDateString()
  @ApiProperty({
    example: '2002-09-23',
    description: 'Date of birth of the user',
  })
  dateOfBirth: Date;

  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'Indicator if the user is a professional',
  })
  isProfessional: boolean;
}
