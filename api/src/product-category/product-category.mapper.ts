import { ProductCategory } from './product-category.entity';
import { ProductCategoryDto } from './dtos/product-category.dto';

export class ProductCategoryMapper {
  static toDto(category: ProductCategory): ProductCategoryDto {
    const userDto = new ProductCategoryDto();
    userDto.id = category.id;
    userDto.name = category.name;
    return userDto;
  }
}
