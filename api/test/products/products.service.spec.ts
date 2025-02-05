import { mockCategories } from './../product-category/product-category.mock';
import { mockUsers } from './../users/users.mock';
import { CreateProductDto } from '../../src/products/dtos/create-product.dto';
import { Product } from '../../src/products/product.entity';
import { ProductAttribute } from '../../src/product-attribute/product-attribute.entity';
import { UsersService } from '../../src/users/users.service';
import { ProductCategoryService } from '../../src/product-category/product-category.service';
import { ProductsService } from '../../src/products/products.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  mockProductRepository,
  createQueryBuilder,
} from './products.repository.mock';
import { mockProductAttributeRepository } from '../product-attribute/product-attribute.repository.mock';
import { mockUsersService } from '../users/users.service.mock';
import { mockProductCategoryService } from '../product-category/product-category.service.mock';
import { mockProducts } from './products.mock';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { SaleProductDto } from '../../src/products/dtos/sale-product.dto';
import { UpdateProductDto } from '../../src/products/dtos/update-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(ProductAttribute),
          useValue: mockProductAttributeRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: ProductCategoryService,
          useValue: mockProductCategoryService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMyProducts', () => {
    it('should return a list of products', async () => {
      const userId = 1;
      const mockProductsForUser = mockProducts.filter(
        (product) => product.user.id === userId,
      );
      createQueryBuilder.getManyAndCount.mockResolvedValue([
        mockProductsForUser,
        mockProductsForUser.length,
      ]);

      const result = await service.getMyProducts(userId);
      expect(result).toEqual({
        products: mockProductsForUser,
        total: mockProductsForUser.length,
      });
      expect(createQueryBuilder.getManyAndCount).toHaveBeenCalled();
    });

    it('should return only sold products', async () => {
      const userId = 1;
      const sold = true;
      const mockProductsForUser = mockProducts.filter(
        (product) => product.user.id === userId && product.sold === sold,
      );
      createQueryBuilder.getManyAndCount.mockResolvedValue([
        mockProductsForUser,
        mockProductsForUser.length,
      ]);

      const result = await service.getMyProducts(userId, 1, 10, sold);
      expect(result).toEqual({
        products: mockProductsForUser,
        total: mockProductsForUser.length,
      });
      expect(createQueryBuilder.getManyAndCount).toHaveBeenCalled();
    });

    it('should return only products with given category ID', async () => {
      const userId = 1;
      const categoryId = 1;
      const mockProductsForUser = mockProducts.filter(
        (product) =>
          product.user.id === userId && product.category.id === categoryId,
      );
      createQueryBuilder.getManyAndCount.mockResolvedValue([
        mockProductsForUser,
        mockProductsForUser.length,
      ]);

      const result = await service.getMyProducts(
        userId,
        1,
        10,
        undefined,
        categoryId,
      );

      expect(result).toEqual({
        products: mockProductsForUser,
        total: mockProductsForUser.length,
      });
      expect(createQueryBuilder.getManyAndCount).toHaveBeenCalled();
    });

    it('it should return 3 products from page 4', async () => {
      const userId = 1;
      const page = 4;
      const limit = 3;
      const mockProductsForUser = mockProducts.filter(
        (product) => product.user.id === userId,
      );
      const paginatedProducts = mockProductsForUser.slice(
        (page - 1) * limit,
        page * limit,
      );
      createQueryBuilder.getManyAndCount.mockResolvedValue([
        paginatedProducts,
        mockProductsForUser.length,
      ]);

      const result = await service.getMyProducts(userId, page, limit);

      expect(result).toEqual({
        products: paginatedProducts,
        total: mockProductsForUser.length,
      });
      expect(createQueryBuilder.getManyAndCount).toHaveBeenCalled();
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const userId = 1;
      const createProductDto: CreateProductDto = {
        name: 'New product',
        purchasePrice: 100,
        purchaseDate: new Date(),
        categoryId: 1,
        attributes: [],
      };

      const mockUser = mockUsers[0];
      const mockCategory = mockCategories[0];

      const mockProduct = {
        ...createProductDto,
        user: mockUser,
        category: mockCategory,
        attributes: [],
      };

      mockUsersService.findUserById.mockResolvedValue(mockUser);
      mockProductCategoryService.findCategoryById.mockResolvedValue(
        mockCategory,
      );

      mockProductRepository.manager.transaction.mockImplementation(
        async (cb) => {
          return await cb({
            create: jest.fn().mockReturnValue(mockProduct),
            save: jest.fn().mockResolvedValue(mockProduct),
          });
        },
      );

      const result = await service.createProduct(userId, createProductDto);

      expect(result).toEqual(mockProduct);
      expect(mockUsersService.findUserById).toHaveBeenCalledWith(userId);
      expect(mockProductCategoryService.findCategoryById).toHaveBeenCalledWith(
        createProductDto.categoryId,
      );
    });

    it('should create a new product with attributes', async () => {
      const userId = 1;
      const createProductDto: CreateProductDto = {
        name: 'New product with attributes',
        purchasePrice: 150,
        purchaseDate: new Date(),
        categoryId: 1,
        attributes: [{ name: 'Color', value: 'Red' }],
      };

      const mockUser = mockUsers[0];
      const mockCategory = mockCategories[0];

      const mockProduct = {
        ...createProductDto,
        user: mockUser,
        category: mockCategory,
        attributes: [],
      };

      const mockAttribute = {
        id: 1,
        ...createProductDto.attributes[0],
        product: mockProduct,
      };

      mockUsersService.findUserById.mockResolvedValue(mockUser);
      mockProductCategoryService.findCategoryById.mockResolvedValue(
        mockCategory,
      );

      mockProductRepository.manager.transaction.mockImplementation(
        async (cb) => {
          return await cb({
            create: jest
              .fn()
              .mockReturnValueOnce(mockProduct)
              .mockReturnValueOnce(mockAttribute),
            save: jest
              .fn()
              .mockResolvedValueOnce(mockProduct)
              .mockResolvedValueOnce([mockAttribute]),
          });
        },
      );

      const result = await service.createProduct(userId, createProductDto);

      expect(result).toEqual({ ...mockProduct, attributes: [mockAttribute] });
      expect(mockUsersService.findUserById).toHaveBeenCalledWith(userId);
      expect(mockProductCategoryService.findCategoryById).toHaveBeenCalledWith(
        createProductDto.categoryId,
      );
    });

    it('should throw an error if user does not exist', async () => {
      const userId = 999;
      const createProductDto: CreateProductDto = {
        name: 'Non-existent user product',
        purchasePrice: 100,
        purchaseDate: new Date(),
        categoryId: 1,
        attributes: [],
      };

      mockUsersService.findUserById.mockResolvedValue(null);

      await expect(
        service.createProduct(userId, createProductDto),
      ).rejects.toThrow(NotFoundException);
      expect(mockUsersService.findUserById).toHaveBeenCalledWith(userId);
      expect(
        mockProductCategoryService.findCategoryById,
      ).not.toHaveBeenCalled();
    });

    it('should throw an error if category does not exist', async () => {
      const userId = 1;
      const createProductDto: CreateProductDto = {
        name: 'Non-existent category product',
        purchasePrice: 100,
        purchaseDate: new Date(),
        categoryId: 999,
        attributes: [],
      };

      const mockUser = mockUsers[0];

      mockUsersService.findUserById.mockResolvedValue(mockUser);
      mockProductCategoryService.findCategoryById.mockResolvedValue(null);

      await expect(
        service.createProduct(userId, createProductDto),
      ).rejects.toThrow(NotFoundException);
      expect(mockUsersService.findUserById).toHaveBeenCalledWith(userId);
      expect(mockProductCategoryService.findCategoryById).toHaveBeenCalledWith(
        createProductDto.categoryId,
      );
    });
  });

  describe('findProductById', () => {
    it('should return a product by ID', async () => {
      const mockProduct = mockProducts[0];
      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      const result = await service.findProductById(
        mockProduct.id,
        mockProduct.user.id,
      );

      expect(result).toEqual({ ...mockProduct, user: undefined });
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProduct.id },
        relations: ['category', 'attributes', 'user', 'costs'],
      });
    });

    it('should throw a NotFoundException if product does not exist', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(service.findProductById(999, 1)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['category', 'attributes', 'user', 'costs'],
      });
    });

    it('should throw a ForbiddenException if product does not belong to user', async () => {
      const mockProduct = mockProducts[1];
      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      await expect(
        service.findProductById(mockProduct.id, 999),
      ).rejects.toThrow(ForbiddenException);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProduct.id },
        relations: ['category', 'attributes', 'user', 'costs'],
      });
    });
  });

  describe('markProductAsSold', () => {
    it('should mark a product as sold', async () => {
      const productId = 1;
      const userId = 1;
      const saleProductDto: SaleProductDto = {
        salePrice: 250,
        saleDate: new Date(),
      };

      const mockProduct = { ...mockProducts[0], user: { id: userId } };
      mockProductRepository.findOne.mockResolvedValue(mockProduct);
      mockProductRepository.save.mockResolvedValue({
        ...mockProduct,
        sold: true,
        salePrice: saleProductDto.salePrice,
        saleDate: saleProductDto.saleDate,
      });

      const result = await service.markProductAsSold(
        productId,
        userId,
        saleProductDto,
      );

      expect(result.sold).toBe(true);
      expect(result.salePrice).toBe(saleProductDto.salePrice);
      expect(result.saleDate).toEqual(saleProductDto.saleDate);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
        relations: ['user', 'attributes'],
      });
      expect(mockProductRepository.save).toHaveBeenCalledWith({
        ...mockProduct,
        sold: true,
        salePrice: saleProductDto.salePrice,
        saleDate: saleProductDto.saleDate,
      });
    });

    it('should throw an error if product does not exist', async () => {
      const productId = 999;
      const userId = 1;
      const saleProductDto: SaleProductDto = {
        salePrice: 250,
        saleDate: new Date(),
      };

      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(
        service.markProductAsSold(productId, userId, saleProductDto),
      ).rejects.toThrow(NotFoundException);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
        relations: ['user', 'attributes'],
      });
      expect(mockProductRepository.save).not.toHaveBeenCalled();
    });

    it('should throw an error if product does not belong to user', async () => {
      const productId = 1;
      const userId = 2;
      const saleProductDto: SaleProductDto = {
        salePrice: 250,
        saleDate: new Date(),
      };

      const mockProduct = { ...mockProducts[0], user: { id: 1 } };
      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      await expect(
        service.markProductAsSold(productId, userId, saleProductDto),
      ).rejects.toThrow(ForbiddenException);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
        relations: ['user', 'attributes'],
      });
      expect(mockProductRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('markProductAsUnsold', () => {
    it('should mark a product as unsold', async () => {
      const mockProduct = {
        ...mockProducts[1],
        sold: true,
        salePrice: 150,
        saleDate: new Date(),
      };

      mockProductRepository.findOne.mockResolvedValue(mockProduct);
      mockProductRepository.save.mockResolvedValue({
        ...mockProduct,
        sold: false,
        salePrice: null,
        saleDate: null,
      });

      const result = await service.markProductAsUnsold(
        mockProduct.id,
        mockProduct.user.id,
      );

      expect(result.sold).toBe(false);
      expect(result.salePrice).toBeNull();
      expect(result.saleDate).toBeNull();
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProduct.id },
        relations: ['user', 'attributes'],
      });
      expect(mockProductRepository.save).toHaveBeenCalledWith({
        ...mockProduct,
        sold: false,
        salePrice: null,
        saleDate: null,
      });
    });

    it('should throw an error if product does not exist', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(service.markProductAsUnsold(999, 1)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['user', 'attributes'],
      });
    });

    it('should throw an error if product does not belong to user', async () => {
      const mockProduct = {
        ...mockProducts[0],
        user: { ...mockUsers[0], id: 1 },
      };
      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      await expect(
        service.markProductAsUnsold(mockProduct.id, 2),
      ).rejects.toThrow(ForbiddenException);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProduct.id },
        relations: ['user', 'attributes'],
      });
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const mockProduct = { ...mockProducts[0], user: mockUsers[0] };
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        purchasePrice: 300,
        purchaseDate: new Date(),
      };

      mockProductRepository.findOne.mockResolvedValue(mockProduct);
      mockProductRepository.save.mockResolvedValue({
        ...mockProduct,
        ...updateProductDto,
      });

      const result = await service.updateProduct(
        mockProduct.id,
        mockProduct.user.id,
        updateProductDto,
      );

      expect(result.name).toBe(updateProductDto.name);
      expect(result.purchasePrice).toBe(updateProductDto.purchasePrice);
      expect(result.purchaseDate).toBe(updateProductDto.purchaseDate);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProduct.id },
        relations: ['user', 'attributes'],
      });
      expect(mockProductRepository.save).toHaveBeenCalledWith({
        ...mockProduct,
        ...updateProductDto,
      });
    });

    it('should throw a NotFoundException if product does not exist', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        purchasePrice: 300,
        purchaseDate: new Date(),
      };

      await expect(
        service.updateProduct(999, 1, updateProductDto),
      ).rejects.toThrow(NotFoundException);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['user', 'attributes'],
      });
    });

    it('should throw an error if product does not belong to user', async () => {
      const mockProduct = mockProducts[1];
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product Name',
      };

      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      await expect(
        service.updateProduct(mockProduct.id, 999, updateProductDto),
      ).rejects.toThrow(ForbiddenException);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProduct.id },
        relations: ['user', 'attributes'],
      });
    });

    it('should throw an error if category does not exist', async () => {
      const mockProduct = mockProducts[1];
      const updateProductDto: UpdateProductDto = {
        categoryId: 999,
      };

      mockProductRepository.findOne.mockResolvedValue(mockProduct);
      mockProductCategoryService.getCategoryById.mockResolvedValue(null);

      await expect(
        service.updateProduct(
          mockProduct.id,
          mockProduct.user.id,
          updateProductDto,
        ),
      ).rejects.toThrow(NotFoundException);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProduct.id },
        relations: ['user', 'attributes'],
      });
      expect(mockProductCategoryService.getCategoryById).toHaveBeenCalledWith(
        999,
      );
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const mockProduct = mockProducts[1];

      mockProductRepository.findOne.mockResolvedValue(mockProduct);
      mockProductRepository.delete.mockResolvedValue({ affected: 1 });

      await service.deleteProduct(mockProduct.id, mockProduct.user.id);

      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProduct.id },
        relations: ['user', 'attributes'],
      });
      expect(mockProductRepository.delete).toHaveBeenCalledWith(mockProduct.id);
    });

    it('should throw an error if product does not exist', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteProduct(999, 1)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['user', 'attributes'],
      });
    });

    it('should throw an error if product does not belong to user', async () => {
      const mockProduct = mockProducts[1];

      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      await expect(service.deleteProduct(mockProduct.id, 999)).rejects.toThrow(
        ForbiddenException,
      );
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockProduct.id },
        relations: ['user', 'attributes'],
      });
    });
  });
});
