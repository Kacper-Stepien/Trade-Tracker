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
import { Product } from 'src/products/product.entity';

@Injectable()
export class ProductCategoryService {
  private readonly logger = new Logger(ProductCategoryService.name);

  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAllCategories(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ categories: ProductCategoryDto[]; total: number }> {
    this.logger.info('Finding all categories for user', {
      userId,
      page,
      limit,
    });

    const query = this.productCategoryRepository
      .createQueryBuilder('category')
      .where('category.userId = :userId', { userId })
      .loadRelationCountAndMap('category.productsCount', 'category.products')
      .orderBy('category.id', 'DESC');

    query.skip((page - 1) * limit).take(limit);
    const [categories, total] = await query.getManyAndCount();

    return { categories: ProductCategoryMapper.toDtoList(categories), total };
  }

  async findCategoryById(
    id: number,
    userId: number,
  ): Promise<ProductCategoryDto> {
    const category = await this.productCategoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.user', 'user')
      .where('category.id = :id', { id })
      .andWhere('category.userId = :userId', { userId })
      .loadRelationCountAndMap('category.productsCount', 'category.products')
      .getOne();

    if (!category) {
      this.logger.warn('Category not found', { categoryId: id });
      throw new NotFoundException({
        message: `Category with ID ${id} not found`,
        code: ApiErrorCode.NOT_FOUND,
      });
    }

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
    const productsCount = await this.productRepository.count({
      where: { category: { id } },
    });
    if (productsCount > 0) {
      throw new ConflictException({
        message: 'Cannot delete category with assigned products',
        code: ApiErrorCode.CATEGORY_HAS_PRODUCTS,
      });
    }

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
      throw new NotFoundException({
        message: `Category with ID ${id} not found`,
        code: ApiErrorCode.NOT_FOUND,
      });
    }

    if (category.user.id !== userId) {
      this.logger.warn('User does not have permission to access category', {
        categoryId: id,
        userId,
      });
      throw new ForbiddenException({
        message: 'You do not have permission to access this resource',
        code: ApiErrorCode.FORBIDDEN,
      });
    }

    return category;
  }
}
