import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../role.enum';

export class UserDto {
  @ApiProperty({ example: 13, description: 'User unique identifier' })
  id: number;

  @ApiProperty({ example: 'Kacper', description: 'User first name' })
  name: string;

  @ApiProperty({ example: 'Stępień', description: 'User last name' })
  surname: string;

  @ApiProperty({
    example: 'kacper2007x48@gmail.com',
    description: 'User email',
  })
  email: string;

  @ApiProperty({ example: '2002-09-23', description: 'User date of birth' })
  dateOfBirth: Date;

  @ApiProperty({
    example: true,
    description:
      'User professional status, if true user is a professional salesman',
  })
  isProfessional: boolean;

  @ApiProperty({ example: 'user', description: 'User role' })
  role: Role;

  @ApiProperty({
    example: '2024-01-01T12:00:00.000Z',
    description: 'Date when user was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-02-01T15:30:00.000Z',
    description: 'Date when user was last updated',
  })
  updatedAt: Date;
}
