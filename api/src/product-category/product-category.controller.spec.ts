import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategoryController } from './product-category.controller';
import { ProductCategoryService } from './product-category.service';
import { ProductCategory } from './product-category.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProductCategoryMapper } from './product-category.mapper';
import { ProductCategoryDto } from './dtos/product-category.dto';
import { CreateProductCategoryDto } from './dtos/create-product-category.dto';
import { UpdateProductCategoryDto } from './dtos/update-product-cateogory.dto';

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

  const mockCategories: ProductCategory[] = [
    { id: 1, name: 'New Category', products: [] },
    { id: 2, name: 'Laptop', products: [] },
    { id: 3, name: 'Phone', products: [] },
    { id: 4, name: 'Clothes', products: [] },
  ];

  const mockCategoriesDto: ProductCategoryDto[] = mockCategories.map(
    (category) => ProductCategoryMapper.toDto(category),
  );

  const createProductCategoryDto: CreateProductCategoryDto = {
    name: 'New Category',
  };

  const updateProductCategoryDto: UpdateProductCategoryDto = {
    name: 'Updated Category',
  };

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
        .mockResolvedValue(mockCategoriesDto);

      expect(await controller.getAllCategories()).toEqual(mockCategoriesDto);
      expect(service.findAllCategories).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by ID', async () => {
      const category = mockCategoriesDto[0];
      jest.spyOn(service, 'findCategoryById').mockResolvedValue(category);
      expect(await controller.getCategoryById(1)).toEqual(category);
      expect(service.findCategoryById).toHaveBeenCalledWith(1);
      expect(service.findCategoryById).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when category is not found', async () => {
      jest
        .spyOn(service, 'findCategoryById')
        .mockRejectedValue(new NotFoundException());
      await expect(controller.getCategoryById(1)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findCategoryById).toHaveBeenCalledWith(1);
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const newCategory = mockCategoriesDto[0];
      jest.spyOn(service, 'createCategory').mockResolvedValue(newCategory);
      expect(await controller.createCategory(createProductCategoryDto)).toEqual(
        newCategory,
      );
      expect(service.createCategory).toHaveBeenCalledWith(
        createProductCategoryDto,
      );
      expect(service.createCategory).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException when category already exists', async () => {
      jest
        .spyOn(service, 'createCategory')
        .mockRejectedValue(new ConflictException());
      await expect(
        controller.createCategory(mockCategoriesDto[0]),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const updatedCategory = {
        ...mockCategories[0],
        ...updateProductCategoryDto,
      };
      jest.spyOn(service, 'updateCategory').mockResolvedValue(updatedCategory);
      expect(
        await controller.updateCategory(1, updateProductCategoryDto),
      ).toEqual(updatedCategory);
      expect(service.updateCategory).toHaveBeenCalledWith(
        1,
        updateProductCategoryDto,
      );
      expect(service.updateCategory).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when category is not found', async () => {
      jest
        .spyOn(service, 'updateCategory')
        .mockRejectedValue(new NotFoundException());
      await expect(
        controller.updateCategory(1, updateProductCategoryDto),
      ).rejects.toThrow(NotFoundException);
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
      await expect(controller.deleteCategory(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
