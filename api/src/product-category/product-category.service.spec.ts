import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategoryService } from './product-category.service';
import { Repository } from 'typeorm';
import { ProductCategory } from './product-category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProductCategoryDto } from './dtos/create-product-category.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ProductCategoryService', () => {
  let service: ProductCategoryService;
  let repository: Repository<ProductCategory>;

  const mockProductCategoryRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockCategories = [
    { id: 1, name: 'New Category' },
    { id: 2, name: 'Laptop' },
    { id: 3, name: 'Phone' },
    { id: 4, name: 'Clothes' },
  ] as ProductCategory[];

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
      expect(await service.findAllCategories()).toEqual(mockCategories);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findCategoryById', () => {
    it('should return a category by ID', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockCategories[0]);
      expect(await service.findCategoryById(1)).toEqual(mockCategories[0]);
      expect(repository.findOneBy).toHaveBeenCalledTimes(1);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if category is not found', async () => {
      const error = new NotFoundException(`Category with ID 1 not found`);
      jest.spyOn(repository, 'findOneBy').mockRejectedValue(error);
      try {
        await service.findCategoryById(1);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
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
      expect(await service.createCategory('New Category')).toEqual(newCategory);
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
      try {
        await service.createCategory('New Category');
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
      }
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const updatedCategory = {
        ...mockCategories[0],
        name: 'Updated Category',
      };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockCategories[0]);
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockCategories[0]);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedCategory);

      expect(await service.updateCategory(1, 'Updated Category')).toEqual(
        updatedCategory,
      );
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if category is not found', async () => {
      const error = new NotFoundException(`Category with ID 1 not found`);
      jest.spyOn(repository, 'findOneBy').mockRejectedValue(error);
      try {
        await service.updateCategory(1, 'Updated Category');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw ConflictException if category already exists', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockCategories[1]);
      try {
        await service.updateCategory(1, 'Laptop');
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
      }
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockCategories[0]);
      jest.spyOn(repository, 'remove').mockResolvedValue(undefined);
      expect(await service.deleteCategory(1)).toBeUndefined();
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.remove).toHaveBeenCalledTimes(1);
      expect(repository.remove).toHaveBeenCalledWith(mockCategories[0]);
    });

    it('should throw NotFoundException if category is not found', async () => {
      const error = new NotFoundException(`Category with ID 1 not found`);
      jest.spyOn(repository, 'findOneBy').mockRejectedValue(error);
      try {
        await service.deleteCategory(1);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
