import { ApiProperty } from '@nestjs/swagger';

export class SignUpConflictResponseDto {
  @ApiProperty({
    example: 'User with this email already exists',
    description: 'Detailed message about the conflict',
  })
  message: string;
  @ApiProperty({ example: 'Conflict', description: 'Type of error' })
  error: string;
  @ApiProperty({ example: 409, description: 'HTTP status code' })
  statusCode: number;
}
