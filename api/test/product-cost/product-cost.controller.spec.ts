import { Test, TestingModule } from '@nestjs/testing';
import { ProductCostController } from '../../src/product-cost/product-cost.controller';
import { ProductCostService } from '../../src/product-cost/product-cost.service';
import { mockProductCostService } from './product-cost.service.mock';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateProductCostDto } from '../../src/product-cost/dtos/update-product-cost.dto';
import { mockProductCostsDto } from './product-cost.mock';
import { CreateProductCostDto } from '../../src/product-cost/dtos/create-product-cost.dto';

describe('ProductCostController', () => {
  let controller: ProductCostController;
  let service: ProductCostService;

  const userId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductCostController],
      providers: [
        {
          provide: ProductCostService,
          useValue: mockProductCostService,
        },
      ],
    }).compile();

    controller = module.get<ProductCostController>(ProductCostController);
    service = module.get<ProductCostService>(ProductCostService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllProductCosts', () => {
    it('should return all product costs for a specific product', async () => {
      jest
        .spyOn(service, 'getAllProductCosts')
        .mockResolvedValue(mockProductCostsDto);

      const result = await controller.getAllProductCosts(
        { user: { sub: userId } },
        1,
      );

      expect(result).toEqual(mockProductCostsDto);
      expect(service.getAllProductCosts).toHaveBeenCalledWith(1, userId);
    });

    it('should throw NotFoundException if no product costs exist', async () => {
      jest
        .spyOn(service, 'getAllProductCosts')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.getAllProductCosts({ user: { sub: userId } }, 1),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not have access', async () => {
      jest
        .spyOn(service, 'getAllProductCosts')
        .mockRejectedValue(new ForbiddenException());

      await expect(
        controller.getAllProductCosts({ user: { sub: userId } }, 1),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getCostById', () => {
    it('should return a product cost by ID', async () => {
      jest
        .spyOn(service, 'getCostById')
        .mockResolvedValue(mockProductCostsDto[0]);

      const result = await controller.getCostById({ user: { sub: userId } }, 1);

      expect(result).toEqual(mockProductCostsDto[0]);
      expect(service.getCostById).toHaveBeenCalledWith(1, userId);
    });

    it('should throw NotFoundException if cost does not exist', async () => {
      jest
        .spyOn(service, 'getCostById')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.getCostById({ user: { sub: userId } }, 1),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not have access', async () => {
      jest
        .spyOn(service, 'getCostById')
        .mockRejectedValue(new ForbiddenException());

      await expect(
        controller.getCostById({ user: { sub: userId } }, 1),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('createProductCost', () => {
    it('should create a new product cost', async () => {
      const createDto: CreateProductCostDto = {
        name: 'New Cost',
        description: 'Test Description',
        price: 500,
        date: new Date(),
        productId: 1,
        costTypeId: 2,
      };

      jest
        .spyOn(service, 'createProductCost')
        .mockResolvedValue(mockProductCostsDto[0]);

      const result = await controller.createProductCost(
        { user: { sub: userId } },
        createDto,
      );

      expect(result).toEqual(mockProductCostsDto[0]);
      expect(service.createProductCost).toHaveBeenCalledWith(createDto, userId);
    });

    it('should throw ForbiddenException if user does not have access', async () => {
      jest
        .spyOn(service, 'createProductCost')
        .mockRejectedValue(new ForbiddenException());

      await expect(
        controller.createProductCost(
          { user: { sub: userId } },
          {} as CreateProductCostDto,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('updateProductCost', () => {
    it('should update an existing product cost', async () => {
      const updateDto: UpdateProductCostDto = {
        name: 'Updated Cost',
        description: 'Updated Description',
        price: 600,
      };

      jest
        .spyOn(service, 'updateProductCost')
        .mockResolvedValue(mockProductCostsDto[0]);

      const result = await controller.updateProductCost(
        { user: { sub: userId } },
        1,
        updateDto,
      );

      expect(result).toEqual(mockProductCostsDto[0]);
      expect(service.updateProductCost).toHaveBeenCalledWith(
        1,
        updateDto,
        userId,
      );
    });

    it('should throw NotFoundException if cost does not exist', async () => {
      jest
        .spyOn(service, 'updateProductCost')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.updateProductCost(
          { user: { sub: userId } },
          1,
          {} as UpdateProductCostDto,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not have access', async () => {
      jest
        .spyOn(service, 'updateProductCost')
        .mockRejectedValue(new ForbiddenException());

      await expect(
        controller.updateProductCost(
          { user: { sub: userId } },
          1,
          {} as UpdateProductCostDto,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteProductCost', () => {
    it('should delete a product cost', async () => {
      jest.spyOn(service, 'deleteProductCost').mockResolvedValue();

      await expect(
        controller.deleteProductCost({ user: { sub: userId } }, 1),
      ).resolves.toBeUndefined();
      expect(service.deleteProductCost).toHaveBeenCalledWith(1, userId);
    });

    it('should throw NotFoundException if cost does not exist', async () => {
      jest
        .spyOn(service, 'deleteProductCost')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.deleteProductCost({ user: { sub: userId } }, 1),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not have access', async () => {
      jest
        .spyOn(service, 'deleteProductCost')
        .mockRejectedValue(new ForbiddenException());

      await expect(
        controller.deleteProductCost({ user: { sub: userId } }, 1),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
