import { ProductCategory } from './product-category.entity';
import { ProductCategoryDto } from './dtos/product-category.dto';

export class ProductCategoryMapper {
  static toDto(category: ProductCategory): ProductCategoryDto {
    const productCategoryDto = new ProductCategoryDto();
    productCategoryDto.id = category.id;
    productCategoryDto.name = category.name;
    return productCategoryDto;
  }

  static toDtoList(categories: ProductCategory[]): ProductCategoryDto[] {
    return categories.map((category) => this.toDto(category));
  }
}
