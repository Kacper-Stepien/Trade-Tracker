import { mockProducts } from './../products/products.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductAttributeService } from '../../src/product-attribute/product-attribute.service';
import { Repository } from 'typeorm';
import { ProductAttribute } from '../../src/product-attribute/product-attribute.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../../src/products/product.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateProductAttributeDto } from '../../src/product-attribute/dtos/create-product-attribute.dto';
import { UpdateProductAttributeDto } from '../../src/product-attribute/dtos/update-product-attribute.dto';
import { ProductAttributeMapper } from '../../src/product-attribute/product-attribute.mapper';

import { mockProductAttributes } from './product-attribute.mock';
import { mockProductRepository } from '../products/products.repository.mock';
import { mockProductAttributeRepository } from './product-attribute.repository.mock';

describe('ProductAttributeService', () => {
  let service: ProductAttributeService;
  let productRepository: Repository<Product>;
  let repository: Repository<ProductAttribute>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductAttributeService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(ProductAttribute),
          useValue: mockProductAttributeRepository,
        },
      ],
    }).compile();

    service = module.get<ProductAttributeService>(ProductAttributeService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    repository = module.get<Repository<ProductAttribute>>(
      getRepositoryToken(ProductAttribute),
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAttribute', () => {
    const mockProduct = mockProducts[0];
    const createProductAttributeDto: CreateProductAttributeDto = {
      name: mockProductAttributes[0].name,
      value: mockProductAttributes[0].value,
    };

    it('should create a new product attribute', async () => {
      jest
        .spyOn(service, 'validateProductOwnership')
        .mockResolvedValue(mockProduct);
      jest
        .spyOn(repository, 'create')
        .mockReturnValue(mockProductAttributes[0]);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue(mockProductAttributes[0]);

      const result = await service.createAttribute(
        createProductAttributeDto,
        mockProduct.id,
        1,
      );

      expect(result).toEqual(
        ProductAttributeMapper.toDto(mockProductAttributes[0]),
      );
      expect(repository.create).toHaveBeenCalledWith({
        ...createProductAttributeDto,
        product: mockProduct,
      });
      expect(repository.save).toHaveBeenCalledWith(mockProductAttributes[0]);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      const mockProduct = mockProducts[0];
      const createProductAttributeDto: CreateProductAttributeDto = {
        name: mockProductAttributes[0].name,
        value: mockProductAttributes[0].value,
      };
      jest
        .spyOn(service, 'validateProductOwnership')
        .mockRejectedValue(new NotFoundException());

      await expect(
        service.createAttribute(createProductAttributeDto, mockProduct.id, 1),
      ).rejects.toThrow(NotFoundException);

      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user does not own the product', async () => {
      const mockProduct = mockProducts[0];
      const createProductAttributeDto: CreateProductAttributeDto = {
        name: mockProductAttributes[0].name,
        value: mockProductAttributes[0].value,
      };
      jest
        .spyOn(service, 'validateProductOwnership')
        .mockRejectedValue(new ForbiddenException());

      await expect(
        service.createAttribute(createProductAttributeDto, mockProduct.id, 1),
      ).rejects.toThrow(ForbiddenException);

      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('getProductAttributes', () => {
    it('should return all attributes of a product', async () => {
      const mockProduct = mockProducts[0];
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(mockProduct);
      jest.spyOn(repository, 'find').mockResolvedValue(mockProductAttributes);

      const result = await service.getProductAttributes(mockProduct.id);

      expect(result).toEqual(
        mockProductAttributes.map(ProductAttributeMapper.toDto),
      );
      expect(mockProductRepository.findOneBy).toHaveBeenCalledWith({
        id: mockProduct.id,
      });
      expect(mockProductAttributeRepository.find).toHaveBeenCalledWith({
        where: { product: mockProduct },
      });
    });

    it('should throw NotFoundException if product does not exist', async () => {
      const mockProduct = mockProducts[0];
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(undefined);
      await expect(
        service.getProductAttributes(mockProduct.id),
      ).rejects.toThrow(NotFoundException);
      expect(mockProductAttributeRepository.find).not.toHaveBeenCalled();
    });
  });

  describe('updateProductAttribute', () => {
    it('should update an attribute of a product', async () => {
      const mockProduct: Product = {
        ...mockProducts[0],
        attributes: mockProductAttributes,
      };
      const productId = mockProduct.id;
      const userId = mockProduct.user.id;
      const attributeId = mockProduct.attributes[0].id;

      const updateProductAttributeDto: UpdateProductAttributeDto = {
        name: 'Updated Attribute',
        value: 'Updated Value',
      };
      jest
        .spyOn(service, 'validateProductOwnership')
        .mockResolvedValue(mockProduct);
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(mockProduct);
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(mockProductAttributes[0]);

      const updatedAttribute = {
        ...mockProductAttributes[0],
        ...updateProductAttributeDto,
      };

      jest.spyOn(repository, 'save').mockResolvedValue(updatedAttribute);

      const result = await service.updateProductAttribute(
        productId,
        attributeId,
        updateProductAttributeDto,
        userId,
      );

      expect(result).toEqual(ProductAttributeMapper.toDto(updatedAttribute));
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(updatedAttribute);
    });

    it('should throw NotFoundException if attribute does not exist', async () => {
      const mockProduct: Product = {
        ...mockProducts[0],
        attributes: mockProductAttributes,
      };
      jest
        .spyOn(service, 'validateProductOwnership')
        .mockResolvedValue(mockProduct);
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(
        service.updateProductAttribute(
          mockProduct.id,
          999,
          { name: 'Updated', value: 'Updated' },
          1,
        ),
      ).rejects.toThrow(NotFoundException);
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('deleteProductAttribute', () => {
    it('should delete an attribute of a product', async () => {
      const mockProduct: Product = {
        ...mockProducts[0],
        attributes: mockProductAttributes,
      };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(mockProductAttributes[0]);

      jest
        .spyOn(service, 'validateProductOwnership')
        .mockResolvedValue(mockProduct);

      await service.deleteProductAttribute(
        mockProduct.id,
        mockProductAttributes[0].id,
        1,
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: mockProductAttributes[0].id, product: mockProduct },
      });
      expect(repository.remove).toHaveBeenCalledWith(mockProductAttributes[0]);
    });

    it('should throw NotFoundException if attribute does not exist', async () => {
      const mockProduct: Product = {
        ...mockProducts[0],
        attributes: mockProductAttributes,
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      jest
        .spyOn(service, 'validateProductOwnership')
        .mockResolvedValue(mockProduct);

      await expect(
        service.deleteProductAttribute(mockProduct.id, 999, 1),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('validateProductOwnership', () => {
    it('should validate product ownership', async () => {
      const mockProduct: Product = {
        ...mockProducts[0],
        attributes: mockProductAttributes,
      };
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(mockProduct);

      const result = await service.validateProductOwnership(
        mockProduct.id,
        mockProduct.user.id,
      );

      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

      await expect(
        service.validateProductOwnership(undefined, 1),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own the product', async () => {
      const mockProduct: Product = {
        ...mockProducts[0],
        attributes: mockProductAttributes,
      };
      const anotherUserProduct = {
        ...mockProduct,
        user: { ...mockProduct.user, id: 100 },
      };
      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(anotherUserProduct);

      await expect(
        service.validateProductOwnership(mockProduct.id, 1),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('validateProductAttributeExistence', () => {
    it('should validate product attribute existence', async () => {
      const result = service.validateProductAttributeExistence(
        mockProductAttributes[0],
      );
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException if product attribute does not exist', async () => {
      expect(() =>
        service.validateProductAttributeExistence(undefined),
      ).toThrow(NotFoundException);
    });
  });
});
