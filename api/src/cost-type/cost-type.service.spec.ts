import { CreateCostTypeDto } from './dtos/create-cost-type.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { CostTypeService } from './cost-type.service';
import { CostType } from './cost-type.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CostTypeDto } from './dtos/cost-type.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('CostTypeService', () => {
  let service: CostTypeService;

  const mockRepository = {
    findOneBy: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockCostTypeDto: CostTypeDto = {
    id: 1,
    name: 'Test Cost Type',
  };

  const mockCostTypesDto: CostTypeDto[] = [
    mockCostTypeDto,
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
      mockRepository.findOneBy.mockResolvedValue(mockCostTypeDto);
      const result = await service.getCostTypeById(1);
      expect(result).toEqual(mockCostTypeDto);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw a NotFoundExceptio if cost type does not exist', async () => {
      mockRepository.findOneBy.mockResolvedValue(undefined);

      try {
        await service.getCostTypeById(1);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('getAllCostTypes', () => {
    it('should return all cost types', async () => {
      mockRepository.find.mockResolvedValue(mockCostTypesDto);
      const result = await service.getAllCostTypes();
      expect(result).toEqual(mockCostTypesDto);
      expect(result).toHaveLength(3);
    });
  });

  describe('createCostType', () => {
    it('should create a new cost type', async () => {
      const createCostTypeDto: CreateCostTypeDto = {
        name: 'Test Cost Type',
      };
      mockRepository.findOneBy.mockResolvedValue(undefined);
      mockRepository.create.mockReturnValue(mockCostTypeDto);
      mockRepository.save.mockResolvedValue(mockCostTypeDto);

      const result = await service.createCostType(createCostTypeDto);
      expect(result).toEqual(mockCostTypeDto);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        name: createCostTypeDto.name,
      });
    });

    it('should throw a ConflictException if cost type already exists', async () => {
      const createCostTypeDto: CreateCostTypeDto = {
        name: 'Test Cost Type',
      };
      mockRepository.findOneBy.mockResolvedValue(mockCostTypeDto);

      try {
        await service.createCostType(createCostTypeDto);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
      }
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
      mockRepository.findOneBy.mockResolvedValue(mockCostTypeDto);
      mockRepository.save.mockResolvedValue(mockCostTypeDto);

      const result = await service.updateCostType(1, updateCostTypeDto);
      expect(result).toEqual(mockCostTypeDto);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw a NotFoundException if cost type does not exist', async () => {
      const updateCostTypeDto = {
        name: 'Updated Test Cost Type',
      };
      mockRepository.findOneBy.mockResolvedValue(undefined);

      try {
        await service.updateCostType(1, updateCostTypeDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
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

      try {
        await service.deleteCostType(1);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
