import { ApiProperty } from '@nestjs/swagger';
import { ProductCategoryDto } from './product-category.dto';

export class GetProductCategoriesResponseDto {
  @ApiProperty({
    type: [ProductCategoryDto],
    description: 'Paginated list of product categories',
  })
  categories: ProductCategoryDto[];

  @ApiProperty({
    example: 42,
    description: 'Total number of categories for current user',
  })
  total: number;
}
