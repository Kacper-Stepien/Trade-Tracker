import { ProductCostDto } from './dtos/product-cost.dto';
import { ProductCost } from './product-cost.entity';
import { CostTypeMapper } from '../cost-type/cost-type.mapper';

export class ProductCostMapper {
  static toDto(productCost: ProductCost): ProductCostDto {
    const mappedProductCost = new ProductCostDto();
    mappedProductCost.id = productCost.id;
    mappedProductCost.name = productCost.name;
    mappedProductCost.description = productCost.description || '';
    mappedProductCost.price = productCost.price;
    mappedProductCost.date = productCost.date;
    mappedProductCost.costType = productCost.costType
      ? CostTypeMapper.toDto(productCost.costType)
      : null;
    return mappedProductCost;
  }

  static toDtoList(productCosts: ProductCost[]): ProductCostDto[] {
    return productCosts.map((productCost) => this.toDto(productCost));
  }
}
