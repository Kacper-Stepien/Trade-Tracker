import { UpdateProductAttributeDto } from './dtos/update-product-attribute.dto';
import {
  Controller,
  Patch,
  Delete,
  Body,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { ProductAttributeService } from './product-attribute.service';
import { CreateProductAttributeDto } from './dtos/create-product-attribute.dto';
import { ProductAttributeDto } from './dtos/product-attribute.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@Controller('product-attribute')
@ApiTags('product-attribute')
export class ProductAttributeController {
  constructor(
    private readonly productAttributeService: ProductAttributeService,
  ) {}

  @Post(':productId')
  @ApiOperation({ summary: 'Create a new product attribute' })
  @ApiParam({
    name: 'productId',
    description: 'The ID of the product to which the attribute belongs',
    type: Number,
  })
  @ApiBody({ type: CreateProductAttributeDto })
  @ApiResponse({
    status: 201,
    description: 'The product attribute has been successfully created',
    type: ProductAttributeDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  createAttribute(
    @Body() createProductAttributeDto: CreateProductAttributeDto,
    @Param('productId') productId: number,
    @Request() req,
  ): Promise<ProductAttributeDto> {
    const userId = req.user.sub;
    return this.productAttributeService.createAttribute(
      createProductAttributeDto,
      productId,
      userId,
    );
  }

  @Patch(':productId/:attributeId')
  @ApiOperation({ summary: 'Update a product attribute' })
  @ApiParam({
    name: 'productId',
    description: 'The ID of the product to which the attribute belongs',
    type: Number,
  })
  @ApiParam({
    name: 'attributeId',
    description: 'The ID of the attribute to update',
    type: Number,
  })
  @ApiBody({ type: UpdateProductAttributeDto })
  @ApiResponse({
    status: 200,
    description: 'The product attribute has been successfully updated',
    type: ProductAttributeDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product or attribute not found',
  })
  updateAttribute(
    @Body() updateProductAttributeDto: UpdateProductAttributeDto,
    @Param('productId') productId: number,
    @Param('attributeId') attributeId: number,
    @Request() req,
  ): Promise<ProductAttributeDto> {
    const userId = req.user.sub;
    return this.productAttributeService.updateProductAttribute(
      productId,
      attributeId,
      updateProductAttributeDto,
      userId,
    );
  }

  @Delete(':productId/:attributeId')
  @ApiOperation({ summary: 'Delete a product attribute' })
  @ApiParam({
    name: 'productId',
    description: 'The ID of the product to which the attribute belongs',
    type: Number,
  })
  @ApiParam({
    name: 'attributeId',
    description: 'The ID of the attribute to delete',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'The product attribute has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Product or attribute not found',
  })
  deleteAttribute(
    @Param('productId') productId: number,
    @Param('attributeId') attributeId: number,
    @Request() req,
  ): Promise<void> {
    const userId = req.user.sub;
    return this.productAttributeService.deleteProductAttribute(
      productId,
      attributeId,
      userId,
    );
  }
}
