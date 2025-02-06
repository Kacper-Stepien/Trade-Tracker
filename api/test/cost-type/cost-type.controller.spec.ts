import { Test, TestingModule } from '@nestjs/testing';
import { CostTypeController } from '../../src/cost-type/cost-type.controller';
import { CostTypeService } from '../../src/cost-type/cost-type.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CostTypeDto } from '../../src/cost-type/dtos/cost-type.dto';
import { CreateCostTypeDto } from '../../src/cost-type/dtos/create-cost-type.dto';
import { UpdateCostTypeDto } from '../../src/cost-type/dtos/update-cost-type.dto';
import { mockCostTypeService } from './cost-type.service.mock';
import { mockCostTypesDto } from './cost-type.mock';

describe('CostTypeController', () => {
  let controller: CostTypeController;
  let service: CostTypeService;

  const mockCreateCostTypeDto: CreateCostTypeDto = {
    name: 'Test Cost Type',
  };

  const mockUpdateCostTypeDto: UpdateCostTypeDto = {
    name: 'Updated Test Cost Type',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CostTypeController],
      providers: [
        {
          provide: CostTypeService,
          useValue: mockCostTypeService,
        },
      ],
    }).compile();

    controller = module.get<CostTypeController>(CostTypeController);
    service = module.get<CostTypeService>(CostTypeService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCostType', () => {
    it('should return a cost type by ID', async () => {
      const mockCostType = mockCostTypesDto[0];
      jest.spyOn(service, 'getCostTypeById').mockResolvedValue(mockCostType);
      const result = await controller.getCostType(mockCostType.id);
      expect(result).toEqual(mockCostTypesDto[0]);
      expect(service.getCostTypeById).toHaveBeenCalledWith(mockCostType.id);
    });

    it('should throw a NotFoundException if cost type does not exist', async () => {
      const mockCostType = mockCostTypesDto[0];
      jest
        .spyOn(service, 'getCostTypeById')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.getCostType(mockCostType.id)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.getCostTypeById).toHaveBeenCalledWith(mockCostType.id);
    });
  });

  describe('getAllCostTypes', () => {
    it('should return all cost types', async () => {
      jest
        .spyOn(service, 'getAllCostTypes')
        .mockResolvedValue(mockCostTypesDto);
      const result = await controller.getAllCostTypes();
      expect(result).toEqual(mockCostTypesDto);
      expect(service.getAllCostTypes).toHaveBeenCalled();
    });
    it('should return an empty array if no cost types exist', async () => {
      jest.spyOn(service, 'getAllCostTypes').mockResolvedValue([]);
      const result = await controller.getAllCostTypes();
      expect(result).toEqual([]);
      expect(service.getAllCostTypes).toHaveBeenCalled();
    });
  });

  describe('createCostType', () => {
    it('should create a new cost type', async () => {
      const mockCreatedCostTypeDto: CostTypeDto = {
        ...mockCreateCostTypeDto,
        id: 4,
      };
      jest
        .spyOn(service, 'createCostType')
        .mockResolvedValue(mockCreatedCostTypeDto);
      const result = await controller.createCostType(mockCreateCostTypeDto);
      expect(result).toEqual(mockCreatedCostTypeDto);
      expect(service.createCostType).toHaveBeenCalledWith(
        mockCreateCostTypeDto,
      );
    });

    it('should throw a ConflictException if cost type already exists', async () => {
      jest
        .spyOn(service, 'createCostType')
        .mockRejectedValue(new ConflictException());
      await expect(
        controller.createCostType(mockCreateCostTypeDto),
      ).rejects.toThrow(ConflictException);
      expect(service.createCostType).toHaveBeenCalledWith(
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
      jest
        .spyOn(service, 'updateCostType')
        .mockResolvedValue(mockUpdatedCostTypeDto);
      const result = await controller.updateCostType(
        mockCostTypesDto[0].id,
        mockUpdateCostTypeDto,
      );
      expect(result).toEqual(mockUpdatedCostTypeDto);
      expect(service.updateCostType).toHaveBeenCalledWith(
        mockCostTypesDto[0].id,
        mockUpdateCostTypeDto,
      );
      expect(service.updateCostType).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException if cost type does not exist', async () => {
      jest
        .spyOn(service, 'updateCostType')
        .mockRejectedValue(new NotFoundException());
      await expect(
        controller.updateCostType(1, mockUpdateCostTypeDto),
      ).rejects.toThrow(NotFoundException);
      expect(mockCostTypeService.updateCostType).toHaveBeenCalledWith(
        1,
        mockUpdateCostTypeDto,
      );
    });

    it('should throw a ConflictException if cost type already exists', async () => {
      jest
        .spyOn(service, 'updateCostType')
        .mockRejectedValue(new ConflictException());
      await expect(
        controller.updateCostType(1, mockUpdateCostTypeDto),
      ).rejects.toThrow(ConflictException);
      expect(mockCostTypeService.updateCostType).toHaveBeenCalledWith(
        1,
        mockUpdateCostTypeDto,
      );
    });
  });

  describe('deleteCostType', () => {
    it('should delete a cost type', async () => {
      jest.spyOn(service, 'deleteCostType').mockResolvedValue();
      expect(await controller.deleteCostType(1)).toBeUndefined();
      expect(mockCostTypeService.deleteCostType).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if cost type does not exist', async () => {
      jest
        .spyOn(service, 'deleteCostType')
        .mockRejectedValue(new NotFoundException());
      await expect(controller.deleteCostType(1)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.deleteCostType).toHaveBeenCalledWith(1);
    });
  });
});
