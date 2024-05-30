import { Test, TestingModule } from '@nestjs/testing';
import { ProductAttributeService } from './product-attribute.service';
import { Repository } from 'typeorm';
import { ProductAttribute } from './product-attribute.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from 'src/products/product.enity';

describe('ProductAttributeService', () => {
  let service: ProductAttributeService;
  let repository: Repository<ProductAttribute>;
  let productRepository: Repository<Product>;

  const mockProductAttributeRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  const mockProductRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductAttributeService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(ProductAttribute),
          useValue: mockProductAttributeRepository,
        },
      ],
    }).compile();

    service = module.get<ProductAttributeService>(ProductAttributeService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    repository = module.get<Repository<ProductAttribute>>(
      getRepositoryToken(ProductAttribute),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
