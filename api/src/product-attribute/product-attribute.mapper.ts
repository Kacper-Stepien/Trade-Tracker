import { ProductAttributeDto } from './dtos/product-attribute.dto';
import { ProductAttribute } from './product-attribute.entity';

export class ProductAttributeMapper {
  static toDto(productAttribute: ProductAttribute): ProductAttributeDto {
    const productAttributeDto = new ProductAttributeDto();
    productAttributeDto.id = productAttribute.id;
    productAttributeDto.name = productAttribute.name;
    productAttributeDto.value = productAttribute.value;
    return productAttributeDto;
  }
}
