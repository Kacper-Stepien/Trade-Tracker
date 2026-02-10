import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductCategory } from './product-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductCategoryDto } from './dtos/create-product-category.dto';
import { UpdateProductCategoryDto } from './dtos/update-product-category.dto';
import { ProductCategoryDto } from './dtos/product-category.dto';
import { ProductCategoryMapper } from './product-category.mapper';
import { Logger } from '@kacper2076/logger-client';
import { ApiErrorCode } from 'src/common/constants/error-codes';

@Injectable()
export class ProductCategoryService {
  private readonly logger = new Logger(ProductCategoryService.name);

  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async findAllCategories(userId: number): Promise<ProductCategoryDto[]> {
    this.logger.info('Finding all categories for user', { userId });

    const categories = await this.productCategoryRepository.find({
      where: { user: { id: userId } },
    });
    return ProductCategoryMapper.toDtoList(categories);
  }

  async findCategoryById(
    id: number,
    userId: number,
  ): Promise<ProductCategoryDto> {
    const category = await this.getCategoryById(id, userId);
    return ProductCategoryMapper.toDto(category);
  }

  async createCategory(
    createProductCategoryDto: CreateProductCategoryDto,
    userId: number,
  ): Promise<ProductCategoryDto> {
    const { name } = createProductCategoryDto;
    this.logger.info('Creating product category', { name, userId });

    const categoryExists = await this.productCategoryRepository.findOne({
      where: { name, user: { id: userId } },
    });
    if (categoryExists) {
      this.logger.warn('Category with this name already exists for user', {
        name,
        userId,
      });
      throw new ConflictException({
        message: `Category with name "${name}" already exists`,
        code: ApiErrorCode.CATEGORY_ALREADY_EXISTS,
      });
    }

    const category = this.productCategoryRepository.create({
      name,
      user: { id: userId },
    });
    await this.productCategoryRepository.save(category);
    this.logger.info('Product category created successfully', {
      categoryId: category.id,
      name,
      userId,
    });

    return ProductCategoryMapper.toDto(category);
  }

  async updateCategory(
    id: number,
    updateProductCategoryDto: UpdateProductCategoryDto,
    userId: number,
  ): Promise<ProductCategoryDto> {
    const { name } = updateProductCategoryDto;
    this.logger.info('Updating product category', {
      categoryId: id,
      name,
      userId,
    });

    const category = await this.getCategoryById(id, userId);

    const categoryExists = await this.productCategoryRepository.findOne({
      where: { name, user: { id: userId } },
    });
    if (categoryExists && categoryExists.id !== id) {
      this.logger.warn('Category with this name already exists for user', {
        name,
        userId,
      });
      throw new ConflictException({
        message: `Category with name "${name}" already exists`,
        code: ApiErrorCode.CATEGORY_ALREADY_EXISTS,
      });
    }

    category.name = name;
    await this.productCategoryRepository.save(category);
    this.logger.info('Product category updated successfully', {
      categoryId: id,
      userId,
    });

    return ProductCategoryMapper.toDto(category);
  }

  async deleteCategory(id: number, userId: number): Promise<void> {
    this.logger.info('Deleting product category', { categoryId: id, userId });

    const category = await this.getCategoryById(id, userId);
    await this.productCategoryRepository.remove(category);

    this.logger.info('Product category deleted successfully', {
      categoryId: id,
      userId,
    });
  }

  async getCategoryById(id: number, userId: number): Promise<ProductCategory> {
    const category = await this.productCategoryRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!category) {
      this.logger.warn('Category not found', { categoryId: id });
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (category.user.id !== userId) {
      this.logger.warn('User does not have permission to access category', {
        categoryId: id,
        userId,
      });
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return category;
  }
}
