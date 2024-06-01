import { CostType } from 'src/cost-type/cost-type.entity';

export class ProductCostDto {
  id: number;
  name: string;
  description: string;
  price: number;
  date: Date;
  costType: CostType;
}
