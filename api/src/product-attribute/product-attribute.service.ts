import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductAttribute } from './product-attribute.entity';
import { Product } from '../products/product.enity';
import { CreateProductAttributeDto } from './dtos/create-product-attribute.dto';
import { UpdateProductAttributeDto } from './dtos/update-product-attribute.dto';
import { ProductAttributeDto } from './dtos/product-attribute.dto';
import { ProductAttributeMapper } from './product-attribute.mapper';

@Injectable()
export class ProductAttributeService {
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
    const product = await this.validateProductOwnership(productId, userId);
    const attribute = this.productAttributeRepository.create({
      ...createProductAttributeDto,
      product,
    });
    return ProductAttributeMapper.toDto(
      await this.productAttributeRepository.save(attribute),
    );
  }

  async getProductAttributes(
    productId: number,
  ): Promise<ProductAttributeDto[]> {
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    const attributes = await this.productAttributeRepository.find({
      where: { product },
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
    const product = await this.validateProductOwnership(productId, userId);
    const attribute = await this.productAttributeRepository.findOne({
      where: { id: attributeId, product },
    });
    await this.validateProductAttributeExistence(attribute);
    attribute.name = updateProductAttributeDto.name;
    attribute.value = updateProductAttributeDto.value;
    return ProductAttributeMapper.toDto(
      await this.productAttributeRepository.save(attribute),
    );
  }

  async deleteProductAttribute(
    productId: number,
    attributeId: number,
    userId: number,
  ): Promise<void> {
    const product = await this.validateProductOwnership(productId, userId);
    const attribute = await this.productAttributeRepository.findOne({
      where: { id: attributeId, product },
    });
    await this.validateProductAttributeExistence(attribute);
    await this.productAttributeRepository.remove(attribute);
  }

  async validateProductOwnership(
    productId: number,
    userId: number,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['user'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    if (product.user.id !== userId) {
      throw new ForbiddenException(
        `Product with ID ${productId} does not belong to user with ID ${userId}`,
      );
    }
    return product;
  }

  async validateProductAttributeExistence(
    productAttribute: ProductAttribute | undefined,
  ) {
    if (!productAttribute) {
      throw new NotFoundException(`Product not found`);
    }
  }
}
