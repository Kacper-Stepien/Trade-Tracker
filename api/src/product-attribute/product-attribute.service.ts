import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductAttribute } from './product-attribute.entity';
import { Product } from '../products/product.entity';
import { CreateProductAttributeDto } from './dtos/create-product-attribute.dto';
import { UpdateProductAttributeDto } from './dtos/update-product-attribute.dto';
import { ProductAttributeDto } from './dtos/product-attribute.dto';
import { ProductAttributeMapper } from './product-attribute.mapper';
import { Logger } from '@kacper2076/logger-client';

@Injectable()
export class ProductAttributeService {
  private readonly logger = new Logger(ProductAttributeService.name);

  constructor(
    @InjectRepository(ProductAttribute)
    private productAttributeRepository: Repository<ProductAttribute>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createAttribute(
    createProductAttributeDto: CreateProductAttributeDto,
    productId: number,
    userId: number,
  ): Promise<ProductAttributeDto> {
    this.logger.info('Creating product attribute', { productId, userId });

    const product = await this.validateProductOwnership(productId, userId);
    const attribute = this.productAttributeRepository.create({
      ...createProductAttributeDto,
      product,
    });
    const savedAttribute =
      await this.productAttributeRepository.save(attribute);

    this.logger.info('Product attribute created successfully', {
      attributeId: savedAttribute.id,
      productId,
    });

    return ProductAttributeMapper.toDto(savedAttribute);
  }

  async getProductAttributes(
    productId: number,
  ): Promise<ProductAttributeDto[]> {
    this.logger.info('Getting product attributes', { productId });

    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      this.logger.warn('Product not found', { productId });
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    const attributes = await this.productAttributeRepository.find({
      where: { product: { id: productId } },
    });
    return attributes.map((attribute) =>
      ProductAttributeMapper.toDto(attribute),
    );
  }

  async updateProductAttribute(
    productId: number,
    attributeId: number,
    updateProductAttributeDto: UpdateProductAttributeDto,
    userId: number,
  ): Promise<ProductAttributeDto> {
    this.logger.info('Updating product attribute', {
      productId,
      attributeId,
      userId,
    });

    await this.validateProductOwnership(productId, userId);
    const attribute = await this.productAttributeRepository.findOne({
      where: { id: attributeId, product: { id: productId } },
    });
    this.validateProductAttributeExistence(attribute, attributeId);
    attribute.name = updateProductAttributeDto.name;
    attribute.value = updateProductAttributeDto.value;
    const updatedAttribute =
      await this.productAttributeRepository.save(attribute);

    this.logger.info('Product attribute updated successfully', { attributeId });

    return ProductAttributeMapper.toDto(updatedAttribute);
  }

  async deleteProductAttribute(
    productId: number,
    attributeId: number,
    userId: number,
  ): Promise<void> {
    this.logger.info('Deleting product attribute', {
      productId,
      attributeId,
      userId,
    });

    await this.validateProductOwnership(productId, userId);
    const attribute = await this.productAttributeRepository.findOne({
      where: { id: attributeId, product: { id: productId } },
    });
    this.validateProductAttributeExistence(attribute, attributeId);
    await this.productAttributeRepository.remove(attribute);

    this.logger.info('Product attribute deleted successfully', { attributeId });
  }

  private async validateProductOwnership(
    productId: number,
    userId: number,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['user'],
    });
    if (!product) {
      this.logger.warn('Product not found', { productId });
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    if (product.user.id !== userId) {
      this.logger.warn('User does not have permission to access product', {
        productId,
        userId,
      });
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }
    return product;
  }

  private validateProductAttributeExistence(
    productAttribute: ProductAttribute | undefined,
    attributeId: number,
  ): asserts productAttribute is ProductAttribute {
    if (!productAttribute) {
      this.logger.warn('Product attribute not found', { attributeId });
      throw new NotFoundException(
        `Product attribute with ID ${attributeId} not found`,
      );
    }
  }
}
