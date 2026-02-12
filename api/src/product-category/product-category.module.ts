import { ProductCategory } from './product-category.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryController } from './product-category.controller';
import { Product } from 'src/products/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory, Product])],
  providers: [ProductCategoryService],
  controllers: [ProductCategoryController],
  exports: [ProductCategoryService],
})
export class ProductCategoryModule {}
