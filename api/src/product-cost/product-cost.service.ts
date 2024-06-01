import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCost } from './product-cost.entity';
import { ProductCostDto } from './dtos/product-cost.dto';
import { ProductCostMapper } from './product-cost.mapper';
import { CreateProductCostDto } from './dtos/create-product-cost.dto';
import { CostType } from 'src/cost-type/cost-type.entity';
import { Product } from 'src/products/product.enity';
import { UpdateProductCostDto } from './dtos/update-product-cost.dto';

@Injectable()
export class ProductCostService {
  constructor(
    @InjectRepository(ProductCost)
    private productCostRepository: Repository<ProductCost>,
    @InjectRepository(CostType)
    private costTypeRepository: Repository<CostType>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getAllProductCosts(productId: number): Promise<ProductCostDto[]> {
    const productCosts = await this.productCostRepository.find({
      where: { product: { id: productId } },
      relations: ['costType'],
    });

    return productCosts.map((productCost) => {
      return ProductCostMapper.toDto(productCost);
    });
  }

  async getCostById(costId: number): Promise<ProductCostDto> {
    const productCost = await this.productCostRepository.findOne({
      where: { id: costId },
      relations: ['costType'],
    });

    if (!productCost) {
      throw new NotFoundException(`Cost with ID ${costId} not found`);
    }

    return ProductCostMapper.toDto(productCost);
  }

  async createProductCost(
    createCostDto: CreateProductCostDto,
  ): Promise<ProductCostDto> {
    const product = await this.productRepository.findOneBy({
      id: createCostDto.productId,
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${createCostDto.productId} not found`,
      );
    }

    const productCostType = await this.costTypeRepository.findOneBy({
      id: createCostDto.costTypeId,
    });
    if (!productCostType) {
      throw new NotFoundException(
        `Cost Type with ID ${createCostDto.costTypeId} not found`,
      );
    }

    const newProductCost = this.productCostRepository.create({
      ...createCostDto,
      product,
      costType: productCostType,
    });

    const savedProductCost =
      await this.productCostRepository.save(newProductCost);

    return ProductCostMapper.toDto(savedProductCost);
  }

  async updateProductCost(
    costId: number,
    updateProductCostDto: UpdateProductCostDto,
  ): Promise<ProductCostDto> {
    const productCost = await this.productCostRepository.findOneBy({
      id: costId,
    });

    if (!productCost) {
      throw new NotFoundException(`Cost with ID ${costId} not found`);
    }

    Object.assign(productCost, updateProductCostDto);

    const updatedProductCost =
      await this.productCostRepository.save(productCost);
    return ProductCostMapper.toDto(updatedProductCost);
  }

  async deleteProductCost(costId: number): Promise<void> {
    const result = await this.productCostRepository.delete(costId);

    if (result.affected === 0) {
      throw new NotFoundException(`Cost with ID ${costId} not found`);
    }
  }
}
