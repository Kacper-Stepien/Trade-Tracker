import { UpdateProductAttributeDto } from './dtos/update-product-attribute';
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
import { ProductAttribute } from './product-attribute.entity';
import { CreateProductAttributeDto } from './dtos/create-product-attribute';

@Controller('product-attribute')
export class ProductAttributeController {
  constructor(
    private readonly productAttributeService: ProductAttributeService,
  ) {}

  @Post(':productId')
  createAttribute(
    @Body() createProductAttributeDto: CreateProductAttributeDto,
    @Param('productId') productId: number,
    @Request() req,
  ): Promise<ProductAttribute> {
    const userId = req.user.sub;
    return this.productAttributeService.createAttribute(
      createProductAttributeDto,
      productId,
      userId,
    );
  }

  @Patch(':productId/:attributeId')
  updateAttribute(
    @Body() updateProductAttributeDto: UpdateProductAttributeDto,
    @Param('productId') productId: number,
    @Param('attributeId') attributeId: number,
    @Request() req,
  ): Promise<ProductAttribute> {
    const userId = req.user.sub;
    return this.productAttributeService.updateProductAttribute(
      productId,
      attributeId,
      updateProductAttributeDto,
      userId,
    );
  }

  @Delete(':productId/:attributeId')
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
