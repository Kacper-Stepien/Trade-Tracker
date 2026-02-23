import { ApiProperty } from '@nestjs/swagger';

export class ProductCategoryDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the product category',
  })
  id: number;

  @ApiProperty({
    example: 'Electronics',
    description: 'The name of the product category',
  })
  name: string;

  @ApiProperty({
    example: 12,
    description: 'Number of products assigned to this category',
  })
  productsCount: number;
}
