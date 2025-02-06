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

@Injectable()
export class ProductCategoryService {
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
    const categoryExists = await this.productCategoryRepository.findOneBy({
      name,
    });
    if (categoryExists) {
      throw new ConflictException(`Category with name ${name} already exists`);
    }
    const category = this.productCategoryRepository.create({ name });
    await this.productCategoryRepository.save(category);
    return ProductCategoryMapper.toDto(category);
  }

  async updateCategory(
    id: number,
    updateProductCategoryDto: UpdateProductCategoryDto,
  ): Promise<ProductCategoryDto> {
    const { name } = updateProductCategoryDto;
    const category = await this.getCategoryById(id);
    const categoryExists = await this.productCategoryRepository.findOne({
      where: { name },
      select: ['id'],
    });
    if (categoryExists && categoryExists.id && categoryExists.id !== id) {
      throw new ConflictException(`Category with name ${name} already exists`);
    }

    category.name = name;
    await this.productCategoryRepository.save(category);
    return ProductCategoryMapper.toDto(category);
  }

  async deleteCategory(id: number): Promise<void> {
    const result = await this.productCategoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }

  async getCategoryById(id: number): Promise<ProductCategory> {
    const category = await this.productCategoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }
}
