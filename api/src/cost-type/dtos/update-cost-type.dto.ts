import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCostTypeDto {
  @IsString()
  @MaxLength(255)
  @ApiProperty({
    example: 'Repair',
    description: 'The name of the cost type',
    maxLength: 255,
  })
  name: string;
}
