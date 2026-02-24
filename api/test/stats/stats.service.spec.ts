import { Test, TestingModule } from '@nestjs/testing';
import { StatsService } from '../../src/stats/stats.service';
import { mockProductRepository } from '../products/products.repository.mock';
import { mockProductCostRepository } from '../product-cost/product-cost.repository.mock';
import { Product } from '../../src/products/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductCost } from '../../src/product-cost/product-cost.entity';
import { Repository } from 'typeorm';
import { mockProducts } from '../products/products.mock';

describe('StatsService', () => {
  let service: StatsService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let productRepository: Repository<Product>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let productCostRepository: Repository<ProductCost>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(ProductCost),
          useValue: mockProductCostRepository,
        },
      ],
    }).compile();

    service = module.get<StatsService>(StatsService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    productCostRepository = module.get<Repository<ProductCost>>(
      getRepositoryToken(ProductCost),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserProducts', () => {
    it('should return user products', async () => {
      const userId = 1;
      const products = mockProducts.filter(
        (product) => product.user.id === userId,
      );

      jest
        .spyOn(service['productsRepository'], 'createQueryBuilder')
        .mockReturnValue({
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockResolvedValue(products),
        } as any);

      const result = await service['getUserProducts'](userId);

      expect(result).toEqual(products);
    });

    it('should return user products within a date range', async () => {
      const userId = 1;
      const startDate = new Date('2021-01-01');
      const endDate = new Date('2021-12-31');
      const products = mockProducts.filter(
        (product) =>
          product.user.id === userId &&
          ((product.saleDate >= startDate && product.saleDate <= endDate) ||
            (product.purchaseDate >= startDate &&
              product.purchaseDate <= endDate)),
      );

      jest
        .spyOn(service['productsRepository'], 'createQueryBuilder')
        .mockReturnValue({
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockResolvedValue(products),
        } as any);

      const result = await service['getUserProducts'](
        userId,
        startDate,
        endDate,
      );

      expect(result).toEqual(products);
    });
  });

  describe('calculateUserStats', () => {
    it('should calculate average days from purchase to sale for sold products', () => {
      const products = [
        {
          id: 1001,
          purchasePrice: 100,
          purchaseDate: new Date('2025-01-01'),
          sold: true,
          salePrice: 150,
          saleDate: new Date('2025-01-11'),
          costs: [],
          user: { id: 1 },
          category: null,
          attributes: [],
          name: 'A',
        } as unknown as Product,
        {
          id: 1002,
          purchasePrice: 200,
          purchaseDate: new Date('2025-01-01'),
          sold: true,
          salePrice: 260,
          saleDate: new Date('2025-01-06'),
          costs: [],
          user: { id: 1 },
          category: null,
          attributes: [],
          name: 'B',
        } as unknown as Product,
      ];

      const result = service['calculateUserStats'](products, 'all');

      expect(result.averageDaysFromPurchaseToSale).toBe(7.5);
    });

    it('should return null average days when there are no sold products with dates', () => {
      const products = [
        {
          id: 1003,
          purchasePrice: 100,
          purchaseDate: new Date('2025-01-01'),
          sold: false,
          salePrice: null,
          saleDate: null,
          costs: [],
          user: { id: 1 },
          category: null,
          attributes: [],
          name: 'C',
        } as unknown as Product,
      ];

      const result = service['calculateUserStats'](products, 'all');

      expect(result.averageDaysFromPurchaseToSale).toBeNull();
    });
  });
});
