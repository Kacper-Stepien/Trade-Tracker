import { ProductCategory } from './product-category.entity';
import { ProductCategoryDto } from './dtos/product-category.dto';

export class ProductCategoryMapper {
  static toDto(
    category: ProductCategory & { productsCount?: number },
  ): ProductCategoryDto {
    const productCategoryDto = new ProductCategoryDto();
    productCategoryDto.id = category.id;
    productCategoryDto.name = category.name;
    productCategoryDto.productsCount = category.productsCount ?? 0;
    return productCategoryDto;
  }

  static toDtoList(
    categories: (ProductCategory & { productsCount?: number })[],
  ): ProductCategoryDto[] {
    return categories.map((category) => this.toDto(category));
  }
}
