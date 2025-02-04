import { ApiProperty } from '@nestjs/swagger';

export class CreateUserConflictResponseDto {
  @ApiProperty({
    example: 'User with this email already exists',
    description: 'Detailed error message indicating email conflict',
  })
  message: string;

  @ApiProperty({
    example: 'Conflict',
    description: 'HTTP status text for the error',
  })
  error: string;

  @ApiProperty({
    example: 409,
    description: 'HTTP status code for conflict',
  })
  statusCode: number;
}
