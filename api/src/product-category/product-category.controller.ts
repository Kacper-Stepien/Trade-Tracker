import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  Request,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto } from './dtos/create-product-category.dto';
import { UpdateProductCategoryDto } from './dtos/update-product-category.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductCategoryDto } from './dtos/product-category.dto';
import { AuthenticatedRequest } from 'src/auth2/auth-request.interface';
import { GetProductCategoriesResponseDto } from './dtos/get-product-categories-response.dto';

@Controller('product-categories')
@ApiTags('product categories')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all product categories for current user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Return all product categories',
    type: GetProductCategoriesResponseDto,
  })
  getAllCategories(
    @Request() req: AuthenticatedRequest,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ categories: ProductCategoryDto[]; total: number }> {
    const userId = req.user.sub;
    return this.productCategoryService.findAllCategories(userId, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product category by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Return a product category by ID',
    type: ProductCategoryDto,
  })
  @ApiResponse({ status: 404, description: 'Product category not found' })
  getCategoryById(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductCategoryDto> {
    const userId = req.user.sub;
    return this.productCategoryService.findCategoryById(id, userId);
  }

  @Post()
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
    @Request() req: AuthenticatedRequest,
    @Body() createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<ProductCategoryDto> {
    const userId = req.user.sub;
    return this.productCategoryService.createCategory(
      createProductCategoryDto,
      userId,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product category' })
  @ApiParam({ name: 'id', type: Number, description: 'Category ID' })
  @ApiBody({ type: UpdateProductCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'Product category updated',
    type: ProductCategoryDto,
  })
  @ApiResponse({ status: 404, description: 'Product category not found' })
  @ApiResponse({
    status: 409,
    description: 'Category with this name already exists',
  })
  updateCategory(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
  ): Promise<ProductCategoryDto> {
    const userId = req.user.sub;
    return this.productCategoryService.updateCategory(
      id,
      updateProductCategoryDto,
      userId,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product category' })
  @ApiParam({ name: 'id', type: Number, description: 'Category ID' })
  @ApiResponse({ status: 204, description: 'Product category deleted' })
  @ApiResponse({ status: 404, description: 'Product category not found' })
  deleteCategory(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    const userId = req.user.sub;
    return this.productCategoryService.deleteCategory(id, userId);
  }
}
