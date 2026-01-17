import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Param,
  Query,
  Patch,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { SaleProductDto } from './dtos/sale-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { AuthenticatedRequest } from 'src/auth2/auth-request.interface';

@Controller('products')
@ApiTags('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('')
  @ApiOperation({ summary: 'Get all products for current user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sold', required: false, type: Boolean })
  @ApiQuery({ name: 'category', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  getMyProducts(
    @Request() req: AuthenticatedRequest,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sold') sold?: boolean,
    @Query('category') category?: number,
  ): Promise<{ products: Product[]; total: number }> {
    const userId = req.user.sub;
    return this.productsService.getMyProducts(
      userId,
      page,
      limit,
      sold,
      category,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  getProductById(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Product> {
    const userId = req.user.sub;
    return this.productsService.findProductById(id, userId);
  }

  @Post('')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 404, description: 'User or category not found' })
  createProduct(
    @Request() req: AuthenticatedRequest,
    @Body() body: CreateProductDto,
  ): Promise<Product> {
    const userId = req.user.sub;
    return this.productsService.createProduct(userId, body);
  }

  @Patch(':id/sold')
  @ApiOperation({ summary: 'Mark product as sold' })
  @ApiParam({ name: 'id', type: Number, description: 'Product ID' })
  @ApiBody({ type: SaleProductDto })
  @ApiResponse({ status: 200, description: 'Product marked as sold' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  markProductAsSold(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SaleProductDto,
  ): Promise<Product> {
    const userId = req.user.sub;
    return this.productsService.markProductAsSold(id, userId, body);
  }

  @Patch(':id/unsold')
  @ApiOperation({ summary: 'Mark product as unsold' })
  @ApiParam({ name: 'id', type: Number, description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product marked as unsold' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  markProductAsUnsold(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Product> {
    const userId = req.user.sub;
    return this.productsService.markProductAsUnsold(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product' })
  @ApiParam({ name: 'id', type: Number, description: 'Product ID' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  updateProduct(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ): Promise<Product> {
    const userId = req.user.sub;
    return this.productsService.updateProduct(id, userId, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete product' })
  @ApiParam({ name: 'id', type: Number, description: 'Product ID' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  deleteProduct(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    const userId = req.user.sub;
    return this.productsService.deleteProduct(id, userId);
  }
}
