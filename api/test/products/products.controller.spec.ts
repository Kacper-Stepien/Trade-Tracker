import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../../src/products/products.controller';
import { ProductsService } from 'src/products/products.service';
import { mockProductsService } from './products.service.mock';
import { mockProducts } from './products.mock';
import { CreateProductDto } from '../../src/products/dtos/create-product.dto';
import { Product } from '../../src/products/product.entity';
import { SaleProductDto } from '../../src/products/dtos/sale-product.dto';
import { UpdateProductDto } from '../../src/products/dtos/update-product.dto';
import { mockUsers } from '../users/users.mock';
import { mockCategories } from '../product-category/product-category.mock';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMyProducts', () => {
    it('should return a list of products', async () => {
      const req = { user: { sub: 1 } };
      const result = { products: mockProducts, total: mockProducts.length };
      jest
        .spyOn(mockProductsService, 'getMyProducts')
        .mockResolvedValue(result);

      expect(await controller.getMyProducts(req, 1, 10)).toBe(result);
      expect(mockProductsService.getMyProducts).toHaveBeenCalledWith(
        1,
        1,
        10,
        undefined,
        undefined,
      );
    });
  });

  describe('getProductById', () => {
    it('should return a single product', async () => {
      const req = { user: { sub: 1 } };
      const product = mockProducts[0];
      jest
        .spyOn(mockProductsService, 'findProductById')
        .mockResolvedValue(product);

      expect(await controller.getProductById(req, product.id)).toBe(product);
      expect(mockProductsService.findProductById).toHaveBeenCalledWith(
        product.id,
        1,
      );
    });
  });

  describe('createProduct', () => {
    it('should create and return a new product', async () => {
      const req = { user: { sub: 1 } };
      const createProductDto: CreateProductDto = {
        name: 'New Product',
        purchasePrice: 100,
        purchaseDate: new Date(),
        categoryId: 1,
        attributes: [],
      };
      const createdProduct = {
        ...createProductDto,
        id: 1,
        user: mockUsers[0],
        category: mockCategories[0],
        sold: false,
        salePrice: null,
        saleDate: null,
        attributes: [],
        costs: [],
      } as Product;
      jest
        .spyOn(mockProductsService, 'createProduct')
        .mockResolvedValue(createdProduct);

      expect(await controller.createProduct(req, createProductDto)).toBe(
        createdProduct,
      );
      expect(mockProductsService.createProduct).toHaveBeenCalledWith(
        1,
        createProductDto,
      );
    });
  });

  describe('markProductAsSold', () => {
    it('should mark a product as sold', async () => {
      const req = { user: { sub: 1 } };
      const saleProductDto: SaleProductDto = {
        salePrice: 150,
        saleDate: new Date(),
      };
      const updatedProduct = {
        ...mockProducts[0],
        sold: true,
        ...saleProductDto,
      };
      jest
        .spyOn(mockProductsService, 'markProductAsSold')
        .mockResolvedValue(updatedProduct);

      expect(
        await controller.markProductAsSold(
          req,
          updatedProduct.id,
          saleProductDto,
        ),
      ).toBe(updatedProduct);
      expect(mockProductsService.markProductAsSold).toHaveBeenCalledWith(
        updatedProduct.id,
        1,
        saleProductDto,
      );
    });
  });

  describe('markProductAsUnsold', () => {
    it('should mark a product as unsold', async () => {
      const req = { user: { sub: 1 } };
      const updatedProduct = {
        ...mockProducts[0],
        sold: false,
        salePrice: null,
        saleDate: null,
      };
      jest
        .spyOn(mockProductsService, 'markProductAsUnsold')
        .mockResolvedValue(updatedProduct);

      expect(await controller.markProductAsUnsold(req, updatedProduct.id)).toBe(
        updatedProduct,
      );
      expect(mockProductsService.markProductAsUnsold).toHaveBeenCalledWith(
        updatedProduct.id,
        1,
      );
    });
  });

  describe('updateProduct', () => {
    it('should update and return the product', async () => {
      const req = { user: { sub: 1 } };
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
      };
      const updatedProduct = { ...mockProducts[0], ...updateProductDto };
      jest
        .spyOn(mockProductsService, 'updateProduct')
        .mockResolvedValue(updatedProduct);

      expect(
        await controller.updateProduct(
          req,
          updatedProduct.id,
          updateProductDto,
        ),
      ).toBe(updatedProduct);
      expect(mockProductsService.updateProduct).toHaveBeenCalledWith(
        updatedProduct.id,
        1,
        updateProductDto,
      );
    });
  });

  describe('deleteProduct', () => {
    it('should delete the product', async () => {
      const req = { user: { sub: 1 } };
      const productId = mockProducts[0].id;
      jest
        .spyOn(mockProductsService, 'deleteProduct')
        .mockResolvedValue(undefined);

      expect(await controller.deleteProduct(req, productId)).toBeUndefined();
      expect(mockProductsService.deleteProduct).toHaveBeenCalledWith(
        productId,
        1,
      );
    });
  });
});
