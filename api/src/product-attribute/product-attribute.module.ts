import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAttribute } from './product-attribute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductAttribute])],
})
export class ProductAttributeModule {}
