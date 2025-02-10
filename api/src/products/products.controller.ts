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
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { SaleProductDto } from './dtos/sale-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('')
  async getMyProducts(
    @Request() req,
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
  async getProductById(
    @Request() req,
    @Param('id') id: number,
  ): Promise<Product> {
    const userId = req.user.sub;
    return this.productsService.findProductById(id, userId);
  }

  @Post('')
  async createProduct(
    @Request() req,
    @Body() body: CreateProductDto,
  ): Promise<Product> {
    console.log('xddddd');
    console.log(req.user);
    const userId = req.user.sub;
    console.log(userId);
    return this.productsService.createProduct(userId, body);
  }

  @Patch(':id/sold')
  async markProductAsSold(
    @Request() req,
    @Param('id') id: number,
    @Body() body: SaleProductDto,
  ) {
    const userId = req.user.sub;
    return this.productsService.markProductAsSold(id, userId, body);
  }

  @Patch(':id/unsold')
  async markProductAsUnsold(@Request() req, @Param('id') id: number) {
    const userId = req.user.sub;
    return this.productsService.markProductAsUnsold(id, userId);
  }

  @Patch(':id')
  async updateProduct(
    @Request() req,
    @Param('id') id: number,
    @Body() body: UpdateProductDto,
  ) {
    const userId = req.user.sub;
    return this.productsService.updateProduct(id, userId, body);
  }

  @Delete(':id')
  async deleteProduct(@Request() req, @Param('id') id: number) {
    const userId = req.user.sub;
    return this.productsService.deleteProduct(id, userId);
  }
}
