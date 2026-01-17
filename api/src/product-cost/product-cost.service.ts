import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCost } from './product-cost.entity';
import { ProductCostDto } from './dtos/product-cost.dto';
import { ProductCostMapper } from './product-cost.mapper';
import { CreateProductCostDto } from './dtos/create-product-cost.dto';
import { CostType } from '../cost-type/cost-type.entity';
import { Product } from '../products/product.entity';
import { UpdateProductCostDto } from './dtos/update-product-cost.dto';
import { Logger } from '@kacper2076/logger-client';

@Injectable()
export class ProductCostService {
  private readonly logger = new Logger(ProductCostService.name);

  constructor(
    @InjectRepository(ProductCost)
    private productCostRepository: Repository<ProductCost>,
    @InjectRepository(CostType)
    private costTypeRepository: Repository<CostType>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getAllProductCosts(
    productId: number,
    userId: number,
  ): Promise<ProductCostDto[]> {
    this.logger.info('Getting all costs for product', { productId, userId });

    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['user'],
    });

    if (!product) {
      this.logger.warn('Product not found', { productId });
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    if (product.user.id !== userId) {
      this.logger.warn(
        'User does not have permission to access product costs',
        { productId, userId },
      );
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    const productCosts = await this.productCostRepository.find({
      where: { product: { id: productId } },
      relations: ['costType'],
    });

    return productCosts.map((productCost) =>
      ProductCostMapper.toDto(productCost),
    );
  }

  async getCostById(costId: number, userId: number): Promise<ProductCostDto> {
    this.logger.info('Getting cost by ID', { costId, userId });

    const productCost = await this.productCostRepository.findOne({
      where: { id: costId },
      relations: ['costType', 'product'],
    });
    if (!productCost) {
      this.logger.warn('Cost not found', { costId });
      throw new NotFoundException(`Cost with ID ${costId} not found`);
    }
    if (productCost.product.user.id !== userId) {
      this.logger.warn('User does not have permission to access cost', {
        costId,
        userId,
      });
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return ProductCostMapper.toDto(productCost);
  }

  async createProductCost(
    createCostDto: CreateProductCostDto,
    userId: number,
  ): Promise<ProductCostDto> {
    this.logger.info('Creating product cost', {
      productId: createCostDto.productId,
      userId,
    });

    const product = await this.getProductById(createCostDto.productId);
    if (product.user.id !== userId) {
      this.logger.warn('User does not have permission to add cost to product', {
        productId: createCostDto.productId,
        userId,
      });
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }
    const costType = await this.getCostTypeById(createCostDto.costTypeId);
    const newProductCost = this.productCostRepository.create({
      ...createCostDto,
      product,
      costType,
    });
    const savedProductCost =
      await this.productCostRepository.save(newProductCost);

    this.logger.info('Product cost created successfully', {
      costId: savedProductCost.id,
      productId: createCostDto.productId,
    });

    return ProductCostMapper.toDto(savedProductCost);
  }

  async updateProductCost(
    costId: number,
    updateProductCostDto: UpdateProductCostDto,
    userId: number,
  ): Promise<ProductCostDto> {
    this.logger.info('Updating product cost', { costId, userId });

    const productCost = await this.productCostRepository.findOne({
      where: { id: costId },
      relations: ['costType', 'product'],
    });

    if (!productCost) {
      this.logger.warn('Cost not found for update', { costId });
      throw new NotFoundException(`Cost with ID ${costId} not found`);
    }

    if (productCost.product.user.id !== userId) {
      this.logger.warn('User does not have permission to update cost', {
        costId,
        userId,
      });
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    Object.assign(productCost, updateProductCostDto);
    const updatedProductCost =
      await this.productCostRepository.save(productCost);

    this.logger.info('Product cost updated successfully', { costId });

    return ProductCostMapper.toDto(updatedProductCost);
  }

  async deleteProductCost(costId: number, userId: number): Promise<void> {
    this.logger.info('Deleting product cost', { costId, userId });

    const productCost = await this.productCostRepository.findOne({
      where: { id: costId },
      relations: ['product', 'product.user'],
    });

    if (!productCost) {
      this.logger.warn('Cost not found for deletion', { costId });
      throw new NotFoundException(`Cost with ID ${costId} not found`);
    }

    if (productCost.product.user.id !== userId) {
      this.logger.warn('User does not have permission to delete cost', {
        costId,
        userId,
      });
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    await this.productCostRepository.delete(costId);
    this.logger.info('Product cost deleted successfully', { costId });
  }

  private async getProductById(productId: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({
      id: productId,
    });

    if (!product) {
      this.logger.warn('Product not found', { productId });
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    return product;
  }

  private async getCostTypeById(costTypeId: number): Promise<CostType> {
    const costType = await this.costTypeRepository.findOneBy({
      id: costTypeId,
    });
    if (!costType) {
      this.logger.warn('Cost type not found', { costTypeId });
      throw new NotFoundException(`Cost Type with ID ${costTypeId} not found`);
    }
    return costType;
  }
}
