import { Test, TestingModule } from '@nestjs/testing';
import { ProductAttributeController } from './product-attribute.controller';
import { ProductAttributeService } from './product-attribute.service';
import { CreateProductAttributeDto } from './dtos/create-product-attribute.dto';
import { UpdateProductAttributeDto } from './dtos/update-product-attribute.dto';
import { ProductAttributeDto } from './dtos/product-attribute.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductAttributeController', () => {
  let controller: ProductAttributeController;
  let service: ProductAttributeService;

  const mockProductAttributeService = {
    createAttribute: jest.fn(),
    updateProductAttribute: jest.fn(),
    deleteProductAttribute: jest.fn(),
  };

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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createAttribute', () => {
    it('should create a new product attribute', async () => {
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
    });

    it('should throw NotFoundException if product does not exist', async () => {
      const createProductAttributeDto: CreateProductAttributeDto = {
        name: 'Attribute 1',
        value: 'Value 1',
      };
      const productId = 1;
      const userId = 1;
      const req = { user: { sub: userId } };

      jest
        .spyOn(service, 'createAttribute')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.createAttribute(createProductAttributeDto, productId, req),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateAttribute', () => {
    it('should update a product attribute', async () => {
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
    });

    it('should throw NotFoundException if product or attribute does not exist', async () => {
      const updateProductAttributeDto: UpdateProductAttributeDto = {
        name: 'Updated Attribute',
        value: 'Updated Value',
      };
      const productId = 1;
      const attributeId = 1;
      const userId = 1;
      const req = { user: { sub: userId } };

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
    });
  });

  describe('deleteAttribute', () => {
    it('should delete a product attribute', async () => {
      const productId = 1;
      const attributeId = 1;
      const userId = 1;
      const req = { user: { sub: userId } };

      jest
        .spyOn(service, 'deleteProductAttribute')
        .mockResolvedValue(undefined);

      await controller.deleteAttribute(productId, attributeId, req);

      expect(service.deleteProductAttribute).toHaveBeenCalledWith(
        productId,
        attributeId,
        userId,
      );
    });

    it('should throw NotFoundException if product or attribute does not exist', async () => {
      const productId = 1;
      const attributeId = 1;
      const userId = 1;
      const req = { user: { sub: userId } };

      jest
        .spyOn(service, 'deleteProductAttribute')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.deleteAttribute(productId, attributeId, req),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
