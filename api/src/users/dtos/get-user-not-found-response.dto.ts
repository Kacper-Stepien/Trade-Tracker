import { ApiProperty } from '@nestjs/swagger';

export class GetUserNotFoundResponseDto {
  @ApiProperty({
    example: 'User with ID 10 not found',
    description: 'Detailed error message',
  })
  message: string;

  @ApiProperty({ example: 'Not Found', description: 'HTTP status code' })
  error: string;

  @ApiProperty({ example: 404, description: 'HTTP status code' })
  statusCode: number;
}
