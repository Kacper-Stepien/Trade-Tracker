import { CreateCostTypeDto } from '../../src/cost-type/dtos/create-cost-type.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { CostTypeService } from '../../src/cost-type/cost-type.service';
import { CostType } from '../../src/cost-type/cost-type.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CostTypeMapper } from '../../src/cost-type/cost-type.mapper';
import { mockCostTypes, mockCostTypesDto } from './cost-type.mock';
import { mockCostTypeRepository } from './cost-type.repository.mock';
import { Repository } from 'typeorm';
import { UpdateCostTypeDto } from 'src/cost-type/dtos/update-cost-type.dto';

describe('CostTypeService', () => {
  let service: CostTypeService;
  let repository: Repository<CostType>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CostTypeService,
        {
          provide: getRepositoryToken(CostType),
          useValue: mockCostTypeRepository,
        },
      ],
    }).compile();

    service = module.get<CostTypeService>(CostTypeService);
    repository = module.get<Repository<CostType>>(getRepositoryToken(CostType));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCostTypeById', () => {
    it('should return a cost type by ID', async () => {
      const costTypeId = 1;
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockCostTypes[0]);
      const result = await service.getCostTypeById(costTypeId);
      expect(result).toEqual(mockCostTypesDto[0]);
      expect(repository.findOneBy).toHaveBeenCalledWith({
        id: costTypeId,
      });
    });

    it('should throw a NotFoundException if cost type does not exist', async () => {
      const costTypeId = 1;
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);
      await expect(service.getCostTypeById(costTypeId)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOneBy).toHaveBeenCalledWith({
        id: costTypeId,
      });
    });
  });

  describe('getAllCostTypes', () => {
    it('should return all cost types', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(mockCostTypes);
      const result = await service.getAllCostTypes();
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(mockCostTypesDto);
      expect(result).toHaveLength(mockCostTypesDto.length);
    });

    it('should return an empty array if no cost types exist', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);
      const result = await service.getAllCostTypes();
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('createCostType', () => {
    it('should create a new cost type', async () => {
      const createCostTypeDto: CreateCostTypeDto = {
        name: 'New Test Cost Type',
      };

      const createdCostType: CostType = {
        id: 4,
        name: 'New Test Cost Type',
        costs: [],
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);
      jest.spyOn(repository, 'create').mockReturnValue(createdCostType);
      jest.spyOn(repository, 'save').mockResolvedValue(createdCostType);

      const result = await service.createCostType(createCostTypeDto);
      expect(result).toEqual(CostTypeMapper.toDto(createdCostType));
      expect(repository.findOneBy).toHaveBeenCalledWith({
        name: createCostTypeDto.name,
      });
      expect(repository.create).toHaveBeenCalledWith(createCostTypeDto);
      expect(repository.save).toHaveBeenCalledWith(createdCostType);
    });

    it('should throw a ConflictException if cost type already exists', async () => {
      const createCostTypeDto: CreateCostTypeDto = {
        name: 'Test Cost Type',
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockCostTypes[0]);
      await expect(service.createCostType(createCostTypeDto)).rejects.toThrow(
        ConflictException,
      );
      expect(repository.findOneBy).toHaveBeenCalledWith({
        name: createCostTypeDto.name,
      });
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('updateCostType', () => {
    it('should update a cost type', async () => {
      const updateCostTypeDto = {
        name: 'Updated Test Cost Type',
      };
      const updatedCostType = { ...mockCostTypes[0], ...updateCostTypeDto };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockCostTypes[0]);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedCostType);
      const result = await service.updateCostType(1, updateCostTypeDto);
      expect(result).toEqual(CostTypeMapper.toDto(updatedCostType));
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.save).toHaveBeenCalledWith(updatedCostType);
      expect(repository.save).toHaveBeenCalledWith(updatedCostType);
    });

    it('should throw a NotFoundException if cost type does not exist', async () => {
      const updateCostTypeDto: UpdateCostTypeDto = {
        name: 'Updated Test Cost Type',
      };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);
      await expect(
        service.updateCostType(1, updateCostTypeDto),
      ).rejects.toThrow(NotFoundException);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('deleteCostType', () => {
    it('should delete a cost type', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);
      await service.deleteCostType(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if cost type does not exist', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 0 } as any);
      await expect(service.deleteCostType(1)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
