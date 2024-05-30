import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAttribute } from './product-attribute.entity';
import { ProductAttributeService } from './product-attribute.service';
import { ProductAttributeController } from './product-attribute.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductAttribute]),
    forwardRef(() => ProductsModule),
  ],
  providers: [ProductAttributeService],
  controllers: [ProductAttributeController],
  exports: [ProductAttributeService],
})
export class ProductAttributeModule {}
