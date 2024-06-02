import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../role.enum';

export class UserDto {
  @ApiProperty({ example: 13 })
  id: number;
  @ApiProperty({ example: 'Kacper' })
  name: string;
  @ApiProperty({ example: 'Stępień' })
  surname: string;
  @ApiProperty({ example: 'kacper2007x48@gmail.com' })
  email: string;
  @ApiProperty({ example: '2002-09-23' })
  dateOfBirth: Date;
  @ApiProperty({ example: true })
  isProfessional: boolean;
  @ApiProperty({ example: 'user' })
  role: Role;
}
