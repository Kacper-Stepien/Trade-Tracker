import { ProductCategory } from './product-category.entity';
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto } from './dtos/create-product-category.dto';
import { UpdateProductCategoryDto } from './dtos/update-product-cateogory.dto';

@Controller('product-categories')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Get()
  async getAllCategories(): Promise<ProductCategory[]> {
    return this.productCategoryService.findAllCategories();
  }

  @Get(':id')
  async getCategoryById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductCategory> {
    return await this.productCategoryService.findCategoryById(id);
  }

  @Post()
  async createCategory(
    @Body() createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<ProductCategory> {
    return await this.productCategoryService.createCategory(
      createProductCategoryDto.name,
    );
  }

  @Patch(':id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
  ): Promise<ProductCategory> {
    return await this.productCategoryService.updateCategory(
      id,
      updateProductCategoryDto.name,
    );
  }

  @Delete(':id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.productCategoryService.deleteCategory(id);
  }
}
