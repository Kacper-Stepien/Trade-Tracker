import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategoryController } from './product-category.controller';
import { ProductCategoryService } from './product-category.service';
import { ProductCategory } from './product-category.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ProductCategoryController', () => {
  let controller: ProductCategoryController;
  let service: ProductCategoryService;

  const mockProductCategoryService = {
    findAllCategories: jest.fn(),
    findCategoryById: jest.fn(),
    createCategory: jest.fn(),
    updateCategory: jest.fn(),
    deleteCategory: jest.fn(),
  };

  const mockCategories = [
    { id: 1, name: 'New Category' },
    { id: 2, name: 'Laptop' },
    { id: 3, name: 'Phone' },
    { id: 4, name: 'Clothes' },
  ] as ProductCategory[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductCategoryController],
      providers: [
        {
          provide: ProductCategoryService,
          useValue: mockProductCategoryService,
        },
      ],
    }).compile();

    controller = module.get<ProductCategoryController>(
      ProductCategoryController,
    );
    service = module.get<ProductCategoryService>(ProductCategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      jest
        .spyOn(service, 'findAllCategories')
        .mockResolvedValue(mockCategories);

      expect(await controller.getAllCategories()).toEqual(mockCategories);
      expect(service.findAllCategories).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by ID', async () => {
      const category = mockCategories[0];
      jest.spyOn(service, 'findCategoryById').mockResolvedValue(category);
      expect(await controller.getCategoryById(1)).toEqual(category);
      expect(service.findCategoryById).toHaveBeenCalledWith(1);
      expect(service.findCategoryById).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when category is not found', async () => {
      jest
        .spyOn(service, 'findCategoryById')
        .mockRejectedValue(new NotFoundException());
      try {
        await controller.getCategoryById(1);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
      expect(service.findCategoryById).toHaveBeenCalledWith(1);
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const newCategory = mockCategories[0];
      jest.spyOn(service, 'createCategory').mockResolvedValue(newCategory);
      expect(await controller.createCategory(newCategory)).toEqual(newCategory);
      expect(service.createCategory).toHaveBeenCalledWith('New Category');
      expect(service.createCategory).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException when category already exists', async () => {
      const error = new ConflictException();
      jest.spyOn(service, 'createCategory').mockRejectedValue(error);
      try {
        await controller.createCategory(mockCategories[0]);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
      }
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const updatedCategory = {
        id: 1,
        name: 'Updated Category',
      } as ProductCategory;

      jest.spyOn(service, 'updateCategory').mockResolvedValue(updatedCategory);
      expect(await controller.updateCategory(1, updatedCategory)).toEqual(
        updatedCategory,
      );
      expect(service.updateCategory).toHaveBeenCalledWith(
        1,
        'Updated Category',
      );
      expect(service.updateCategory).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when category is not found', async () => {
      jest
        .spyOn(service, 'updateCategory')
        .mockRejectedValue(new NotFoundException());
      try {
        await controller.updateCategory(1, mockCategories[0]);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      jest.spyOn(service, 'deleteCategory').mockResolvedValue();
      expect(await controller.deleteCategory(1)).toBeUndefined();
      expect(service.deleteCategory).toHaveBeenCalledWith(1);
      expect(service.deleteCategory).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when category is not found', async () => {
      jest
        .spyOn(service, 'deleteCategory')
        .mockRejectedValue(new NotFoundException());
      try {
        await controller.deleteCategory(1);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
