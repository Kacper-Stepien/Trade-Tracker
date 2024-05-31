import { Test, TestingModule } from '@nestjs/testing';
import { ProductAttributeService } from './product-attribute.service';
import { Repository } from 'typeorm';
import { ProductAttribute } from './product-attribute.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../products/product.enity';

describe('ProductAttributeService', () => {
  let service: ProductAttributeService;
  // eslint-disable-next-line
  let repository: Repository<ProductAttribute>;
  // eslint-disable-next-line
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

  const mockProduct: Product = {
    id: 1,
    name: 'Product 1',
    purchasePrice: 100,
    purchaseDate: new Date(),
    sold: false,
    salePrice: null,
    saleDate: null,
    user: null,
    category: null,
    attributes: [
      {
        id: 1,
        name: 'Attribute 1',
        value: 'Value 1',
        product: null,
      },
      {
        id: 2,
        name: 'Attribute 2',
        value: 'Value 2',
        product: null,
      },
    ],
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

  describe('createAttribute', () => {
    it('should create a new product attribute', async () => {
      jest
        .spyOn<
          any,
          any
        >(Object.getPrototypeOf(service), 'validateProductOwnership')
        .mockResolvedValue(mockProduct);
      jest
        .spyOn(repository, 'create')
        .mockReturnValue(mockProduct.attributes[0]);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue(mockProduct.attributes[0]);

      const result = await service.createAttribute(
        { name: 'Attribute 1', value: 'Value 1' },
        mockProduct.id,
        1,
      );

      expect(result).toEqual(mockProduct.attributes[0]);
      expect(repository.create).toHaveBeenCalledWith({
        name: 'Attribute 1',
        value: 'Value 1',
        product: mockProduct,
      });
      expect(repository.save).toHaveBeenCalledWith(mockProduct.attributes[0]);
    });
  });
});
