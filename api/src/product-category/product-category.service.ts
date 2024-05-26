import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductCategory } from './product-category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
  ) {}

  private async validateCategoryExistence(
    id: number,
  ): Promise<ProductCategory> {
    const category = await this.productCategoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async findAllCategories(): Promise<ProductCategory[]> {
    return this.productCategoryRepository.find();
  }

  async findCategoryById(id: number): Promise<ProductCategory> {
    const category = await this.validateCategoryExistence(id);
    return category;
  }

  async createCategory(name: string): Promise<ProductCategory> {
    const categoryExists = await this.productCategoryRepository.findOneBy({
      name,
    });
    if (categoryExists) {
      throw new ConflictException(`Category with name ${name} already exists`);
    }
    const category = this.productCategoryRepository.create({ name });
    return this.productCategoryRepository.save(category);
  }

  async updateCategory(id: number, name: string): Promise<ProductCategory> {
    const category = await this.validateCategoryExistence(id);
    const categoryExists = await this.productCategoryRepository.findOne({
      where: { name },
      select: ['id'],
    });
    if (!categoryExists || categoryExists.id !== id) {
      throw new ConflictException(`Category with name ${name} already exists`);
    }

    category.name = name;
    return this.productCategoryRepository.save(category);
  }

  async deleteCategory(id: number): Promise<void> {
    const category = await this.validateCategoryExistence(id);
    await this.productCategoryRepository.remove(category);
  }
}
