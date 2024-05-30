import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.enity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { UsersModule } from 'src/users/users.module';
import { ProductCategoryModule } from 'src/product-category/product-category.module';
import { ProductAttributeModule } from 'src/product-attribute/product-attribute.module';
import { ProductAttribute } from 'src/product-attribute/product-attribute.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductAttribute]),
    UsersModule,
    ProductCategoryModule,
    forwardRef(() => ProductAttributeModule),
  ],
  exports: [TypeOrmModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
