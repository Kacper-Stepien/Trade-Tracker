import { ApiProperty } from '@nestjs/swagger';

export class GetUserNotFoundResponseDto {
  @ApiProperty({
    example: 'User with ID 10 not found',
    description: 'Detailed error message when the user does not exist',
    type: String,
  })
  message: string;

  @ApiProperty({
    example: 'Not Found',
    description: 'HTTP status text for the error',
    type: String,
  })
  error: string;

  @ApiProperty({
    example: 404,
    description: 'HTTP status code indicating the resource was not found',
    type: Number,
  })
  statusCode: number;
}
