import { Module, forwardRef } from '@nestjs/common';
import { ProductCostController } from './product-cost.controller';
import { ProductCostService } from './product-cost.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCost } from './product-cost.entity';
import { ProductsModule } from 'src/products/products.module';
import { CostType } from '../cost-type/cost-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductCost, CostType]),
    forwardRef(() => ProductsModule),
    forwardRef(() => CostType),
  ],
  controllers: [ProductCostController],
  providers: [ProductCostService],
  exports: [ProductCostService],
})
export class ProductCostModule {}
