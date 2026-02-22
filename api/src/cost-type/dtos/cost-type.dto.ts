import { ApiProperty } from '@nestjs/swagger';

export class CostTypeDto {
  @ApiProperty({ example: 1, description: 'The ID of the cost type' })
  id: number;

  @ApiProperty({ example: 'Repair', description: 'The name of the cost type' })
  name: string;

  @ApiProperty({
    example: 12,
    description: 'Number of product costs assigned to this cost type',
  })
  costsCount: number;
}
