import { CreateCostTypeDto } from './dtos/create-cost-type.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { CostTypeService } from './cost-type.service';
import { CostType } from './cost-type.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CostTypeDto } from './dtos/cost-type.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CostTypeMapper } from './cost-type.mapper';

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

describe('CostTypeService', () => {
  let service: CostTypeService;

  const mockRepository = {
    findOneBy: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CostTypeService,
        {
          provide: getRepositoryToken(CostType),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CostTypeService>(CostTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCostTypeById', () => {
    it('shoukd return a cost type by ID', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockCostTypes[0]);
      const result = await service.getCostTypeById(1);
      expect(result).toEqual(mockCostTypesDto[0]);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw a NotFoundExceptio if cost type does not exist', async () => {
      mockRepository.findOneBy.mockResolvedValue(undefined);

      await expect(service.getCostTypeById(1)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('getAllCostTypes', () => {
    it('should return all cost types', async () => {
      mockRepository.find.mockResolvedValue(mockCostTypes);
      const result = await service.getAllCostTypes();
      expect(result).toEqual(mockCostTypesDto);
      expect(result).toHaveLength(3);
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

      mockRepository.findOneBy.mockResolvedValue(undefined);
      mockRepository.create.mockReturnValue(createdCostType);
      mockRepository.save.mockResolvedValue(createdCostType);

      const result = await service.createCostType(createCostTypeDto);
      expect(result).toEqual(CostTypeMapper.toDto(createdCostType));
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        name: createCostTypeDto.name,
      });
    });

    it('should throw a ConflictException if cost type already exists', async () => {
      const createCostTypeDto: CreateCostTypeDto = {
        name: 'Test Cost Type',
      };

      mockRepository.findOneBy.mockResolvedValue(mockCostTypes[0]);
      await expect(service.createCostType(createCostTypeDto)).rejects.toThrow(
        ConflictException,
      );

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        name: createCostTypeDto.name,
      });
    });
  });

  describe('updateCostType', () => {
    it('should update a cost type', async () => {
      const updateCostTypeDto = {
        name: 'Updated Test Cost Type',
      };
      const updatedCostType = { ...mockCostTypes[0], ...updateCostTypeDto };

      mockRepository.findOneBy.mockResolvedValue(mockCostTypes[0]);
      mockRepository.save.mockResolvedValue(updatedCostType);

      const result = await service.updateCostType(1, updateCostTypeDto);
      expect(result).toEqual(CostTypeMapper.toDto(updatedCostType));
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw a NotFoundException if cost type does not exist', async () => {
      const updateCostTypeDto = {
        name: 'Updated Test Cost Type',
      };
      mockRepository.findOneBy.mockResolvedValue(undefined);
      await expect(
        service.updateCostType(1, updateCostTypeDto),
      ).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('deleteCostType', () => {
    it('should delete a cost type', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      await service.deleteCostType(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if cost type does not exist', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.deleteCostType(1)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
