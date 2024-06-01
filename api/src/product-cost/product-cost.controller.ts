import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductCostService } from './product-cost.service';
import { CreateProductCostDto } from './dtos/create-product-cost.dto';
import { UpdateProductCostDto } from './dtos/update-product-cost.dto';
import { ProductCostDto } from './dtos/product-cost.dto';

@Controller('product-cost')
export class ProductCostController {
  constructor(private readonly productCostService: ProductCostService) {}

  @Get('product/:productId')
  async getAllProductCosts(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<ProductCostDto[]> {
    return this.productCostService.getAllProductCosts(productId);
  }

  @Get(':costId')
  async getCostById(
    @Param('costId', ParseIntPipe) costId: number,
  ): Promise<ProductCostDto> {
    return this.productCostService.getCostById(costId);
  }

  @Post()
  async createProductCost(
    @Body() createCostDto: CreateProductCostDto,
  ): Promise<ProductCostDto> {
    return this.productCostService.createProductCost(createCostDto);
  }

  @Patch(':costId')
  async updateProductCost(
    @Param('costId', ParseIntPipe) costId: number,
    @Body() updateCostDto: UpdateProductCostDto,
  ): Promise<ProductCostDto> {
    return this.productCostService.updateProductCost(costId, updateCostDto);
  }

  @Delete(':costId')
  async deleteProductCost(
    @Param('costId', ParseIntPipe) costId: number,
  ): Promise<void> {
    return this.productCostService.deleteProductCost(costId);
  }
}
