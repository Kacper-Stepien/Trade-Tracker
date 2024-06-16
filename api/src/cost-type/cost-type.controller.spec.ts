import { Test, TestingModule } from '@nestjs/testing';
import { CostTypeController } from './cost-type.controller';
import { CostTypeService } from './cost-type.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CostTypeDto } from './dtos/cost-type.dto';
import { CostType } from './cost-type.entity';
import { CostTypeMapper } from './cost-type.mapper';
import { CreateCostTypeDto } from './dtos/create-cost-type.dto';
import { UpdateCostTypeDto } from './dtos/update-cost-type.dto';

describe('CostTypeController', () => {
  let controller: CostTypeController;

  const mockService = {
    getCostTypeById: jest.fn(),
    getAllCostTypes: jest.fn(),
    createCostType: jest.fn(),
    updateCostType: jest.fn(),
    deleteCostType: jest.fn(),
  };

  const mockCreateCostTypeDto: CreateCostTypeDto = {
    name: 'Test Cost Type',
  };

  const mockUpdateCostTypeDto: UpdateCostTypeDto = {
    name: 'Updated Test Cost Type',
  };

  const mockCostTypes: CostType[] = [
    {
      id: 1,
      name: 'Test Cost Type',
      costs: [],
    },
    {
      id: 2,
      name: 'Another Test Cost Type',
      costs: [],
    },
    {
      id: 3,
      name: 'Yet Another Test Cost Type',
      costs: [],
    },
  ];

  const mockCostTypesDto: CostTypeDto[] = mockCostTypes.map((cost) =>
    CostTypeMapper.toDto(cost),
  );

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
      mockService.getCostTypeById.mockResolvedValue(mockCostTypesDto[0]);
      const result = await controller.getCostType(1);
      expect(result).toEqual(mockCostTypesDto[0]);
      expect(mockService.getCostTypeById).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if cost type does not exist', async () => {
      const error = new NotFoundException('Cost type with ID 1 not found');
      mockService.getCostTypeById.mockRejectedValue(error);
      await expect(controller.getCostType(1)).rejects.toThrow(error);
      expect(mockService.getCostTypeById).toHaveBeenCalledWith(1);
    });
  });

  describe('getAllCostTypes', () => {
    it('should return all cost types', async () => {
      mockService.getAllCostTypes.mockResolvedValue(mockCostTypesDto);
      const result = await controller.getAllCostTypes();
      expect(result).toEqual(mockCostTypesDto);
      expect(mockService.getAllCostTypes).toHaveBeenCalled();
    });
  });

  describe('createCostType', () => {
    it('should create a new cost type', async () => {
      const mockCreatedCostTypeDto: CostTypeDto = {
        ...mockCreateCostTypeDto,
        id: 4,
      };
      mockService.createCostType.mockResolvedValue(mockCreatedCostTypeDto);
      const result = await controller.createCostType(mockCreateCostTypeDto);
      expect(result).toEqual(mockCreatedCostTypeDto);
      expect(mockService.createCostType).toHaveBeenCalledWith(
        mockCreateCostTypeDto,
      );
    });

    it('should throw a ConflictException if cost type already exists', async () => {
      const error = new ConflictException(
        'Cost type with name Test Cost Type already exists',
      );
      mockService.createCostType.mockRejectedValue(error);
      await expect(
        controller.createCostType(mockCreateCostTypeDto),
      ).rejects.toThrow(error);

      expect(mockService.createCostType).toHaveBeenCalledWith(
        mockCreateCostTypeDto,
      );
    });
  });

  describe('updateCostType', () => {
    it('should update a cost type', async () => {
      const mockUpdatedCostTypeDto: CostTypeDto = {
        ...mockUpdateCostTypeDto,
        ...mockCostTypesDto[0],
      };

      mockService.updateCostType.mockResolvedValue(mockUpdatedCostTypeDto);
      const result = await controller.updateCostType(1, mockUpdateCostTypeDto);
      expect(result).toEqual(mockUpdatedCostTypeDto);
      expect(mockService.updateCostType).toHaveBeenCalledWith(
        1,
        mockUpdateCostTypeDto,
      );
    });

    it('should throw a NotFoundException if cost type does not exist', async () => {
      const error = new NotFoundException('Cost type with ID 1 not found');
      mockService.updateCostType.mockRejectedValue(error);
      await expect(
        controller.updateCostType(1, mockUpdateCostTypeDto),
      ).rejects.toThrow(error);
      expect(mockService.updateCostType).toHaveBeenCalledWith(
        1,
        mockUpdateCostTypeDto,
      );
    });

    it('should throw a ConflictException if cost type already exists', async () => {
      const error = new ConflictException(
        'Cost type with name Test Cost Type already exists',
      );
      mockService.updateCostType.mockRejectedValue(error);
      await expect(
        controller.updateCostType(1, mockUpdateCostTypeDto),
      ).rejects.toThrow(error);
      expect(mockService.updateCostType).toHaveBeenCalledWith(
        1,
        mockUpdateCostTypeDto,
      );
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
      await expect(controller.deleteCostType(1)).rejects.toThrow(error);
      expect(mockService.deleteCostType).toHaveBeenCalledWith(1);
    });
  });
});
