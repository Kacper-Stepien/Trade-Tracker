import { UserDto } from './user-dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetUsersResponseDto {
  @ApiProperty({ type: () => UserDto, isArray: true })
  users: UserDto[];
  @ApiProperty({ example: 10, description: 'Total number of users' })
  total: number;
}
