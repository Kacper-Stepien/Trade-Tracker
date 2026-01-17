import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto } from './dtos/create-product-category.dto';
import { UpdateProductCategoryDto } from './dtos/update-product-category.dto';
import { AdminGuard } from '../auth2/guards/admin.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ProductCategoryDto } from './dtos/product-category.dto';

@Controller('product-categories')
@ApiTags('product categories')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all product categories' })
  @ApiResponse({
    status: 200,
    description: 'Return all product categories',
    type: [ProductCategoryDto],
  })
  getAllCategories(): Promise<ProductCategoryDto[]> {
    return this.productCategoryService.findAllCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product category by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the product category',
  })
  @ApiResponse({
    status: 200,
    description: 'Return a product category by ID',
    type: ProductCategoryDto,
  })
  @ApiResponse({ status: 404, description: 'Product category not found' })
  getCategoryById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductCategoryDto> {
    return this.productCategoryService.findCategoryById(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create a new product category' })
  @ApiBody({ type: CreateProductCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Product category created',
    type: ProductCategoryDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Category with this name already exists',
  })
  createCategory(
    @Body() createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<ProductCategoryDto> {
    return this.productCategoryService.createCategory(createProductCategoryDto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update a product category' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateProductCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'Product category updated',
    type: ProductCategoryDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product category not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Category with this name already exists',
  })
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
  ): Promise<ProductCategoryDto> {
    return this.productCategoryService.updateCategory(
      id,
      updateProductCategoryDto,
    );
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete a product category' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 204,
    description: 'Product category deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Product category not found',
  })
  deleteCategory(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productCategoryService.deleteCategory(id);
  }
}
