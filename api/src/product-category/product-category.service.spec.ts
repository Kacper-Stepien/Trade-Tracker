import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategoryService } from './product-category.service';
import { Repository } from 'typeorm';
import { ProductCategory } from './product-category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProductCategoryDto } from './dtos/create-product-category.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProductCategoryDto } from './dtos/product-category.dto';
import { ProductCategoryMapper } from './product-category.mapper';
import { UpdateProductCategoryDto } from './dtos/update-product-cateogory.dto';

describe('ProductCategoryService', () => {
  let service: ProductCategoryService;
  let repository: Repository<ProductCategory>;

  const mockProductCategoryRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockCategories: ProductCategory[] = [
    { id: 1, name: 'New Category', products: [] },
    { id: 2, name: 'Laptop', products: [] },
    { id: 3, name: 'Phone', products: [] },
    { id: 4, name: 'Clothes', products: [] },
  ];

  const mockCategoriesDto: ProductCategoryDto[] = mockCategories.map(
    (category) => ProductCategoryMapper.toDto(category),
  );

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
  });

  describe('findCategoryById', () => {
    it('should return a category by ID', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockCategories[0]);
      expect(await service.findCategoryById(1)).toEqual(mockCategoriesDto[0]);
      expect(repository.findOneBy).toHaveBeenCalledTimes(1);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if category is not found', async () => {
      const id = 1;
      mockProductCategoryRepository.findOneBy.mockResolvedValue(undefined);
      await expect(service.findCategoryById(id)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOneBy).toHaveBeenCalledWith({
        id,
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
        name: 'New Category',
      });
      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith({ name: 'New Category' });
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(newCategory);
    });

    it('should throw ConflictException if category already exists', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockCategories[0]);
      await expect(
        service.createCategory(createProductCategory),
      ).rejects.toThrow(ConflictException);
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
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockCategories[0]);
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockCategories[0]);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedCategory);

      expect(await service.updateCategory(1, updateCategory)).toEqual(
        ProductCategoryMapper.toDto(updatedCategory),
      );
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if category is not found', async () => {
      const updateCategory: UpdateProductCategoryDto = {
        name: 'Updated Category',
      };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);
      await expect(service.updateCategory(1, updateCategory)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw ConflictException if category already exists', async () => {
      const updateCategory: UpdateProductCategoryDto = {
        name: 'Updated Category',
      };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockCategories[0]);
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockCategories[1]);
      await expect(service.updateCategory(1, updateCategory)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      mockProductCategoryRepository.delete.mockResolvedValue({ affected: 1 });
      await service.deleteCategory(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if category is not found', async () => {
      mockProductCategoryRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.deleteCategory(1)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
