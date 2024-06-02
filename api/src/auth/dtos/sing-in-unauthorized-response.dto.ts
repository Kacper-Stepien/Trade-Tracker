import { ApiProperty } from '@nestjs/swagger';

export class SignInUnauthorizedResponseDto {
  @ApiProperty({
    example: 'Invalid credentials',
    description: 'Detailed message about the error',
  })
  message: string;
  @ApiProperty({ example: 'Unauthorized', description: 'Type of error' })
  error: string;
  @ApiProperty({ example: 401, description: 'HTTP status code' })
  statusCode: number;
}
