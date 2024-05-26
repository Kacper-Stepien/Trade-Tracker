import { ProductCategory } from './product-category.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory])],
})
export class ProductCategoryModule {}
