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
  {
    id: 4,
    name: 'Product cost 4',
    description: 'Product cost 4 description',
    price: 400.0,
    date: new Date('2021-04-01'),
    product: mockProducts[3],
    costType: mockCostTypes[1],
  },
  {
    id: 5,
    name: 'Product cost 5',
    description: 'Product cost 5 description',
    price: 500.0,
    date: new Date('2021-05-01'),
    product: mockProducts[4],
    costType: mockCostTypes[0],
  },
  {
    id: 6,
    name: 'Product cost 6',
    description: 'Product cost 6 description',
    price: 600.0,
    date: new Date('2021-06-01'),
    product: mockProducts[3],
    costType: mockCostTypes[2],
  },
  {
    id: 7,
    name: 'Product cost 7',
    description: 'Product cost 7 description',
    price: 700.0,
    date: new Date('2021-07-01'),
    product: mockProducts[2],
    costType: mockCostTypes[1],
  },
  {
    id: 8,
    name: 'Product cost 8',
    description: 'Product cost 8 description',
    price: 800.0,
    date: new Date('2021-08-01'),
    product: mockProducts[1],
    costType: mockCostTypes[0],
  },
  {
    id: 9,
    name: 'Product cost 9',
    description: 'Product cost 9 description',
    price: 900.0,
    date: new Date('2021-09-01'),
    product: mockProducts[0],
    costType: mockCostTypes[2],
  },
  {
    id: 10,
    name: 'Product cost 10',
    description: 'Product cost 10 description',
    price: 1000.0,
    date: new Date('2021-10-01'),
    product: mockProducts[1],
    costType: mockCostTypes[1],
  },
];

export const mockProductCostsDto: ProductCostDto[] =
  ProductCostMapper.toDtoList(mockProductCosts);
