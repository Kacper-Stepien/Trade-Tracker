import { ProductCategoryMapper } from '../../src/product-category/product-category.mapper';
import { ProductCategory } from '../../src/product-category/product-category.entity';
import { ProductCategoryDto } from '../../src/product-category/dtos/product-category.dto';

export const mockCategories: ProductCategory[] = [
  {
    id: 1,
    name: 'Electronics',
    products: [],
  },
  {
    id: 2,
    name: 'Clothing',
    products: [],
  },
  {
    id: 3,
    name: 'Books',
    products: [],
  },
  {
    id: 4,
    name: 'Furniture',
    products: [],
  },
];

export const mockCategoriesDto: ProductCategoryDto[] = mockCategories.map(
  (category) => ProductCategoryMapper.toDto(category),
);
