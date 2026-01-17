import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductCategory } from './product-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductCategoryDto } from './dtos/create-product-category.dto';
import { UpdateProductCategoryDto } from './dtos/update-product-category.dto';
import { ProductCategoryDto } from './dtos/product-category.dto';
import { ProductCategoryMapper } from './product-category.mapper';
import { Logger } from '@kacper2076/logger-client';

@Injectable()
export class ProductCategoryService {
  private readonly logger = new Logger(ProductCategoryService.name);

  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async findAllCategories(): Promise<ProductCategoryDto[]> {
    const categories = await this.productCategoryRepository.find();
    return ProductCategoryMapper.toDtoList(categories);
  }

  async findCategoryById(id: number): Promise<ProductCategoryDto> {
    const category = await this.getCategoryById(id);
    return ProductCategoryMapper.toDto(category);
  }

  async createCategory(
    createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<ProductCategoryDto> {
    const { name } = createProductCategoryDto;
    this.logger.info('Creating product category', { name });

    const categoryExists = await this.productCategoryRepository.findOneBy({
      name,
    });
    if (categoryExists) {
      this.logger.warn('Category with this name already exists', { name });
      throw new ConflictException(`Category with name ${name} already exists`);
    }
    const category = this.productCategoryRepository.create({ name });
    await this.productCategoryRepository.save(category);
    this.logger.info('Product category created successfully', {
      categoryId: category.id,
      name,
    });

    return ProductCategoryMapper.toDto(category);
  }

  async updateCategory(
    id: number,
    updateProductCategoryDto: UpdateProductCategoryDto,
  ): Promise<ProductCategoryDto> {
    const { name } = updateProductCategoryDto;
    this.logger.info('Updating product category', { categoryId: id, name });

    const category = await this.getCategoryById(id);
    const categoryExists = await this.productCategoryRepository.findOne({
      where: { name },
      select: ['id'],
    });
    if (categoryExists && categoryExists.id && categoryExists.id !== id) {
      this.logger.warn('Category with this name already exists', { name });
      throw new ConflictException(`Category with name ${name} already exists`);
    }

    category.name = name;
    await this.productCategoryRepository.save(category);
    this.logger.info('Product category updated successfully', {
      categoryId: id,
    });

    return ProductCategoryMapper.toDto(category);
  }

  async deleteCategory(id: number): Promise<void> {
    this.logger.info('Deleting product category', { categoryId: id });

    const result = await this.productCategoryRepository.delete(id);
    if (result.affected === 0) {
      this.logger.warn('Category not found for deletion', { categoryId: id });
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    this.logger.info('Product category deleted successfully', {
      categoryId: id,
    });
  }

  private async getCategoryById(id: number): Promise<ProductCategory> {
    const category = await this.productCategoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      this.logger.warn('Category not found', { categoryId: id });
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }
}
