import { mockProductRepository } from '../products/products.repository.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductCostService } from '../../src/product-cost/product-cost.service';
import { Repository } from 'typeorm';
import { ProductCost } from '../../src/product-cost/product-cost.entity';
import { CostType } from '../../src/cost-type/cost-type.entity';
import { Product } from '../../src/products/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockCostTypeRepository } from '../cost-type/cost-type.repository.mock';
import { mockProductCostRepository } from './product-cost.repository.mock';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { mockProductCosts, mockProductCostsDto } from './product-cost.mock';
import { mockProducts } from '../products/products.mock';
import { UpdateProductCostDto } from '../../src/product-cost/dtos/update-product-cost.dto';
import { CreateProductCostDto } from '../../src/product-cost/dtos/create-product-cost.dto';
import { mockCostTypes } from '../cost-type/cost-type.mock';

describe('ProductCostService', () => {
  let service: ProductCostService;
  let repository: Repository<ProductCost>;
  let costTypeRepository: Repository<CostType>;
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductCostService,
        {
          provide: getRepositoryToken(ProductCost),
          useValue: mockProductCostRepository,
        },
        {
          provide: getRepositoryToken(CostType),
          useValue: mockCostTypeRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductCostService>(ProductCostService);
    costTypeRepository = module.get<Repository<CostType>>(
      getRepositoryToken(CostType),
    );
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    repository = module.get<Repository<ProductCost>>(
      getRepositoryToken(ProductCost),
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllProductCosts', () => {
    it('should return all product costs for a given product', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(mockProductCosts);

      const result = await service.getAllProductCosts(
        mockProducts[0].id,
        mockProducts[0].user.id,
      );

      expect(result).toHaveLength(mockProductCosts.length);
      expect(result).toEqual(mockProductCostsDto);
      expect(repository.find).toHaveBeenCalledWith({
        where: { product: { id: mockProducts[0].id } },
        relations: ['costType', 'product'],
      });
    });

    it('should throw NotFoundException if no costs exist for the product', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);
      await expect(
        service.getAllProductCosts(mockProducts[0].id, mockProducts[0].user.id),
      ).rejects.toThrow(NotFoundException);

      expect(repository.find).toHaveBeenCalledWith({
        where: { product: { id: mockProducts[0].id } },
        relations: ['costType', 'product'],
      });
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw ForbiddenException if user does not own the product', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(mockProductCosts);
      await expect(
        service.getAllProductCosts(mockProducts[0].id, 999),
      ).rejects.toThrow(ForbiddenException);
      expect(repository.find).toHaveBeenCalledWith({
        where: { product: { id: mockProducts[0].id } },
        relations: ['costType', 'product'],
      });
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCostById', () => {
    it('should return a product cost by ID', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockProductCosts[0]);

      const result = await service.getCostById(
        mockProductCosts[0].id,
        mockProducts[0].user.id,
      );

      expect(result).toEqual(mockProductCostsDto[0]);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: mockProductCosts[0].id },
        relations: ['costType', 'product'],
      });
    });

    it('should throw NotFoundException if cost does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(service.getCostById(999, 1)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['costType', 'product'],
      });
    });

    it('should throw ForbiddenException if user does not own the product cost', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockProductCosts[0]);

      await expect(
        service.getCostById(mockProductCosts[0].id, 999),
      ).rejects.toThrow(ForbiddenException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: mockProductCosts[0].id },
        relations: ['costType', 'product'],
      });
    });
  });

  describe('createProductCost', () => {
    it('should create a new product cost', async () => {
      const createDto: CreateProductCostDto = {
        name: 'New Cost',
        description: 'New Cost Description',
        price: 500,
        date: new Date(),
        productId: mockProducts[0].id,
        costTypeId: mockCostTypes[0].id,
      };

      jest
        .spyOn(productRepository, 'findOneBy')
        .mockResolvedValue(mockProducts[0]);
      jest
        .spyOn(costTypeRepository, 'findOneBy')
        .mockResolvedValue(mockCostTypes[0]);
      jest.spyOn(repository, 'create').mockReturnValue(mockProductCosts[0]);
      jest.spyOn(repository, 'save').mockResolvedValue(mockProductCosts[0]);

      const result = await service.createProductCost(
        createDto,
        mockProducts[0].user.id,
      );

      expect(result).toEqual(mockProductCostsDto[0]);
      expect(productRepository.findOneBy).toHaveBeenCalledWith({
        id: createDto.productId,
      });
    });

    it('should throw ForbiddenException if user does not own the product', async () => {
      const createProductCost: CreateProductCostDto = {
        ...mockProductCosts[0],
        productId: 999,
        costTypeId: mockCostTypes[0].id,
      };

      jest
        .spyOn(productRepository, 'findOneBy')
        .mockResolvedValue(mockProducts[0]);
      await expect(
        service.createProductCost(createProductCost, 999),
      ).rejects.toThrow(ForbiddenException);
      expect(productRepository.findOneBy).toHaveBeenCalledWith({
        id: createProductCost.productId,
      });
    });
  });

  describe('updateProductCost', () => {
    it('should update an existing product cost', async () => {
      const updateDto: UpdateProductCostDto = {
        name: 'Updated Cost',
        description: 'Updated Description',
        price: 600,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockProductCosts[0]);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mockProductCosts[0],
        ...updateDto,
      });

      const result = await service.updateProductCost(
        mockProductCosts[0].id,
        updateDto,
        mockProducts[0].user.id,
      );

      expect(repository.save).toHaveBeenCalledWith({
        ...mockProductCosts[0],
        ...updateDto,
      });
      expect(result.name).toBe(updateDto.name);
      expect(result.description).toBe(updateDto.description);
      expect(result.price).toBe(updateDto.price);
    });

    it('should throw ForbiddenException if user does not own the product cost', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockProductCosts[0]);

      await expect(
        service.updateProductCost(mockProductCosts[0].id, {}, 999),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteProductCost', () => {
    it('should delete a product cost', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockProductCosts[0]);
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await service.deleteProductCost(
        mockProductCosts[0].id,
        mockProducts[0].user.id,
      );

      expect(repository.delete).toHaveBeenCalledWith(mockProductCosts[0].id);
    });

    it('should throw NotFoundException if cost does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(service.deleteProductCost(999, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user does not own the product cost', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockProductCosts[0]);

      await expect(
        service.deleteProductCost(mockProductCosts[0].id, 999),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
