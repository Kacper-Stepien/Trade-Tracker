import { ApiProperty } from '@nestjs/swagger';

export class ProductAttributeDto {
  @ApiProperty({
    description: 'The id of the product attribute',
    example: 1,
  })
  id: number;
  @ApiProperty({
    description: 'The name of the product attribute',
    example: 'Color',
  })
  name: string;

  @ApiProperty({
    description: 'The value of the product attribute',
    example: 'Red',
  })
  value: string;
}
