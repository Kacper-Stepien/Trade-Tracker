import { ApiProperty } from '@nestjs/swagger';

export class CreateUserConflictResponseDto {
  @ApiProperty({
    example: 'User with this email already exists',
  })
  message: string;

  @ApiProperty({
    example: 'Conflict',
  })
  error: string;

  @ApiProperty({
    example: 409,
  })
  statusCode: number;
}
