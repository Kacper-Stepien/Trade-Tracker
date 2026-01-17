import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dtos/user.dto';

export class SignInResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT token generated upon successful authentication',
  })
  token: string;

  @ApiProperty({
    type: UserDto,
    description: 'Details of the authenticated user',
  })
  user: UserDto;
}
