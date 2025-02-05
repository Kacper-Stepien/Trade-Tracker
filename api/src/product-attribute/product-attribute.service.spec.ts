import { Test, TestingModule } from '@nestjs/testing';
import { ProductAttributeService } from './product-attribute.service';
import { Repository } from 'typeorm';
import { ProductAttribute } from './product-attribute.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../products/product.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateProductAttributeDto } from './dtos/create-product-attribute.dto';
import { UpdateProductAttributeDto } from './dtos/update-product-attribute.dto';
import { ProductAttributeMapper } from './product-attribute.mapper';
import { Role } from '../users/role.enum';

const mockProductAttributes = [
  {
    id: 1,
    name: 'Attribute 1',
    value: 'Value 1',
    product: null,
  },
  {
    id: 2,
    name: 'Attribute 2',
    value: 'Value 2',
    product: null,
  },
];

const mockUser = {
  id: 1,
  name: 'Kacper',
  surname: 'Stepien',
  email: 'kacper@gmail.com',
  password: 'password',
  dateOfBirth: new Date(),
  isProfessional: false,
  products: [],
  role: Role.USER,
};

const mockProduct: Product = {
  id: 1,
  name: 'Product 1',
  purchasePrice: 100,
  purchaseDate: new Date(),
  sold: false,
  salePrice: null,
  saleDate: null,
  user: mockUser,
  category: null,
  attributes: mockProductAttributes,
  costs: [],
};

describe('ProductAttributeService', () => {
  let service: ProductAttributeService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let productRepository: Repository<Product>;
  let repository: Repository<ProductAttribute>;

  const mockProductAttributeRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  };

  const mockProductRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
  };

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAttribute', () => {
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

      const createProductAttributeDto: CreateProductAttributeDto = {
        name: 'Attribute 1',
        value: 'Value 1',
      };

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
  });

  describe('getProductAttributes', () => {
    it('should return all attributes of a product', async () => {
      mockProductRepository.findOneBy.mockResolvedValue(mockProduct);
      mockProductAttributeRepository.find.mockResolvedValue(
        mockProductAttributes,
      );

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
      mockProductRepository.findOneBy.mockResolvedValue(undefined);

      await expect(
        service.getProductAttributes(mockProduct.id),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProductAttribute', () => {
    it('should update an attribute of a product', async () => {
      const updateProductAttributeDto: UpdateProductAttributeDto = {
        name: 'Updated Attribute',
        value: 'Updated Value',
      };

      mockProductAttributeRepository.findOne.mockResolvedValue(
        mockProductAttributes[0],
      );
      jest
        .spyOn(service, 'validateProductOwnership')
        .mockResolvedValue(mockProduct);

      const updatedAttribute = {
        ...mockProductAttributes[0],
        ...updateProductAttributeDto,
      };

      mockProductAttributeRepository.save.mockResolvedValue(updatedAttribute);

      const result = await service.updateProductAttribute(
        mockProduct.id,
        mockProductAttributes[0].id,
        updateProductAttributeDto,
        1,
      );

      expect(result).toEqual(ProductAttributeMapper.toDto(updatedAttribute));
      expect(mockProductAttributeRepository.save).toHaveBeenCalledWith(
        updatedAttribute,
      );
    });

    it('should throw NotFoundException if attribute does not exist', async () => {
      mockProductAttributeRepository.findOne.mockResolvedValue(undefined);
      jest
        .spyOn(service, 'validateProductOwnership')
        .mockResolvedValue(mockProduct);

      await expect(
        service.updateProductAttribute(
          mockProduct.id,
          999,
          { name: 'Updated', value: 'Updated' },
          1,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteProductAttribute', () => {
    it('should delete an attribute of a product', async () => {
      mockProductAttributeRepository.findOne.mockResolvedValue(
        mockProductAttributes[0],
      );
      jest
        .spyOn(service, 'validateProductOwnership')
        .mockResolvedValue(mockProduct);

      const removeSpy = jest
        .spyOn(mockProductAttributeRepository, 'remove')
        .mockResolvedValue(undefined);

      await service.deleteProductAttribute(
        mockProduct.id,
        mockProductAttributes[0].id,
        1,
      );

      expect(removeSpy).toHaveBeenCalledWith(mockProductAttributes[0]);
    });

    it('should throw NotFoundException if attribute does not exist', async () => {
      mockProductAttributeRepository.findOne.mockResolvedValue(undefined);
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
      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      const result = await service.validateProductOwnership(mockProduct.id, 1);

      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockProductRepository.findOne.mockResolvedValue(undefined);

      await expect(
        service.validateProductOwnership(mockProduct.id, 1),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own the product', async () => {
      const anotherUserProduct = {
        ...mockProduct,
        user: { ...mockUser, id: 2 },
      };
      mockProductRepository.findOne.mockResolvedValue(anotherUserProduct);

      await expect(
        service.validateProductOwnership(mockProduct.id, 1),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('validateProductAttributeExistence', () => {
    it('should validate product attribute existence', async () => {
      await expect(
        service.validateProductAttributeExistence(mockProductAttributes[0]),
      ).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if product attribute does not exist', async () => {
      await expect(
        service.validateProductAttributeExistence(undefined),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
