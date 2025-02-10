import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';

const PASSWORD_MIN_LENGTH = parseInt(process.env.PASSWORD_MIN_LENGTH, 10) || 8;

export class SignInDto {
  @IsEmail()
  @ApiProperty({
    example: 'kacper2007x48@gmail.com',
    description: 'The email address of the user',
  })
  email: string;

  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  @ApiProperty({
    example: 'fj4Alfe34po./',
    description: `The password of the user, must be at least ${PASSWORD_MIN_LENGTH} characters long`,
  })
  password: string;
}
