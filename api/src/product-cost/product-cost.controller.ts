import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { ProductCostService } from './product-cost.service';
import { CreateProductCostDto } from './dtos/create-product-cost.dto';
import { UpdateProductCostDto } from './dtos/update-product-cost.dto';
import { ProductCostDto } from './dtos/product-cost.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { AuthenticatedRequest } from 'src/auth2/auth-request.interface';

@Controller('product-cost')
@ApiTags('product-cost')
export class ProductCostController {
  constructor(private readonly productCostService: ProductCostService) {}

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get all costs for a specific product' })
  @ApiParam({
    name: 'productId',
    type: 'integer',
    description: 'The ID of the product',
  })
  @ApiResponse({
    status: 200,
    description: 'The costs for the product have been successfully retrieved.',
    type: ProductCostDto,
    isArray: true,
  })
  @ApiResponse({
    status: 403,
    description: 'You do not have permission to access this resource.',
  })
  @ApiResponse({
    status: 404,
    description: 'The product with the specified ID was not found.',
  })
  getAllProductCosts(
    @Request() req: AuthenticatedRequest,
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<ProductCostDto[]> {
    const userId = req.user.sub;
    return this.productCostService.getAllProductCosts(productId, userId);
  }

  @Get(':costId')
  @ApiOperation({ summary: 'Get a specific cost by ID' })
  @ApiParam({
    name: 'costId',
    type: 'integer',
    description: 'The ID of the cost',
  })
  @ApiResponse({
    status: 200,
    description: 'The cost has been successfully retrieved.',
    type: ProductCostDto,
  })
  @ApiResponse({
    status: 404,
    description: 'The cost with the specified ID was not found.',
  })
  getCostById(
    @Request() req: AuthenticatedRequest,
    @Param('costId', ParseIntPipe) costId: number,
  ): Promise<ProductCostDto> {
    const userId = req.user.sub;
    return this.productCostService.getCostById(costId, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product cost' })
  @ApiBody({ type: CreateProductCostDto })
  @ApiResponse({
    status: 201,
    description: 'The cost has been successfully created.',
    type: ProductCostDto,
  })
  @ApiResponse({
    status: 400,
    description: 'The request body was invalid.',
  })
  @ApiResponse({
    status: 403,
    description: 'You do not have permission to access this resource.',
  })
  @ApiResponse({
    status: 404,
    description:
      'The product or cost type with the specified ID was not found.',
  })
  createProductCost(
    @Request() req: AuthenticatedRequest,
    @Body() createCostDto: CreateProductCostDto,
  ): Promise<ProductCostDto> {
    const userId = req.user.sub;
    return this.productCostService.createProductCost(createCostDto, userId);
  }

  @Patch(':costId')
  @ApiOperation({ summary: 'Update a specific product cost by ID' })
  @ApiParam({
    name: 'costId',
    type: 'integer',
    description: 'The ID of the cost',
  })
  @ApiBody({ type: UpdateProductCostDto })
  @ApiResponse({
    status: 200,
    description: 'The cost has been successfully updated.',
    type: ProductCostDto,
  })
  @ApiResponse({
    status: 400,
    description: 'The request body was invalid.',
  })
  @ApiResponse({
    status: 403,
    description: 'You do not have permission to access this resource.',
  })
  @ApiResponse({
    status: 404,
    description:
      'The product or cost type with the specified ID was not found.',
  })
  updateProductCost(
    @Request() req: AuthenticatedRequest,
    @Param('costId', ParseIntPipe) costId: number,
    @Body() updateCostDto: UpdateProductCostDto,
  ): Promise<ProductCostDto> {
    const userId = req.user.sub;
    return this.productCostService.updateProductCost(
      costId,
      updateCostDto,
      userId,
    );
  }

  @Delete(':costId')
  @ApiOperation({ summary: 'Delete a specific product cost by ID' })
  @ApiParam({
    name: 'costId',
    type: 'integer',
    description: 'The ID of the cost',
  })
  @ApiResponse({
    status: 204,
    description: 'The cost has been successfully deleted.',
  })
  @ApiResponse({
    status: 403,
    description: 'You do not have permission to access this resource.',
  })
  @ApiResponse({
    status: 404,
    description: 'The cost with the specified ID was not found.',
  })
  deleteProductCost(
    @Request() req: AuthenticatedRequest,
    @Param('costId', ParseIntPipe) costId: number,
  ): Promise<void> {
    const userId = req.user.sub;
    return this.productCostService.deleteProductCost(costId, userId);
  }
}
