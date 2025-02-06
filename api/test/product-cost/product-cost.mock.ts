import { ProductCost } from '../../src/product-cost/product-cost.entity';
import { mockProducts } from '../products/products.mock';
import { mockCostTypes } from '../cost-type/cost-type.mock';
import { ProductCostMapper } from 'src/product-cost/product-cost.mapper';
import { ProductCostDto } from '../../src/product-cost/dtos/product-cost.dto';

export const mockProductCosts: ProductCost[] = [
  {
    id: 1,
    name: 'Product cost 1',
    description: 'Product cost 1 description',
    price: 100.0,
    date: new Date('2021-01-01'),
    product: mockProducts[0],
    costType: mockCostTypes[0],
  },
  {
    id: 2,
    name: 'Product cost 2',
    description: 'Product cost 2 description',
    price: 200.0,
    date: new Date('2021-02-01'),
    product: mockProducts[1],
    costType: mockCostTypes[1],
  },
  {
    id: 3,
    name: 'Product cost 3',
    description: 'Product cost 3 description',
    price: 300.0,
    date: new Date('2021-03-01'),
    product: mockProducts[2],
    costType: mockCostTypes[2],
  },
];

export const mockProductCostsDto: ProductCostDto[] =
  ProductCostMapper.toDtoList(mockProductCosts);
