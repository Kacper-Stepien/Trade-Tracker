import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategoryService } from '../../src/product-category/product-category.service';
import { Repository } from 'typeorm';
import { ProductCategory } from '../../src/product-category/product-category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProductCategoryDto } from '../../src/product-category/dtos/create-product-category.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProductCategoryMapper } from '../../src/product-category/product-category.mapper';
import { UpdateProductCategoryDto } from '../../src/product-category/dtos/update-product-category.dto';
import { mockCategories, mockCategoriesDto } from './product-category.mock';
import { mockProductCategoryRepository } from './product-category.repository.mock';

describe('ProductCategoryService', () => {
  let service: ProductCategoryService;
  let repository: Repository<ProductCategory>;
  const createProductCategory: CreateProductCategoryDto = {
    name: 'New Category',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductCategoryService,
        {
          provide: getRepositoryToken(ProductCategory),
          useValue: mockProductCategoryRepository,
        },
      ],
    }).compile();

    jest.clearAllMocks();

    service = module.get<ProductCategoryService>(ProductCategoryService);
    repository = module.get<Repository<ProductCategory>>(
      getRepositoryToken(ProductCategory),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllCategories', () => {
    it('should return all categories', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(mockCategories);
      expect(await service.findAllCategories()).toEqual(mockCategoriesDto);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if no categories are found', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);
      expect(await service.findAllCategories()).toEqual([]);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findCategoryById', () => {
    it('should return a category by ID', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockCategories[0]);
      expect(await service.findCategoryById(mockCategories[0].id)).toEqual(
        mockCategoriesDto[0],
      );
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: mockCategories[0].id },
      });
    });

    it('should throw NotFoundException if category is not found', async () => {
      const id = 1;
      mockProductCategoryRepository.findOne.mockResolvedValue(undefined);
      await expect(service.findCategoryById(id)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const newCategory: ProductCategory = {
        ...createProductCategory,
        id: 6,
        products: [],
      };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);
      jest.spyOn(repository, 'create').mockReturnValue(newCategory);
      jest.spyOn(repository, 'save').mockResolvedValue(newCategory);

      expect(await service.createCategory(createProductCategory)).toEqual(
        ProductCategoryMapper.toDto(newCategory),
      );
      expect(repository.findOneBy).toHaveBeenCalledWith({
        name: newCategory.name,
      });
      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith({
        name: newCategory.name,
      });
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(newCategory);
    });

    it('should throw ConflictException if category already exists', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockCategories[0]);
      await expect(
        service.createCategory(createProductCategory),
      ).rejects.toThrow(ConflictException);
      expect(repository.findOneBy).toHaveBeenCalledWith({
        name: createProductCategory.name,
      });
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const updateCategory: UpdateProductCategoryDto = {
        name: 'Updated Category',
      };
      const updatedCategory: ProductCategory = {
        ...mockCategories[0],
        ...updateCategory,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockCategories[0]);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedCategory);

      expect(await service.updateCategory(1, updateCategory)).toEqual(
        ProductCategoryMapper.toDto(updatedCategory),
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { name: updateCategory.name },
        select: ['id'],
      });
    });

    it('should throw NotFoundException if category is not found', async () => {
      const id = 1;
      const updateCategory: UpdateProductCategoryDto = {
        name: 'Updated Category',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      await expect(service.updateCategory(id, updateCategory)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if category with given name already exists', async () => {
      const id = mockCategories[0].id;
      const updateCategory: UpdateProductCategoryDto = {
        name: mockCategories[1].name,
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockCategories[2]);
      await expect(service.updateCategory(id, updateCategory)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await service.deleteCategory(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if category is not found', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 0 } as any);
      await expect(service.deleteCategory(1)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by ID', async () => {
      const id = mockCategories[0].id;
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockCategories[0]);
      expect(await service.getCategoryById(id)).toEqual(mockCategories[0]);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it("should throw NotFoundException if category doesn't exist", async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      await expect(service.getCategoryById(id)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });
});
