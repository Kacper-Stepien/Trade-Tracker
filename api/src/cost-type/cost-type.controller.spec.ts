import { Test, TestingModule } from '@nestjs/testing';
import { CostTypeController } from './cost-type.controller';
import { CostTypeService } from './cost-type.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CostTypeDto } from './dtos/cost-type.dto';

describe('CostTypeController', () => {
  let controller: CostTypeController;

  const mockService = {
    getCostTypeById: jest.fn(),
    getAllCostTypes: jest.fn(),
    createCostType: jest.fn(),
    updateCostType: jest.fn(),
    deleteCostType: jest.fn(),
  };

  const mockCostType = {
    id: 1,
    name: 'Test Cost Type',
  };

  const mockCostTypes: CostTypeDto[] = [
    {
      id: 1,
      name: 'Test Cost Type',
    },
    {
      id: 2,
      name: 'Another Test Cost Type',
    },
    {
      id: 3,
      name: 'Yet Another Test Cost Type',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CostTypeController],
      providers: [
        {
          provide: CostTypeService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CostTypeController>(CostTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCostType', () => {
    it('should return a cost type by ID', async () => {
      const mockCostType = {
        id: 1,
        name: 'Test Cost Type',
      };
      mockService.getCostTypeById.mockResolvedValue(mockCostType);
      const result = await controller.getCostType(1);
      expect(result).toEqual(mockCostType);
      expect(mockService.getCostTypeById).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if cost type does not exist', async () => {
      const error = new NotFoundException('Cost type with ID 1 not found');
      mockService.getCostTypeById.mockRejectedValue(error);
      try {
        await controller.getCostType(1);
      } catch (error) {
        expect(error).toEqual(error);
      }
      expect(mockService.getCostTypeById).toHaveBeenCalledWith(1);
    });
  });

  describe('getAllCostTypes', () => {
    it('should return all cost types', async () => {
      mockService.getAllCostTypes.mockResolvedValue(mockCostTypes);
      const result = await controller.getAllCostTypes();
      expect(result).toEqual(mockCostTypes);
      expect(mockService.getAllCostTypes).toHaveBeenCalled();
    });
  });

  describe('createCostType', () => {
    it('should create a new cost type', async () => {
      mockService.createCostType.mockResolvedValue(mockCostType);
      const result = await controller.createCostType(mockCostType);
      expect(result).toEqual(mockCostType);
      expect(mockService.createCostType).toHaveBeenCalledWith(mockCostType);
    });

    it('should throw a ConflictException if cost type already exists', async () => {
      const error = new ConflictException(
        'Cost type with name Test Cost Type already exists',
      );
      mockService.createCostType.mockRejectedValue(error);
      try {
        await controller.createCostType(mockCostType);
      } catch (error) {
        expect(error).toEqual(error);
      }
      expect(mockService.createCostType).toHaveBeenCalledWith(mockCostType);
    });
  });

  describe('updateCostType', () => {
    it('should update a cost type', async () => {
      mockService.updateCostType.mockResolvedValue(mockCostType);
      const result = await controller.updateCostType(1, mockCostType);
      expect(result).toEqual(mockCostType);
      expect(mockService.updateCostType).toHaveBeenCalledWith(1, mockCostType);
    });

    it('should throw a NotFoundException if cost type does not exist', async () => {
      const error = new NotFoundException('Cost type with ID 1 not found');
      mockService.updateCostType.mockRejectedValue(error);
      try {
        await controller.updateCostType(1, mockCostType);
      } catch (error) {
        expect(error).toEqual(error);
      }
      expect(mockService.updateCostType).toHaveBeenCalledWith(1, mockCostType);
    });

    it('should throw a ConflictException if cost type already exists', async () => {
      const error = new ConflictException(
        'Cost type with name Test Cost Type already exists',
      );
      mockService.updateCostType.mockRejectedValue(error);
      try {
        await controller.updateCostType(1, mockCostType);
      } catch (error) {
        expect(error).toEqual(error);
      }
      expect(mockService.updateCostType).toHaveBeenCalledWith(1, mockCostType);
    });
  });

  describe('deleteCostType', () => {
    it('should delete a cost type', async () => {
      await controller.deleteCostType(1);
      expect(mockService.deleteCostType).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if cost type does not exist', async () => {
      const error = new NotFoundException('Cost type with ID 1 not found');
      mockService.deleteCostType.mockRejectedValue(error);
      try {
        await controller.deleteCostType(1);
      } catch (error) {
        expect(error).toEqual(error);
      }
      expect(mockService.deleteCostType).toHaveBeenCalledWith(1);
    });
  });
});
