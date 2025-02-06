import { Test, TestingModule } from '@nestjs/testing';
import { ProductAttributeController } from '../../src/product-attribute/product-attribute.controller';
import { ProductAttributeService } from '../../src/product-attribute/product-attribute.service';
import { CreateProductAttributeDto } from '../../src/product-attribute/dtos/create-product-attribute.dto';
import { UpdateProductAttributeDto } from '../../src/product-attribute/dtos/update-product-attribute.dto';
import { ProductAttributeDto } from '../../src/product-attribute/dtos/product-attribute.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { mockProductAttributeService } from './product-attribute.service.mock';

describe('ProductAttributeController', () => {
  let controller: ProductAttributeController;
  let service: ProductAttributeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductAttributeController],
      providers: [
        {
          provide: ProductAttributeService,
          useValue: mockProductAttributeService,
        },
      ],
    }).compile();

    controller = module.get<ProductAttributeController>(
      ProductAttributeController,
    );
    service = module.get<ProductAttributeService>(ProductAttributeService);

    jest.clearAllMocks(); // 🛠️ Czyszczenie mocków przed każdym testem
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createAttribute', () => {
    const createProductAttributeDto: CreateProductAttributeDto = {
      name: 'Attribute 1',
      value: 'Value 1',
    };
    const productId = 1;
    const userId = 1;
    const req = { user: { sub: userId } };
    const result: ProductAttributeDto = {
      id: 1,
      name: 'Attribute 1',
      value: 'Value 1',
    };

    it('should create a new product attribute', async () => {
      jest.spyOn(service, 'createAttribute').mockResolvedValue(result);

      expect(
        await controller.createAttribute(
          createProductAttributeDto,
          productId,
          req,
        ),
      ).toEqual(result);

      expect(service.createAttribute).toHaveBeenCalledWith(
        createProductAttributeDto,
        productId,
        userId,
      );
      expect(service.createAttribute).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      jest
        .spyOn(service, 'createAttribute')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.createAttribute(createProductAttributeDto, productId, req),
      ).rejects.toThrow(NotFoundException);

      expect(service.createAttribute).toHaveBeenCalledTimes(1);
    });

    it('should throw ForbiddenException if user does not own the product', async () => {
      jest
        .spyOn(service, 'createAttribute')
        .mockRejectedValue(new ForbiddenException());

      await expect(
        controller.createAttribute(createProductAttributeDto, productId, req),
      ).rejects.toThrow(ForbiddenException);

      expect(service.createAttribute).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateAttribute', () => {
    const updateProductAttributeDto: UpdateProductAttributeDto = {
      name: 'Updated Attribute',
      value: 'Updated Value',
    };
    const productId = 1;
    const attributeId = 1;
    const userId = 1;
    const req = { user: { sub: userId } };
    const result: ProductAttributeDto = {
      id: 1,
      name: 'Updated Attribute',
      value: 'Updated Value',
    };

    it('should update a product attribute', async () => {
      jest.spyOn(service, 'updateProductAttribute').mockResolvedValue(result);

      expect(
        await controller.updateAttribute(
          updateProductAttributeDto,
          productId,
          attributeId,
          req,
        ),
      ).toEqual(result);

      expect(service.updateProductAttribute).toHaveBeenCalledWith(
        productId,
        attributeId,
        updateProductAttributeDto,
        userId,
      );
      expect(service.updateProductAttribute).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if product or attribute does not exist', async () => {
      jest
        .spyOn(service, 'updateProductAttribute')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.updateAttribute(
          updateProductAttributeDto,
          productId,
          attributeId,
          req,
        ),
      ).rejects.toThrow(NotFoundException);

      expect(service.updateProductAttribute).toHaveBeenCalledTimes(1);
    });

    it('should throw ForbiddenException if user does not own the product', async () => {
      jest
        .spyOn(service, 'updateProductAttribute')
        .mockRejectedValue(new ForbiddenException());

      await expect(
        controller.updateAttribute(
          updateProductAttributeDto,
          productId,
          attributeId,
          req,
        ),
      ).rejects.toThrow(ForbiddenException);

      expect(service.updateProductAttribute).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteAttribute', () => {
    const productId = 1;
    const attributeId = 1;
    const userId = 1;
    const req = { user: { sub: userId } };

    it('should delete a product attribute', async () => {
      jest
        .spyOn(service, 'deleteProductAttribute')
        .mockResolvedValue(undefined);

      await expect(
        controller.deleteAttribute(productId, attributeId, req),
      ).resolves.toBeUndefined();

      expect(service.deleteProductAttribute).toHaveBeenCalledWith(
        productId,
        attributeId,
        userId,
      );
      expect(service.deleteProductAttribute).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if product or attribute does not exist', async () => {
      jest
        .spyOn(service, 'deleteProductAttribute')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.deleteAttribute(productId, attributeId, req),
      ).rejects.toThrow(NotFoundException);

      expect(service.deleteProductAttribute).toHaveBeenCalledTimes(1);
    });

    it('should throw ForbiddenException if user does not own the product', async () => {
      jest
        .spyOn(service, 'deleteProductAttribute')
        .mockRejectedValue(new ForbiddenException());

      await expect(
        controller.deleteAttribute(productId, attributeId, req),
      ).rejects.toThrow(ForbiddenException);

      expect(service.deleteProductAttribute).toHaveBeenCalledTimes(1);
    });
  });
});
