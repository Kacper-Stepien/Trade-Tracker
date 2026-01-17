import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetUsersResponseDto {
  @ApiProperty({
    type: UserDto,
    isArray: true,
    description: 'Array of user objects',
  })
  users: UserDto[];

  @ApiProperty({
    example: 10,
    description: 'Total number of users available in the database',
    type: Number,
  })
  total: number;
}
